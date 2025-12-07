import { db } from "../firebase";

export interface TrackData {
  name?: string | null;
  popularity?: number | null;
  uri?: string | null;
  duration_ms?: number | null;
  isrc?: string | null;
  soundcharts_uuid?: string | null;
  soundcharts_total_value?: number | null;
  soundcharts_avg_evolution?: number | null;
  soundcharts_last_evolution_gt100_date?: string | null;
  added_at?: string | null;
  available?: boolean;
  artists?: string[];
  album?: {
    name?: string | null;
    release_date?: string | null;
  };
  last_updated?: string;
  [key: string]: any;
}

export interface DailyStreamData {
  date: string;
  value: number;
  evolution?: number | null;
  estimated?: boolean | null;
  [key: string]: any;
}

export interface PlaylistData {
  name: string;
  tracks: string[];
  [key: string]: any;
}

const TRACKS_COLLECTION = "tracks";
const PLAYLISTS_COLLECTION = "playlists";
const DAILY_STREAMS_SUBCOLLECTION = "dailyStreams";

export const FirestoreService = {
  async setPlaylist(playlistId: string, data: PlaylistData) {
    if (!playlistId) return;
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await db.collection(PLAYLISTS_COLLECTION).doc(playlistId).set(updateData, { merge: true });
    } catch (error) {
      console.error(`Error saving playlist ${playlistId} to Firestore:`, error);
    }
  },

  async setTrack(trackId: string, data: TrackData) {
    if (!trackId) return;
    try {
      const updateData = {
        ...data,
        last_updated: new Date().toISOString()
      };
      
      await db.collection(TRACKS_COLLECTION).doc(trackId).set(updateData, { merge: true });
    } catch (error) {
      console.error(`Error saving track ${trackId} to Firestore:`, error);
    }
  },

  async getTrack(trackId: string) {
    try {
      const doc = await db.collection(TRACKS_COLLECTION).doc(trackId).get();
      if (!doc.exists) return null;
      return doc.data();
    } catch (error) {
      console.error(`Error getting track ${trackId} from Firestore:`, error);
      throw error;
    }
  },

  async setDailyStream(trackId: string, dateIso: string, data: DailyStreamData) {
    if (!trackId || !dateIso) return;
    try {
      await db
        .collection(TRACKS_COLLECTION)
        .doc(trackId)
        .collection(DAILY_STREAMS_SUBCOLLECTION)
        .doc(dateIso)
        .set(data, { merge: true });
    } catch (error) {
      console.error(`Error saving daily stream for track ${trackId} to Firestore:`, error);
    }
  },
  
  async getDailyStreams(trackId: string) {
    try {
      const snapshot = await db
        .collection(TRACKS_COLLECTION)
        .doc(trackId)
        .collection(DAILY_STREAMS_SUBCOLLECTION)
        .orderBy('date')
        .get();
        
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
       console.error(`Error getting daily streams for track ${trackId} from Firestore:`, error);
       throw error;
    }
  }
};
