
import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

const LowCodeNewsSection: React.FC = () => {
  const news = [
    {
      id: 1,
      title: "Novos recursos de automação no Power Apps anunciados",
      description: "Microsoft anuncia novos recursos de automação que prometem facilitar o desenvolvimento de aplicações low-code para empresas.",
      source: "TechCrunch",
      date: "28 Jul 2023",
      url: "#"
    },
    {
      id: 2,
      title: "Ferramentas no-code crescem 40% em adoção durante 2023",
      description: "Estudo revela que a adoção de ferramentas no-code e low-code cresceu significativamente entre empresas de todos os tamanhos.",
      source: "Forbes Tech",
      date: "15 Jul 2023",
      url: "#"
    },
    {
      id: 3,
      title: "Bubble lança nova plataforma com recursos avançados de IA",
      description: "A plataforma Bubble anunciou sua nova versão com recursos de IA integrados para facilitar o desenvolvimento de aplicações sem código.",
      source: "TechNews",
      date: "10 Jul 2023",
      url: "#"
    },
    {
      id: 4,
      title: "Como plataformas low-code estão transformando o desenvolvimento empresarial",
      description: "Especialistas explicam como as plataformas low-code estão mudando a forma como as empresas desenvolvem software internamente.",
      source: "Business Insider",
      date: "5 Jul 2023",
      url: "#"
    },
    {
      id: 5,
      title: "Gartner prevê que 65% do desenvolvimento de aplicações será low-code até 2024",
      description: "Nova pesquisa do Gartner sugere que a maioria do desenvolvimento de aplicações empresariais usará plataformas low-code nos próximos anos.",
      source: "Gartner",
      date: "28 Jun 2023",
      url: "#"
    },
    {
      id: 6,
      title: "WebFlow recebe investimento de $140 milhões para expandir plataforma",
      description: "A plataforma de desenvolvimento visual WebFlow anunciou nova rodada de investimento para expandir recursos de comércio eletrônico.",
      source: "VentureBeat",
      date: "20 Jun 2023",
      url: "#"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notícias Low-Code</h2>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-all">
          <RefreshCw size={20} />
        </button>
      </div>
      
      <div className="flex-grow overflow-auto p-4">
        <div className="grid gap-4">
          {news.map((item) => (
            <div key={item.id} className="glass border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowCodeNewsSection;
