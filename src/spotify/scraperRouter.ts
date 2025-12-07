import { Router, Request, Response } from "express";
import { scrapePlaylist, savePlaylistData } from "./scraper";

const router = Router();

router.post("/api/scrape/playlist", async (req: Request, res: Response) => {
  try {
    const { playlistId } = req.body;

    if (!playlistId || typeof playlistId !== "string") {
      return res.status(400).json({
        ok: false,
        error: "missing_playlist_id",
        message: "playlistId is required and must be a string"
      });
    }

    const AUTH_TOKEN = process.env.SPOTIFY_PARTNER_AUTH_TOKEN;
    const CLIENT_TOKEN = process.env.SPOTIFY_PARTNER_CLIENT_TOKEN;

    if (!AUTH_TOKEN || !CLIENT_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: "missing_credentials",
        message: "SPOTIFY_PARTNER_AUTH_TOKEN and SPOTIFY_PARTNER_CLIENT_TOKEN must be set in .env file"
      });
    }

    const { name, tracks } = await scrapePlaylist(playlistId);
    await savePlaylistData(playlistId, name, tracks);

    res.json({
      ok: true,
      playlist: {
        id: playlistId,
        name,
        trackCount: tracks.length
      }
    });
  } catch (error: any) {
    console.error("Error scraping playlist:", error);
    res.status(500).json({
      ok: false,
      error: "scrape_failed",
      message: error.message || "Failed to scrape playlist"
    });
  }
});

export default router;


