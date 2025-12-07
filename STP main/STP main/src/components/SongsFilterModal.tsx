import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Filter, RotateCcw } from "lucide-react";

export interface SongFilters {
  groupByArtists: boolean;
  sortBy: 'streams' | 'dailyStreams' | 'averageDailyStreams' | 'trending' | 'growth' | 'releaseDate';
  sortOrder: 'asc' | 'desc';
}

interface SongsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: SongFilters;
  onApplyFilters: (filters: SongFilters) => void;
}

const defaultFilters: SongFilters = {
  groupByArtists: false,
  sortBy: 'streams',
  sortOrder: 'desc'
};

export function SongsFilterModal({ isOpen, onClose, currentFilters, onApplyFilters }: SongsFilterModalProps) {
  const [filters, setFilters] = useState<SongFilters>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleClose = () => {
    setFilters(currentFilters); // Reset to current filters if canceled
    onClose();
  };

  const sortOptions = [
    { value: 'streams', label: 'Total Streams', description: 'Sort by total stream count' },
    { value: 'dailyStreams', label: 'Daily Streams', description: 'Sort by recent daily stream activity' },
    { value: 'averageDailyStreams', label: 'Average Daily Streams', description: 'Sort by average streams per day' },
    { value: 'trending', label: 'Trending', description: 'Sort by stream growth trend' },
    { value: 'growth', label: 'Growth %', description: 'Sort by growth percentage' },
    { value: 'releaseDate', label: 'Release Date', description: 'Sort by song release date' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-1 text-base">
            <Filter className="h-4 w-4" />
            Filter & Sort Songs
          </DialogTitle>
          <DialogDescription className="text-sm">
            Customize how songs are grouped and sorted in the list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group By Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Group By</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="group-artists"
                checked={filters.groupByArtists}
                onCheckedChange={(checked) => 
                  setFilters(prev => ({ ...prev, groupByArtists: checked as boolean }))
                }
              />
              <Label htmlFor="group-artists" className="cursor-pointer text-sm">
                Group by Artists
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              When enabled, songs will be grouped by their artists for better organization.
            </p>
          </div>

          {/* Sort By Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <RadioGroup
              value={filters.sortBy}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, sortBy: value as SongFilters['sortBy'] }))
              }
              className="space-y-2"
            >
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value}
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor={option.value} className="cursor-pointer font-medium text-sm">
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sort Order Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort Order</Label>
            <RadioGroup
              value={filters.sortOrder}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, sortOrder: value as 'asc' | 'desc' }))
              }
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="desc" />
                <Label htmlFor="desc" className="cursor-pointer text-sm">
                  {filters.sortBy === 'releaseDate' ? 'Newest First' : 
                   filters.sortBy === 'growth' ? 'Highest Growth First' :
                   filters.sortBy === 'trending' ? 'Most Trending First' : 'Highest to Lowest'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="asc" />
                <Label htmlFor="asc" className="cursor-pointer text-sm">
                  {filters.sortBy === 'releaseDate' ? 'Oldest First' : 
                   filters.sortBy === 'growth' ? 'Lowest Growth First' :
                   filters.sortBy === 'trending' ? 'Least Trending First' : 'Lowest to Highest'}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Current Selection Summary */}
          <div className="bg-muted/30 rounded-lg p-2 space-y-1">
            <Label className="text-xs font-medium">Current Selection:</Label>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>• {filters.groupByArtists ? 'Grouped by artists' : 'No grouping'}</div>
              <div>• Sorted by {sortOptions.find(opt => opt.value === filters.sortBy)?.label}</div>
              <div>• Order: {filters.sortOrder === 'desc' ? 'Highest to Lowest' : 'Lowest to Highest'}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-1 pt-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-1 h-7 text-xs"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleClose} size="sm" className="h-7 text-xs">
            Cancel
          </Button>
          <Button onClick={handleApply} size="sm" className="h-7 text-xs">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
