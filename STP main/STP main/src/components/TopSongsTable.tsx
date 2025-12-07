import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Song {
  id: string;
  title: string;
  artist: string;
  streams: number;
  lastUpdated: string;
}

// Mock data - replace with real data from your API
const mockSongs: Song[] = [
  {
    id: "1",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    streams: 2847361,
    lastUpdated: "2024-01-15"
  },
  {
    id: "2", 
    title: "Blinding Lights",
    artist: "The Weeknd",
    streams: 2654923,
    lastUpdated: "2024-01-15"
  },
  {
    id: "3",
    title: "Shape of You",
    artist: "Ed Sheeran", 
    streams: 2398471,
    lastUpdated: "2024-01-14"
  },
  {
    id: "4",
    title: "Bad Habits",
    artist: "Ed Sheeran",
    streams: 1987234,
    lastUpdated: "2024-01-14"
  },
  {
    id: "5",
    title: "As It Was",
    artist: "Harry Styles",
    streams: 1876543,
    lastUpdated: "2024-01-13"
  }
];

export function TopSongsTable() {
  const formatStreams = (streams: number) => {
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M`;
    } else if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K`;
    }
    return streams.toString();
  };

  return (
    <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal">
      <CardHeader className="card-minimal-sm">
        <CardTitle className="text-minimal-lg font-semibold">Top Songs by Streams</CardTitle>
      </CardHeader>
      <CardContent className="card-minimal-sm pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-minimal hover:bg-transparent">
              <TableHead className="text-muted-foreground text-minimal-xs">#</TableHead>
              <TableHead className="text-muted-foreground text-minimal-xs">Song</TableHead>
              <TableHead className="text-muted-foreground text-minimal-xs">Artist</TableHead>
              <TableHead className="text-muted-foreground text-right text-minimal-xs">Streams</TableHead>
              <TableHead className="text-muted-foreground text-right text-minimal-xs">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSongs.map((song, index) => (
              <TableRow key={song.id} className="border-minimal hover:bg-muted/30 hover-minimal">
                <TableCell className="font-medium text-primary text-minimal-sm">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-minimal-sm">
                  {song.title}
                </TableCell>
                <TableCell className="text-muted-foreground text-minimal-sm">
                  {song.artist}
                </TableCell>
                <TableCell className="text-right font-mono text-minimal-sm">
                  {formatStreams(song.streams)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-minimal-xs">
                  {song.lastUpdated}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}