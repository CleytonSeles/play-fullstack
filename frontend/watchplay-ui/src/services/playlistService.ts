import { playlistApi } from './api';
import { CreatePlaylistRequest, CreateVideoRequest, FilterPlaylistRequest, Playlist, SharePlaylistRequest, Video } from '../types/playlist';

export const playlistService = {
  getPlaylists: async (): Promise<Playlist[]> => {
    const response = await playlistApi.get<Playlist[]>('/playlists');
    return response.data;
  },

  getPlaylist: async (id: string): Promise<Playlist> => {
    const response = await playlistApi.get<Playlist>(`/playlists/${id}`);
    return response.data;
  },

  createPlaylist: async (playlist: CreatePlaylistRequest): Promise<Playlist> => {
    const response = await playlistApi.post<Playlist>('/playlists', playlist);
    return response.data;
  },

  updatePlaylist: async (id: string, playlist: Partial<CreatePlaylistRequest>): Promise<Playlist> => {
    const response = await playlistApi.patch<Playlist>(`/playlists/${id}`, playlist);
    return response.data;
  },

  deletePlaylist: async (id: string): Promise<void> => {
    await playlistApi.delete(`/playlists/${id}`);
  },

  filterPlaylists: async (filter: FilterPlaylistRequest): Promise<Playlist[]> => {
    const params = new URLSearchParams();
    if (filter.category) params.append('category', filter.category);
    if (filter.tags) filter.tags.forEach(tag => params.append('tags', tag));
    
    const response = await playlistApi.get<Playlist[]>(`/playlists/filter?${params.toString()}`);
    return response.data;
  },

  sharePlaylist: async (id: string, share: SharePlaylistRequest): Promise<Playlist> => {
    const response = await playlistApi.post<Playlist>(`/playlists/${id}/share`, share);
    return response.data;
  },

  addVideo: async (playlistId: string, video: CreateVideoRequest): Promise<Video> => {
    const response = await playlistApi.post<Video>(`/playlists/${playlistId}/videos`, video);
    return response.data;
  },

  removeVideo: async (playlistId: string, videoId: string): Promise<void> => {
    await playlistApi.delete(`/playlists/${playlistId}/videos/${videoId}`);
  },
};
