import { useState } from "react";
import Footer from "../components/Footer";
import logo from "../assets/Dominalogo.png";
import Peneira1 from "../assets/Peneira1.png";
import Peneira2 from "../assets/Peneira2.png";

export default function Peneiras() {
  const [location, setLocation] = useState("");

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow flex flex-col items-center justify-start p-6">
        <div className="flex flex-col items-center gap-4 mt-4">
          <img
            src={logo} 
            alt="Domina no pé"
            className="w-40"
          />
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Encontre peneiras perto de você
          </h2>
        </div>

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

        <div className="flex flex-col md:flex-row gap-6 mt-10">
          <img
            src={Peneira1} 
            alt="Jogador em peneira"
            className="w-64 h-40 object-cover rounded-lg shadow-md"
          />
          <img
            src={Peneira2}
            alt="Fila de jogadores"
            className="w-64 h-40 object-cover rounded-lg shadow-md"
          />
        </div>

        <p className="mt-10 text-xl text-gray-800 text-center">
          Seja <span className="text-purple-700 font-bold">você</span> a próxima
          Estrela do Brasil!
        </p>
      </main>

      <Footer />
    </div>
  );
}