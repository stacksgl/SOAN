import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Filter, Music, ExternalLink, TrendingUp, TrendingDown, ChevronDown, Copy, Heart, Pin, Link, StickyNote, FolderPlus, Edit2, Trash2, Upload, Eye, CheckSquare, Square, Users, MousePointer2, Layers, CheckCircle, XCircle } from "lucide-react";
import { useColorMode } from "@/contexts/ColorModeContext";
import { useSongs } from "@/contexts/SongsContext";
import { useColumnVisibility } from "@/contexts/ColumnVisibilityContext";
import { AddToFolderModal } from "@/components/AddToFolderModal";
import { NotesModal } from "@/components/NotesModal";
import { SongsFilterModal, SongFilters } from "@/components/SongsFilterModal";
import { BulkImportModal } from "@/components/BulkImportModal";
import { StreamChart } from "@/components/StreamChart";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { fetchSongsFromFirestore, BackendSongRecord, formatMsToDuration } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

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
  distributor?: string;
  backendAvgEvolution?: number;
  available?: boolean;
}

const exampleSongs: Song[] = [];

const Songs = () => {
  const { isColorModeEnabled } = useColorMode();
  const { columnVisibility } = useColumnVisibility();
  const { 
    getSongActions, 
    setSongLiked, 
    setSongPinned, 
    setSongLinkable, 
    setSongWatched,
    addSongNote, 
    updateSongNote, 
    deleteSongNote,
    getFoldersBySong 
  } = useSongs();

  const getCategoryColor = (genre: string) => {
    const colors: Record<string, string> = {
      "Pop": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "Hip-Hop": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Rock": "bg-red-500/20 text-red-400 border-red-500/30",
      "Chill": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Country": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Indie": "bg-green-500/20 text-green-400 border-green-500/30",
      "Electronic": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "Synthpop": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      "Disco Pop": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "Pop Punk": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    };
    return colors[genre] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [selectedSongForFolder, setSelectedSongForFolder] = useState<{ id: string; title: string } | null>(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedSongForNotes, setSelectedSongForNotes] = useState<{ id: string; title: string } | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [filters, setFilters] = useState<SongFilters>({
    groupByArtists: false,
    sortBy: 'streams',
    sortOrder: 'desc'
  });
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [bulkActionModalOpen, setBulkActionModalOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [onlyUnavailable, setOnlyUnavailable] = useState(false);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard`);
  };

  const handleLike = (songId: string, songTitle: string) => {
    const actions = getSongActions(songId);
    setSongLiked(songId, !actions.isLiked);
    toast(`"${songTitle}" ${!actions.isLiked ? 'liked' : 'unliked'}`);
  };

  const handlePin = (songId: string, songTitle: string) => {
    const actions = getSongActions(songId);
    setSongPinned(songId, !actions.isPinned);
    toast(`"${songTitle}" ${!actions.isPinned ? 'pinned' : 'unpinned'}`);
  };

  const handleLinkable = (songId: string, songTitle: string) => {
    const actions = getSongActions(songId);
    setSongLinkable(songId, !actions.isLinkable);
    toast(`"${songTitle}" marked as ${!actions.isLinkable ? 'linkable' : 'not linkable'}`);
  };

  const handleWatch = (songId: string, songTitle: string) => {
    const actions = getSongActions(songId);
    setSongWatched(songId, !actions.isWatched);
    toast(`"${songTitle}" ${!actions.isWatched ? 'added to watchlist' : 'removed from watchlist'}`);
  };

  const handleAddToFolder = (songId: string, songTitle: string) => {
    setSelectedSongForFolder({ id: songId, title: songTitle });
    setFolderModalOpen(true);
  };

  const handleOpenNotes = (songId: string, songTitle: string) => {
    setSelectedSongForNotes({ id: songId, title: songTitle });
    setNotesModalOpen(true);
  };

  const handleApplyFilters = (newFilters: SongFilters) => {
    setFilters(newFilters);
    toast("Filters applied successfully");
  };

  const toggleSongSelection = (songId: string) => {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedSongs(newSelected);
  };

  const selectAllSongs = () => {
    const allSongIds = new Set(processedSongs.map(song => song.id));
    setSelectedSongs(allSongIds);
  };

  const clearSelection = () => {
    setSelectedSongs(new Set());
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedSongs(new Set());
    }
  };

  const handleBulkLike = () => {
    selectedSongs.forEach(songId => {
      const song = processedSongs.find(s => s.id === songId);
      if (song) {
        setSongLiked(songId, true);
      }
    });
    toast(`${selectedSongs.size} songs liked`);
    setSelectedSongs(new Set());
  };

  const handleBulkPin = () => {
    selectedSongs.forEach(songId => {
      const song = processedSongs.find(s => s.id === songId);
      if (song) {
        setSongPinned(songId, true);
      }
    });
    toast(`${selectedSongs.size} songs pinned`);
    setSelectedSongs(new Set());
  };

  const handleBulkWatch = () => {
    selectedSongs.forEach(songId => {
      const song = processedSongs.find(s => s.id === songId);
      if (song) {
        setSongWatched(songId, true);
      }
    });
    toast(`${selectedSongs.size} songs added to watchlist`);
    setSelectedSongs(new Set());
  };

  const sortSongs = (songs: Song[]) => {
    const sortedSongs = [...songs].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (filters.sortBy) {
        case 'streams':
          aValue = a.streams;
          bValue = b.streams;
          break;
        case 'dailyStreams':
          aValue = a.dailyStreams;
          bValue = b.dailyStreams;
          break;
        case 'averageDailyStreams':
          aValue = a.averageDailyStreams;
          bValue = b.averageDailyStreams;
          break;
        case 'trending':
          aValue = a.streamsTrend;
          bValue = b.streamsTrend;
          break;
        case 'growth':
          aValue = a.streamsTrend;
          bValue = b.streamsTrend;
          break;
        case 'releaseDate':
          aValue = new Date(a.releaseDate).getTime();
          bValue = new Date(b.releaseDate).getTime();
          break;
        default:
          aValue = a.streams;
          bValue = b.streams;
      }

      if (filters.sortOrder === 'desc') {
        return (bValue as number) - (aValue as number);
      } else {
        return (aValue as number) - (bValue as number);
      }
    });

    return sortedSongs;
  };

  const groupSongsByArtist = (songs: Song[]) => {
    if (!filters.groupByArtists) {
      return { ungrouped: songs };
    }

    const grouped = songs.reduce((acc, song) => {
      const artist = song.artist;
      if (!acc[artist]) {
        acc[artist] = [];
      }
      acc[artist].push(song);
      return acc;
    }, {} as Record<string, Song[]>);

    Object.keys(grouped).forEach(artist => {
      grouped[artist] = sortSongs(grouped[artist]);
    });

    return grouped;
  };

  const [backendSongs, setBackendSongs] = useState<Song[]>(exampleSongs);

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
        setBackendSongs(mapped);
      } catch (error) {
        console.error("Error loading songs from Firestore:", error);
        toast.error("Failed to load songs from Firestore");
        setBackendSongs([]);
      }
    })();
  }, []);

  const filteredSongs = onlyUnavailable ? backendSongs.filter(s => s.available === false) : backendSongs;
  const processedSongs = sortSongs(filteredSongs);

  const pageSize = 25;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(processedSongs.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const startIndex = (clampedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleSongs = processedSongs.slice(startIndex, endIndex);

  const groupedSongs = groupSongsByArtist(visibleSongs);

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

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (popularity >= 75) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const formatTrackUri = (uri: string, maxLength: number = 25) => {
    const trackId = uri.replace('spotify:track:', '');
    
    if (trackId.length > maxLength) {
      return trackId.substring(0, maxLength - 3) + '...';
    }
    
    return trackId;
  };

  return (
    <div className="h-full flex flex-col p-2 sm:p-6">
      <div className="mb-2 sm:mb-4">
        <h1 className={`text-xl sm:text-3xl font-bold ${isColorModeEnabled ? 'bg-gradient-primary bg-clip-text text-transparent' : 'text-foreground'}`}>
          Songs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage and browse all songs in your database
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 sm:mb-4">
        <Button 
          variant={selectionMode ? "default" : "outline"}
          className={`h-10 w-10 p-0 ${selectionMode ? 'bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-muted'}`}
          onClick={toggleSelectionMode}
        >
          {selectionMode ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Layers className="h-4 w-4" />
          )}
        </Button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-border">
          <Switch id="only-unavailable" checked={onlyUnavailable} onCheckedChange={(v) => { setOnlyUnavailable(!!v); setPage(1); }} />
          <label htmlFor="only-unavailable" className="text-xs sm:text-sm text-muted-foreground select-none">Only unavailable</label>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tracks or artists..."
            className="pl-10 bg-background border-border"
          />
        </div>
        <Button 
          variant="outline" 
          className="border-border text-foreground hover:bg-muted"
          onClick={() => setFilterModalOpen(true)}
        >
          <Filter className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Apply Filter</span>
          <span className="sm:hidden">Filter</span>
        </Button>
        <Button 
          variant="outline" 
          className="border-border text-foreground hover:bg-muted"
          onClick={() => setBulkImportModalOpen(true)}
        >
          <Upload className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Bulk Import</span>
          <span className="sm:hidden">Import</span>
        </Button>
      </div>

      {selectionMode && selectedSongs.size > 0 && (
        <Card className="mb-4 bg-muted/30 border-border">
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {selectedSongs.size} song{selectedSongs.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkLike}
                  className="h-8"
                >
                  <Heart className="mr-1 h-3 w-3" />
                  Like All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkPin}
                  className="h-8"
                >
                  <Pin className="mr-1 h-3 w-3" />
                  Pin All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkWatch}
                  className="h-8"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Watch All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkActionModalOpen(true)}
                  className="h-8"
                >
                  <FolderPlus className="mr-1 h-3 w-3" />
                  Add to Folder
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-8"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-background border-border flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className={`h-5 w-5 ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
              Tracks ({processedSongs.length})
              <span className="text-xs text-muted-foreground ml-2">Page {clampedPage} / {totalPages}</span>
              {filters.groupByArtists && (
                <span className="text-sm text-muted-foreground ml-2">
                  - Grouped by Artists
                </span>
              )}
            </CardTitle>
            {selectionMode && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectedSongs.size === processedSongs.length ? clearSelection : selectAllSongs}
                  className="h-8"
                >
                  {selectedSongs.size === processedSongs.length ? (
                    <>
                      <Square className="mr-1 h-3 w-3" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <CheckSquare className="mr-1 h-3 w-3" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-0">
            {Object.entries(groupedSongs).map(([artistName, songs]) => (
              <div key={artistName} className="space-y-0">
                {filters.groupByArtists && (
                  <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-2 px-4 font-medium text-sm">
                    {artistName} ({songs.length} song{songs.length !== 1 ? 's' : ''})
                  </div>
                )}
                {songs.map((song, index) => {
                  const globalIndex = filters.groupByArtists ? 
                    processedSongs.findIndex(s => s.id === song.id) + 1 : 
                    startIndex + index + 1;
                  
                  return (
              <Collapsible key={song.id} open={expandedRows.has(song.id)} onOpenChange={() => toggleRow(song.id)}>
                <div className="group border-b border-border last:border-b-0">
                  <div className="flex items-center gap-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {selectionMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSongSelection(song.id)}
                          className="h-6 w-6 p-0 hover:bg-muted"
                        >
                          {selectedSongs.has(song.id) ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      )}
                      
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-muted"
                        >
                          <ChevronDown 
                            className={`h-3 w-3 transition-transform ${expandedRows.has(song.id) ? 'rotate-180' : ''}`} 
                          />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <span className={`text-sm font-mono min-w-[20px] ${isColorModeEnabled ? 'text-primary' : 'text-muted-foreground'}`}>
                        {globalIndex}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{song.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${song.available ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`} title={song.available ? 'Available' : 'Unavailable'}>
                        {song.available ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {song.available ? 'Available' : 'Unavailable'}
                      </span>
                      {columnVisibility.genre && (
                        <Badge className={`text-xs hidden sm:inline-flex ${getCategoryColor(song.genre)}`}>
                          {song.genre}
                        </Badge>
                      )}
                      
                      {columnVisibility.streams && (
                        <span className="font-mono text-right min-w-[50px] sm:min-w-[60px]">
                          {formatStreams(song.streams)} <span className="hidden sm:inline">streams</span>
                        </span>
                      )}

                      {columnVisibility.dailyStreams && (
                        <span className="font-mono text-right min-w-[50px] sm:min-w-[60px]">
                          {formatStreams(song.dailyStreams)} <span className="hidden sm:inline">today</span>
                        </span>
                      )}

                      {columnVisibility.averageDailyStreams && (
                        <span className="text-right min-w-[50px] sm:min-w-[60px] text-muted-foreground text-xs">
                          unavailable
                        </span>
                      )}

                      {columnVisibility.releaseDate && (
                        <span className="font-mono text-right min-w-[60px] sm:min-w-[80px] text-xs">
                          {new Date(song.releaseDate).getFullYear()}
                        </span>
                      )}

                      {columnVisibility.distributor && (
                        <span className="text-right min-w-[60px] sm:min-w-[80px] text-xs text-muted-foreground">
                          {song.distributor || 'Unknown'}
                        </span>
                      )}

                      {columnVisibility.trendPercentage && (
                        <div className={`flex items-center gap-1 min-w-[40px] sm:min-w-[50px] justify-end ${song.streamsTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {song.streamsTrend > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="text-xs font-mono hidden sm:inline">
                            {Math.abs(song.streamsTrend).toFixed(1)}%
                          </span>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(song.spotifyUrl, '_blank')}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="pl-12 pb-4 pt-2 bg-muted/20 space-y-4">
                      <div className="flex flex-wrap gap-2 pb-3 border-b border-border/50">
                        {(() => {
                          const actions = getSongActions(song.id);
                          const folders = getFoldersBySong(song.id);
                          
                          return (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={actions.isLiked ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleLike(song.id, song.title)}
                                    className={`h-8 w-8 p-0 ${actions.isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                                  >
                                    <Heart className={`h-4 w-4 ${actions.isLiked ? 'fill-current' : ''}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{actions.isLiked ? 'Unlike' : 'Like'}</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={actions.isPinned ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePin(song.id, song.title)}
                                    className={`h-8 w-8 p-0 ${actions.isPinned ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                                  >
                                    <Pin className={`h-4 w-4 ${actions.isPinned ? 'fill-current' : ''}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{actions.isPinned ? 'Unpin' : 'Pin'}</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={actions.isLinkable ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleLinkable(song.id, song.title)}
                                    className={`h-8 w-8 p-0 ${actions.isLinkable ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
                                  >
                                    <Link className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{actions.isLinkable ? 'Remove Linkable' : 'Mark as Linkable'}</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={actions.isWatched ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleWatch(song.id, song.title)}
                                    className={`h-8 w-8 p-0 ${actions.isWatched ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}`}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{actions.isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenNotes(song.id, song.title)}
                                    className="h-8 w-8 p-0 relative"
                                  >
                                    <StickyNote className="h-4 w-4" />
                                    {actions.notes.length > 0 && (
                                      <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
                                        {actions.notes.length}
                                      </Badge>
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Notes {actions.notes.length > 0 ? `(${actions.notes.length})` : ''}</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddToFolder(song.id, song.title)}
                                    className="h-8 w-8 p-0 relative"
                                  >
                                    <FolderPlus className="h-4 w-4" />
                                    {folders.length > 0 && (
                                      <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
                                        {folders.length}
                                      </Badge>
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Add to Folder {folders.length > 0 ? `(${folders.length})` : ''}</p>
                                </TooltipContent>
                              </Tooltip>
                            </>
                          );
                        })()}
                      </div>


                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground"># ISRC</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{song.isrc}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(song.isrc, "ISRC")}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-mono">{song.duration}</span>
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
                                className="h-6 w-6 p-0 flex-shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Artists</span>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs truncate flex-1 text-right" title={song.artists.join(", ")}>
                                {song.artists.join(", ")}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(song.artists.join(", "), "Artists")}
                                className="h-6 w-6 p-0 flex-shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50">
                        <StreamChart 
                          songId={song.id}
                          songTitle={song.title}
                          avgEvolution={song.backendAvgEvolution}
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-muted-foreground">Showing {startIndex + 1}-{Math.min(endIndex, processedSongs.length)} of {processedSongs.length}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                disabled={clampedPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span className="text-xs font-mono">{clampedPage}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                disabled={clampedPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSongForFolder && (
        <AddToFolderModal
          isOpen={folderModalOpen}
          onClose={() => {
            setFolderModalOpen(false);
            setSelectedSongForFolder(null);
          }}
          songId={selectedSongForFolder.id}
          songTitle={selectedSongForFolder.title}
        />
      )}

      {selectedSongForNotes && (
        <NotesModal
          isOpen={notesModalOpen}
          onClose={() => {
            setNotesModalOpen(false);
            setSelectedSongForNotes(null);
          }}
          songId={selectedSongForNotes.id}
          songTitle={selectedSongForNotes.title}
        />
      )}

      <SongsFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />

      <BulkImportModal
        isOpen={bulkImportModalOpen}
        onClose={() => setBulkImportModalOpen(false)}
        type="songs"
      />
    </div>
  );
};

export default Songs;