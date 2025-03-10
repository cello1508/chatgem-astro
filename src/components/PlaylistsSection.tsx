
import React from 'react';
import { ExternalLink, Play, PlayCircle } from 'lucide-react';

interface Playlist {
  id: string;
  title: string;
  duration: string;
  category: string;
  imageUrl: string;
  url: string;
}

const PlaylistsSection: React.FC = () => {
  const playlists: Playlist[] = [
    {
      id: '1',
      title: 'Concentração Profunda',
      duration: '3h 20min',
      category: 'Lo-fi Beats',
      imageUrl: 'https://i.imgur.com/3vUo7Tj.jpg',
      url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
    },
    {
      id: '2',
      title: 'Música Clássica para Estudar',
      duration: '2h 45min',
      category: 'Clássica',
      imageUrl: 'https://i.imgur.com/JFo9vCj.jpg',
      url: 'https://www.youtube.com/watch?v=1Cv0n4YpEsk'
    },
    {
      id: '3',
      title: 'Ambiente Natural',
      duration: '1h 15min',
      category: 'Sons da Natureza',
      imageUrl: 'https://i.imgur.com/7nF0HZj.jpg',
      url: 'https://www.youtube.com/watch?v=eGl8XGN-uxc'
    },
    {
      id: '4',
      title: 'Focus Flow',
      duration: '4h 10min',
      category: 'Eletrônica Ambiente',
      imageUrl: 'https://i.imgur.com/N9MhIxM.jpg',
      url: 'https://www.youtube.com/watch?v=hHW1oY26kxQ'
    },
    {
      id: '5',
      title: 'Café da Manhã com Jazz',
      duration: '2h 30min',
      category: 'Jazz Suave',
      imageUrl: 'https://i.imgur.com/u3MGKS6.jpg',
      url: 'https://www.youtube.com/watch?v=5u96V3AwZSM'
    },
    {
      id: '6',
      title: 'Meditação Zen',
      duration: '1h 45min',
      category: 'Meditação',
      imageUrl: 'https://i.imgur.com/wNkYoLT.jpg',
      url: 'https://www.youtube.com/watch?v=77ZozI0rw7w'
    }
  ];

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Playlists de FOCO EXTREMO</h1>
      <p className="text-gray-400 mb-8">Música para aumentar sua produtividade e concentração</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="rounded-lg overflow-hidden glass hover:ring-1 hover:ring-success transition-all duration-300">
            <div className="aspect-video relative overflow-hidden group">
              <img 
                src={playlist.imageUrl} 
                alt={playlist.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openExternalLink(playlist.url)} 
                  className="w-16 h-16 rounded-full bg-success text-black flex items-center justify-center transform hover:scale-110 transition-transform"
                >
                  <Play size={32} fill="black" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{playlist.title}</h3>
                <span className="text-sm text-gray-400">{playlist.duration}</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{playlist.category}</p>
              <button 
                onClick={() => openExternalLink(playlist.url)}
                className="flex items-center gap-2 text-success hover:underline text-sm"
              >
                <ExternalLink size={14} />
                Abrir no YouTube
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsSection;
