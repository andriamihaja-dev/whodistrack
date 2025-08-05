import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyTrack } from '../../models/spotify.models';

@Component({
  selector: 'app-answer-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-display.component.html',
  styleUrls: ['./answer-display.component.css'],
})
export class AnswerDisplayComponent {
  @Input() track!: SpotifyTrack;
  @Input() wasCorrect: boolean = false; // Affichage conditionnel

  getArtistsNames(): string {
    return this.track?.artists?.map(a => a.name).join(', ') || '';
  }
}
