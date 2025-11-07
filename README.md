# Passa a Bola ⚽

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-cyan?logo=tailwindcss)

## 📖 Sobre o Projeto

**Passa a Bola** é uma plataforma web dedicada a entusiastas do futebol feminino. O projeto foi desenvolvido como um desafio para aplicar conceitos modernos de desenvolvimento front-end, criando uma experiência rica e interativa para o usuário, desde a autenticação até o consumo de dados de partidas.

A aplicação permite que usuários se cadastrem, façam login e acessem uma área de dashboard para visualizar resultados de campeonatos importantes do futebol feminino.

## ✨ Features

-   🔐 **Autenticação de Usuários:** Sistema completo de login e cadastro utilizando **Firebase Authentication (E-mail e Senha)**.
-   👤 **Perfis de Usuário:** Armazenamento de dados adicionais do usuário (nome, telefone, etc.) no **Cloud Firestore**, vinculados de forma segura ao perfil de autenticação.
-   🛡️ **Rotas Protegidas:** Acesso a páginas exclusivas, como o dashboard de jogos, somente para usuários autenticados.
-   📊 **Integração com API Interna:** Consumo de dados da **API-Interna** para exibir resultados de jogos do Brasileirão Feminino, com tratamento de estado de carregamento e erros.
-   🎨 **Design Moderno e Responsivo:** Interface estilizada com **Tailwind CSS**, apresentando os resultados das partidas em formato de *cards* visuais e informativos, incluindo logos dos times e do campeonato.
-   ⚙️ **Arquitetura Escalável:** Código organizado com uma clara separação de responsabilidades, utilizando Context API para gerenciamento de estado global e uma camada de serviço para as chamadas de API.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

-   **React:** Biblioteca principal para a construção da interface.
-   **Vite:** Ferramenta de build extremamente rápida para o ambiente de desenvolvimento.
-   **Firebase:** Utilizado para:
    -   **Authentication:** Gerenciamento de usuários.
    -   **Cloud Firestore:** Banco de dados NoSQL para perfis de usuário.
-   **React Router DOM:** Para gerenciamento de rotas e navegação.
-   **Tailwind CSS:** Framework CSS para estilização rápida e moderna.
-   **Fetch API:** Para realizar as chamadas à API externa de futebol.

## 🚀 Como Rodar o Projeto Localmente

Para executar este projeto na sua máquina, siga os passos abaixo.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [Git](https://git-scm.com/)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Challenge-Domina-No-Pe/WebDev.git
    cd passa-a-bola
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    npm i react-router-dom
    npm install lucide-react
    ```

3.  **Configure as Variáveis de Ambiente:**
    Para que a conexão com o Firebase e a API de futebol funcione, você precisa criar suas próprias chaves.

    a. Na raiz do projeto, crie um arquivo chamado `.env.local`.
    b. Copie o conteúdo abaixo para o seu `.env.local`.

    ```env
    # Configuração do Firebase
    VITE_FIREBASE_API_KEY="SUA_CHAVE_API_DO_FIREBASE"
    VITE_FIREBASE_AUTH_DOMAIN="SEU_DOMINIO_AUTH_DO_FIREBASE"
    VITE_FIREBASE_PROJECT_ID="SEU_ID_DE_PROJETO_DO_FIREBASE"
    VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET_DO_FIREBASE"
    VITE_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID_DO_FIREBASE"
    VITE_FIREBASE_APP_ID="SEU_APP_ID_DO_FIREBASE"
    ```

    c. Substitua os valores `"SUA_CHAVE..."` pelas chaves reais do seu projeto no [Firebase](https://console.firebase.google.com/)

4.  **Rode o projeto:**
    ```bash
    npm run dev
    ```
    O aplicativo estará disponível em `http://localhost:5173` (ou a porta que o Vite indicar).

## 👥 Integrantes
- Vítor Silva Borsato RM:561805   
- João Pedro Godinho Passiani RM:561602​
- Gabriel Molinari Droppa RM:562082
- Isabela de Deus RM: 565988

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
