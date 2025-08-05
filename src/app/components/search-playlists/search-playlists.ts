import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { PlaylistCardComponent } from '../playlist-card/playlist-card';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { SpotifyPlaylist } from '../../models/spotify.models';
import { Output, EventEmitter } from '@angular/core'; // à ajouter tout en haut





@Component({
  selector: 'app-search-playlists',
  standalone: true,
  templateUrl: './search-playlists.html',
  styleUrls: ['./search-playlists.css'],
  imports: [CommonModule, FormsModule, PlaylistCardComponent]
})
export class SearchPlaylistsComponent {
  searchQuery = '';
  results$!: Observable<SpotifyPlaylist[]>;
  suggestions: SpotifyPlaylist[] = [];
  showSuggestions = false;
  @Output() select = new EventEmitter<string>();

  constructor(
    private http: HttpClient,
    private spotifyAuth: SpotifyAuthService
  ) {}

  onSearchChange(): void {
    const query = this.searchQuery.trim();

    if (query.length < 2) {
      this.results$ = of([]);
      this.suggestions = [];
      return;
    }

    const token = this.spotifyAuth.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.results$ = of(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) =>
        this.http
          .get<{ playlists: { items: SpotifyPlaylist[] } }>('https://api.spotify.com/v1/search', {
            headers,
            params: {
              q: q,
              type: 'playlist',
              limit: 10,
            },
          })
          .pipe(
            map((res) =>
              res.playlists.items.filter(
                (p): p is SpotifyPlaylist =>
                  !!p && Array.isArray(p.images) && p.images.length > 0 && !!p.name
              )
            ),
            tap((items) => (this.suggestions = items)),
            catchError((err) => {
              console.error('❌ Erreur recherche playlists Spotify :', err);
              this.suggestions = [];
              return of([]);
            })
          )
      )
    );
  }

  selectSuggestion(playlist: SpotifyPlaylist): void {
    this.searchQuery = playlist.name;
    this.showSuggestions = false;
    this.onSearchChange();
  }

  hideSuggestions(): void {
    setTimeout(() => (this.showSuggestions = false), 200);
  }

  onPlaylistSelect(playlistId: string): void {
  this.select.emit(playlistId);
}


}
