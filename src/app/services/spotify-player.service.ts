import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpotifyPlayerService {
  player: Spotify.Player | null = null;
  deviceId: string | null = null;

  constructor(private ngZone: NgZone) {}

  initialize(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        this.player = new Spotify.Player({
          name: 'Blindify Player',
          getOAuthToken: (cb) => cb(token),
          volume: 0.5,
        });

        this.player.addListener('ready', ({ device_id }) => {
          this.ngZone.run(() => {
            console.log('Spotify Player ready with Device ID:', device_id);
            this.deviceId = device_id;
            resolve();
          });
        });

        this.player.addListener('initialization_error', ({ message }) => reject(message));
        this.player.addListener('authentication_error', ({ message }) => reject(message));
        this.player.addListener('account_error', ({ message }) => reject(message));
        this.player.addListener('playback_error', ({ message }) => reject(message));

        this.player.connect().then((success) => {
          if (!success) reject('Spotify Player failed to connect');
        });
      };

      // Charge le SDK uniquement s’il n’est pas déjà chargé
      if (!(window as any).Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.head.appendChild(script);
      } else {
        // SDK déjà chargé, appelle la callback manuellement une fois
        window.onSpotifyWebPlaybackSDKReady();
      }
    });
  }

  play(trackUri: string, token: string): void {
    if (!this.deviceId) {
      console.error('Device ID not ready yet');
      return;
    }

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        console.error('Failed to play track, status:', response.status);
      }
    }).catch((error) => {
      console.error('Error while trying to play track:', error);
    });
  }
}
