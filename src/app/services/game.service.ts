import { Injectable } from '@angular/core';
import { PlaylistService } from './playlist.service';
import { GameSettingsService } from './game-settings.service';
import { SpotifyTrack } from '../models/spotify.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameService {
  private tracks: SpotifyTrack[] = [];
  private currentTrackIndex = 0;
  private paused$ = new BehaviorSubject<boolean>(false);

  constructor(
    private playlistService: PlaylistService,
    private gameSettings: GameSettingsService
  ) {}

  loadGameTracks(playlistId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const trackCount = this.gameSettings.getTrackCount();
      const guestTrack = this.gameSettings.getGuestTrack();
      const includeGuest = this.gameSettings.isGuestEnabled();

      this.playlistService.loadPlaylistTracks(playlistId, trackCount).subscribe({
        next: (tracks) => {
          if (includeGuest && guestTrack && !tracks.some(t => t.id === guestTrack.id)) {
            tracks.pop(); // Supprimer un morceau pour faire de la place
            tracks.push(guestTrack); // Ajouter le morceau invité
            tracks = this.shuffleArray(tracks);
          }

          this.tracks = tracks;
          this.currentTrackIndex = 0;
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  get currentTrack(): SpotifyTrack | null {
    return this.tracks[this.currentTrackIndex] || null;
  }

  nextTrack(): SpotifyTrack | null {
    if (this.hasNextTrack()) {
      this.currentTrackIndex++;
      return this.currentTrack;
    }
    return null;
  }

  hasNextTrack(): boolean {
    return this.currentTrackIndex < this.tracks.length - 1;
  }

  resetGame(): void {
    this.tracks = [];
    this.currentTrackIndex = 0;
    this.paused$.next(false);
  }

  togglePause(): void {
    this.paused$.next(!this.paused$.value);
  }

  pause(): void {
    this.paused$.next(true);
  }

  resume(): void {
    this.paused$.next(false);
  }

  isPaused(): boolean {
    return this.paused$.value;
  }

  private shuffleArray(array: SpotifyTrack[]): SpotifyTrack[] {
    let currentIndex = array.length, randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  getAllTracks(): SpotifyTrack[] {
    return this.tracks;
  }
  
}
