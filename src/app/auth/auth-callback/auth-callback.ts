import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-auth-callback',
  template: `<p>Connexion en cours...</p>`,
  imports: [CommonModule, HttpClientModule]
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const code = params['code'];
    const verifier = localStorage.getItem('code_verifier');

    if (!code || !verifier) {
      // Si le verifier est manquant, on redirige vers login (flow cassé)
      this.router.navigate(['/home']);
      return;
    }

    this.spotifyAuthService.exchangeCodeForToken(code).subscribe({
      next: (response: any) => {
        this.spotifyAuthService.storeAccessToken(response.access_token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // En cas d'échec, mieux vaut forcer une nouvelle connexion
        this.spotifyAuthService.logout();
        this.router.navigate(['/home']);
      }
    });
  });
}

}
