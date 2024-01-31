import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../../users/user.service';
import { ConversationListComponent } from '../../ui/conversation-list/conversation-list.component';
import { ConversationMessagesPageComponent } from '../conversation-messages-page/conversation-messages-page.component';

@Component({
  standalone: true,
  imports: [ 
    JsonPipe, 
    ConversationListComponent,
    ConversationMessagesPageComponent,
    RouterOutlet
  ],
  template: `
    <div class="container">
      <app-conversation-list/>

      <div>
        <router-outlet/>
      </div>  
    </div>
  `,
  styleUrl: './conversation-page.component.scss'
})
export default class ConversationPageComponent {
  private userService = inject(UserService);
  protected userInfo = this.userService.getUserInfoSignal();
}
