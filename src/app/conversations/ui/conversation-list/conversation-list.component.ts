import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from '../../conversation.service';
import { ConversationContactComponent } from '../conversation-contact/conversation-contact.component';
import { ConversationHeaderComponent } from '../conversation-header/conversation-header.component';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [
    ConversationHeaderComponent,
    ConversationContactComponent,
    AsyncPipe
  ],
  template: `
    <app-conversation-header/>

    <div class="container">
      @for (conversation of conversations$ | async; track conversation.id) {
        <div class="separator"></div>
        <app-conversation-contact [conversation]="conversation" 
          (click)="goToUser(conversation.userId)" />
      }
    </div>
  `,
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent {
  private conversationService = inject(ConversationService);
  protected conversations$ = this.conversationService
    .listenConversations()

  private router = inject(Router);

  protected goToUser(userId: string){
    this.router.navigate(['conversations', userId]);
  }
}
