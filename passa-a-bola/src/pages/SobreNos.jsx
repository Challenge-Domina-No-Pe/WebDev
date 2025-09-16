import logo from "../assets/Passalogo.png"; 
import Footer from "../components/Footer";  
import sobre from "../assets/Sobre.jpeg" 

export default function SobreNos() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-center bg-white shadow-md py-4">
        <img src={logo} alt="Passa a Bola" className="w-16 h-16 mr-3" />
        <h1 className="text-2xl font-bold text-purple-800">PASSA A BOLA</h1>
      </header>

      {/* Conteúdo */}
      <main className="flex flex-1 items-center justify-center px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-6xl w-full">
          {/* Imagem */}
          <div className="flex justify-center">
            <img
              src={sobre}
              alt="Equipe Passa a Bola"
              className="rounded-lg shadow-md w-full max-w-md"
            />
          </div>

          {/* Texto */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quem está por trás do Passa a Bola?
            </h2>

            <p className="text-gray-700 mb-6">
              Esse é o time do Passa a Bola — duas mulheres que vivem o futebol
              com paixão, dedicação e propósito.
            </p>

            {/* Luana */}
            <p className="text-gray-700 mb-6">
              <span className="font-semibold">Luana Maluf</span><br />
              Ao centro, está a jornalista de todos Luana Maluf, comentarista
              esportiva no Prime Video e no programa “Globo Esporte”. É uma das
              fundadoras do Passa a Bola e tem como missão mostrar que o futebol
              pode ser para todas e todos.
            </p>

            {/* Alexandra */}
            <p className="text-gray-700">
              <span className="font-semibold">Alexandra Xavier</span><br />
              À esquerda de vocês, Alex Xavier, que desde pequena sonhava em ser
              jogadora de futebol. Já atuou em clubes de destaque e também
              buscou sua formação na área jornalística. Hoje, com suas crônicas
              finais na campanha “Mulheres de Garoa”, ela inspira outras meninas
              a acreditarem em si mesmas. No Passa a Bola, Alex traz seu olhar
              de dentro dos gramados e sua experiência como atleta.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}