import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import ErrorMsg from '../types/ErrorMsg';
import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';
import Document from '../types/DocumentType';

export interface HistoryState {
  isLoading: boolean;
  documents: Document[];
  error: string | null;
}

const initialState: HistoryState = {
  isLoading: false,
  documents: [],
  error: '',
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDocHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getDocHistory.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.isLoading = false;
          state.documents = action.payload;
        }
      )
      .addCase(getDocHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(addDocToHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        addDocToHistory.fulfilled,
        (state, action: PayloadAction<{ id: string; title: string }>) => {
          state.isLoading = false;
          state.documents.unshift({ ...action.payload, timestamp: Date.now() });
          if (state.documents.length > 10) {
            state.documents.pop();
          }
        }
      )
      .addCase(addDocToHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'An error occurred';
      });
  },
});

export const getDocHistory = createAsyncThunk<
  Document[],
  void,
  { rejectValue: string }
>('history/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Document[]>('/api/history');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to get history'
    );
  }
});

export const addDocToHistory = createAsyncThunk<
  { id: string; title: string },
  { id: string; title: string },
  { rejectValue: string }
>('history/add', async ({ id, title }, { rejectWithValue }) => {
  try {
    await axiosInstance.post('/api/history', {
      id,
      title,
    });
    return { id, title };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to add document to history'
    );
  }
});

export default historySlice.reducer;
