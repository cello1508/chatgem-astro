
import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Youtube, Newspaper, Filter, Info, Users, HandShake } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Notícias Low-Code</h2>
          <button 
            onClick={() => setPartnerDialogOpen(true)}
            className="text-success hover:text-success/80 p-1 rounded-full hover:bg-success/10 transition-all flex items-center justify-center"
            title="Informações sobre parcerias"
          >
            <Info size={16} />
          </button>
        </div>
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

      {/* Partner Information Dialog */}
      <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
        <DialogContent className="glass border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users size={20} className="text-success" /> Sistema de Parceiros
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Publicar conteúdo na seção de Notícias Low-Code
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="glass border border-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                <Users size={18} className="text-success" /> 
                O que é o Programa de Parceiros?
              </h3>
              <p className="text-gray-300">
                Nosso Programa de Parceiros permite que especialistas em desenvolvimento low-code e no-code publiquem conteúdo diretamente em nossa plataforma, alcançando milhares de usuários interessados nesse ecossistema.
              </p>
            </div>

            <div className="glass border border-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                <ExternalLink size={18} className="text-success" /> 
                Benefícios da Parceria
              </h3>
              <ul className="text-gray-300 space-y-2 list-disc pl-5">
                <li>Visibilidade para sua marca/conteúdo em um público-alvo qualificado</li>
                <li>Tráfego direcionado para seu site, canal ou plataforma</li>
                <li>Posicionamento como autoridade no segmento low-code/no-code</li>
                <li>Acesso a métricas detalhadas de engajamento com seu conteúdo</li>
              </ul>
            </div>

            <div className="glass border border-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                <Newspaper size={18} className="text-success" /> 
                Tipos de Conteúdo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-start gap-2">
                  <Youtube size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Vídeos</p>
                    <p className="text-sm">Tutoriais, análises, comparativos e novidades sobre tecnologias low-code/no-code</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Newspaper size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Artigos</p>
                    <p className="text-sm">Publicações, estudos de caso, notícias e guias sobre desenvolvimento low-code</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button 
                className="bg-success hover:bg-success/80 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                onClick={() => setPartnerDialogOpen(false)}
              >
                Quero ser parceiro
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LowCodeNewsSection;
