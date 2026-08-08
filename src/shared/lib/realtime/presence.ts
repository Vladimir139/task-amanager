export const mergePresenceState = (
  currentState: Record<string, boolean>,
  updates: Record<string, boolean>,
): Record<string, boolean> => {
  let hasChanges = false;
  const nextState = { ...currentState };

  for (const [userId, isOnline] of Object.entries(updates)) {
    if (nextState[userId] === isOnline) {
      continue;
    }

    nextState[userId] = isOnline;
    hasChanges = true;
  }

  return hasChanges ? nextState : currentState;
};

export const setPresenceState = (
  currentState: Record<string, boolean>,
  userId: string,
  isOnline: boolean,
): Record<string, boolean> =>
  currentState[userId] === isOnline
    ? currentState
    : {
        ...currentState,
        [userId]: isOnline,
      };
