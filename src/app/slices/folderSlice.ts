import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Folder from '../types/FolderType';
import ErrorMsg from '../types/ErrorMsg';
import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';

export interface FolderState {
  isLoading: boolean;
  folders: Folder[];
  error: string | null;
}

const initialState: FolderState = {
  isLoading: false,
  folders: [],
  error: '',
};

export const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    clearError: (state: FolderState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFolders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getFolders.fulfilled,
        (state, action: PayloadAction<Folder[]>) => {
          state.isLoading = false;
          state.folders = action.payload;
        }
      )
      .addCase(getFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(createFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createFolder.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          state.isLoading = false;
          state.folders.push(action.payload);
        }
      )
      .addCase(createFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(deleteFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteFolder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.folders = state.folders.filter(
            (folder) => folder.id !== action.payload
          );
        }
      )
      .addCase(deleteFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const getFolders = createAsyncThunk<
  Folder[],
  void,
  { rejectValue: string }
>('folder/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Folder[]>('/api/folders');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to create folder'
    );
  }
});

export const createFolder = createAsyncThunk<
  Folder,
  string,
  { rejectValue: string }
>('folder/create', async (folderName: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<Folder>('/api/folders', {
      name: folderName,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.error || 'Failed to create folder'
    );
  }
});

export const deleteFolder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('folder/delete', async (folderId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/folders/${folderId}`);
    return folderId;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to delete folder'
    );
  }
});

export const { clearError } = folderSlice.actions;

export default folderSlice.reducer;
