import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../pages/layout/MainLayout";
import CopaPabLayout from "../pages/layout/CopaPabLayout";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import CriarConta from "../pages/CriarConta";
import Peneiras from "../pages/Peneiras";
import Escolinhas from "../pages/Escolinhas";
import SobreNos from "../pages/SobreNos";
import Contato from "../pages/Contato";
import CopaPabHome from "../pages/CopaPAB/CopaPabHome";
import PageNotFound from "../pages/PageNotFound";
import ListaJogos from "../pages/ListaJogos";
import Noticias from "../pages/Noticias";
import TabelaCompeticao1 from "../pages/CopaPAB/Competicao1/Tabela";
import TimesCompeticao1 from "../pages/CopaPAB/Competicao1/Times";
import EstatisticasCompeticao1 from "../pages/CopaPAB/Competicao1/Estatisticas";
import FotosCompeticao1 from "../pages/CopaPAB/Competicao1/Fotos";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/criar-conta",
    element: <CriarConta />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "noticias",
        element: <Noticias />,
      },
      {
        path: "jogos",
        element: <ListaJogos />,
      },
      {
        path: "peneiras",
        element: <Peneiras />,
      },
      {
        path: "escolinhas",
        element: <Escolinhas />,
      },
      {
        path: "sobre-nos",
        element: <SobreNos />,
      },
      {
        path: "contato",
        element: <Contato />,
      },
      {
        path: "copa-pab",
        element: <CopaPabLayout />,
        children: [
          { index: true, element: <CopaPabHome /> },
          {
            path: "competicao1",
            children: [
              { path: "tabela/grupos", element: <Navigate to="../tabela" replace /> },
              { path: "tabela", element: <TabelaCompeticao1 /> },
              { path: "times", element: <TimesCompeticao1 /> },
              { path: "estatisticas", element: <EstatisticasCompeticao1 /> },
              { path: "fotos", element: <FotosCompeticao1 /> },
            ],
          },
        ],
      },
    ],
  },
]);