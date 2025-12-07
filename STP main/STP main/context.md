# Stream Tuner Dashboard - Project Context

## 📋 Project Overview

**Stream Tuner Dashboard** is a comprehensive React-based frontend for a Spotify song scraper analytics system. It provides real-time monitoring, data visualization, and management tools for scraped music data with a **minimalistic, modern design system**.

### Technology Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn-ui + Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API + localStorage
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query (prepared)

## 🎨 Design System - Minimalistic Rebrand

### Core Design Principles
- **Ultra-Compact Spacing**: Consistent 4px, 8px, 12px, 16px, 20px, 24px scale
- **Minimalistic Typography**: 10px to 20px scale with proper line heights
- **Glass-Morphism Effects**: Subtle transparency and backdrop blur
- **Micro-Animations**: Smooth fade-in, slide-up, and scale-in transitions
- **Status Indicators**: Consistent colored dots and badges
- **Hover States**: Subtle lift effects and color changes

### Design System Classes
```css
/* Typography Scale */
.text-minimal-xs    /* 10px */
.text-minimal-sm    /* 12px */
.text-minimal-base  /* 14px */
.text-minimal-lg    /* 16px */
.text-minimal-xl    /* 18px */
.text-minimal-2xl   /* 20px */

/* Component Sizes */
.btn-minimal        /* 28px height */
.btn-minimal-sm     /* 24px height */
.btn-minimal-lg     /* 32px height */
.input-minimal      /* 28px height */
.card-minimal       /* 12px padding */
.card-minimal-sm    /* 8px padding */

/* Visual Effects */
.glass-minimal      /* Glass-morphism background */
.shadow-minimal     /* Subtle shadows */
.hover-minimal      /* Hover animations */
.text-gradient-minimal /* Gradient text */
.status-dot         /* 6px status indicators */
.icon-minimal       /* 14px icons */
.icon-minimal-sm    /* 12px icons */
.icon-minimal-xs    /* 10px icons */
```

## 🏗️ Architecture Overview

