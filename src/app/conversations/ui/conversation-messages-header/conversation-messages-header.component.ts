import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { UserService } from '../../../users/user.service';

@Component({
  selector: 'app-conversation-messages-header',
  standalone: true,
  imports: [ AsyncPipe ],
  template: `
    @if(user$ | async; as userImage){
      <div class="container">
        <img [src]="userImage.imageUrl" alt="">
        <span> {{ userImage.user!.name }} </span>
      </div>
    }

    <div class="divider"></div>
  `,
  styleUrl: './conversation-messages-header.component.scss'
})
export class ConversationMessagesHeaderComponent {
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  protected user$ = this.activatedRoute.paramMap
    .pipe(
      map(value => value.get('userId')),
      switchMap(userId => this.userService.getLocalUserById(userId!)));
}
