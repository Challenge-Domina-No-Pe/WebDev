import { useState } from "react";
import Footer from "../components/Footer";
import logo from "../assets/Dominalogo.png";

export default function Escolinhas() {
  const [location, setLocation] = useState("");

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Conteúdo principal */}
      <main className="flex-grow flex flex-col items-center justify-start p-6">
        {/* Logo e título */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <img
            src={logo}
            alt="Passa a Bola"
            className="w-40"
          />
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Que tal achar uma escolinha para sua Filha?
          </h2>
        </div>

        {/* Input de localização */}
        <div className="mt-8 w-full max-w-xl">
          <label
            htmlFor="location"
            className="block text-sm text-gray-600 mb-2"
          >
            Coloque sua localização
          </label>
          <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-gray-100">
            <input
              id="location"
              type="text"
              placeholder="Ex: Av. Paulista n 433"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
            />
            {location && (
              <button
                onClick={() => setLocation("")}
                className="text-red-500 font-bold text-lg"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tabela de escolinhas */}
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Algumas escolinhas famosas:
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-md bg-white">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-6 py-3 text-left">Instituição</th>
                  <th className="px-6 py-3 text-left">Endereço</th>
                  <th className="px-6 py-3 text-left">Saiba mais</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-3">JogaMiga</td>
                  <td className="px-6 py-3">Diversos locais em vários estados</td>
                  <td className="px-6 py-3 text-purple-600 font-medium">
                    <a href="https://jogamiga.com.br/querojogar/" target="_blank" rel="noreferrer">JogaMiga</a>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3">Meninas em Campo</td>
                  <td className="px-6 py-3">Av. Corifeu de Azevedo Marques, 3200 - Butantã</td>
                  <td className="px-6 py-3 text-purple-600 font-medium">
                    <a href="https://www.meninasemcampo.org.br/" target="_blank" rel="noreferrer">Meninas em Campo</a>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3">Donas da Bola</td>
                  <td className="px-6 py-3">R. Tijuco Preto, 1023 - Tatuapé</td>
                  <td className="px-6 py-3 text-purple-600 font-medium">
                    <a href="https://wellhub.com/pt-br/search/partners/donas-da-bola-f-c-tatuape-tatuape-sao-paulo/" target="_blank" rel="noreferrer">Donas da Bola</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3">PSG Academy</td>
                  <td className="px-6 py-3">Diversas unidades em vários estados</td>
                  <td className="px-6 py-3 text-purple-600 font-medium">
                    <a href="https://psgacademy.com.br/" target="_blank" rel="noreferrer">PSG Academy</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
