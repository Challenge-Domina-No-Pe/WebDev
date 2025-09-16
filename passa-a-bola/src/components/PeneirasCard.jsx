const PeneirasCard = ({ title, date, location, requirements, onDetailsClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-2">
      <h3 className="text-xl font-bold text-purple-700">{title}</h3>
      <p className="text-gray-600 mt-2">
        <span className="font-semibold">Data:</span> {date}
      </p>
      <p className="text-gray-600 mt-1">
        <span className="font-semibold">Local:</span> {location}
      </p>
      <p className="text-gray-600 mt-1">
        <span className="font-semibold">Requisitos:</span> {requirements}
      </p>
      <button
        onClick={onDetailsClick} // Agora o botão chama a prop onDetailsClick
        className="mt-4 inline-block bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition-colors"
      >
        Mais detalhes
      </button>
    </div>
  );
};

export default PeneirasCard;