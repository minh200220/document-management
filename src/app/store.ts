import { configureStore } from '@reduxjs/toolkit';
import folderReducer from './slices/folderSlice';
import documentReducer from './slices/documentSlice';
import historyReducer from './slices/historySlice';
import searchDocReducer from './slices/searchDocSlice';

export const store = configureStore({
  reducer: {
    folder: folderReducer,
    document: documentReducer,
    history: historyReducer,
    searchDoc: searchDocReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
