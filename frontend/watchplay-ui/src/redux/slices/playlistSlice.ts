import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreatePlaylistRequest, CreateVideoRequest, FilterPlaylistRequest, Playlist, PlaylistState, SharePlaylistRequest, Video } from '../../types/playlist';
import { playlistService } from '../../services/playlistService';

// Thunks
export const fetchPlaylists = createAsyncThunk<Playlist[]>(
  'playlists/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await playlistService.getPlaylists();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch playlists');
    }
  }
);

export const fetchPlaylist = createAsyncThunk<Playlist, string>(
  'playlists/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await playlistService.getPlaylist(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch playlist');
    }
  }
);

export const createPlaylist = createAsyncThunk<Playlist, CreatePlaylistRequest>(
  'playlists/create',
  async (playlist, { rejectWithValue }) => {
    try {
      return await playlistService.createPlaylist(playlist);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create playlist');
    }
  }
);

export const updatePlaylist = createAsyncThunk<Playlist, { id: string; playlist: Partial<CreatePlaylistRequest> }>(
  'playlists/update',
  async ({ id, playlist }, { rejectWithValue }) => {
    try {
      return await playlistService.updatePlaylist(id, playlist);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update playlist');
    }
  }
);

export const deletePlaylist = createAsyncThunk<string, string>(
  'playlists/delete',
  async (id, { rejectWithValue }) => {
    try {
      await playlistService.deletePlaylist(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete playlist');
    }
  }
);

export const filterPlaylists = createAsyncThunk<Playlist[], FilterPlaylistRequest>(
  'playlists/filter',
  async (filter, { rejectWithValue }) => {
    try {
      return await playlistService.filterPlaylists(filter);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to filter playlists');
    }
  }
);

export const sharePlaylist = createAsyncThunk<Playlist, { id: string; share: SharePlaylistRequest }>(
  'playlists/share',
  async ({ id, share }, { rejectWithValue }) => {
    try {
      return await playlistService.sharePlaylist(id, share);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share playlist');
    }
  }
);

export const addVideo = createAsyncThunk<{ video: Video; playlistId: string }, { playlistId: string; video: CreateVideoRequest }>(
  'playlists/addVideo',
  async ({ playlistId, video }, { rejectWithValue }) => {
    try {
      const response = await playlistService.addVideo(playlistId, video);
      return { video: response, playlistId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add video');
    }
  }
);

export const removeVideo = createAsyncThunk<{ videoId: string; playlistId: string }, { playlistId: string; videoId: string }>(
  'playlists/removeVideo',
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      await playlistService.removeVideo(playlistId, videoId);
      return { videoId, playlistId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove video');
    }
  }
);

// Slice
const initialState: PlaylistState = {
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
};

export const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all playlists
      .addCase(fetchPlaylists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action: PayloadAction<Playlist[]>) => {
        state.isLoading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single playlist
      .addCase(fetchPlaylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.isLoading = false;
        state.currentPlaylist = action.payload;
        // Atualiza a playlist no array de playlists se ela já existir
        const index = state.playlists.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
      })
      .addCase(fetchPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create playlist
      .addCase(createPlaylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.isLoading = false;
        state.playlists.push(action.payload);
        state.currentPlaylist = action.payload;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update playlist
      .addCase(updatePlaylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.isLoading = false;
        const index = state.playlists.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        state.currentPlaylist = action.payload;
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete playlist
      .addCase(deletePlaylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.playlists = state.playlists.filter(p => p.id !== action.payload);
        if (state.currentPlaylist?.id === action.payload) {
          state.currentPlaylist = null;
        }
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Filter playlists
      .addCase(filterPlaylists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(filterPlaylists.fulfilled, (state, action: PayloadAction<Playlist[]>) => {
        state.isLoading = false;
        state.playlists = action.payload;
      })
      .addCase(filterPlaylists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Share playlist
      .addCase(sharePlaylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sharePlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.isLoading = false;
        const index = state.playlists.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        state.currentPlaylist = action.payload;
      })
      .addCase(sharePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add video
      .addCase(addVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addVideo.fulfilled, (state, action: PayloadAction<{ video: Video; playlistId: string }>) => {
        state.isLoading = false;
        const { video, playlistId } = action.payload;
        const playlistIndex = state.playlists.findIndex(p => p.id === playlistId);
        
        if (playlistIndex !== -1) {
          state.playlists[playlistIndex].videos.push(video);
        }
        
        if (state.currentPlaylist?.id === playlistId) {
          state.currentPlaylist.videos.push(video);
        }
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove video
      .addCase(removeVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeVideo.fulfilled, (state, action: PayloadAction<{ videoId: string; playlistId: string }>) => {
        state.isLoading = false;
        const { videoId, playlistId } = action.payload;
        const playlistIndex = state.playlists.findIndex(p => p.id === playlistId);
        
        if (playlistIndex !== -1) {
          state.playlists[playlistIndex].videos = state.playlists[playlistIndex].videos.filter(v => v.id !== videoId);
        }
        
        if (state.currentPlaylist?.id === playlistId) {
          state.currentPlaylist.videos = state.currentPlaylist.videos.filter(v => v.id !== videoId);
        }
      })
      .addCase(removeVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
