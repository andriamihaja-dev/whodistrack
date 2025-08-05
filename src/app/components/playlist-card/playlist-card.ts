import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyPlaylist } from '../../models/spotify.models';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.html',
  styleUrls: ['./playlist-card.css'],
  imports: [CommonModule]
})
export class PlaylistCardComponent {
  @Input() playlist!: SpotifyPlaylist
  @Output() select = new EventEmitter<string>();

  constructor(private router: Router) {}
 

selectPlaylist(): void {
  this.router.navigate(['/game', this.playlist.id]);
}

}
