import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SpotifyTrack } from '../models/spotify.models';

@Injectable({ providedIn: 'root' })
export class GuestTrackService {
  private guestTrack$ = new BehaviorSubject<SpotifyTrack | null>(null);
  private enabled$ = new BehaviorSubject<boolean>(false);

  setGuestTrack(track: SpotifyTrack) {
    this.guestTrack$.next(track);
  }

  clearGuestTrack() {
    this.guestTrack$.next(null);
  }

  toggleGuest(enabled: boolean) {
    this.enabled$.next(enabled);
  }

  getGuestTrack(): SpotifyTrack | null {
    return this.guestTrack$.getValue();
  }

  isGuestEnabled(): boolean {
    return this.enabled$.getValue();
  }
}
