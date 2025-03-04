export interface Video {
    id: string;
    title: string;
    url: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: string;
    playlistId: string;
    createdAt: string;
  }

  export interface Playlist {
    id: string;
    title: string;
    description?: string;
    userId: string;
    isPublic: boolean;
    tags?: string[];
    category?: string;
    videos: Video[];
    sharedWith?: string[];
    createdAt: string;
    updatedAt: string;
  }

  export interface PlaylistState {
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    isLoading: boolean;
    error: string | null;
  }

  export interface CreatePlaylistRequest {
    title: string;
    description?: string;
    tags?: string[];
    category?: string;
    isPublic?: boolean;
  }

  export interface CreateVideoRequest {
    title: string;
    url: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: string;
  }

  export interface FilterPlaylistRequest {
    category?: string;
    tags?: string[];
  }

  export interface SharePlaylistRequest {
    emails: string[];
  }
