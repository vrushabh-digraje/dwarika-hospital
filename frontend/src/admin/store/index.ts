import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    sidebarCollapsed: false,
  } as UiState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setSidebarOpen, toggleSidebar, toggleSidebarCollapsed } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
