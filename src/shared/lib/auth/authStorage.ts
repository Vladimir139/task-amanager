const STORAGE_KEY = "task-manager-auth";

export interface StoredAuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

const emptyTokens: StoredAuthTokens = {
  accessToken: null,
  refreshToken: null,
};

export const getStoredAuthTokens = (): StoredAuthTokens => {
  if (typeof window === "undefined") {
    return emptyTokens;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return emptyTokens;
    }

    const parsed = JSON.parse(rawValue) as Partial<StoredAuthTokens>;

    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch {
    return emptyTokens;
  }
};

export const saveStoredAuthTokens = (tokens: StoredAuthTokens): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

export const clearStoredAuthTokens = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};
