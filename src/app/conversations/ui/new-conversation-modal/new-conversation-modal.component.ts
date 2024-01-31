import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { map, take } from 'rxjs';
import { User } from '../../../users/user.model';
import { UserService } from '../../../users/user.service';
import { ConversationService } from '../../conversation.service';

@Component({
  selector: 'app-new-conversation-modal',
  standalone: true,
  imports: [ AsyncPipe ],
  template: `
    <div class="container">
      <span> Conteudo </span>
      <button (click)="showModalChange.emit(false)"> X </button>

      @for (user of users$ | async; track user.user.id) {
        <div class="user" (click)="createNewConversation(user.user)"> 
          <img [src]="user.imageUrl" alt="">
          <span> {{ user.user.name }} </span>
        </div>
      }
    </div>

  `,
  styleUrl: './new-conversation-modal.component.scss'
})
export class NewConversationModalComponent {
  
  protected userService = inject(UserService);
  private conversationService = inject(ConversationService);

  private currentUser = this.userService.getUserInfoSignal();

  protected users$ = this.userService.getLocalUsers()
    .pipe(
      map(users => users.filter(user => user.user.id !== this.currentUser()!.id))
    );
  
  @Input()
  showModal = false;

  @Output()
  showModalChange = new EventEmitter<boolean>();

  createNewConversation(user: User){
    this.conversationService
      .createConversation(user.id, user.name)
      .pipe(take(1))
      .subscribe(() => {
        this.showModalChange.emit(false);
      })
  }
}
