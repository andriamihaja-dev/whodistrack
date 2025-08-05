import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SpotifyTrack } from '../models/spotify.models';

@Injectable({ providedIn: 'root' })
export class GameSettingsService {
  // ⏱️ Durée d’un round (par défaut : 30 sec)
  private roundDuration$ = new BehaviorSubject<number>(30);

  // 🎵 Nombre de morceaux à charger (par défaut : 15)
  private trackCount$ = new BehaviorSubject<number>(15);

  // 👀 Affichage du timer
  private showTimer$ = new BehaviorSubject<boolean>(true);

  // 🔥 Mode hardcore = pas d’indice/preview
  private hardcoreMode$ = new BehaviorSubject<boolean>(false);

  // ⭐ Guest Track (piste spéciale)
  private guestTrack$ = new BehaviorSubject<SpotifyTrack | null>(null);
  private enableGuest$ = new BehaviorSubject<boolean>(false);

  // 🔘 Setters
  setRoundDuration(seconds: number) {
    this.roundDuration$.next(seconds);
  }

  setTrackCount(count: number) {
    this.trackCount$.next(count);
  }

  toggleShowTimer(value: boolean) {
    this.showTimer$.next(value);
  }

  toggleHardcoreMode(value: boolean) {
    this.hardcoreMode$.next(value);
  }

  setGuestTrack(track: SpotifyTrack) {
    this.guestTrack$.next(track);
  }

  toggleGuest(enabled: boolean) {
    this.enableGuest$.next(enabled);
  }

  clearGuestTrack() {
    this.guestTrack$.next(null);
    this.enableGuest$.next(false);
  }

  // 🔎 Getters
  getRoundDuration(): number {
    return this.roundDuration$.getValue();
  }

  getTrackCount(): number {
    return this.trackCount$.getValue();
  }

  isTimerVisible(): boolean {
    return this.showTimer$.getValue();
  }

  isHardcore(): boolean {
    return this.hardcoreMode$.getValue();
  }

  getGuestTrack(): SpotifyTrack | null {
    return this.guestTrack$.getValue();
  }

  isGuestEnabled(): boolean {
    return this.enableGuest$.getValue();
  }
}
