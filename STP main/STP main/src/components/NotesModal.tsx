import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StickyNote, Edit2, Trash2, Plus } from "lucide-react";
import { useSongs, SongNote } from "@/contexts/SongsContext";
import { toast } from "@/components/ui/sonner";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  songTitle: string;
}

export function NotesModal({ isOpen, onClose, songId, songTitle }: NotesModalProps) {
  const { getSongActions, addSongNote, updateSongNote, deleteSongNote } = useSongs();
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const actions = getSongActions(songId);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      addSongNote(songId, newNoteContent.trim());
      setNewNoteContent("");
      toast("Note added");
    }
  };

  const handleUpdateNote = (noteId: string, content: string) => {
    updateSongNote(noteId, content);
    setEditingNote(null);
    toast("Note updated");
  };

  const handleDeleteNote = (noteId: string) => {
    deleteSongNote(noteId);
    toast("Note deleted");
  };

  const handleClose = () => {
    onClose();
    setEditingNote(null);
    setNewNoteContent("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-background border-border max-h-[80vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-1 text-base">
            <StickyNote className="h-4 w-4" />
            Notes for "{songTitle}"
          </DialogTitle>
          <DialogDescription className="text-sm">
            Add and manage notes for this song.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-2">
          {actions.notes.length === 0 ? (
            <div className="text-center py-4">
              <StickyNote className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-sm font-semibold mb-1">No notes yet</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Add your first note for this song
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {actions.notes.map((note: SongNote) => (
                <div key={note.id} className="bg-muted/30 rounded-lg p-2 space-y-2 border border-border">
                  {editingNote === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        defaultValue={note.content}
                        className="min-h-[60px] bg-background border-border resize-none text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleUpdateNote(note.id, e.currentTarget.value);
                          }
                        }}
                        id={`edit-note-${note.id}`}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            const textarea = document.getElementById(`edit-note-${note.id}`) as HTMLTextAreaElement;
                            handleUpdateNote(note.id, textarea.value);
                          }}
                          className="h-6 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNote(null)}
                          className="h-6 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tip: Press Ctrl+Enter to save quickly
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-border/50">
                        <div className="text-xs text-muted-foreground">
                          <div>Created: {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString()}</div>
                          {note.updatedAt !== note.createdAt && (
                            <div>Updated: {new Date(note.updatedAt).toLocaleDateString()} {new Date(note.updatedAt).toLocaleTimeString()}</div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingNote(note.id)}
                            className="h-6 w-6 p-0 hover:bg-muted"
                          >
                            <Edit2 className="h-2.5 w-2.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-6 w-6 p-0 hover:bg-muted hover:text-red-400"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add new note section */}
          <div className="border border-dashed border-border rounded-lg p-2 space-y-2">
            <Label htmlFor="new-note" className="text-xs font-medium flex items-center gap-1">
              <Plus className="h-3 w-3" />
              Add New Note
            </Label>
            <Textarea
              id="new-note"
              placeholder="Write your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[60px] bg-background border-border resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddNote();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to add quickly
              </p>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="h-6 text-xs"
              >
                <Plus className="h-2.5 w-2.5 mr-1" />
                Add Note
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} size="sm" className="h-7 text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
