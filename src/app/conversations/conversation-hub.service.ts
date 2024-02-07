import { environment } from "@@environment/environment";
import { Injectable, OnDestroy, inject } from "@angular/core";
import { Router } from "@angular/router";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Subject, filter, from, of, switchMap, take, takeUntil, tap } from "rxjs";
import { LocalConversationMessage } from "../local-db/local-conversation-message.model";
import { LocalConversation } from "../local-db/local-conversation.model";
import { LocalDb } from "../local-db/local-db";
import { UserService } from "../users/user.service";
import { Message } from "./message.model";

@Injectable()
export class ConversationHubService implements OnDestroy {
  
  private hubUrl = `${environment.urlApi}/message-hub`;
  private userInfoSignal = inject(UserService).getUserInfoSignal();
  private hubConnection: HubConnection;
  private isConnectionStarted = false;
  private localDb = new LocalDb();
  private messagesReceived$ = new Subject<LocalConversationMessage>();
  private openConversations: LocalConversation[] = [];
  private unsub$ = new Subject<boolean>();
  private router = inject(Router);

  constructor(){
    this.hubConnection = this.buildConnection();
    this.getOpenConversations();
  }

  ngOnDestroy(): void {
    this.stopHubConnection();
    this.unsub$.next(true)
    this.unsub$.complete();
  }

  getOpenConversations(){
    this.localDb.getLiveConversations()
      .pipe(takeUntil(this.unsub$))
      .subscribe(conversations => this.openConversations = conversations);
  }

  private buildConnection(){
    return new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.userInfoSignal()!.token
      }).build();
  }

  startHubConnection(){
    if (this.isConnectionStarted)
      return of(null);

    return from(this.hubConnection.start())
      .pipe(
        tap(() => this.isConnectionStarted = true),
        tap(() => console.log('CONECTOU')))
  }

  stopHubConnection(){
    this.hubConnection.stop()
      .then(() => this.isConnectionStarted = false)
  }

  startListenningMessages(){
    this.hubConnection.on('message-received', (messageReceived: Message) => {
      this.processReceivedMessages(messageReceived)
    })
  }

  listenMessagesReceived(conversationUserId: string){
    return this.messagesReceived$
      .pipe(
        filter(message => message.conversationUserId === conversationUserId));
  }
  
  processReceivedMessages(message: Message){
    const localMessage: LocalConversationMessage = {
      conversationUserId: message.userId.toLowerCase(),
      mine: false,
      time: new Date(),
      message: message.message
    }
    
    this.localDb.saveMessage(localMessage)
    this.messagesReceived$.next(localMessage);

    // checando se conversa já existe
    if(!this.openConversations
        .some(c => c.id === localMessage.conversationUserId)){
      
      const user = this.localDb
        .getUserById(localMessage.conversationUserId)
        .pipe(
          switchMap(user => this.localDb.addConversation(user!.id, user!.name)),
          take(1)
        ).subscribe(() => {
          this.router.navigate(['conversations', localMessage.conversationUserId]);
        })
    }
  }

  publishMessage(conversationUserId: string, message: string){
    this.localDb.saveMessage({
      time: new Date(),
      message: message,
      mine: true,
      conversationUserId: conversationUserId
    });

    this.sendMessageToDestinationUserId(conversationUserId, message);
  }

  sendMessageToDestinationUserId(destinationUserId: string, message: string){
    return from(this.hubConnection
      .send('SendMessage', destinationUserId, message));
  }
  
}