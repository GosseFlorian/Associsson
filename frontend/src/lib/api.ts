import { useLoginStore } from "../stores/loginStore";

const BASE_URL = "http://localhost:3000";

export async function apiFetch(chemin: string, options: RequestInit = {}) {
  const token = useLoginStore.getState().token;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${BASE_URL}${chemin}`, { ...options, headers });
}
