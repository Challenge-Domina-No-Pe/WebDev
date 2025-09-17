export default function ListaDeJogos({ jogos }) {
  if (!jogos || jogos.length === 0) {
    return <p className="text-center font-semibold mt-4">Nenhum jogo encontrado.</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto">
      {/* O nome da liga vem de cada item, então pegamos do primeiro */}
      <h2 className="text-2xl font-bold mb-4 text-purple-700">{jogos[0].strLeague}</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Data</th>
            <th className="py-3 px-4 text-left">Horário</th>
            <th className="py-3 px-4 text-left">Partida</th>
            <th className="py-3 px-4 text-left">Resultado</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {jogos.map(item => (
            <tr key={item.idEvent} className="border-b hover:bg-purple-100">
              <td className="py-3 px-4">{new Date(item.dateEvent).toLocaleDateString('pt-BR')}</td>
              <td className="py-3 px-4">{item.strTime.substring(0, 5)}</td>
              <td className="py-3 px-4 font-semibold">
                {item.strHomeTeam} vs {item.strAwayTeam}
              </td>
              <td className="py-3 px-4 font-bold text-lg">
                {item.intHomeScore} - {item.intAwayScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}