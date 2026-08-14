import { createSelector } from "@reduxjs/toolkit";

import type { StateSchema } from "@/shared/config";

export const selectProjectSelectionState = (state: StateSchema): StateSchema["projectSelection"] =>
  state.projectSelection;

export const selectCurrentProjectId = createSelector(
  [selectProjectSelectionState],
  (projectSelection) => projectSelection.currentProjectId,
);

export const selectCurrentProjectIsHydrated = createSelector(
  [selectProjectSelectionState],
  (projectSelection) => projectSelection.isHydrated,
);
