import { Injectable } from '@angular/core';
import { SpotifyApiService } from './spotify-api.service';
import { Observable, map, tap } from 'rxjs';
import { SpotifyTrack } from '../models/spotify.models';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  constructor(private spotifyApiService: SpotifyApiService) {}

  loadPlaylistTracks(playlistId: string, limit = 15): Observable<SpotifyTrack[]> {
    console.log('[PlaylistService] Requested playlistId:', playlistId);

    return this.spotifyApiService.getPlaylistTracks(playlistId).pipe(
      tap(response => {
        console.log('[PlaylistService] API response items:', response.items.length);
      }),
      map(response => {
        // On ne filtre que sur la présence d'un URI valide
        const tracks = response.items
          .map(item => item.track)
          .filter(track => {
            const isValid = !!track?.uri;
            if (!isValid) {
              console.warn('[PlaylistService] Track filtrée (uri invalide)', track);
            }
            return isValid;
          });

        console.log('[PlaylistService] Tracks valides après filtre:', tracks.length);
        const shuffled = this.shuffleArray(tracks);
        const finalSelection = shuffled.slice(0, limit);
        console.log('[PlaylistService] Tracks après shuffle + slice:', finalSelection.map(t => t.name));

        return finalSelection;
      })
    );
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
}