### Core Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui base components
│   ├── AppSidebar.tsx  # Minimalistic navigation sidebar
│   ├── StatCard.tsx    # Refined dashboard statistics cards
│   ├── TopSongsTable.tsx # Compact songs table
│   ├── StreamChart.tsx # Minimalistic analytics charts
│   ├── LogWindow.tsx   # System logs display
│   ├── AddToFolderModal.tsx # Compact song organization modal
│   ├── NotesModal.tsx  # Streamlined notes management
│   ├── SongsFilterModal.tsx # Minimalistic filtering
│   └── BulkImportModal.tsx # Compact bulk import system
├── contexts/           # Global state management
│   ├── LogContext.tsx  # System logging
│   ├── ColorModeContext.tsx # UI theme control
│   ├── SongsContext.tsx # Song actions & folders
│   └── ColumnVisibilityContext.tsx # Column management
├── pages/              # Main application pages
│   ├── Index.tsx       # Enhanced minimalistic dashboard
│   ├── Songs.tsx       # Compact song library with actions
│   ├── Folders.tsx     # Streamlined song organization
│   ├── Playlists.tsx   # Minimalistic playlist management
│   ├── Settings.tsx    # Refined configuration panel
│   └── Admin.tsx       # Professional admin interface
└── hooks/              # Custom React hooks
```

## 🎯 Key Features Implemented

### 1. Enhanced Minimalistic Dashboard (`src/pages/Index.tsx`)
- **Refined Stat Cards**: Elegant design with small titles, prominent values, and subtle trend indicators
- **Glass-Morphism Cards**: Subtle transparency effects throughout
- **Compact Quick Actions**: Streamlined operation controls
- **Minimalistic Activity Feed**: Clean, color-coded user action history
- **Refined Performance Metrics**: Thin progress bars and compact indicators
- **Status Dot System**: Consistent colored indicators for system health
- **Enhanced Top Songs Table**: Compact design with minimal spacing

### 2. Advanced Song Management (`src/pages/Songs.tsx`)
- **Ultra-Compact Song List**: Thin rows with minimal padding
- **Streamlined Song Actions**:
  - ❤️ Like/Unlike songs
  - 📌 Pin/Unpin for priority
  - 🔗 Mark as linkable
  - 📝 Add/manage notes (compact modal)
  - 📁 Add to folders (minimalistic modal)
- **Minimalistic Filtering Modal**: Clean interface with compact controls
- **Compact Bulk Import System**: Streamlined URL processing
- **Refined Song Details**: Minimalistic technical information display
- **Compact Stream Analytics**: Smaller charts with essential data
- **Micro-Interactions**: Smooth hover effects and transitions

### 3. Folder Organization System (`src/pages/Folders.tsx`)
- **Minimalistic Folder Cards**: Clean design with subtle borders
- **Compact Folder Management**: Streamlined create/delete operations
- **Refined Color System**: Subtle color indicators
- **Ultra-Compact Song Lists**: Thin rows in folder contents
- **Minimalistic Statistics**: Clean folder metrics display

### 4. Playlist Management (`src/pages/Playlists.tsx`)
- **Compact Playlist Cards**: Minimalistic design with essential info
- **Streamlined Details**: Clean expandable information
- **Subtle Trend Indicators**: Minimal trend visualization
- **Refined Category Badges**: Clean visual categorization
- **Compact Bulk Import**: Streamlined playlist processing

### 5. Settings & Configuration (`src/pages/Settings.tsx`)
- **Minimalistic Theme Presets**: Compact color swatches
- **Refined Color Pickers**: Smaller, elegant color selection
- **Streamlined Tabs**: Clean navigation with minimal icons
- **Compact Form Elements**: Minimalistic input controls
- **Consistent Button Sizing**: Unified button dimensions

### 6. Professional Admin Panel (`src/pages/Admin.tsx`)
- **Minimalistic System Cards**: Clean monitoring interface
- **Compact Resource Bars**: Thin progress indicators
- **Streamlined Configuration**: Minimalistic form controls
- **Refined Status Indicators**: Consistent colored dots
- **Professional Layout**: Clean separation of concerns

## 🔧 Context System (Global State)

### 1. SongsContext (`src/contexts/SongsContext.tsx`)
**Purpose**: Manages song actions, notes, and folder organization

**Interfaces**:
```typescript
interface SongAction {
  isLiked: boolean;
  isPinned: boolean;
  isLinkable: boolean;
  notes: SongNote[];
}

