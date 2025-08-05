export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  images: { url: string }[];
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  description: string;
}

export interface SpotifyArtist {
  name: string;
}
export interface SpotifyAlbum {
  images: { url: string }[];
}
export interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  uri: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;  
}

export interface SpotifyTrackItem {
  track: SpotifyTrack;
}

export interface SpotifyPlaylistTracksResponse {
  items: SpotifyTrackItem[];
}
