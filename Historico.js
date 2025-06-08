// historico.js

document.addEventListener("DOMContentLoaded", () => {
    carregarMovimentacoes();
    exibirInfoUsuario(); // Exibe as informações do usuário logado
});

// Era pra ser uma função para exibir o nome e e-mail do usuário, era
function exibirInfoUsuario() {
    const userLogado = JSON.parse(localStorage.getItem("userLogado"));
    if (userLogado) {
        document.getElementById("nomeUsuario").textContent = userLogado.nome;
        document.getElementById("contaUsuario").textContent = userLogado.user;
    }
}

// Função para carregar e exibir as movimentações
function carregarMovimentacoes() {
    const listaMovimentacoes = JSON.parse(localStorage.getItem("historicoMovimentacoes") || "[]");
    const tbody = document.getElementById("lista-movimentacoes");

    tbody.innerHTML = ""; // Limpa a tabela antes de adicionar novos itens

    if (listaMovimentacoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhuma movimentação registrada.</td></tr>';
        return;
    }

    listaMovimentacoes.forEach(movimentacao => {
        const row = document.createElement("tr");

        let detalhesHtml = '';
        if (movimentacao.tipo === 'Entrada de Produto' || movimentacao.tipo === 'Saída de Produto') {
            detalhesHtml = `Quantidade: ${movimentacao.quantidade} ${movimentacao.unidadeMedida}`;
        } else if (movimentacao.tipo === 'Preço Alterado') {
            detalhesHtml = `De: ${movimentacao.precoAntigo} Para: ${movimentacao.precoNovo}`;
        } else if (movimentacao.tipo === 'Produto Deletado') {
            detalhesHtml = `Código: ${movimentacao.codigoProduto}`;
        }

        row.innerHTML = `
            <td>${movimentacao.dataHora}</td>
            <td>${movimentacao.tipo}</td>
            <td>${movimentacao.nomeProduto || 'N/A'}</td>
            <td>${detalhesHtml}</td>
            <td>${movimentacao.usuario || 'Desconhecido'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Event Listener para a barra de pesquisa do histórico
document.getElementById("pesquisaHistorico").addEventListener("keyup", function () {
    const termoPesquisa = this.value.toLowerCase();
    const linhasMovimentacoes = document.querySelectorAll("#lista-movimentacoes tr");

    linhasMovimentacoes.forEach(linha => {
        // Verifica se a linha não é a mensagem "Nenhuma movimentação registrada."
        if (linha.querySelector('td[colspan="5"]')) {
            linha.style.display = "none"; // Esconde a mensagem
            return;
        }

        const dataHora = linha.cells[0].textContent.toLowerCase();
        const tipo = linha.cells[1].textContent.toLowerCase();
        const produto = linha.cells[2].textContent.toLowerCase();
        const detalhes = linha.cells[3].textContent.toLowerCase();
        const usuario = linha.cells[4].textContent.toLowerCase();

        if (dataHora.includes(termoPesquisa) || tipo.includes(termoPesquisa) ||
            produto.includes(termoPesquisa) || detalhes.includes(termoPesquisa) ||
            usuario.includes(termoPesquisa)) {
            linha.style.display = ""; // Mostra a linha
        } else {
            linha.style.display = "none"; // Esconde a linha
        }
    });
});