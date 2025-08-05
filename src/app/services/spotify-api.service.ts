import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpotifyAuthService } from './spotify-auth.service';
import { map, Observable } from 'rxjs';
import { SpotifyPlaylistTracksResponse, SpotifyTrack } from '../models/spotify.models';

@Injectable({ providedIn: 'root' })
export class SpotifyApiService {
  constructor(private http: HttpClient, private auth: SpotifyAuthService) {}

  private getTokenOrThrow(): string {
    const token = this.auth.getAccessToken();
    if (!token) throw new Error('Token d’accès manquant');
    return token;
  }

  getPlaylistTracks(playlistId: string, limit = 100, offset = 0): Observable<SpotifyPlaylistTracksResponse> {
    const token = this.getTokenOrThrow();
    return this.http.get<SpotifyPlaylistTracksResponse>(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
      }
    );
  }
  searchTracks(query: string): Observable<SpotifyTrack[]> {
  const token = this.getAccessToken();
  return this.http.get<any>('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q: query,
      type: 'track',
      limit: 10
    }
  }).pipe(
    map(res => res.tracks.items)
  );
}

  getAccessToken(): string | null {
    return this.auth.getAccessToken();
  }
}
