import logo from "../assets/Passalogo.png"; 
import Footer from "../components/Footer";  
import contato from "../assets/Contato.png";

export default function Contato() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="flex items-center justify-center bg-white shadow-md py-4">
              <img src={logo} alt="Passa a Bola" className="w-16 h-16 mr-3" />
              <h1 className="text-2xl font-bold text-purple-800">PASSA A BOLA</h1>
        </header>

      <main className="flex flex-1 items-center justify-center px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl w-full">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Qualquer dúvida entre em contato
            </h2>

            <p className="mb-4 flex items-center gap-2">
              <span className="text-lg">📸</span>
              <span>
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/passaabola/"
                  target="_blank"
                  className="text-purple-700 hover:underline"
                >
                  @passaabola
                </a>
              </span>
            </p>

            <p className="mb-4 flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span>
                WhatsApp – Comunidade:{" "}
                <a
                  href="https://www.whatsapp.com/channel/0029Vavm10347XeEyTTNi91i"
                  target="_blank"
                  className="text-purple-700 hover:underline"
                >
                  Entrar no grupo
                </a>
              </span>
            </p>

            <p className="mb-4 flex items-center gap-2">
              <span className="text-lg">📧</span>
              <span>
                E-mail:{" "}
                <a
                  href="mailto:contato@passaabola.com.br"
                  target="_blank"
                  className="text-purple-700 hover:underline"
                >
                  contato@passaabola.com.br
                </a>
              </span>
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src={contato}
              alt="Contato Passa a Bola"
              className="rounded-lg shadow-md w-full max-w-md"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
