import { db } from "../firebase";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

async function migrateTracks() {
  const tracksPath = path.resolve(process.cwd(), "scraped_tracks.json");
  
  try {
    const data = await readFile(tracksPath, "utf-8");
    const tracks = JSON.parse(data);

    let tracksMap: Record<string, any> = {};
    if (Array.isArray(tracks)) {
        for (const t of tracks) {
            if (t.uri) tracksMap[t.uri] = t;
        }
    } else {
        tracksMap = tracks;
    }

    const trackEntries = Object.entries(tracksMap);
    console.log(`Found ${trackEntries.length} tracks to migrate.`);

    let count = 0;
    
    for (const [id, trackData] of trackEntries) {
      if (!id) continue;

      const trackRef = db.collection("tracks").doc(id);
      
      await trackRef.set({
        ...trackData,
        last_updated: new Date().toISOString()
      }, { merge: true });

      count++;
      if (count % 50 === 0) {
        console.log(`Migrated ${count} tracks...`);
      }
    }

    console.log(`Migration completed. Total tracks: ${count}`);

  } catch (error) {
    console.error("Error during track migration:", error);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    migrateTracks();
}

export { migrateTracks };

