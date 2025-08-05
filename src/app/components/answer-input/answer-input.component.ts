import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-answer-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './answer-input.component.html',
  styleUrls: ['./answer-input.component.css'],
})
export class AnswerInputComponent {
  answer: string = '';

  @Output() answerSubmitted = new EventEmitter<string>();

  submitAnswer() {
    if (this.answer.trim()) {
      this.answerSubmitted.emit(this.answer.trim());
      this.answer = '';
    }
  }
}
