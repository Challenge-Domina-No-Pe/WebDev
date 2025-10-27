export default function ListaDeJogos({ jogos, leagueName, leagueLogo }) {
  if (!jogos || jogos.length === 0) {
    return <p className="text-center font-semibold mt-4">Nenhum jogo encontrado.</p>;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <img src={leagueLogo} alt={leagueName} className="w-12 h-12 object-contain" />
        <h2 className="text-3xl font-bold text-gray-800">{leagueName}</h2>
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
  );
}