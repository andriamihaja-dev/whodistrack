import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-display.component.html',
  styleUrls: ['./score-display.component.css'],
})
export class ScoreDisplayComponent {
  @Input() score: number = 0;
}
