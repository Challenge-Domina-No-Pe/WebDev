import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { getUltimosJogosDB } from "../services/footballApi";
import ListaDeJogos from "../components/ListaDeJogos";


export default function Jogos() {
  const { user } = useAuth();
  const [jogos, setJogos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabelaVisivel, setTabelaVisivel] = useState(false);

  const handleVerResultadosClick = () => {
    // ID da Liga do Brasileirão Masculino na TheSportsDB: 4391
    const brasileiraoId = '5201'; 

    if (tabelaVisivel) {
      setTabelaVisivel(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    getUltimosJogosDB(brasileiraoId)
      .then(dados => {
        setJogos(dados);
        setTabelaVisivel(true);
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar os jogos. Tente novamente mais tarde.");
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
          Bem-vindo ao Passa a Bola, seu hub para o futebol.
        </p>
      </div>

      <div 
        className="mt-8 bg-purple-200 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-purple-300 hover:shadow-xl transition-all duration-300"
        onClick={handleVerResultadosClick}
      >
        <h2 className="text-xl font-bold text-purple-800">Resultados do Brasileirão</h2>
        <p className="text-purple-700 mt-1">
          {tabelaVisivel ? 'Clique para fechar' : 'Clique para ver os últimos resultados'}
        </p>
      </div>

      <div className="mt-6 min-h-[100px]">
        {isLoading && <div className="text-center p-10"><p className="font-semibold text-purple-700">Buscando resultados...</p></div>}
        {error && <div className="text-center p-10 bg-red-100 rounded-lg"><p className="text-red-600 font-semibold">{error}</p></div>}
        {tabelaVisivel && !isLoading && <ListaDeJogos jogos={jogos} />}
      </div>
    </div>
  );
}