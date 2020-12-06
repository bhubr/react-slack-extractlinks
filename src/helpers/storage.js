const STORAGE_KEY = "slack:auth";

export function getStoredAuth() {
  const storedAuth = localStorage.getItem(STORAGE_KEY);
  if (!storedAuth) return null;
  try {
    const { token, userId } = JSON.parse(storedAuth);
    return { token, userId };
  } catch (err) {
    return null;
  }
}

export function setStoredAuth(auth) {
  const authJSON = JSON.stringify(auth);
  localStorage.setItem(STORAGE_KEY, authJSON);
}

export function resetStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}
