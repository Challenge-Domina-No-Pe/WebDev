import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold">Passa a Bola</h1>
          {user && <p className="text-sm text-purple-300 mt-2">Bem-vindo, {user.name}!</p>}
        </div>
        <nav className="flex flex-col gap-4">
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="p-3 rounded-md hover:bg-purple-800 transition-colors">Home</NavLink>
          <NavLink to="/copa-pab" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="p-3 rounded-md hover:bg-purple-800 transition-colors">Copa PAB</NavLink>
          <NavLink to="/peneiras" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="p-3 rounded-md hover:bg-purple-800 transition-colors">Peneiras</NavLink>
          <NavLink to="/escolinhas" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="p-3 rounded-md hover:bg-purple-800 transition-colors">Escolinhas</NavLink>
          <NavLink to="/sobre-nos" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="p-3 rounded-md hover:bg-purple-800 transition-colors">Sobre nós</NavLink>
          <NavLink to="/contato" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="p-3 rounded-md hover:bg-purple-800 transition-colors">Contato</NavLink>
        </nav>
      </div>
      <button onClick={handleLogout} className="w-full bg-red-600 p-3 rounded-md hover:bg-red-700 transition-colors font-bold">
        Sair
      </button>
    </aside>
  );
}