import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-new-conversation-modal',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      Conteudo
      <button (click)="showModalChange.emit(false)"> X </button>
    </div>

  `,
  styleUrl: './new-conversation-modal.component.scss'
})
export class NewConversationModalComponent {
  @Input()
  showModal = false;

  @Output()
  showModalChange = new EventEmitter<boolean>();
}
