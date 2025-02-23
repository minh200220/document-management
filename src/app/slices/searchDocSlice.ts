import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import ErrorMsg from '../types/ErrorMsg';
import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';
import Document from '../types/DocumentType';

export interface SearchDocState {
  isLoading: boolean;
  documents: Document[];
  error: string | null;
}

const initialState: SearchDocState = {
  isLoading: false,
  documents: [],
  error: '',
};

export const searchDocSlice = createSlice({
  name: 'searchDoc',
  initialState,
  reducers: {
    clearDocuments: (state: SearchDocState) => {
      state.documents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDoc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        searchDoc.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.isLoading = false;
          state.documents = action.payload;
        }
      )
      .addCase(searchDoc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const searchDoc = createAsyncThunk<
  Document[],
  { keyword: string },
  { rejectValue: string }
>('searchDoc/getAllByKeyword', async ({ keyword }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Document[]>(
      `/api/search?query=${keyword}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to search documents'
    );
  }
});

export const { clearDocuments } = searchDocSlice.actions;

export default searchDocSlice.reducer;
