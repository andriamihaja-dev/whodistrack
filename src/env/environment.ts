// src/environments/environment.ts
export const environment = {
  production: false,
  spotify: {
    clientId: 'e9e92df0cb404ff499bff680579b7b58',
    redirectUri: 'http://127.0.0.1:4200/auth/callback',
    scopes: [
      'user-read-email',
      'user-read-private',
      'playlist-read-private',
      'playlist-read-collaborative',
      'streaming',
      'user-modify-playback-state',
      'user-read-playback-state'
    ]
  }
};
