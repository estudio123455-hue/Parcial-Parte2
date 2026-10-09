export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Error ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type Actor = {
  id: string; name: string; photo: string; nationality: string;
  birthDate: string; biography: string;
};
export type Prize = { id: string; name: string; category: string; year: number; status: string };
export type Movie = {
  id: string; title: string; poster: string; duration: number; country: string;
  releaseDate: string; popularity: number; actors?: Actor[]; director?: Actor;
  genre?: { id: string; type: string }; youtubeTrailer?: { name: string; url: string; duration: number; channel: string };
  prizes?: Prize[];
};
