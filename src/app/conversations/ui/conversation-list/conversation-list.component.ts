import { Component } from '@angular/core';
import { ConversationContactComponent } from '../conversation-contact/conversation-contact.component';
import { ConversationHeaderComponent } from '../conversation-header/conversation-header.component';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [
    ConversationHeaderComponent,
    ConversationContactComponent
  ],
  template: `
    <app-conversation-header/>

    <div class="container">
      <app-conversation-contact/>
      <app-conversation-contact/>
    </div>
  `,
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent {

}
