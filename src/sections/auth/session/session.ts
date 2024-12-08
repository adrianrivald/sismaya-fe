const STORAGE_KEY = 'session';

export function getSession() {
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setSession(newSession: string) {
  window.localStorage.setItem(STORAGE_KEY, newSession);
}

export function flushStorage() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export async function flushSession() {
  // use `fetch` instead of `http` from `utils` to prevent circular dependency
  await window.fetch(`/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getSession()}`,
    },
  });

  flushStorage();
}
