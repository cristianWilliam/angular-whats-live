import { Component, Input } from '@angular/core';
import { Conversation } from '../../conversation.model';

@Component({
  selector: 'app-conversation-contact',
  standalone: true,
  imports: [],
  template: `
    <img [src]="conversation.userImageUrl" alt="">
    <span> {{ conversation.userName }} </span>
  `,
  styleUrl: './conversation-contact.component.scss'
})
export class ConversationContactComponent {
  
  @Input({required: true})
  conversation!: Conversation
  
}
