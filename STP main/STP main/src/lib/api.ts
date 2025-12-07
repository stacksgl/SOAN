import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export type BackendSongRecord = {
  available: boolean;
  added_at: string | null;
  track: {
    id: string;
    name: string | null;
    popularity: number | null;
    uri: string | null;
    duration_ms: number;
    external_ids: { isrc: string | null };
    soundcharts_uuid?: string | null;
    soundcharts_total_value?: number | null;
    soundcharts_avg_evolution?: number | null;
    soundcharts_last_evolution_gt100_date?: string | null;
  };
};

export type BackendSongsResponse = { ok: boolean; items: BackendSongRecord[] };

export type BackendDetailsResponse = {
  ok: boolean;
  id: string;
  soundcharts_uuid: string;
  count: number;
  items: { date: string; value?: number | null; evolution?: number | null }[];
};

export interface FirestoreTrack {
  name?: string | null;
  uri?: string | null;
  stream_count?: number | null;
  duration_seconds?: number | null;
  is_playable?: boolean | null;
  detected_at?: string | null;
  last_updated?: string | null;
  artists?: string[] | null;
  album?: {
    name?: string | null;
    release_date?: string | null;
  } | null;
  popularity?: number | null;
  isrc?: string | null;
  [key: string]: any;
}

export interface FirestorePlaylist {
  name?: string | null;
  tracks?: string[] | null;
  updatedAt?: string | null;
  [key: string]: any;
}

export async function fetchSongsFromFirestore(): Promise<BackendSongRecord[]> {
  try {
    const tracksCollection = collection(db, "tracks");
    const snapshot = await getDocs(tracksCollection);
    
    const tracks: BackendSongRecord[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreTrack;
      const uri = data.uri || doc.id;
      
      let trackId = uri;
      if (uri.startsWith("spotify:track:")) {
        trackId = uri.replace("spotify:track:", "");
      }
      
      const duration_ms = data.duration_seconds 
        ? data.duration_seconds * 1000 
        : (data.duration_ms || 0);
      
      const track: BackendSongRecord = {
        available: data.is_playable !== false,
        added_at: data.detected_at || data.last_updated || null,
        track: {
          id: trackId,
          name: data.name || null,
          popularity: data.popularity || null,
          uri: uri,
          duration_ms: duration_ms,
          external_ids: {
            isrc: data.isrc || null,
          },
          soundcharts_total_value: data.stream_count || null,
          soundcharts_avg_evolution: null,
          artists: data.artists || [],
          album: data.album ? {
            name: data.album.name || null,
            release_date: data.album.release_date || null,
          } : undefined,
        } as any,
      };
      
      tracks.push(track);
    });
    
    return tracks;
  } catch (error) {
    console.error("Error fetching tracks from Firestore:", error);
    throw error;
  }
}

export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerImage: string;
  totalTracks: number;
  followers: number;
  followersTrend: number;
  totalDuration: string;
  spotifyUrl: string;
  dateAdded: string;
  lastUpdated: string;
  isPublic: boolean;
  category: string;
  coverImage: string;
  playlistUri: string;
  playlistId: string;
  collaborators: string[];
}

export async function fetchPlaylistsFromFirestore(): Promise<PlaylistData[]> {
  try {
    const playlistsCollection = collection(db, "playlists");
    const snapshot = await getDocs(playlistsCollection);
    
    const playlists: PlaylistData[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestorePlaylist;
      const playlistId = doc.id;
      const uri = playlistId.startsWith("spotify:playlist:") 
        ? playlistId 
        : `spotify:playlist:${playlistId}`;
      
      let extractedId = playlistId;
      if (playlistId.startsWith("spotify:playlist:")) {
        extractedId = playlistId.replace("spotify:playlist:", "");
      }
      
      const tracks = Array.isArray(data.tracks) ? data.tracks : [];
      const spotifyUrl = `https://open.spotify.com/playlist/${extractedId}`;
      
      const playlist: PlaylistData = {
        id: playlistId,
        name: data.name || "Unnamed Playlist",
        description: "unavailable",
        owner: "unavailable",
        ownerImage: "",
        totalTracks: tracks.length,
        followers: 0,
        followersTrend: 0,
        totalDuration: "unavailable",
        spotifyUrl: spotifyUrl,
        dateAdded: data.updatedAt || "",
        lastUpdated: data.updatedAt || "",
        isPublic: false,
        category: "unavailable",
        coverImage: "",
        playlistUri: uri,
        playlistId: extractedId,
        collaborators: [],
      };
      
      playlists.push(playlist);
    });
    
    return playlists;
  } catch (error) {
    console.error("Error fetching playlists from Firestore:", error);
    throw error;
  }
}

export async function fetchSongs(): Promise<BackendSongRecord[]> {
  const res = await fetch('/api/view/songs', { credentials: 'include' });
  if (!res.ok) throw new Error(`songs ${res.status}`);
  const data: BackendSongsResponse = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

export async function fetchSongDetails(trackId: string): Promise<BackendDetailsResponse | null> {
  if (!trackId) return null;
  const url = `/api/details?id=${encodeURIComponent(trackId)}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return null;
  return await res.json();
}

export function formatMsToDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function ensureArray<T>(v: T | T[] | null | undefined): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}


