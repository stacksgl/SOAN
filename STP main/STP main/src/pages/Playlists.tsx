import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Filter, PlayCircle, ExternalLink, Users, Clock, TrendingUp, TrendingDown, ChevronDown, Copy, Upload } from "lucide-react";
import { useColorMode } from "@/contexts/ColorModeContext";
import { BulkImportModal } from "../components/BulkImportModal";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { fetchPlaylistsFromFirestore, PlaylistData } from "@/lib/api";

interface Playlist {
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

const examplePlaylists: Playlist[] = [
  {
    id: "1",
    name: "Today's Top Hits",
    description: "The biggest songs right now in the world.",
    owner: "Spotify",
    ownerImage: "https://images.unsplash.com/photo-1558618047-b2c8c64b7b8b?w=64&h=64&fit=crop&crop=face",
    totalTracks: 50,
    followers: 32847291,
    followersTrend: 5.2,
    totalDuration: "2h 45m",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    dateAdded: "2024-01-10",
    lastUpdated: "2024-01-15",
    isPublic: true,
    category: "Pop",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    playlistUri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
    playlistId: "37i9dQZF1DXcBWIGoYBM5M",
    collaborators: ["Spotify"]
  },
  {
    id: "2",
    name: "RapCaviar",
    description: "Hip hop, rap and everything in between.",
    owner: "Spotify",
    ownerImage: "https://images.unsplash.com/photo-1558618047-b2c8c64b7b8b?w=64&h=64&fit=crop&crop=face",
    totalTracks: 65,
    followers: 15234567,
    followersTrend: 12.8,
    totalDuration: "3h 12m",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    dateAdded: "2024-01-08",
    lastUpdated: "2024-01-15",
    isPublic: true,
    category: "Hip-Hop",
    coverImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
    playlistUri: "spotify:playlist:37i9dQZF1DX0XUsuxWHRQd",
    playlistId: "37i9dQZF1DX0XUsuxWHRQd",
    collaborators: ["Spotify"]
  },
  {
    id: "3",
    name: "Rock Classics",
    description: "Rock legends & epic guitar solos",
    owner: "Spotify",
    ownerImage: "https://images.unsplash.com/photo-1558618047-b2c8c64b7b8b?w=64&h=64&fit=crop&crop=face",
    totalTracks: 100,
    followers: 8765432,
    followersTrend: -2.1,
    totalDuration: "6h 23m",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U",
    dateAdded: "2024-01-12",
    lastUpdated: "2024-01-14",
    isPublic: true,
    category: "Rock",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    playlistUri: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
    playlistId: "37i9dQZF1DWXRqgorJj26U",
    collaborators: ["Spotify"]
  },
  {
    id: "4",
    name: "Chill Hits",
    description: "Kick back to the best new and recent chill hits.",
    owner: "Spotify",
    ownerImage: "https://images.unsplash.com/photo-1558618047-b2c8c64b7b8b?w=64&h=64&fit=crop&crop=face",
    totalTracks: 75,
    followers: 12456789,
    followersTrend: 8.7,
    totalDuration: "4h 18m",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
    dateAdded: "2024-01-05",
    lastUpdated: "2024-01-15",
    isPublic: true,
    category: "Chill",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    playlistUri: "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6",
    playlistId: "37i9dQZF1DX4WYpdgoIcn6",
    collaborators: ["Spotify"]
  },
  {
    id: "5",
    name: "Hot Country",
    description: "The hottest tracks in country music right now.",
    owner: "Spotify",
    ownerImage: "https://images.unsplash.com/photo-1558618047-b2c8c64b7b8b?w=64&h=64&fit=crop&crop=face",
    totalTracks: 45,
    followers: 6543210,
    followersTrend: 15.3,
    totalDuration: "2h 56m",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda",
    dateAdded: "2024-01-03",
    lastUpdated: "2024-01-13",
    isPublic: true,
    category: "Country",
    coverImage: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=300&h=300&fit=crop",
    playlistUri: "spotify:playlist:37i9dQZF1DX1lVhptIYRda",
    playlistId: "37i9dQZF1DX1lVhptIYRda",
    collaborators: ["Spotify"]
  },
  {
    id: "6",
    name: "Indie Mix",
    description: "The best indie tracks curated for you.",
    owner: "John Smith",
    ownerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    totalTracks: 32,
    followers: 234567,
    followersTrend: 22.1,
    totalDuration: "2h 8m",
    spotifyUrl: "https://open.spotify.com/playlist/4rOoJ6Egrf8K2IrywzwOMk",
    dateAdded: "2024-01-14",
    lastUpdated: "2024-01-15",
    isPublic: false,
    category: "Indie",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    playlistUri: "spotify:playlist:4rOoJ6Egrf8K2IrywzwOMk",
    playlistId: "4rOoJ6Egrf8K2IrywzwOMk",
    collaborators: ["John Smith", "Sarah Johnson"]
  },
  {
    id: "7",
    name: "Electronic Dance",
    description: "High energy electronic beats and dance hits.",
    owner: "DJ Music Pro",
    ownerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    totalTracks: 80,
    followers: 1987654,
    followersTrend: 7.8,
    totalDuration: "5h 12m",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4dyCV0mUd9r",
    dateAdded: "2024-01-11",
    lastUpdated: "2024-01-15",
    isPublic: true,
    category: "Electronic",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    playlistUri: "spotify:playlist:37i9dQZF1DX4dyCV0mUd9r",
    playlistId: "37i9dQZF1DX4dyCV0mUd9r",
    collaborators: ["DJ Music Pro", "BeatMaster"]
  }
];

const Playlists = () => {
  const { isColorModeEnabled } = useColorMode();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>(examplePlaylists);

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchPlaylistsFromFirestore();
        setPlaylists(items as Playlist[]);
      } catch (error) {
        console.error("Error loading playlists from Firestore:", error);
        toast.error("Failed to load playlists from Firestore");
        setPlaylists([]);
      }
    })();
  }, []);

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

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000000) {
      return `${(followers / 1000000000).toFixed(1)}B`;
    } else if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Pop": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "Hip-Hop": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Rock": "bg-red-500/20 text-red-400 border-red-500/30",
      "Chill": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Country": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Indie": "bg-green-500/20 text-green-400 border-green-500/30",
      "Electronic": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    };
    return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="space-y-2 sm:space-y-4 p-1 sm:p-4">
      <div>
        <h1 className={`text-lg sm:text-2xl font-bold ${isColorModeEnabled ? 'bg-gradient-primary bg-clip-text text-transparent' : 'text-foreground'}`}>
          Playlists
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage and browse all playlists being tracked
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
          <Input
            placeholder="Search playlists..."
            className="pl-8 h-8 text-sm bg-background border-border"
          />
        </div>
        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted h-8">
          <Filter className="mr-1 h-3 w-3" />
          <span className="hidden sm:inline text-xs">Filter</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="border-border text-foreground hover:bg-muted h-8"
          onClick={() => setBulkImportModalOpen(true)}
        >
          <Upload className="mr-1 h-3 w-3" />
          <span className="hidden sm:inline text-xs">Import</span>
        </Button>
      </div>

      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className={`h-5 w-5 ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
            Playlists ({playlists.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {playlists.map((playlist, index) => (
              <Collapsible key={playlist.id} open={expandedRows.has(playlist.id)} onOpenChange={() => toggleRow(playlist.id)}>
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
                            className={`h-2.5 w-2.5 transition-transform ${expandedRows.has(playlist.id) ? 'rotate-180' : ''}`} 
                          />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <span className={`text-xs font-mono min-w-[16px] ${isColorModeEnabled ? 'text-primary' : 'text-muted-foreground'}`}>
                        {index + 1}
                      </span>
                      
                      {playlist.coverImage ? (
                        <img 
                          src={playlist.coverImage} 
                          alt={playlist.name}
                          className="w-6 h-6 rounded object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                          <PlayCircle className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{playlist.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{playlist.owner}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3 text-xs">
                      {playlist.category !== "unavailable" && (
                        <Badge className={`text-xs ${getCategoryColor(playlist.category)}`}>
                          {playlist.category}
                        </Badge>
                      )}
                      
                      <span className="font-mono text-right min-w-[30px]">
                        {playlist.totalTracks} <span className="hidden sm:inline">tr</span>
                      </span>

                      {playlist.followers > 0 ? (
                        <div className="flex items-center gap-0.5 min-w-[30px] sm:min-w-[50px] justify-end">
                          <Users className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="font-mono hidden sm:inline text-xs">{formatFollowers(playlist.followers)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 min-w-[30px] sm:min-w-[50px] justify-end text-muted-foreground text-xs">
                          unavailable
                        </div>
                      )}

                      {playlist.followersTrend !== 0 ? (
                        <div className={`flex items-center gap-0.5 min-w-[30px] sm:min-w-[40px] justify-end ${playlist.followersTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {playlist.followersTrend > 0 ? (
                            <TrendingUp className="h-2.5 w-2.5" />
                          ) : (
                            <TrendingDown className="h-2.5 w-2.5" />
                          )}
                          <span className="text-xs font-mono hidden sm:inline">
                            {Math.abs(playlist.followersTrend).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 min-w-[30px] sm:min-w-[40px] justify-end text-muted-foreground text-xs">
                          unavailable
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(playlist.spotifyUrl, '_blank')}
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="pl-8 pb-2 pt-1 bg-muted/20 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground"># Playlist ID</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{playlist.playlistId}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(playlist.playlistId, "Playlist ID")}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono text-xs text-muted-foreground">
                                {playlist.totalDuration !== "unavailable" ? playlist.totalDuration : "unavailable"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Privacy</span>
                            <span className="text-xs text-muted-foreground">unavailable</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Playlist URI</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs max-w-[180px] truncate">{playlist.playlistUri}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(playlist.playlistUri, "Playlist URI")}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Collaborators</span>
                            <div className="flex items-center gap-2">
                              {playlist.collaborators.length > 0 ? (
                                <>
                                  <span className="text-xs max-w-[150px] truncate">{playlist.collaborators.join(", ")}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(playlist.collaborators.join(", "), "Collaborators")}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">unavailable</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Description</span>
                            <span className="text-xs text-muted-foreground max-w-[150px] truncate text-right">
                              {playlist.description !== "unavailable" ? playlist.description : "unavailable"}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Owner</span>
                            <span className="text-xs text-muted-foreground">
                              {playlist.owner !== "unavailable" ? playlist.owner : "unavailable"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Last Updated</span>
                            <span className="text-xs text-muted-foreground">{playlist.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      <BulkImportModal
        isOpen={bulkImportModalOpen}
        onClose={() => setBulkImportModalOpen(false)}
        type="playlists"
      />
    </div>
  );
};

export default Playlists;