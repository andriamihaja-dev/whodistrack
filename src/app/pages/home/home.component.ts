import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, MatButtonModule, MatToolbarModule]
})
export class HomeComponent implements OnInit {
  user: any = null;
  randomPlaylist: any = null;

  constructor(
    private spotifyAuthService: SpotifyAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.spotifyAuthService.getAccessToken();
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.spotifyAuthService.login();
  }

  logout(): void {
    this.spotifyAuthService.logout();
    this.user = null;
  }
}
