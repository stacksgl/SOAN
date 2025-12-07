import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SongNote {
  id: string;
  songId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SongAction {
  songId: string;
  isLiked: boolean;
  isPinned: boolean;
  isLinkable: boolean;
  isWatched: boolean;
  notes: SongNote[];
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
  color?: string;
}

interface SongsContextType {
  songActions: Record<string, SongAction>;
  folders: Folder[];
  setSongLiked: (songId: string, liked: boolean) => void;
  setSongPinned: (songId: string, pinned: boolean) => void;
  setSongLinkable: (songId: string, linkable: boolean) => void;
  setSongWatched: (songId: string, watched: boolean) => void;
  addSongNote: (songId: string, content: string) => void;
  updateSongNote: (noteId: string, content: string) => void;
  deleteSongNote: (noteId: string) => void;
  createFolder: (name: string, description?: string, color?: string) => Folder;
  addSongToFolder: (songId: string, folderId: string) => void;
  removeSongFromFolder: (songId: string, folderId: string) => void;
  deleteFolder: (folderId: string) => void;
  getSongActions: (songId: string) => SongAction;
  getFoldersBySong: (songId: string) => Folder[];
}

const SongsContext = createContext<SongsContextType | undefined>(undefined);

export const SongsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songActions, setSongActions] = useState<Record<string, SongAction>>(() => {
    const saved = localStorage.getItem('songActions');
    return saved ? JSON.parse(saved) : {};
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('folders');
    if (saved) {
      const parsedFolders = JSON.parse(saved);
      // Check if default folders exist, if not create them
      const defaultFolderNames = ['Liked', 'Pinned', 'Linkable', 'Watched'];
      const existingNames = parsedFolders.map((f: Folder) => f.name);
      
      const missingDefaults = defaultFolderNames.filter(name => !existingNames.includes(name));
      
      if (missingDefaults.length > 0) {
        const newDefaults = missingDefaults.map(name => ({
          id: `default_${name.toLowerCase()}_${Date.now()}`,
          name,
          description: `Default ${name.toLowerCase()} songs collection`,
          songIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          color: name === 'Liked' ? '#ef4444' : name === 'Pinned' ? '#3b82f6' : name === 'Linkable' ? '#10b981' : '#8b5cf6'
        }));
        return [...newDefaults, ...parsedFolders];
      }
      return parsedFolders;
    } else {
      // Create default folders on first run
      const defaultFolders: Folder[] = [
        {
          id: `default_liked_${Date.now()}`,
          name: 'Liked',
          description: 'Default liked songs collection',
          songIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          color: '#ef4444'
        },
        {
          id: `default_pinned_${Date.now() + 1}`,
          name: 'Pinned',
          description: 'Default pinned songs collection',
          songIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          color: '#3b82f6'
        },
        {
          id: `default_linkable_${Date.now() + 2}`,
          name: 'Linkable',
          description: 'Default linkable songs collection',
          songIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          color: '#10b981'
        },
        {
          id: `default_watched_${Date.now() + 3}`,
          name: 'Watched',
          description: 'Default watched songs collection',
          songIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          color: '#8b5cf6'
        }
      ];
      return defaultFolders;
    }
  });

  useEffect(() => {
    localStorage.setItem('songActions', JSON.stringify(songActions));
  }, [songActions]);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const getSongActions = (songId: string): SongAction => {
    return songActions[songId] || {
      songId,
      isLiked: false,
      isPinned: false,
      isLinkable: false,
      isWatched: false,
      notes: []
    };
  };

  const setSongLiked = (songId: string, liked: boolean) => {
    setSongActions(prev => ({
      ...prev,
      [songId]: {
        ...getSongActions(songId),
        isLiked: liked
      }
    }));

    // Auto-manage Liked folder
    const likedFolder = folders.find(f => f.name === 'Liked');
    if (likedFolder) {
      setFolders(prevFolders =>
        prevFolders.map(folder => {
          if (folder.id === likedFolder.id) {
            const songIds = liked 
              ? [...folder.songIds.filter(id => id !== songId), songId]
              : folder.songIds.filter(id => id !== songId);
            return {
              ...folder,
              songIds,
              updatedAt: new Date().toISOString()
            };
          }
          return folder;
        })
      );
    }
  };

  const setSongPinned = (songId: string, pinned: boolean) => {
    setSongActions(prev => ({
      ...prev,
      [songId]: {
        ...getSongActions(songId),
        isPinned: pinned
      }
    }));

    // Auto-manage Pinned folder
    const pinnedFolder = folders.find(f => f.name === 'Pinned');
    if (pinnedFolder) {
      setFolders(prevFolders =>
        prevFolders.map(folder => {
          if (folder.id === pinnedFolder.id) {
            const songIds = pinned 
              ? [...folder.songIds.filter(id => id !== songId), songId]
              : folder.songIds.filter(id => id !== songId);
            return {
              ...folder,
              songIds,
              updatedAt: new Date().toISOString()
            };
          }
          return folder;
        })
      );
    }
  };

  const setSongLinkable = (songId: string, linkable: boolean) => {
    setSongActions(prev => ({
      ...prev,
      [songId]: {
        ...getSongActions(songId),
        isLinkable: linkable
      }
    }));

    // Auto-manage Linkable folder
    const linkableFolder = folders.find(f => f.name === 'Linkable');
    if (linkableFolder) {
      setFolders(prevFolders =>
        prevFolders.map(folder => {
          if (folder.id === linkableFolder.id) {
            const songIds = linkable 
              ? [...folder.songIds.filter(id => id !== songId), songId]
              : folder.songIds.filter(id => id !== songId);
            return {
              ...folder,
              songIds,
              updatedAt: new Date().toISOString()
            };
          }
          return folder;
        })
      );
    }
  };

  const setSongWatched = (songId: string, watched: boolean) => {
    setSongActions(prev => ({
      ...prev,
      [songId]: {
        ...getSongActions(songId),
        isWatched: watched
      }
    }));

    // Auto-manage Watched folder
    const watchedFolder = folders.find(f => f.name === 'Watched');
    if (watchedFolder) {
      setFolders(prevFolders =>
        prevFolders.map(folder => {
          if (folder.id === watchedFolder.id) {
            const songIds = watched 
              ? [...folder.songIds.filter(id => id !== songId), songId]
              : folder.songIds.filter(id => id !== songId);
            return {
              ...folder,
              songIds,
              updatedAt: new Date().toISOString()
            };
          }
          return folder;
        })
      );
    }
  };

  const addSongNote = (songId: string, content: string) => {
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNote: SongNote = {
      id: noteId,
      songId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSongActions(prev => ({
      ...prev,
      [songId]: {
        ...getSongActions(songId),
        notes: [...getSongActions(songId).notes, newNote]
      }
    }));
  };

  const updateSongNote = (noteId: string, content: string) => {
    setSongActions(prev => {
      const updated = { ...prev };
      for (const songId in updated) {
        updated[songId] = {
          ...updated[songId],
          notes: updated[songId].notes.map(note =>
            note.id === noteId
              ? { ...note, content, updatedAt: new Date().toISOString() }
              : note
          )
        };
      }
      return updated;
    });
  };

  const deleteSongNote = (noteId: string) => {
    setSongActions(prev => {
      const updated = { ...prev };
      for (const songId in updated) {
        updated[songId] = {
          ...updated[songId],
          notes: updated[songId].notes.filter(note => note.id !== noteId)
        };
      }
      return updated;
    });
  };

  const createFolder = (name: string, description?: string, color?: string): Folder => {
    const folderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newFolder: Folder = {
      id: folderId,
      name,
      description,
      songIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color
    };

    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const addSongToFolder = (songId: string, folderId: string) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId && !folder.songIds.includes(songId)
          ? {
              ...folder,
              songIds: [...folder.songIds, songId],
              updatedAt: new Date().toISOString()
            }
          : folder
      )
    );
  };

  const removeSongFromFolder = (songId: string, folderId: string) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? {
              ...folder,
              songIds: folder.songIds.filter(id => id !== songId),
              updatedAt: new Date().toISOString()
            }
          : folder
      )
    );
  };

  const deleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
  };

  const getFoldersBySong = (songId: string): Folder[] => {
    return folders.filter(folder => folder.songIds.includes(songId));
  };

  return (
    <SongsContext.Provider value={{
      songActions,
      folders,
      setSongLiked,
      setSongPinned,
      setSongLinkable,
      setSongWatched,
      addSongNote,
      updateSongNote,
      deleteSongNote,
      createFolder,
      addSongToFolder,
      removeSongFromFolder,
      deleteFolder,
      getSongActions,
      getFoldersBySong
    }}>
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = (): SongsContextType => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error('useSongs must be used within a SongsProvider');
  }
  return context;
};
