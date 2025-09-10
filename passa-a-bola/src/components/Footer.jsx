import logo from "../assets/Dominalogo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-6 mt-10 border-t border-gray-300">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        
        {/* Logo ou nome do projeto */}
        <div className="flex items-center gap-2">
          <img
            src={logo} // substitua pelo caminho do seu logo
            alt="Passa a Bola"
            className="w-8 h-8"
          />
          <span className="font-semibold text-gray-700">Domina no Pé</span>
        </div>

        {/* Links extras */}
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="/sobre-nos" className="hover:text-purple-700 transition-colors">
            Sobre nós
          </a>
          <a href="/contato" className="hover:text-purple-700 transition-colors">
            Contato
          </a>
          <a href="/privacidade" className="hover:text-purple-700 transition-colors">
            Política de Privacidade
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-4 md:mt-0">
          © {new Date().getFullYear()} Domina no pé. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
