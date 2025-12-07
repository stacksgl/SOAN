import "dotenv/config";
import fetch from "node-fetch";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { FirestoreService } from "../services/firestore";

const SP_PARTNER_URL = "https://api-partner.spotify.com/pathfinder/v2/query";
const AUTH_TOKEN = process.env.SPOTIFY_PARTNER_AUTH_TOKEN || "";
const CLIENT_TOKEN = process.env.SPOTIFY_PARTNER_CLIENT_TOKEN || "";

const COMMON_HEADERS = {
  "accept": "application/json",
  "accept-language": "cs",
  "app-platform": "WebPlayer",
  "authorization": `Bearer ${AUTH_TOKEN}`,
  "cache-control": "no-cache",
  "client-token": CLIENT_TOKEN,
  "content-type": "application/json;charset=UTF-8",
  "origin": "https://open.spotify.com",
  "pragma": "no-cache",
  "priority": "u=1, i",
  "referer": "https://open.spotify.com/",
  "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "spotify-app-version": "1.2.79.250.g72d95fb3",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
};

export type ScrapedTrack = {
  name: string;
  detected_at: string;
  uri: string;
  is_playable: boolean;
  stream_count: number | null;
  duration_seconds: number | null;
};

type TrackMap = Record<string, ScrapedTrack>;
type PlaylistData = {
  name: string;
  tracks: string[];
};
type PlaylistMap = Record<string, PlaylistData>;

const OPERATION_NAME = "fetchPlaylist";
const OPERATION_HASH = "837211ef46f604a73cd3d051f12ee63c81aca4ec6eb18e227b0629a7b36adad3";

async function fetchPlaylistPage(uri: string, offset: number, limit: number) {
  const body = {
    variables: {
      uri,
      offset,
      limit,
      enableWatchFeedEntrypoint: true
    },
    operationName: OPERATION_NAME,
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: OPERATION_HASH
      }
    }
  };

  const res = await fetch(SP_PARTNER_URL, {
    method: "POST",
    headers: COMMON_HEADERS,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Partner API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

export async function scrapePlaylist(playlistId: string): Promise<{ name: string; tracks: ScrapedTrack[] }> {
  const uri = `spotify:playlist:${playlistId}`;
  const tracks: ScrapedTrack[] = [];
  let offset = 0;
  const limit = 100;
  let hasNext = true;
  const detectedAt = new Date().toISOString();
  let playlistName = "";

  console.log(`Starting scrape for playlist ${playlistId}...`);

  while (hasNext) {
    console.log(`Fetching offset ${offset}...`);
    const data: any = await fetchPlaylistPage(uri, offset, limit);
    
    const playlistV2 = data?.data?.playlistV2;
    if (!playlistV2) {
      console.warn("No playlistV2 data found in response:", JSON.stringify(data).slice(0, 200));
      break;
    }

    if (offset === 0 && playlistV2.data?.name) {
      playlistName = playlistV2.data.name;
    } else if (offset === 0 && playlistV2.name) {
      playlistName = playlistV2.name;
    }

    const items = playlistV2.content?.items;
    console.log(`Found ${items?.length} items in page.`);
    if (!Array.isArray(items) || items.length === 0) {
      hasNext = false;
      break;
    }

    for (const item of items) {
      const trackData = item.itemV2?.data;
      if (!trackData) continue;
      
      const trackUri = trackData.uri;
      const name = trackData.name;
      const playable = trackData.playability?.playable === true;
      const playcountStr = trackData.playcount;
      const streamCount = playcountStr ? parseInt(playcountStr, 10) : null;
      const durationMs = trackData.trackDuration?.totalMilliseconds;
      const durationSeconds = typeof durationMs === 'number' ? Math.round(durationMs / 1000) : null;

      tracks.push({
        name: name || "Unknown",
        detected_at: detectedAt,
        uri: trackUri || "",
        is_playable: playable,
        stream_count: streamCount,
        duration_seconds: durationSeconds
      });
    }

    const totalCount = playlistV2.content?.totalCount || 0;
    console.log(`Total count: ${totalCount}, Offset: ${offset}, Items fetched: ${items?.length}`);
    offset += (items?.length || 0);
    if (offset >= totalCount) {
      hasNext = false;
    }
  }

  console.log(`Scraped ${tracks.length} tracks from ${playlistName || playlistId}.`);
  return { name: playlistName || "Unknown Playlist", tracks };
}

export async function savePlaylistData(playlistId: string, playlistName: string, tracks: ScrapedTrack[]): Promise<void> {
  const tracksFile = "scraped_tracks.json";
  const playlistsFile = "playlists.json";
  const root = process.cwd();

  let trackMap: TrackMap = {};
  let playlistMap: PlaylistMap = {};

  try {
    const trackData = await readFile(path.resolve(root, tracksFile), "utf8");
    const parsedTracks = JSON.parse(trackData);
    if (Array.isArray(parsedTracks)) {
      for (const t of parsedTracks) {
        if (t.uri) trackMap[t.uri] = t;
      }
    } else {
      trackMap = parsedTracks;
    }
  } catch (e) {
    console.log("No existing tracks file, starting fresh.");
  }

  try {
    const playlistData = await readFile(path.resolve(root, playlistsFile), "utf8");
    playlistMap = JSON.parse(playlistData);
  } catch (e) {
    console.log("No existing playlists file, starting fresh.");
  }

  for (const track of tracks) {
    if (track.uri) {
      trackMap[track.uri] = track;
    }
  }

  const playlistUri = `spotify:playlist:${playlistId}`;
  playlistMap[playlistUri] = {
    name: playlistName,
    tracks: tracks.map(t => t.uri).filter(u => !!u)
  };

  await writeFile(path.resolve(root, tracksFile), JSON.stringify(trackMap, null, 2), "utf8");
  await writeFile(path.resolve(root, playlistsFile), JSON.stringify(playlistMap, null, 2), "utf8");
  
  await FirestoreService.setPlaylist(playlistUri, {
    name: playlistName,
    tracks: tracks.map(t => t.uri).filter(u => !!u)
  });

  console.log(`Syncing ${tracks.length} tracks to Firestore...`);
  for (const track of tracks) {
    if (track.uri) {
      await FirestoreService.setTrack(track.uri, track);
    }
  }

  console.log("Saved updated tracks and playlists (and synced to Firestore).");
}
