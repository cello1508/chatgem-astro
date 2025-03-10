
import React from 'react';
import { SkipBack, SkipForward, Play, Pause, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  progress: number;
  onProgressChange: (value: number[]) => void;
}

const MusicPlayer = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  progress,
  onProgressChange
}: MusicPlayerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full bg-[#171717]/70 backdrop-blur-lg border border-gray-800/50 shadow-lg rounded-lg"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-700/20 rounded-lg transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            className="p-2 bg-success hover:bg-success/80 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <span className="text-sm font-medium">Playlist de foco extremo</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </CollapsibleTrigger>

      <CollapsibleContent className="p-4 pt-2">
        <Slider
          defaultValue={[0]}
          value={[progress]}
          max={100}
          step={1}
          onValueChange={onProgressChange}
          className="mb-4"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onPrevious}
              className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={onPlayPause}
              className="p-3 bg-success hover:bg-success/80 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={onNext} 
              className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <Heart 
            size={18} 
            className="text-gray-400 hover:text-success cursor-pointer transition-colors"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MusicPlayer;