interface SongNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Folder {
  id: string;
  name: string;
  description: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
  color: string;
}
```

**Key Functions**:
- `getSongActions(songId)` - Get all actions for a song
- `setSongLiked/Pinned/Linkable()` - Update song states
- `addSongNote/updateSongNote/deleteSongNote()` - Manage notes
- `createFolder/deleteFolder()` - Folder management
- `addSongToFolder/removeSongFromFolder()` - Song organization
- **Auto-management**: Default folders automatically sync with song actions

**Data Persistence**: localStorage with automatic sync

### 2. ColorModeContext (`src/contexts/ColorModeContext.tsx`)
**Purpose**: Controls UI color scheme (colorful vs. monochrome)

**Functions**:
- `isColorModeEnabled` - Current color mode state
- `setColorModeEnabled()` - Toggle color mode
- **Default**: Colorful mode enabled
- **Persistence**: localStorage

### 3. ColumnVisibilityContext (`src/contexts/ColumnVisibilityContext.tsx`)
**Purpose**: Manages column visibility in song lists

**Functions**:
- `columnVisibility` - Current column state
- `setColumnVisibility()` - Update column visibility
- **Persistence**: localStorage

### 4. LogContext (`src/contexts/LogContext.tsx`)
**Purpose**: System logging and log window management

**Functions**:
- `isLogWindowVisible` - Log window visibility
- `setLogWindowVisible()` - Toggle log window
- **Integration**: Toast notifications and system events

## 🎨 UI/UX Design Principles

### Minimalistic Design System
- **Ultra-Compact Spacing**: Consistent micro-spacing throughout
- **Refined Typography**: Smaller, more elegant text hierarchy
- **Glass-Morphism**: Subtle transparency effects for depth
- **Micro-Animations**: Smooth, subtle transitions
- **Status Indicators**: Consistent colored dots and badges
- **Hover States**: Subtle lift effects and color changes

### Component Design Patterns
- **Compact Lists**: Ultra-thin rows with minimal padding
- **Minimalistic Modals**: Streamlined dialog patterns
- **Refined Progress Indicators**: Thin bars and compact metrics
- **Subtle Status Badges**: Minimal color-coded states
- **Compact Tooltips**: Minimal hover descriptions
- **Responsive Grids**: Mobile-first with compact spacing

### Data Visualization
- **Compact Charts**: Smaller, essential data display
- **Thin Progress Bars**: Minimalistic system health metrics
- **Subtle Trend Indicators**: Clean up/down arrows
- **Refined Color Coding**: Consistent status colors

## 📊 Mock Data Structure

### Songs Data (`src/pages/Songs.tsx`)
```typescript
interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
  popularity: number;
  streams: number;
  dailyStreams: number;
  averageDailyStreams: number;
  trending: number;
  isrc: string;
  trackUri: string;
  artists: string[];
  spotifyUrl: string;
  lastUpdated: string;
  releaseDate: string;
  genre: string;
  distributor?: string;
  trendPercentage: number;
}
```

### Playlists Data (`src/pages/Playlists.tsx`)
```typescript
interface Playlist {
  id: string;
  name: string;
  owner: string;
  coverImage: string;
  totalTracks: number;
  followers: number;
  followersTrend: number;
  category: string;
  isPublic: boolean;
  totalDuration: string;
  lastUpdated: string;
  spotifyUrl: string;
  playlistUri: string;
  playlistId: string;
  collaborators: string[];
}
```

## 🔌 Backend Integration Preparation

### API Endpoints Needed

#### 1. Songs API
```typescript
// GET /api/songs - Get all songs with pagination/filtering
// GET /api/songs/:id - Get specific song details
// GET /api/songs/:id/streams - Get stream analytics data
// POST /api/songs/bulk-import - Bulk import songs from URLs
// POST /api/songs/:id/actions - Update song actions (like, pin, linkable)
// GET /api/songs/:id/notes - Get song notes
// POST /api/songs/:id/notes - Create note
// PUT /api/songs/:id/notes/:noteId - Update note
// DELETE /api/songs/:id/notes/:noteId - Delete note
```

#### 2. Playlists API
```typescript
// GET /api/playlists - Get all playlists
// GET /api/playlists/:id - Get specific playlist
// POST /api/playlists/bulk-import - Bulk import playlists from URLs
// POST /api/playlists/scrape - Start playlist scraping
// POST /api/playlists/:id/rescrape - Rescrape specific playlist
```

#### 3. Folders API
```typescript
// GET /api/folders - Get user folders
// POST /api/folders - Create new folder
// PUT /api/folders/:id - Update folder
// DELETE /api/folders/:id - Delete folder
// POST /api/folders/:id/songs - Add song to folder
// DELETE /api/folders/:id/songs/:songId - Remove song from folder
```

#### 4. System API
```typescript
// GET /api/system/status - System health check
// GET /api/system/stats - Dashboard statistics
// POST /api/system/scrape/all - Start full rescrape
// GET /api/system/jobs - Get active scraping jobs
// GET /api/system/logs - Get system logs
```

### Data Synchronization Strategy

#### 1. Replace Mock Data
- Replace `exampleSongs` arrays with TanStack Query hooks
- Implement `useSongs()`, `usePlaylists()`, `useFolders()` queries
- Add loading states and error handling

#### 2. Real-time Updates
- WebSocket integration for live data updates
- Optimistic updates for user actions
- Background refresh for statistics

#### 3. Local State Management
- Keep SongsContext for user actions (like, pin, notes)
- Sync local actions with backend on changes
- Offline support with sync on reconnection

### Migration Steps for Backend Integration

#### Phase 1: API Layer
1. **Create API client** (`src/lib/api.ts`)
2. **Replace mock data** with query hooks
3. **Add loading states** to all components
4. **Implement error handling** with user feedback

#### Phase 2: Real-time Features
1. **WebSocket connection** for live updates
2. **Optimistic UI updates** for better UX
3. **Background data refresh** for dashboards
4. **Push notifications** for system events

#### Phase 3: Advanced Features
1. **Offline support** with service workers
2. **Data export/import** functionality
3. **Advanced analytics** with historical data
4. **User authentication** and preferences

### Database Schema Recommendations

#### Songs Table
```sql
songs (
  id, title, artist, album_art, duration, popularity,
  streams, daily_streams, average_daily_streams, trending,
  isrc, track_uri, spotify_url, created_at, updated_at
)
```

#### Playlists Table
```sql
playlists (
  id, name, owner, cover_image, total_tracks, followers,
  followers_trend, category, is_public, total_duration,
  playlist_uri, playlist_id, spotify_url, created_at, updated_at
)
```

#### User Actions Tables
```sql
song_actions (song_id, user_id, is_liked, is_pinned, is_linkable, updated_at)
song_notes (id, song_id, user_id, content, created_at, updated_at)
folders (id, user_id, name, description, color, created_at, updated_at)
folder_songs (folder_id, song_id, created_at)
```

## 🚀 Current Implementation Status

### ✅ Completed Features
- ✅ **Complete Minimalistic Rebrand**: Unified design system across all pages
- ✅ **Ultra-Compact UI**: Consistent spacing and typography throughout
- ✅ **Glass-Morphism Effects**: Subtle transparency and modern aesthetics
- ✅ **Micro-Animations**: Smooth transitions and hover effects
- ✅ **Refined Stat Cards**: Elegant dashboard statistics with small titles
- ✅ **Minimalistic Components**: Compact buttons, inputs, and cards
- ✅ **Status Indicator System**: Consistent colored dots and badges
- ✅ **Professional Admin Panel**: Clean system monitoring interface
- ✅ **Streamlined Modals**: Compact action dialogs throughout
- ✅ **Enhanced Visual Hierarchy**: Clear information structure
- ✅ Full responsive UI with shadcn-ui components
- ✅ Advanced song management with actions system
- ✅ Folder organization with auto-managed defaults
- ✅ Playlist management with detailed views
- ✅ Enhanced dashboard with live statistics
- ✅ Settings panel with theme customization
- ✅ Modal system for actions (notes, folders, filtering)
- ✅ Stream analytics charts for individual songs
- ✅ Color mode system (colorful/monochrome)
- ✅ Local storage persistence for user preferences
- ✅ Toast notification system
- ✅ Copy-to-clipboard functionality
- ✅ Responsive design for all screen sizes
- ✅ Collapsible interfaces for space efficiency
- ✅ Advanced filtering and sorting systems
- ✅ Bulk import system for songs and playlists
- ✅ URL validation and batch processing
- ✅ Real-time import progress tracking

### 🔄 Ready for Backend Integration
- 🔄 API client implementation
- 🔄 Real-time data fetching with TanStack Query
- 🔄 WebSocket integration for live updates
- 🔄 User authentication system
- 🔄 Database synchronization
- 🔄 Background data refresh
- 🔄 Export/import functionality

### 📝 Development Notes
- All components are prepared for loading states
- Error handling patterns established
- Mock data structures match expected API responses
- Local state management ready for backend sync
- Optimistic updates prepared for better UX
- Responsive design tested across screen sizes
- **Minimalistic design system fully implemented**
- **Consistent visual language across all pages**

## 🔄 Recent Updates

### Complete Minimalistic Rebrand
- **Unified Design System**: Created comprehensive minimalistic design system with consistent typography, spacing, and colors
- **Ultra-Compact Components**: Implemented `btn-minimal`, `input-minimal`, `card-minimal` classes throughout
- **Glass-Morphism Effects**: Added subtle transparency and backdrop blur effects
- **Micro-Animations**: Implemented fade-in, slide-up, and scale-in transitions
- **Status Indicators**: Created consistent colored dot system for system status
- **Refined Typography**: Implemented 10px-20px typography scale with proper line heights

### Dashboard Enhancement
- **Elegant Stat Cards**: Redesigned with small titles, prominent values, and subtle trend indicators
- **Glass-Morphism Cards**: Applied subtle transparency effects throughout
- **Compact Quick Actions**: Streamlined operation controls with minimal spacing
- **Minimalistic Activity Feed**: Clean, color-coded user action history
- **Refined Performance Metrics**: Thin progress bars and compact indicators
- **Status Dot System**: Consistent colored indicators for system health

### All Pages Updated
- **Settings Page**: Ultra-compact theme presets, minimalistic color pickers, streamlined tabs
- **Admin Page**: Minimalistic system cards, compact resource bars, refined status indicators
- **Songs/Playlists/Folders**: Already updated with compact design from previous work
- **Components**: StatCard, AppSidebar, TopSongsTable, StreamChart all updated with minimalistic design

### Technical Improvements
- **CSS Design System**: Comprehensive utility classes for consistent minimalistic design
- **Component Consistency**: Unified sizing, spacing, and typography across all components
- **Visual Hierarchy**: Clear information structure with minimal visual noise
- **Performance**: Optimized animations and transitions for smooth UX
- **Maintainability**: Consistent design patterns for easy future updates

## 📱 Mobile Optimization & UI Refinements

### Mobile Layout Overhaul
- **Perfect screen fit**: Changed from `min-h-screen` to `h-screen` for exact viewport usage
- **Responsive spacing**: Mobile-optimized padding (`p-2`) and gaps (`gap-2`) vs desktop (`p-6`, `gap-4`)
- **Compact headers**: Smaller font sizes on mobile (`text-xl` vs `text-3xl`)
- **Flex layout**: Proper flex column layout with `overflow-y-auto` for scrollable content
- **Card optimization**: Songs/Playlists cards use `flex-1` for proper height utilization

### Responsive Content Strategy
- **Mobile-first approach**: Essential information only on small screens
- **Progressive enhancement**: Full details revealed on larger screens
- **Smart hiding**: Genre badges, trend percentages, and descriptive text hidden on mobile
- **Button optimization**: Shortened button text on mobile ("Filter" vs "Apply Filter")

### Cross-Platform Consistency
- **Desktop preservation**: All original functionality and details maintained on desktop
- **Mobile efficiency**: Streamlined interface for touch interaction
- **Breakpoint strategy**: Clean transition at 640px (sm breakpoint)
- **Visual hierarchy**: Maintained information importance across screen sizes

### Genre Color System Enhancement
- **Unified color mapping**: Consistent genre colors between Songs and Playlists
- **Extended genre support**: Added specific colors for Synthpop, Disco Pop, Pop Punk
- **Visual categorization**: 10 distinct color schemes for better genre identification
- **Fallback handling**: Gray color for unknown genres

### Dashboard Spacing Refinements
- **Proper card spacing**: Restored original `gap-4` and `space-y-6` values
- **Section separation**: Clear visual hierarchy between dashboard sections
- **Responsive gaps**: Maintained spacing consistency across screen sizes
- **Clean layout**: Removed redundant margins and optimized flex spacing

### Admin Panel UI Fixes
- **Tab overlap resolution**: Fixed z-index and margin issues with proper spacing
- **Responsive tab layout**: Better handling of 2x2 vs 1x4 tab arrangements
- **Professional appearance**: Clean separation between navigation and content

The frontend features a **complete minimalistic rebrand** with a unified design system, ultra-compact components, glass-morphism effects, and micro-animations. It's fully functional with mock data and ready for seamless backend integration with minimal changes to existing components.