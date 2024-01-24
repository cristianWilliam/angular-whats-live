import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../users/user.service';

@Component({
  standalone: true,
  imports: [ JsonPipe ],
  template: `
    <p>
      usuario Logado: {{ userInfo()!.name }}
    </p>

    <div>
      <button (click)="logoutClick()"> Logout </button>
    </div>
  `,
  styleUrl: './conversation-page.component.scss'
})
export default class ConversationPageComponent {
  private userService = inject(UserService);
  protected userInfo = this.userService.getUserInfoSignal();

  logoutClick(){
    this.userService.logout();
  }
}
