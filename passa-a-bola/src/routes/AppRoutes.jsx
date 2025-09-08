import { createBrowserRouter } from "react-router-dom";

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
import Jogos from "../pages/CopaPAB/Jogos";
import Estatisticas from "../pages/CopaPAB/Estatisticas";
import Fotos from "../pages/CopaPAB/Fotos";
import PageNotFound from "../pages/PageNotFound";

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
          {
            index: true,
            element: <CopaPabHome />,
          },
          {
            path: "jogos",
            element: <Jogos />,
          },
          {
            path: "estatisticas",
            element: <Estatisticas />,
          },
          {
            path: "fotos",
            element: <Fotos />,
          },
        ],
      },
    ],
  },
]);