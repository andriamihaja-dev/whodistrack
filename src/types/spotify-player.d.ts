// src/types/spotify-player.d.ts

declare namespace Spotify {
  interface Player {
    addListener(
      event: 
        | 'initialization_error' 
        | 'authentication_error' 
        | 'account_error' 
        | 'playback_error' 
        | 'player_state_changed' 
        | 'ready',  // Ajout de 'ready' ici
      callback: (payload: any) => void // on utilise any pour la simplicité
    ): void;

    connect(): Promise<boolean>;
    disconnect(): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    // Ajoute ici les autres méthodes si besoin
  }
}

declare const Spotify: {
  Player: new (options: {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }) => Spotify.Player;
};

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
}
