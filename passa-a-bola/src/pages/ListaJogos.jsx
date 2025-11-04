import { useState } from "react";
import { getJogosBrasileiraoLocal } from "../services/footballApi";

export default function ListaJogos() {
  const [jogos, setJogos] = useState([]);
  const [leagueInfo, setLeagueInfo] = useState({ name: '', logo: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabelaVisivel, setTabelaVisivel] = useState(false);

  // Função chamada ao clicar no card
  const handleCardClick = () => {
    // Se a tabela já está visível, fecha
    if (tabelaVisivel) {
      setTabelaVisivel(false);
      return;
    }

    // Se os dados já foram carregados, apenas reexibe
    if (jogos.length > 0) {
      setTabelaVisivel(true);
      return;
    }

    // Se for o primeiro clique, busca os dados
    setIsLoading(true);
    setError(null);

    getJogosBrasileiraoLocal()
      .then(dados => {
        if (dados && dados.matches) {
          setJogos(dados.matches);
          setLeagueInfo({ name: dados.leagueName, logo: dados.leagueLogo });
          setTabelaVisivel(true);
        } else {
          throw new Error("Formato de dados inválido.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar os jogos.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Resultados dos Jogos</h1>
        <p className="mt-2 text-lg text-gray-600">Selecione a competição para ver os últimos resultados.</p>
      </div>

      {/* Card de Seleção do Brasileirão */}
      <div 
        className="bg-purple-200 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-purple-300 hover:shadow-xl transition-all duration-300"
        onClick={handleCardClick}
      >
        <h2 className="text-xl font-bold text-purple-800">Brasileirão Feminino</h2>
        <p className="text-purple-700 mt-1">
          {tabelaVisivel ? 'Clique para fechar os resultados.' : 'Clique para ver os últimos resultados da temporada.'}
        </p>
      </div>

      {/* Área de Resultados Dinâmica */}
      <div className="mt-6 min-h-[100px]">
        {isLoading && <div className="text-center p-10"><p className="font-semibold text-purple-700">Buscando resultados...</p></div>}
        {error && <div className="text-center p-10 bg-red-100 rounded-lg"><p className="text-red-600 font-semibold">{error}</p></div>}
        
        {tabelaVisivel && !isLoading && jogos.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src={leagueInfo.logo} alt={leagueInfo.name} className="w-12 h-12 object-contain" />
              <h2 className="text-3xl font-bold text-gray-800">{leagueInfo.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jogos.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-4">
                    <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-around w-full">
                    <div className="flex flex-col items-center text-center w-1/3">
                      <img src={item.home_team.logo} alt={item.home_team.name} className="w-16 h-16 object-contain mb-2"/>
                      <span className="font-semibold text-gray-700">{item.home_team.name}</span>
                    </div>
                    <div className="text-4xl font-bold text-purple-700 mx-4">
                      <span>{item.home_score}</span>
                      <span className="mx-2 text-gray-400">-</span>
                      <span>{item.away_score}</span>
                    </div>
                    <div className="flex flex-col items-center text-center w-1/3">
                      <img src={item.away_team.logo} alt={item.away_team.name} className="w-16 h-16 object-contain mb-2"/>
                      <span className="font-semibold text-gray-700">{item.away_team.name}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-4 text-center">
                    🏟️ {item.venue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}