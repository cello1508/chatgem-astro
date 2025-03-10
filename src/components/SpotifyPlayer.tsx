
import React, { useEffect, useState, useRef } from 'react';

interface SpotifyPlayerProps {
  defaultEpisodeId?: string;
  defaultPlaylistId?: string;
  className?: string;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ 
  defaultEpisodeId = "spotify:playlist:5U0foVQIwgsOxpj1EEnEXp",
  defaultPlaylistId = "5U0foVQIwgsOxpj1EEnEXp",
  className = "",
}) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const [controller, setController] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Load the Spotify Embed API
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    
    // Check if script already exists to prevent duplicate scripts
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.body.appendChild(script);
    }

    // Initialize the API when it's ready
    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      if (embedRef.current) {
        const options = {
          width: '100%',
          height: '160',
          uri: defaultEpisodeId,
          theme: '0', // 0 is dark theme
        };

        IFrameAPI.createController(embedRef.current, options, (embedController: any) => {
          setController(embedController);
          
          // Listen for playback state changes
          embedController.addListener('playback_update', (e: any) => {
            setIsPlaying(e.data.isPaused === false);
          });
        });
      }
    };

    return () => {
      // Clean up
      if (controller) {
        controller.destroy();
      }
    };
  }, [defaultEpisodeId]);

  const handlePlayItem = (spotifyId: string) => {
    if (controller) {
      controller.loadUri(spotifyId);
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl bg-[#8B1F60] text-white w-full ${className}`}>
      <div ref={embedRef} id="embed-iframe" className="w-full" />
      
      <div className="flex flex-wrap items-center justify-between p-3 bg-[#6D1A4D]">
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
          <button 
            className="px-3 py-2 rounded-md bg-[#191414] hover:bg-[#1DB954] transition-colors"
            onClick={() => handlePlayItem(`spotify:playlist:${defaultPlaylistId}`)}
          >
            Playlist de foco
          </button>
          <button 
            className="px-3 py-2 rounded-md bg-[#191414] hover:bg-[#1DB954] transition-colors"
            onClick={() => handlePlayItem('spotify:episode:7makk4oTQel546B0PZlDM5')}
          >
            Episódio 1
          </button>
          <button 
            className="px-3 py-2 rounded-md bg-[#191414] hover:bg-[#1DB954] transition-colors"
            onClick={() => handlePlayItem('spotify:episode:43cbJh4ccRD7lzM2730YK3')}
          >
            Episódio 2
          </button>
        </div>
        
        <div className="text-sm text-white/80">
          {isPlaying ? 'Tocando' : 'Pausado'}
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
