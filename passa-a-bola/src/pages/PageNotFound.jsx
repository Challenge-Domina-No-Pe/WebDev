import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

export default function PageNotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleVoltarClick = () => {
    // 3. Adicione a lógica condicional:
    // Se 'user' existir (não for nulo), o usuário está logado.
    if (user) {
      navigate('/'); // Navega para a home do dashboard
    } else {
      navigate('/login'); // Navega para a página de login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold mb-4 text-purple-600">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <button
          type="button"
          onClick={handleVoltarClick} // Chama a nova função com a lógica
          className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md"
        >
          {/* Altera o texto do botão dependendo do status de login */}
          {user ? 'Voltar para a Home' : 'Ir para a Página de Login'}
        </button>
      </div>
    </div>
  );
}