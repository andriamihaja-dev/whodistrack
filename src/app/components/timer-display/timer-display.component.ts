import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-display.component.html',
  styleUrls: ['./timer-display.component.css'],
})
export class TimerDisplayComponent {
  @Input() timeLeft: number = 3;
  @Input() totalTime: number = 30; // nécessaire pour éviter l’erreur NG8002

  get isFinalCountdown(): boolean {
    return this.timeLeft <= 3;
  }
}
