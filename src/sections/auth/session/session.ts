import { API_URL } from "src/constants";
import { User } from "src/services/master-data/user/types";

const STORAGE_KEY = 'session';
const USER_KEY = 'user_info';

export function getSession() {
  return window.localStorage.getItem(STORAGE_KEY);
}

export function getUser() {
  return window.localStorage.getItem(USER_KEY);
}

export function setSession(newSession: string, user: User) {
  window.localStorage.setItem(STORAGE_KEY, newSession);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function flushStorage() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem("clientList");
}

export async function flushSession() {
  // use `fetch` instead of `http` from `utils` to prevent circular dependency
  await window.fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getSession()}`,
    },
  });

  flushStorage();
}
