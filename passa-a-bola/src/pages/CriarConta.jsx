import { useState } from 'react';
import { useAuth } from '../contexts/AuthContexts';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/Dominalogo.png'

export default function CriarConta() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); 
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      return setError('As senhas não são iguais.');
    }
    try {
      await signup(email, password, { username, phone });
      
      navigate('/');
    } catch (err) {
      setError('Falha ao criar a conta. O e-mail já pode estar em uso.');
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Logo */}
      <img 
        src={logo} 
        alt="Passa a Bola" 
        className="w-20 h-20 object-contain mb-6" 
      />
      {/* Card do formulário */}
      <div className="bg-purple-200 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Criar Conta
        </h1>

        {/* Exibe a mensagem de erro, se houver */}
        {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Digite seu email
            </label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Crie um Usuário
            </label>
            <input
              type="text"
              placeholder="Crie um usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Digite o Número
            </label>
            <input
              type="tel"
              placeholder="Ex: 11 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
              minLength="6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar senha
            </label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition font-bold"
          >
            Criar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem conta?{" "}
          <Link to="/login" className="text-purple-600 font-bold hover:underline">
            Entre
          </Link>
        </p>
      </div>
    </div>
  );
}