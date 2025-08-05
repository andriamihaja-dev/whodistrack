import { Component } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { GameSettingsService } from '../../services/game-settings.service';
import { SpotifyTrack } from '../../models/spotify.models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-game-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.css']
})
export class GameSettingsComponent {
  roundDuration: number;
  trackCount: number;
  showTimer: boolean;
  hardcoreMode: boolean;
  guestEnabled: boolean;

  searchControl = new FormControl('');
  results: SpotifyTrack[] = [];

  constructor(
    private settings: GameSettingsService,
    private spotifyApi: SpotifyApiService
  ) {
    this.roundDuration = settings.getRoundDuration();
    this.trackCount = settings.getTrackCount();
    this.showTimer = settings.isTimerVisible();
    this.hardcoreMode = settings.isHardcore();
    this.guestEnabled = settings.isGuestEnabled();

    this.initSearchListener();
  }

  initSearchListener() {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => this.spotifyApi.searchTracks(query || ''))
    ).subscribe(results => {
      this.results = results;
    });
  }

  selectTrackAsGuest(track: SpotifyTrack) {
    this.settings.setGuestTrack(track);
    this.settings.toggleGuest(true);
    this.guestEnabled = true;
    this.searchControl.setValue(`${track.name} – ${track.artists[0]?.name}`, { emitEvent: false });
    this.results = [];
  }

  applyChanges() {
    this.settings.setRoundDuration(this.roundDuration);
    this.settings.setTrackCount(this.trackCount);
    this.settings.toggleShowTimer(this.showTimer);
    this.settings.toggleHardcoreMode(this.hardcoreMode);
    this.settings.toggleGuest(this.guestEnabled);

    if (!this.guestEnabled) {
      this.settings.clearGuestTrack();
    }
  }
}
