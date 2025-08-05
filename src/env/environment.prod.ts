export const environment = {
  production: true,
  spotify: {
    clientId: 'e9e92df0cb404ff499bff680579b7b58',
    redirectUri: 'https://whodistrack.vercel.app/auth/callback',
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
