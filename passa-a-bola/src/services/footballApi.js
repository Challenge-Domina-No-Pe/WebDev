// Função para buscar dados da API-Football para uma temporada específica
export async function getJogosApiFootball(leagueId, season) {
  const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}&status=FT`;
  
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': import.meta.env.VITE_API_FOOTBALL_KEY
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log("Dados recebidos da API-Football (Brasileirão 2023):", data);
    
    if (data.results === 0) {
      console.warn("A API não retornou resultados para esta consulta.");
    }
    
    return data.response; 
  } catch (error) {
    console.error("Falha ao buscar dados da API-Football:", error);
    return []; 
  }
}

// Função para buscar os últimos jogos de uma liga na TheSportsDB
export async function getUltimosJogosDB(leagueId) {
  const apiKey = import.meta.env.VITE_THESPORTSDB_KEY;
  // Usando o endpoint correto para os últimos jogos finalizados
  const url = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventspastleague.php?id=${leagueId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Log para depuração: ver o que a API está realmente enviando
    console.log("Dados recebidos da TheSportsDB:", data);

    // A resposta pode estar em 'data.events' (futebol) ou 'data.results'
    const jogos = data.events || data.results;

    if (!jogos) {
      console.warn("TheSportsDB não retornou eventos para esta consulta.");
      return [];
    }

    return jogos;
  } catch (error) {
    console.error("Falha ao buscar dados da TheSportsDB:", error);
    return [];
  }
}