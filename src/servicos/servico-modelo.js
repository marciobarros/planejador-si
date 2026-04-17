var servicoModelo = function() {

  const STORAGE_KEY_DADOS = "dados-planejador-projetos-si"

  // Carrega todos os dados do localStorage
  function pegaDados() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_DADOS)) || { funcionalidades: [] };
  }

  // Salva todos os dados no localStorage
  function salvaDados(dados) {
    localStorage.setItem(STORAGE_KEY_DADOS, JSON.stringify(dados));
  }

  return { pegaDados, salvaDados }
}()