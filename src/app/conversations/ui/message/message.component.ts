import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LocalConversationMessage } from '../../../local-db/local-conversation-message.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ DatePipe ],
  template: `
    <div class="container" [class.is-mine]="message.mine">
      <div class="balloon">
        <div class="message">
          {{ message.message }}
        </div>
        <div class="time">
          {{ message.time | date: 'hh:mm a'  }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input({ required: true })
  message!: LocalConversationMessage;
}
