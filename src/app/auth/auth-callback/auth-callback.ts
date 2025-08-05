import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-auth-callback',
  template: `
    <p>Connexion en cours...</p>
  `,
  imports: [CommonModule, HttpClientModule],
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  ngOnInit(): void {
    console.log('[AUTH_CALLBACK] Le composant a bien démarré.');

    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const verifier = localStorage.getItem('code_verifier');

      console.log('[CALLBACK] code:', code);
      console.log('[CALLBACK] verifier:', verifier);
      console.log('[CALLBACK] redirectUri utilisé:', this.spotifyAuthService['redirectUri']);

      if (!code || !verifier) {
        console.warn('[CALLBACK] Code ou verifier manquant. Redirection vers /home.');
        this.router.navigate(['/home']);
        return;
      }

      this.spotifyAuthService.exchangeCodeForToken(code).subscribe({
        next: (response: any) => {
          const accessToken = response.access_token;
          console.log('[CALLBACK] Token reçu :', accessToken);

          this.spotifyAuthService.storeAccessToken(accessToken);
          console.log('[CALLBACK] Token stocké. Redirection vers /dashboard');

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('[CALLBACK] Erreur lors de l’échange code → token :', error);
          this.spotifyAuthService.logout();
          this.router.navigate(['/home']);
        }
      });
    });
  }
}
