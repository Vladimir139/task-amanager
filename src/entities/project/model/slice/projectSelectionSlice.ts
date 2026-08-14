import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ProjectSelectionSchema } from "../types/projectSelection";

const initialState: ProjectSelectionSchema = {
  currentProjectId: null,
  isHydrated: false,
};

const projectSelectionSlice = createSlice({
  name: "projectSelection",
  initialState,
  reducers: {
    clearCurrentProjectSelection: () => initialState,
    hydrateCurrentProjectSelection: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload;
      state.isHydrated = true;
    },
    setCurrentProjectId: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload;
      state.isHydrated = true;
    },
  },
});

export const { actions: projectSelectionActions } = projectSelectionSlice;
export const { reducer: projectSelectionReducer } = projectSelectionSlice;
