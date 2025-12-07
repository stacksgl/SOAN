import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Folder, Plus } from "lucide-react";
import { useSongs } from "@/contexts/SongsContext";
import { toast } from "@/components/ui/sonner";

interface AddToFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  songTitle: string;
}

export function AddToFolderModal({ isOpen, onClose, songId, songTitle }: AddToFolderModalProps) {
  const { folders, createFolder, addSongToFolder, getFoldersBySong } = useSongs();
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const songFolders = getFoldersBySong(songId);
  const songFolderIds = new Set(songFolders.map(f => f.id));

  const handleFolderToggle = (folderId: string, checked: boolean) => {
    const newSelected = new Set(selectedFolders);
    if (checked) {
      newSelected.add(folderId);
    } else {
      newSelected.delete(folderId);
    }
    setSelectedFolders(newSelected);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const colors = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#6366f1"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newFolder = createFolder(newFolderName.trim(), undefined, randomColor);
      setSelectedFolders(prev => new Set([...prev, newFolder.id]));
      setNewFolderName("");
      setShowNewFolderInput(false);
      toast(`Folder "${newFolderName}" created`);
    }
  };

  const handleSave = () => {
    let addedCount = 0;
    
    selectedFolders.forEach(folderId => {
      if (!songFolderIds.has(folderId)) {
        addSongToFolder(songId, folderId);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast(`"${songTitle}" added to ${addedCount} folder${addedCount !== 1 ? 's' : ''}`);
    }

    onClose();
    setSelectedFolders(new Set());
    setShowNewFolderInput(false);
    setNewFolderName("");
  };

  const handleClose = () => {
    onClose();
    setSelectedFolders(new Set());
    setShowNewFolderInput(false);
    setNewFolderName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-1 text-base">
            <Folder className="h-4 w-4" />
            Add to Folder
          </DialogTitle>
          <DialogDescription className="text-sm">
            Add "{songTitle}" to existing folders or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-80 overflow-auto">
          {folders.length === 0 && !showNewFolderInput ? (
            <div className="text-center py-4">
              <Folder className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground mb-2">No folders yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewFolderInput(true)}
                className="border-border h-7 text-xs"
              >
                <Plus className="mr-1 h-3 w-3" />
                Create First Folder
              </Button>
            </div>
          ) : (
            <>
              {folders.map(folder => {
                const isInFolder = songFolderIds.has(folder.id);
                const isSelected = selectedFolders.has(folder.id);
                
                return (
                  <div key={folder.id} className="flex items-center space-x-2 p-1.5 rounded hover:bg-muted/30">
                    <Checkbox
                      id={folder.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleFolderToggle(folder.id, checked as boolean)}
                      disabled={isInFolder}
                    />
                    <div
                      className="w-2.5 h-2.5 rounded"
                      style={{ backgroundColor: folder.color || '#8b5cf6' }}
                    />
                    <Label htmlFor={folder.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isInFolder ? 'text-muted-foreground' : ''}`}>{folder.name}</span>
                        {isInFolder && (
                          <span className="text-xs text-muted-foreground">Already added</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {folder.songIds.length} song{folder.songIds.length !== 1 ? 's' : ''}
                      </div>
                    </Label>
                  </div>
                );
              })}

              {showNewFolderInput ? (
                <div className="border border-border rounded-lg p-2 bg-muted/20">
                  <Label htmlFor="new-folder" className="text-xs font-medium">
                    New Folder Name
                  </Label>
                  <div className="flex gap-1 mt-1">
                    <Input
                      id="new-folder"
                      placeholder="Enter folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                      className="bg-background border-border h-7 text-xs"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim()}
                      className="h-7 text-xs"
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowNewFolderInput(false);
                        setNewFolderName("");
                      }}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewFolderInput(true)}
                  className="w-full border-border border-dashed h-7 text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Create New Folder
                </Button>
              )}
            </>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} size="sm" className="h-7 text-xs">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={selectedFolders.size === 0 && !showNewFolderInput}
            size="sm"
            className="h-7 text-xs"
          >
            Add to {selectedFolders.size} Folder{selectedFolders.size !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
