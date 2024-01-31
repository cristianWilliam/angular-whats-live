import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-conversation-messages-header',
  standalone: true,
  imports: [ AsyncPipe ],
  template: `
    <span>  {{ user$ | async }} -  nome usuario </span>
  `,
  styleUrl: './conversation-messages-header.component.scss'
})
export class ConversationMessagesHeaderComponent {

  private activatedRoute = inject(ActivatedRoute);
  protected user$ = this.activatedRoute.paramMap
    .pipe(
      map(value => value.get('userId')),
      switchMap(userId => )
      );

}
