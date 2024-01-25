import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../users/user.service';
import { ConversationListComponent } from '../../ui/conversation-list/conversation-list.component';

@Component({
  standalone: true,
  imports: [ 
    JsonPipe, 
    ConversationListComponent 
  ],
  template: `
    <div class="container">
      <app-conversation-list/>

      <div class="cor-2">
        cor 2
      </div>
    </div>
  `,
  styleUrl: './conversation-page.component.scss'
})
export default class ConversationPageComponent {
  private userService = inject(UserService);
  protected userInfo = this.userService.getUserInfoSignal();
}
