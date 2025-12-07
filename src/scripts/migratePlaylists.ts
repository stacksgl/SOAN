import { db } from "../firebase";
import { readFile } from "fs/promises";
import path from "path";

async function migratePlaylists() {
  const playlistsPath = path.resolve(process.cwd(), "playlists.json");
  
  try {
    const data = await readFile(playlistsPath, "utf-8");
    const playlists = JSON.parse(data);

    console.log(`Found ${Object.keys(playlists).length} playlists to migrate.`);

    for (const [id, playlistData] of Object.entries(playlists)) {
      const playlistRef = db.collection("playlists").doc(id);
      
      if (!playlistData || typeof playlistData !== 'object') {
        console.warn(`Skipping invalid playlist data for ID: ${id}`);
        continue;
      }

      const { name, tracks } = playlistData as { name: string, tracks: string[] };

      await playlistRef.set({
        name,
        tracks: Array.isArray(tracks) ? tracks : [],
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log(`Migrated playlist: ${id} (${name})`);
    }

    console.log("Migration completed successfully.");

  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    migratePlaylists();
}

export { migratePlaylists };

