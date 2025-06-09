document.addEventListener('DOMContentLoaded', async () => {
  const caminhoDoJsonProdutosIniciais = 'Produtos.json'; 
  try {
    const response = await fetch(caminhoDoJsonProdutosIniciais);

        if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo JSON: ${response.status} ${response.statusText}`);
    }

    const produtosDoArquivoJson = await response.json();

    let listaProdutosAtual = JSON.parse(localStorage.getItem("listaProdutos") || "[]");

    const novosProdutosParaAdicionar = produtosDoArquivoJson.filter(jsonProduto => {
      return !listaProdutosAtual.some(produtoExistente => produtoExistente.codigoCad === jsonProduto.codigoCad);
    });

if (novosProdutosParaAdicionar.length > 0) {
  listaProdutosAtual = listaProdutosAtual.concat(novosProdutosParaAdicionar);
  localStorage.setItem("listaProdutos", JSON.stringify(listaProdutosAtual));
  console.log(`${novosProdutosParaAdicionar.length} produtos do JSON foram adicionados ao localStorage.`);
  carregarGraficos(); 
} else {
  console.log('Nenhum novo produto do JSON para adicionar (já existem ou o JSON está vazio).');
  carregarGraficos();
}
  } catch (error) {
    console.error("Houve um erro ao carregar ou processar o JSON de produtos iniciais:", error);
  }
});
