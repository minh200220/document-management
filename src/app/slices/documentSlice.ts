import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Document from '../types/DocumentType';
import ErrorMsg from '../types/ErrorMsg';
import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';

export interface DocumentState {
  isLoading: boolean;
  documents: Document[];
  document: Document | null;
  error: string | null;
}

const initialState: DocumentState = {
  isLoading: false,
  documents: [],
  document: null,
  error: '',
};

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    clearDocument: (state: DocumentState) => {
      state.document = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDocumentsByFolderId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getDocumentsByFolderId.fulfilled,
        (state, action: PayloadAction<Document[]>) => {
          state.isLoading = false;
          state.documents = action.payload;
          state.document = null;
        }
      )
      .addCase(getDocumentsByFolderId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(getDocumentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getDocumentById.fulfilled,
        (state, action: PayloadAction<Document>) => {
          state.isLoading = false;
          state.document = action.payload;
        }
      )
      .addCase(getDocumentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(createDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createDocument.fulfilled,
        (state, action: PayloadAction<Document>) => {
          state.isLoading = false;
          state.documents.push(action.payload);
          state.document = action.payload;
        }
      )
      .addCase(createDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(updateDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateDocument.fulfilled,
        (state, action: PayloadAction<Document>) => {
          state.isLoading = false;
          state.document = action.payload;
        }
      )
      .addCase(updateDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteDocument.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.documents = state.documents.filter(
            (document) => document.id !== action.payload
          );
        }
      )
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const getDocumentsByFolderId = createAsyncThunk<
  Document[],
  string,
  { rejectValue: string }
>('document/getAllByFolderId', async (folderId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Document[]>(
      `/api/folders/${folderId}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        'Failed to get documents by folder id'
    );
  }
});

export const getDocumentById = createAsyncThunk<
  Document,
  string,
  { rejectValue: string }
>('document/getDocumentById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Document>(`/api/documents/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to get document by id'
    );
  }
});

export const createDocument = createAsyncThunk<
  Document,
  { title: string; content: string; folderId: string },
  { rejectValue: string }
>(
  'document/create',
  async ({ title, content, folderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<Document>('/api/documents', {
        title,
        content,
        folderId,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorMsg>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Failed to create document'
      );
    }
  }
);

export const updateDocument = createAsyncThunk<
  Document,
  { id: string; content: string },
  { rejectValue: string }
>('document/update', async ({ id, content }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<Document>(
      `/api/documents/${id}`,
      { content }
    );
    return response.data; // Return the updated document
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to update document'
    );
  }
});

export const deleteDocument = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('document/delete', async (documentId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/documents/${documentId}`);
    return documentId;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMsg>;
    return rejectWithValue(
      axiosError.response?.data?.message || 'Failed to delete document'
    );
  }
});

export const { clearDocument } = documentSlice.actions;

export default documentSlice.reducer;
