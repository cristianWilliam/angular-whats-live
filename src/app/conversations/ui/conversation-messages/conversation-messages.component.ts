import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, filter, map, take, takeUntil } from 'rxjs';
import { LocalConversationMessage } from '../../../local-db/local-conversation-message.model';
import { ConversationHubService } from '../../conversation-hub.service';
import { ConversationService } from '../../conversation.service';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-conversation-messages',
  standalone: true,
  imports: [ MessageComponent, FormsModule ],
  template: `
    <div class="messages" #scrollPanel>
      @for (message of messages; track $index) {
        <app-message [message]="message"/>
      }
    </div>
    <input 
      type="text" 
      placeholder="Pressione Enter para enviar..."
      [(ngModel)]="inputMessage"
      (keyup.enter)="sendMessage()"
      >
  `,
  styleUrl: './conversation-messages.component.scss',
})
export class ConversationMessagesComponent implements OnDestroy, AfterViewInit {
  @ViewChildren(MessageComponent) messageComps!: QueryList<MessageComponent>;
  @ViewChild('scrollPanel') scrollPanel!: ElementRef

  private conversationService = inject(ConversationService);
  private conversationHubService = inject(ConversationHubService);

  protected inputMessage = '';
  protected messages: LocalConversationMessage[] = [];

  private unsub$ = new Subject<boolean>();
  private conversationUserId = '';
  private lastSubMessage = new Subscription();

  constructor(activatedRoute: ActivatedRoute){
    activatedRoute.paramMap
      .pipe(
        map(params => params.get('userId')),
        filter(userId => !!userId),
        takeUntil(this.unsub$)
      ).subscribe((userId => {
        this.conversationUserId = userId || '';
        this.loadMessageHistory();
        this.refreshMessageListener();
      }));
  }

  refreshMessageListener(){
    this.lastSubMessage.unsubscribe();

    this.lastSubMessage = this.conversationHubService
      .listenMessagesReceived(this.conversationUserId)
      .subscribe(message => {
        this.messages.push(message);
      })
  }

  private loadMessageHistory(){
    this.messages = [];

    // Load all messages from current user id conversation
    this.conversationService
      .getHistoryMessagesUserId(this.conversationUserId)
      .pipe(take(1))
      .subscribe(messages => this.messages = messages)
  }

  ngAfterViewInit(): void {
    this.messageComps.changes
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe(() => this.scrollToLast());
  }

  scrollToLast(){
    try{
      this.scrollPanel.nativeElement.scrollTop = 
        this.scrollPanel.nativeElement.scrollHeight
    }catch(err){}
  }
  
  sendMessage(){
    if (!this.inputMessage)
      return;
    
    this.messages.push({
      time: new Date(),
      mine: true,
      message: this.inputMessage,
      conversationUserId: this.conversationUserId
    })

    this.conversationHubService
      .publishMessage(this.conversationUserId, this.inputMessage);
    
    this.inputMessage = '';
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }


}
