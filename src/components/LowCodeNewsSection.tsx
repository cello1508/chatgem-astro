
import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Youtube, Newspaper, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NewsType = 'all' | 'video' | 'article';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
  type: 'video' | 'article';
  thumbnail?: string;
  duration?: string;
  views?: string;
}

const LowCodeNewsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NewsType>('all');
  const [isHovering, setIsHovering] = useState<number | null>(null);

  const news: NewsItem[] = [
    {
      id: 1,
      title: "Novos recursos de automação no Power Apps anunciados",
      description: "Microsoft anuncia novos recursos de automação que prometem facilitar o desenvolvimento de aplicações low-code para empresas.",
      source: "TechCrunch",
      date: "28 Jul 2023",
      url: "#",
      type: "article"
    },
    {
      id: 2,
      title: "Ferramentas no-code crescem 40% em adoção durante 2023",
      description: "Estudo revela que a adoção de ferramentas no-code e low-code cresceu significativamente entre empresas de todos os tamanhos.",
      source: "Forbes Tech",
      date: "15 Jul 2023",
      url: "#",
      type: "article"
    },
    {
      id: 3,
      title: "Como criar aplicações completas sem código | Bubble Tutorial",
      description: "Aprenda a construir um aplicativo funcional do zero sem escrever uma linha de código usando a plataforma Bubble.",
      source: "Low Code Academy",
      date: "10 Jul 2023",
      url: "#",
      type: "video",
      thumbnail: "https://picsum.photos/seed/bubble/400/225",
      duration: "18:24",
      views: "13K"
    },
    {
      id: 4,
      title: "Como plataformas low-code estão transformando o desenvolvimento empresarial",
      description: "Especialistas explicam como as plataformas low-code estão mudando a forma como as empresas desenvolvem software internamente.",
      source: "Business Insider",
      date: "5 Jul 2023",
      url: "#",
      type: "article"
    },
    {
      id: 5,
      title: "Webflow vs Wix: Qual é a melhor plataforma no-code em 2023?",
      description: "Comparativo detalhado entre as plataformas mais populares para desenvolvimento web sem código.",
      source: "Tech Reviews",
      date: "28 Jun 2023",
      url: "#",
      type: "video",
      thumbnail: "https://picsum.photos/seed/webflow/400/225",
      duration: "22:05",
      views: "27K"
    },
    {
      id: 6,
      title: "WebFlow recebe investimento de $140 milhões para expandir plataforma",
      description: "A plataforma de desenvolvimento visual WebFlow anunciou nova rodada de investimento para expandir recursos de comércio eletrônico.",
      source: "VentureBeat",
      date: "20 Jun 2023",
      url: "#",
      type: "article"
    },
    {
      id: 7,
      title: "Integração de IA com ferramentas No-Code - O futuro do desenvolvimento",
      description: "Como a inteligência artificial está potencializando plataformas low-code e no-code para criar aplicações mais inteligentes.",
      source: "AI Academy",
      date: "15 Jun 2023",
      url: "#",
      type: "video",
      thumbnail: "https://picsum.photos/seed/ai/400/225",
      duration: "31:47",
      views: "42K"
    },
    {
      id: 8,
      title: "Gartner prevê que 65% do desenvolvimento de aplicações será low-code até 2024",
      description: "Nova pesquisa do Gartner sugere que a maioria do desenvolvimento de aplicações empresariais usará plataformas low-code nos próximos anos.",
      source: "Gartner",
      date: "28 May 2023",
      url: "#",
      type: "article"
    }
  ];

  const filteredNews = activeTab === 'all' 
    ? news 
    : news.filter(item => item.type === activeTab);

  const handleFilter = (type: NewsType) => {
    setActiveTab(type);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notícias Low-Code</h2>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={(value) => handleFilter(value as NewsType)}>
            <TabsList className="bg-gray-800/50">
              <TabsTrigger value="all" className="text-xs">
                Todos
              </TabsTrigger>
              <TabsTrigger value="video" className="text-xs">
                <Youtube size={14} className="mr-1" />
                Vídeos
              </TabsTrigger>
              <TabsTrigger value="article" className="text-xs">
                <Newspaper size={14} className="mr-1" />
                Artigos
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-all">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto p-4">
        <div className="grid gap-4">
          {filteredNews.map((item) => (
            <div 
              key={item.id} 
              className={`glass border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all ${
                item.type === 'video' ? 'hover:bg-gray-800/30' : ''
              }`}
              onMouseEnter={() => setIsHovering(item.id)}
              onMouseLeave={() => setIsHovering(null)}
            >
              {item.type === 'video' ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-40 h-24 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                    {item.thumbnail && (
                      <>
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                          isHovering === item.id ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                          </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {item.duration}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">{item.source}</span>
                        <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded-sm">{item.date}</span>
                        {item.views && (
                          <span className="text-xs text-gray-400">{item.views} visualizações</span>
                        )}
                      </div>
                      
                      <a 
                        href={item.url} 
                        className="text-success hover:text-success/80 flex items-center gap-1 text-xs transition-colors"
                      >
                        Assistir
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-3">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">{item.source}</span>
                      <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">{item.date}</span>
                    </div>
                    
                    <a 
                      href={item.url} 
                      className="text-success hover:text-success/80 flex items-center gap-1 text-sm transition-colors"
                    >
                      Ler mais
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowCodeNewsSection;
