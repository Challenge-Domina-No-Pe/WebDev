import logo from "../assets/Passalogo.png"; 
import Footer from "../components/Footer";  
import yt from "../assets/yt.jpg"; 
import insta from "../assets/insta.jpg"; 
import { useAuth } from "../contexts/AuthContexts";

export default function Home() {
  
    const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex items-center justify-center bg-white shadow-md py-4">
        <img src={logo} alt="Passa a Bola" className="w-16 h-16 mr-3" />
        <h1 className="text-2xl font-bold text-purple-800">PASSA A BOLA</h1>
      </header><br></br>

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Olá, {user?.username || 'Usuário'}!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Bem-vindo ao Passa a Bola, seu hub para o futebol feminino.
        </p>
      </div>

      <main className="flex flex-1 items-center justify-center px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-6xl w-full text-center">
          <a
            href="https://www.youtube.com/@passabola"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 ">
              Vem nos conhecer
            </h2>
            <img
              src={yt}
              alt="Canal do Passa a Bola no YouTube"
              className="rounded-lg shadow-md w-full max-w-md mb-2 w-100 h-100"
            />
            <p className="text-gray-700">
              Vem ver nosso canal do YouTube
            </p>
          </a>

          <a
            href="https://instagram.com/passaabola"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Nosso Insta
            </h2>
            <img
              src={insta}
              alt="Instagram do Passa a Bola"
              className="rounded-lg shadow-md w-full max-w-md mb-2 w-100 h-100"
            />
            <p className="text-gray-700">
              Nosso Instagram tem as últimas notícias do mundo da bola feminina
            </p>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}