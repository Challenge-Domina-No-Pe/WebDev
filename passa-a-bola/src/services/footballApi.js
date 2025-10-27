export async function getJogosBrasileiraoLocal() {
  const url = '/dadosJogos.json';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo JSON local: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Dados locais carregados:", data);
    return data;
  } catch (error) {
    console.error("Falha ao buscar dados locais:", error);
    return { leagueName: 'Erro', leagueLogo: '', matches: [] }; 
  }
}