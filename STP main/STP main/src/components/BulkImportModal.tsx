import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Upload, FileText } from "lucide-react";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "playlists" | "songs" | "folders";
}

const BulkImportModal = ({ isOpen, onClose, type }: BulkImportModalProps) => {
  const [importData, setImportData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error("Please enter data to import");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse the data (basic implementation)
      const lines = importData.trim().split('\n').filter(line => line.trim());
      
      toast.success(`Successfully imported ${lines.length} ${type}`);
      setImportData("");
      onClose();
    } catch (error) {
      toast.error("Failed to import data");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "playlists":
        return "Enter playlist URLs or IDs (one per line):\nhttps://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M\n37i9dQZF1DX0XUsuxWHRQd";
      case "songs":
        return "Enter song URLs or IDs (one per line):\nhttps://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh\nspotify:track:0VjIjW4WU9z4Tpz0y8VnqN";
      case "folders":
        return "Enter folder names (one per line):\nMy Favorites\nWorkout Playlist\nChill Vibes";
      default:
        return "Enter data to import (one item per line)";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "playlists":
        return "Bulk Import Playlists";
      case "songs":
        return "Bulk Import Songs";
      case "folders":
        return "Bulk Import Folders";
      default:
        return "Bulk Import";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "playlists":
        return "Import multiple playlists at once by entering their URLs or IDs.";
      case "songs":
        return "Import multiple songs at once by entering their URLs or IDs.";
      case "folders":
        return "Create multiple folders at once by entering their names.";
      default:
        return "Import multiple items at once.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-1 text-base">
            <Upload className="h-4 w-4" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="import-data" className="text-sm">
              <FileText className="inline h-3 w-3 mr-1" />
              Import Data
            </Label>
            <Textarea
              id="import-data"
              placeholder={getPlaceholder()}
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="min-h-[150px] font-mono text-xs"
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>• Enter one item per line</p>
            <p>• Supported formats: URLs, IDs, or names (depending on type)</p>
            <p>• Empty lines will be ignored</p>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading} size="sm" className="h-7 text-xs">
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading || !importData.trim()} size="sm" className="h-7 text-xs">
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { BulkImportModal };
export default BulkImportModal;
