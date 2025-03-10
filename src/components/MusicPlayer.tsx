
import React from 'react';
import { SkipBack, SkipForward, Play, Pause, Heart } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

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
  return (
    <div className="p-4 glass rounded-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Playlist de foco extremo</span>
        <Heart 
          size={18} 
          className="text-gray-400 hover:text-success cursor-pointer transition-colors"
        />
      </div>
      
      <Slider
        defaultValue={[0]}
        value={[progress]}
        max={100}
        step={1}
        onValueChange={onProgressChange}
        className="mb-4"
      />
      
      <div className="flex items-center justify-center gap-4">
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
    </div>
  );
};

export default MusicPlayer;
