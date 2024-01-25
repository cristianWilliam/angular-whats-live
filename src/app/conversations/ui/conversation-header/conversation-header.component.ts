import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../users/user.service';
import { NewConversationModalComponent } from '../new-conversation-modal/new-conversation-modal.component';

@Component({
  selector: 'app-conversation-header',
  standalone: true,
  imports: [ AsyncPipe, NewConversationModalComponent ],
  template: `
    <div class="header">
      <img [src]="userImageUrl$ | async" alt="">
      <span> {{ userInfo()!.name }} </span>
      <button (click)="showModal = true"> + </button>
    </div>

    <input type="text" placeholder="Pesquisar...">

    @if (showModal) {
      <app-new-conversation-modal [(showModal)]="showModal"/>
    }
  `,
  styleUrl: './conversation-header.component.scss'
})
export class ConversationHeaderComponent {
  
  private userService = inject(UserService);
  protected userInfo = this.userService.getUserInfoSignal();
  protected userImageUrl$ = this.userService.getCurrentUserImageUrl();

  protected showModal = true;

}
