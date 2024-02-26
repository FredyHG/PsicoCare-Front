import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.scss'
})
export class ConfirmPopupComponent {
  @Output() confirm = new EventEmitter<boolean>();

  @Input() message: any;

  isVisible: boolean = false;


  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  onConfirm() {
    this.confirm.emit(true);
    this.hide();
  }

  onDecline() {
    this.confirm.emit(false);
    this.hide();
  }
}
