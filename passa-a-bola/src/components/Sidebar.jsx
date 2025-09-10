import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import logo from '../assets/Dominalogo.png';

const ChevronDown = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isCopaOpen, setIsCopaOpen] = useState(false);

  const activeLinkStyle = {
    backgroundColor: '#5b21b6',
    fontWeight: 'bold',
  };

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#2D065A] text-white h-screen p-5 flex flex-col justify-between">
      <div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Domina no Pé</h1>
          {user && <p className="text-sm text-purple-300 mt-2">Bem-vindo, {user.username}!</p>}
        </div>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="/"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded-md hover:bg-purple-800 transition-colors"
          >
            Home
          </NavLink>

          {/* Copa PAB com submenu */}
          <div>
            <div className="flex items-center justify-between">
              <NavLink
                to="/copa-pab"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="flex-1 p-3 rounded-md hover:bg-purple-800 transition-colors"
              >
                Copa PAB
              </NavLink>
              <button
                type="button"
                onClick={() => setIsCopaOpen(!isCopaOpen)}
                className="ml-2 p-1"
              >
                {isCopaOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>

            {isCopaOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <NavLink
                  to="/copa-pab/jogos"
                  className="p-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Jogos
                </NavLink>
                <NavLink
                  to="/copa-pab/estatisticas"
                  className="p-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Estatísticas
                </NavLink>
                <NavLink
                  to="/copa-pab/fotos"
                  className="p-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Fotos
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/peneiras"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded-md hover:bg-purple-800 transition-colors"
          >
            Peneiras
          </NavLink>

          <NavLink
            to="/escolinhas"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded-md hover:bg-purple-800 transition-colors"
          >
            Escolinhas
          </NavLink>

          <NavLink
            to="/sobre-nos"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded-md hover:bg-purple-800 transition-colors"
          >
            Sobre nós
          </NavLink>

          <NavLink
            to="/contato"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded-md hover:bg-purple-800 transition-colors"
          >
            Contato
          </NavLink>
        </nav>
      </div>
      <button onClick={handleLogout} className="w-full bg-red-600 p-3 rounded-md hover:bg-red-700 transition-colors font-bold">
        Sair
      </button>
    </aside>
  );
}