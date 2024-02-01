import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { LocalConversationMessage } from '../../../local-db/local-conversation-message.model';
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
  styleUrl: './conversation-messages.component.scss'
})
export class ConversationMessagesComponent implements OnDestroy, AfterViewInit {
  @ViewChildren(MessageComponent) messageComps!: QueryList<MessageComponent>;
  @ViewChild('scrollPanel') scrollPanel!: ElementRef

  private conversationService = inject(ConversationService);

  protected inputMessage = '';
  protected messages: LocalConversationMessage[] = [];

  private unsub$ = new Subject<boolean>();
  private conversationUserId = '';

  constructor(activatedRoute: ActivatedRoute){
    activatedRoute.paramMap
      .pipe(
        map(params => params.get('userId')),
        filter(userId => !!userId),
        takeUntil(this.unsub$)
      ).subscribe((userId => {
        this.conversationUserId = userId || '';
        this.messages = []
      }))
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

    this.conversationService
      .publishMessage(this.conversationUserId, this.inputMessage);
    
    this.inputMessage = '';
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }


}
