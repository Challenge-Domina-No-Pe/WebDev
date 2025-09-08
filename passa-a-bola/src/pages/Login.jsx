import { useState } from 'react';
import { useAuth } from '../contexts/AuthContexts';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); 
    if (email === 'godinho@fiap.com.br' && password === '123') {
      console.log('Login bem-sucedido!');
      const userData = { 
        id: '1', 
        name: 'João Pedro Godinho', 
        email: email 
      };
      
      login(userData); 
      navigate(from, { replace: true }); 

    } else {
      console.error('Falha no login: credenciais inválidas');
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Bem-vindo de Volta!</h2>
        <p className="text-center text-gray-500 mb-6">Faça login para continuar</p>
        
        {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">Usuário</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Digite seu e-mail"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Digite sua senha"
            required
          />
        </div>
        
        <button type="submit" className="w-full bg-[#2D065A] text-white py-3 rounded-lg hover:bg-purple-800 transition font-bold text-lg">
          Entrar
        </button>

        <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/criar-conta" className="font-semibold text-purple-700 hover:underline">
                    Crie uma agora
                </Link>
            </p>
        </div>
      </form>
    </div>
  );
}