export default function ListaDeJogos({ jogos }) {
  if (!jogos || jogos.length === 0) {
    return <p className="text-center font-semibold mt-4">Nenhum jogo encontrado para a temporada selecionada.</p>;
  }

  const jogosOrdenados = [...jogos].sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <img src={jogos[0].league.logo} alt={jogos[0].league.name} className="w-12 h-12 object-contain" />
        <h2 className="text-3xl font-bold text-gray-800">
          {jogos[0].league.name} - {jogos[0].league.season}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jogosOrdenados.map(item => (
          <div key={item.fixture.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center">
            
            <div className="text-sm text-gray-500 mb-4">
              <span>{new Date(item.fixture.date).toLocaleDateString('pt-BR')}</span>
              <span className="mx-2">|</span>
              <span>{new Date(item.fixture.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="flex items-center justify-around w-full">
              <div className="flex flex-col items-center text-center w-1/3">
                <img src={item.teams.home.logo} alt={item.teams.home.name} className="w-16 h-16 object-contain mb-2"/>
                <span className="font-semibold text-gray-700">{item.teams.home.name}</span>
              </div>

              <div className="text-4xl font-bold text-purple-700 mx-4">
                <span>{item.goals.home}</span>
                <span className="mx-2 text-gray-400">-</span>
                <span>{item.goals.away}</span>
              </div>

              <div className="flex flex-col items-center text-center w-1/3">
                <img src={item.teams.away.logo} alt={item.teams.away.name} className="w-16 h-16 object-contain mb-2"/>
                <span className="font-semibold text-gray-700">{item.teams.away.name}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-4 text-center">
              🏟️ {item.fixture.venue.name}, {item.fixture.venue.city}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}