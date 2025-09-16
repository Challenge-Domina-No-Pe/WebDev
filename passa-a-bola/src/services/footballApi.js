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