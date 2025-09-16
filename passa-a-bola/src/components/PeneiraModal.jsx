import React from 'react';

const PeneiraModal = ({ isOpen, onClose, peneira }) => {
  if (!isOpen || !peneira) return null;

  const generateMapEmbedUrl = (location) => {
    const query = encodeURIComponent(location);
    const apiKey = "AIzaSyCCLUoNv5FecOrt9cLy8kv4zkAJnki9fV8";
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
        {/* Coluna de Detalhes da Peneira */}
        <div className="p-6 md:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-purple-800">{peneira.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">
              ×
            </button>
          </div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Data:</span> {peneira.date}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Local:</span> {peneira.location}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Requisitos:</span> {peneira.requirements}
          </p>
          {peneira.description && (
            <>
              <h3 className="text-xl font-semibold mt-4 mb-2">Detalhes:</h3>
              <p className="text-gray-700">{peneira.description}</p>
            </>
          )}
          <a
            href={peneira.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition-colors"
          >
            Fazer Inscrição
          </a>
        </div>

        {/* Coluna do Mapa */}
        <div className="md:w-1/2 min-h-[300px] md:min-h-full">
          {peneira.location && (
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={generateMapEmbedUrl(peneira.location)}
              title={`Mapa de ${peneira.location}`}
              className="rounded-b-lg md:rounded-bl-none md:rounded-r-lg"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeneiraModal;