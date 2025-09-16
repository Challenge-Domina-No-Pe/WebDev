import { useState } from 'react';
import PeneirasCard from "../components/PeneirasCard";
import PeneiraModal from '../components/PeneiraModal';
import Footer from "../components/Footer";

const Peneiras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeneira, setSelectedPeneira] = useState(null);

  const peneirasList = [
    {
      id: 1,
      title: "Peneira do Futuro FC",
      date: "15 de Outubro de 2025",
      location: "Estádio Municipal de Osasco, SP",
      requirements: "Nascidas entre 2005 e 2010. Levar chuteira e RG.",
      description: "Venha participar da peneira do Futuro FC! Uma grande oportunidade para jovens talentos mostrarem seu futebol e conquistarem uma vaga no nosso time. Não perca!",
      link: "#",
    },
    {
      id: 2,
      title: "Seleção para o Time Sub-17",
      date: "05 de Novembro de 2025",
      location: "Centro de Treinamento da Capital, SP",
      requirements: "Nascidas entre 2008 e 2009. Inscrição prévia obrigatória.",
      description: "A seleção para o time Sub-17 está aberta! Se você tem talento e paixão pelo futebol, esta é sua chance de fazer parte de uma equipe vencedora.",
      link: "#",
    },
    {
      id: 3,
      title: "Oportunidade no Clube Atlântico",
      date: "20 de Novembro de 2025",
      location: "Campo da Cidade Esportiva, SP",
      requirements: "Nascidas entre 2000 e 07. Trazer atestado médico.",
      description: "O Clube Atlântico busca novos talentos para reforçar suas categorias de base. Participe da nossa peneira e venha fazer história conosco!",
      link: "#",
    },
  ];

  const filteredPeneiras = peneirasList.filter(peneira =>
    peneira.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (peneira) => {
    setSelectedPeneira(peneira);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPeneira(null);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Peneiras</h1>
      <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">
        Encontre oportunidades de peneiras perto de você.
      </p>

      <div className="mb-6 md:mb-8">
        <input
          type="text"
          placeholder="Pesquisar por cidade..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredPeneiras.length > 0 ? (
          filteredPeneiras.map(peneira => (
            <PeneirasCard
              key={peneira.id}
              title={peneira.title}
              date={peneira.date}
              location={peneira.location}
              requirements={peneira.requirements}
              onDetailsClick={() => handleCardClick(peneira)}
              link={peneira.link}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">Nenhuma peneira encontrada para sua pesquisa.</p>
        )}
      </div>

      <PeneiraModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        peneira={selectedPeneira}
      />
      <br />
      <Footer/>
    </div>
  );
};

export default Peneiras;