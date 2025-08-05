import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SpotifyUser, SpotifyPlaylist } from '../../models/spotify.models';
import { UserHeaderComponent } from '../../components/user-header/user-header';
import { PlaylistCardComponent } from '../../components/playlist-card/playlist-card';
import { SearchPlaylistsComponent } from '../../components/search-playlists/search-playlists';
import { GameSettingsComponent } from '../../components/game-settings/game-settings.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, UserHeaderComponent, PlaylistCardComponent, SearchPlaylistsComponent, GameSettingsComponent]
})
export class DashboardComponent implements OnInit {
  userInfo$!: Observable<SpotifyUser | null>;
  playlists$!: Observable<SpotifyPlaylist[]>;
  error = '';
  showSettings = false;

toggleSettings(): void {
  this.showSettings = !this.showSettings;
}

  constructor(
    private http: HttpClient,
    private spotifyAuth: SpotifyAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.spotifyAuth.getAccessToken();
    if (!token) {
      this.router.navigate(['/home']);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.userInfo$ = this.http.get<SpotifyUser>('https://api.spotify.com/v1/me', { headers }).pipe(
      catchError(() => {
        this.error = 'Erreur profil utilisateur.';
        this.spotifyAuth.logout();
        return of(null);
      })
    );

    this.playlists$ = this.http.get<{ items: SpotifyPlaylist[] }>(
      'https://api.spotify.com/v1/me/playlists',
      { headers }
    ).pipe(
      map(response => response.items),
      catchError(() => of([]))
    );
  }

  onLogout(): void {
    this.spotifyAuth.logout();
    this.router.navigate(['/home']);
  }

  playWithPlaylist(playlistId: string): void {
    this.router.navigate(['/game'], { queryParams: { playlistId } });
  }
  
}
