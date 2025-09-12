import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { getJogosApiFootball } from "../services/footballApi";
import ListaDeJogos from "../components/ListaDeJogos";

const LIGAS_DISPONIVEIS = [
  {
    id: '74',
    season: '2023',
    name: 'Brasileirão Feminino 2023',
    description: 'Clique aqui para ver os últimos resultados da temporada.',
  },
  {
    id: '699',
    season: '2023',
    name: "Women's Champions League 2023",
    description: 'Clique para ver os resultados da principal competição europeia.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const [jogos, setJogos] = useState([]);
  const [ligaAtivaId, setLigaAtivaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCardClick = (leagueId, season) => {
    if (ligaAtivaId === leagueId) {
      setLigaAtivaId(null);
      setJogos([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setLigaAtivaId(leagueId);

    getJogosApiFootball(leagueId, season)
      .then(dados => {
        const ultimosJogos = dados.slice(-15).reverse();
        setJogos(ultimosJogos);
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar os jogos. Verifique sua chave de API ou o plano de assinatura.");
        setLigaAtivaId(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Olá, {user?.username || 'Usuário'}!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Bem-vindo ao Passa a Bola, seu hub para o futebol feminino.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LIGAS_DISPONIVEIS.map((liga) => (
          <div 
            key={liga.id}
            className="bg-purple-200 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-purple-300 hover:shadow-xl transition-all duration-300"
            onClick={() => handleCardClick(liga.id, liga.season)}
          >
            <h2 className="text-xl font-bold text-purple-800">{liga.name}</h2>
            <p className="text-purple-700 mt-1">{liga.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 min-h-[100px]">
        {isLoading && <div className="text-center p-10"><p className="font-semibold text-purple-700">Buscando resultados...</p></div>}
        {error && <div className="text-center p-10 bg-red-100 rounded-lg"><p className="text-red-600 font-semibold">{error}</p></div>}
        
        {ligaAtivaId && !isLoading && <ListaDeJogos jogos={jogos} />}
      </div>
    </div>
  );
}