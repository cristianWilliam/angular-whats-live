import { Component } from '@angular/core';
import { ConversationMessagesHeaderComponent } from '../../ui/conversation-messages-header/conversation-messages-header.component';
import { ConversationMessagesComponent } from '../../ui/conversation-messages/conversation-messages.component';

@Component({
  selector: 'app-conversation-messages-page',
  standalone: true,
  imports: [
    ConversationMessagesHeaderComponent,
    ConversationMessagesComponent
  ],
  template: `
    <app-conversation-messages-header/>
    <app-conversation-messages/>
  `,
  styleUrl: './conversation-messages-page.component.scss'
})
export class ConversationMessagesPageComponent {

}
