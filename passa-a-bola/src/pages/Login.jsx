import { useState } from 'react';
import { useAuth } from '../contexts/AuthContexts';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/Passalogo.png'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <img
        src={logo}
        alt="Passa a Bola"
        className="w-24 h-24 object-contain mb-6"
      />

      <div className="bg-purple-200 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Bem-vindo de Volta!
        </h1>

        {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition font-bold"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Não tem conta ainda?{" "}
          <Link
            to="/criar-conta"
            className="text-purple-600 font-bold hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}