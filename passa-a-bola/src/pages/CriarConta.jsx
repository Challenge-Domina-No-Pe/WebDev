import { useState } from 'react';
import { useAuth } from '../contexts/AuthContexts';
import { useNavigate, Link } from 'react-router-dom';

export default function CriarConta() {
  const [email, setEmail] = useState('');
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
      await signup(email, password);
      navigate('/');
    } catch (err) {
      setError('Falha ao criar a conta. Tente um e-mail diferente.');
      console.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Crie sua Conta</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-semibold">E-mail</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-semibold">Senha</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Confirme a Senha</label>
          <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border rounded-lg" required />
        </div>
        
        <button type="submit" className="w-full bg-[#2D065A] text-white py-3 rounded-lg font-bold">Criar Conta</button>
        <div className="text-center mt-6">
          <p>Já tem uma conta? <Link to="/login" className="font-semibold text-purple-700">Faça Login</Link></p>
        </div>
      </form>
    </div>
  );
}