import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Filter, Folder, ChevronDown, Plus, Trash2, Edit2, Music, ExternalLink, Copy, CheckCircle, XCircle } from "lucide-react";
import { useColorMode } from "@/contexts/ColorModeContext";
import { useSongs } from "@/contexts/SongsContext";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { fetchSongsFromFirestore, BackendSongRecord, formatMsToDuration } from "@/lib/api";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  streams: number;
  streamsTrend: number;
  spotifyUrl: string;
  dateAdded: string;
  lastUpdated: string;
  releaseDate: string;
  popularity: number;
  genre: string;
  duration: string;
  isrc: string;
  trackUri: string;
  artists: string[];
  dailyStreams: number;
  averageDailyStreams: number;
  backendAvgEvolution?: number;
  available?: boolean;
}

const Folders = () => {
  const { isColorModeEnabled } = useColorMode();
  const { folders, deleteFolder, removeSongFromFolder, createFolder } = useSongs();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [expandedSongs, setExpandedSongs] = useState<Set<string>>(new Set());
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const colors = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      createFolder(newFolderName.trim(), undefined, randomColor);
      setNewFolderName("");
      setShowNewFolderInput(false);
      toast(`Folder "${newFolderName}" created successfully`);
    }
  };

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    deleteFolder(folderId);
    toast(`Folder "${folderName}" deleted`);
  };

  const handleRemoveSong = (songId: string, folderId: string, songTitle: string) => {
    removeSongFromFolder(songId, folderId);
    toast(`"${songTitle}" removed from folder`);
  };

  const toggleSong = (songId: string) => {
    const newExpanded = new Set(expandedSongs);
    if (newExpanded.has(songId)) {
      newExpanded.delete(songId);
    } else {
      newExpanded.add(songId);
    }
    setExpandedSongs(newExpanded);
  };

  const getSongById = (songId: string): Song | undefined => {
    return songs.find(song => song.id === songId);
  };

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchSongsFromFirestore();
        const mapped: Song[] = items.map((it: BackendSongRecord) => {
          const id = it?.track?.id || "";
          const title = it?.track?.name || "Unknown";
          const artistsArray: string[] = Array.isArray((it as any)?.track?.artists) ? (it as any).track.artists : [];
          const artist = artistsArray[0] || "";
          const album = (it as any)?.track?.album?.name || "";
          const streams = Number(it?.track?.soundcharts_total_value || 0);
          const avg = Number(it?.track?.soundcharts_avg_evolution || 0);
          const spotifyUrl = id ? `https://open.spotify.com/track/${id}` : "";
          const dateAdded = it?.added_at || "";
          const releaseDate = (it as any)?.track?.album?.release_date || "";
          const popularity = Number(it?.track?.popularity || 0);
          const duration = formatMsToDuration(Number(it?.track?.duration_ms || 0));
          const isrc = it?.track?.external_ids?.isrc || "";
          const trackUri = it?.track?.uri || (id ? `spotify:track:${id}` : "");
          return {
            id,
            title,
            artist,
            album,
            streams,
            streamsTrend: 0,
            spotifyUrl,
            dateAdded,
            lastUpdated: dateAdded,
            releaseDate,
            popularity,
            genre: "",
            duration,
            isrc,
            trackUri,
            artists: artistsArray,
            dailyStreams: 0,
            averageDailyStreams: avg,
            backendAvgEvolution: avg,
            available: !!(it as any)?.available,
          } as Song;
        });
        setSongs(mapped);
      } catch (error) {
        console.error("Error loading songs from Firestore:", error);
        setSongs([]);
      }
    })();
  }, []);

  const formatTrackUri = (uri: string, maxLength: number = 25) => {
    const trackId = uri.replace('spotify:track:', '');
    if (trackId.length > maxLength) {
      return trackId.substring(0, maxLength - 3) + '...';
    }
    return trackId;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard`);
  };

  const formatStreams = (streams: number) => {
    if (streams >= 1000000000) {
      return `${(streams / 1000000000).toFixed(1)}B`;
    } else if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M`;
    } else if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K`;
    }
    return streams.toString();
  };

  return (
    <div className="space-y-2 sm:space-y-4 p-1 sm:p-4">
      <div>
        <h1 className={`text-lg sm:text-2xl font-bold ${isColorModeEnabled ? 'bg-gradient-primary bg-clip-text text-transparent' : 'text-foreground'}`}>
          Folders
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Organize your songs into custom folders
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
          <Input
            placeholder="Search folders..."
            className="pl-8 h-8 text-sm bg-background border-border"
          />
        </div>
        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted h-8">
          <Filter className="mr-1 h-3 w-3" />
          <span className="hidden sm:inline text-xs">Filter</span>
        </Button>
        <Button 
          size="sm"
          onClick={() => setShowNewFolderInput(true)}
          className={`h-8 ${isColorModeEnabled ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"}`}
        >
          <Plus className="mr-1 h-3 w-3" />
          <span className="hidden sm:inline text-xs">New Folder</span>
          <span className="sm:hidden text-xs">New</span>
        </Button>
      </div>

      {showNewFolderInput && (
        <Card className="bg-background border-border">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="bg-background border-border"
                autoFocus
              />
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create
              </Button>
              <Button variant="outline" onClick={() => {
                setShowNewFolderInput(false);
                setNewFolderName("");
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className={`h-5 w-5 ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
            My Folders ({folders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {folders.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No folders yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first folder to organize your songs
              </p>
              <Button 
                onClick={() => setShowNewFolderInput(true)}
                className={isColorModeEnabled ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Folder
              </Button>
            </div>
          ) : (
            <div className="space-y-0">
              {folders.map((folder) => (
                <Collapsible key={folder.id} open={expandedFolders.has(folder.id)} onOpenChange={() => toggleFolder(folder.id)}>
                  <div className="group border-b border-border last:border-b-0">
                    <div className="flex items-center gap-2 py-1.5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-muted"
                          >
                            <ChevronDown 
                              className={`h-2.5 w-2.5 transition-transform ${expandedFolders.has(folder.id) ? 'rotate-180' : ''}`} 
                            />
                          </Button>
                        </CollapsibleTrigger>
                        
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: folder.color || '#8b5cf6' }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{folder.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {folder.songIds.length} song{folder.songIds.length !== 1 ? 's' : ''} • Created {new Date(folder.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {folder.songIds.length} songs
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFolder(folder.id, folder.name)}
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="pl-6 pb-2 pt-1 bg-muted/20">
                        {folder.songIds.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2">
                            No songs in this folder yet. Add songs from the Songs page.
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {folder.songIds.map((songId) => {
                              const song = getSongById(songId);
                              if (!song) return null;

                              return (
                                <Collapsible key={songId} open={expandedSongs.has(songId)} onOpenChange={() => toggleSong(songId)}>
                                  <div className="border-b border-border/50 last:border-b-0">
                                    <div className="flex items-center gap-2 py-2 px-2 rounded bg-background/50 hover:bg-background transition-colors group">
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 hover:bg-muted"
                                        >
                                          <ChevronDown 
                                            className={`h-2.5 w-2.5 transition-transform ${expandedSongs.has(songId) ? 'rotate-180' : ''}`} 
                                          />
                                        </Button>
                                      </CollapsibleTrigger>
                                      
                                      <Music className="h-3 w-3 text-muted-foreground" />
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-xs truncate">{song.title}</div>
                                        <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-xs">
                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-xs ${song.available ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                          {song.available ? (
                                            <CheckCircle className="h-2.5 w-2.5" />
                                          ) : (
                                            <XCircle className="h-2.5 w-2.5" />
                                          )}
                                          {song.available ? 'Available' : 'Unavailable'}
                                        </span>
                                        <span className="font-mono text-xs">{formatStreams(song.streams)}</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(song.spotifyUrl, '_blank')}
                                          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <ExternalLink className="h-2.5 w-2.5" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveSong(songId, folder.id, song.title)}
                                          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                                        >
                                          <Trash2 className="h-2.5 w-2.5" />
                                        </Button>
                                      </div>
                                    </div>

                                    <CollapsibleContent>
                                      <div className="pl-8 pb-3 pt-2 bg-muted/30 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-muted-foreground"># ISRC</span>
                                              <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs">{song.isrc || "unavailable"}</span>
                                                {song.isrc && (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(song.isrc, "ISRC")}
                                                    className="h-5 w-5 p-0"
                                                  >
                                                    <Copy className="h-2.5 w-2.5" />
                                                  </Button>
                                                )}
                                              </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                              <span className="text-muted-foreground">Duration</span>
                                              <span className="font-mono text-xs">{song.duration}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <span className="text-muted-foreground">Popularity</span>
                                              <span className="font-mono text-xs">{song.popularity || "unavailable"}</span>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-muted-foreground">Track URI</span>
                                              <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-mono text-xs truncate flex-1 text-right" title={song.trackUri}>
                                                  {formatTrackUri(song.trackUri)}
                                                </span>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => copyToClipboard(song.trackUri, "Track URI")}
                                                  className="h-5 w-5 p-0 flex-shrink-0"
                                                >
                                                  <Copy className="h-2.5 w-2.5" />
                                                </Button>
                                              </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <span className="text-muted-foreground">Artists</span>
                                              <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-xs truncate flex-1 text-right" title={song.artists.join(", ")}>
                                                  {song.artists.length > 0 ? song.artists.join(", ") : "unavailable"}
                                                </span>
                                                {song.artists.length > 0 && (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(song.artists.join(", "), "Artists")}
                                                    className="h-5 w-5 p-0 flex-shrink-0"
                                                  >
                                                    <Copy className="h-2.5 w-2.5" />
                                                  </Button>
                                                )}
                                              </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <span className="text-muted-foreground">Album</span>
                                              <span className="text-xs text-right">{song.album || "unavailable"}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <span className="text-muted-foreground">Release Date</span>
                                              <span className="text-xs text-right">{song.releaseDate || "unavailable"}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </div>
                                </Collapsible>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Folders;
