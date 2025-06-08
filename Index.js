// Função para registrar as movimentações no localStorage
function registrarMovimentacao(tipo, produto, detalhes) {
    let historico = JSON.parse(localStorage.getItem("historicoMovimentacoes") || "[]");
    const userLogado = JSON.parse(localStorage.getItem("userLogado"));
    const nomeUsuario = userLogado && userLogado.nome ? userLogado.nome.split(' ')[0] : 'Desconhecido';
    const dataHoraAtual = new Date();
    const dataHoraFormatada = `${dataHoraAtual.getDate().toString().padStart(2, '0')}/${(dataHoraAtual.getMonth() + 1).toString().padStart(2, '0')}/${dataHoraAtual.getFullYear()} ${dataHoraAtual.getHours().toString().padStart(2, '0')}:${dataHoraAtual.getMinutes().toString().padStart(2, '0')}`;

    historico.push({
        dataHora: dataHoraFormatada,
        tipo: tipo,
        nomeProduto: produto.descricao_produtoCad,
        codigoProduto: produto.codigoCad,
        quantidade: detalhes.quantidade || null, // Usado para entrada/saída
        unidadeMedida: produto.unidade_medidaCad || null, // Usado para entrada/saída
        precoAntigo: detalhes.precoAntigo || null, // Usado para alteração de preço
        precoNovo: detalhes.precoNovo || null, // Usado para alteração de preço
        usuario: nomeUsuario
    });
    localStorage.setItem("historicoMovimentacoes", JSON.stringify(historico));
}

// Função para carregar e exibir os produtos
function carregarProdutos() {
    const listaProdutos = JSON.parse(localStorage.getItem("listaProdutos") || "[]");
    const tbody = document.getElementById("lista-produtos");

    tbody.innerHTML = "";

    if (listaProdutos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    listaProdutos.forEach(produto => {
        const row = document.createElement("tr");

        // Determina a classe da bolinha de status do estoque
        let statusBolinha = "";
        const estoqueAtual = parseInt(produto.NumCad);
        const estoqueMinimo = parseInt(produto.estoque_minimoCad);

        if (estoqueAtual === 0) {
            statusBolinha = "vermelha"; // Estoque Vazio
        } else if (estoqueAtual <= estoqueMinimo) {
            statusBolinha = "amarela"; // Estoque Baixo
        } else {
            statusBolinha = "azul"; // Estoque Estável
        }

        row.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="${produto.imagem_produtoCad}" alt="Imagem do Produto" class="product-image">
                    <div>
                        <div class="product-name">${produto.descricao_produtoCad}</div>
                        <div class="product-code">Código: ${produto.codigoCad}</div>
                    </div>
                </div>
            </td>
            <td>${produto.grupo_produtoCad}</td>
            <td>
                <span class="bolinha ${statusBolinha}"></span> ${produto.NumCad} ${produto.unidade_medidaCad}
            </td>
            <td>${parseFloat(produto.preco_medioCad.replace('R$', '').replace(/\./g, '').replace(',', '.'))
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-button" data-codigo="${produto.codigoCad}">Editar</button>
                    <button class="delete-button" data-codigo="${produto.codigoCad}">Deletar</button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
    atualizarAlertaEstoque(listaProdutos); // Chama a função para atualizar o alerta de itens em alerta
}

// Função para atualizar o contador de itens em alerta
function atualizarAlertaEstoque(listaProdutos) {
    const itensEmAlerta = listaProdutos.filter(produto => {
        const estoqueAtual = parseInt(produto.NumCad);
        const estoqueMinimo = parseInt(produto.estoque_minimoCad);
        return estoqueAtual <= estoqueMinimo;
    }).length;

    const alertaSpan = document.querySelector('.alerta');
    if (alertaSpan) {
        alertaSpan.textContent = `${itensEmAlerta} Itens em alerta`;
    }
}

// Executa a função carregarProdutos quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", carregarProdutos);

// Função para navegar para a página de cadastro de produto
function Cadastrar_prod_trocar() {
    window.location.href = "CadastroProd.html";
}

// Funções de ordenação
function ordenarPorEstoque() {
    const listaProdutos = JSON.parse(localStorage.getItem("listaProdutos") || "[]");

    // Ordena a lista de produtos com base no estoque (NumCad)
    listaProdutos.sort((a, b) => parseInt(a.NumCad) - parseInt(b.NumCad));

    localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
    carregarProdutos();
    console.log("Produtos ordenados por Estoque.");
}

function ordenarPorPreco() {
    const listaProdutos = JSON.parse(localStorage.getItem("listaProdutos") || "[]");

    // Ordena a lista de produtos com base no preço (preco_medioCad)
    listaProdutos.sort((a, b) => {
        // Ajustado para remover todos os pontos e vírgulas para a conversão correta
        const precoA = parseFloat(a.preco_medioCad.replace('R$', '').replace(/\./g, '').replace(',', '.'));
        const precoB = parseFloat(b.preco_medioCad.replace('R$', '').replace(/\./g, '').replace(',', '.'));
        return precoA - precoB;
    });

    localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
    carregarProdutos();
    console.log("Produtos ordenados por Preço.");
}

// Pesquisa de produtos na tabela
document.getElementById("pesquisa").addEventListener("keyup", function () {
    const termoPesquisa = this.value.toLowerCase();
    const linhasProdutos = document.querySelectorAll("#lista-produtos tr");

    linhasProdutos.forEach(linha => {
        // Verifica se a linha não é a mensagem "Nenhum produto cadastrado."
        if (linha.querySelector('td[colspan="5"]')) {
            linha.style.display = "none"; // Esconde a mensagem
            return;
        }

        const nomeProduto = linha.querySelector(".product-name").textContent.toLowerCase();
        const codigoProduto = linha.querySelector(".product-code").textContent.toLowerCase();
        const categoriaProduto = linha.cells[1].textContent.toLowerCase();

        if (nomeProduto.includes(termoPesquisa) || codigoProduto.includes(termoPesquisa) || categoriaProduto.includes(termoPesquisa)) {
            linha.style.display = ""; // Mostra a linha
        } else {
            linha.style.display = "none"; // Esconde a linha
        }
    });
});

// Referências para o modal e seus elementos
const editProductModal = document.getElementById("editProductModal");
const closeButton = document.querySelector(".close-button");
const editProductForm = document.getElementById("editProductForm");
const editProductId = document.getElementById("editProductId"); // Campo oculto para o ID
const editEstoque = document.getElementById("editEstoque");
const editPreco = document.getElementById("editPreco");

// Event Listener para abrir o modal de edição (delegado ao documento para pegar botões dinâmicos)
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-button')) {
        const codigoProduto = event.target.dataset.codigo; // Pega o código do produto do atributo data-codigo
        abrirModalEdicao(codigoProduto);
    }
});

// Event Listener para deletar produto (delegado ao documento)
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-button')) {
        const codigoProduto = event.target.dataset.codigo; // Pega o código do produto
        confirmarDelecao(codigoProduto);
    }
});

// Função para abrir o modal de edição e preencher com os dados do produto
function abrirModalEdicao(codigo) {
    const listaProdutos = JSON.parse(localStorage.getItem("listaProdutos") || "[]");
    const produtoParaEditar = listaProdutos.find(p => p.codigoCad === codigo);

    if (produtoParaEditar) {
        editProductId.value = produtoParaEditar.codigoCad;
        editEstoque.value = produtoParaEditar.NumCad;
        // Remove "R$" e espaços para o campo de edição de preço, permitindo edição numérica
        editPreco.value = parseFloat(produtoParaEditar.preco_medioCad.replace('R$', '').replace(/\./g, '').replace(',', '.')).toFixed(2);
        editProductModal.style.display = "flex"; // Usa flex para centralizar o modal
    } else {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Produto não encontrado para edição.",
        });
    }
}

// Fechar o modal (clicando no 'X')
closeButton.addEventListener('click', () => {
    editProductModal.style.display = "none";
});

// Fechar o modal (clicando fora da área do conteúdo do modal)
window.addEventListener('click', (event) => {
    if (event.target === editProductModal) {
        editProductModal.style.display = "none";
    }
});

// Lógica de salvar alterações no formulário do modal
editProductForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    const codigo = editProductId.value;
    const novoEstoque = editEstoque.value;
    const novoPreco = editPreco.value;

    let listaProdutos = JSON.parse(localStorage.getItem("listaProdutos") || "[]");

    const index = listaProdutos.findIndex(p => p.codigoCad === codigo);

    if (index !== -1) {
        const produtoAntigo = { ...listaProdutos[index] }; // Copia o estado anterior do produto

        // Validação básica: estoque não pode ser negativo
        if (parseInt(novoEstoque) < 0) {
            Swal.fire({
                icon: "error",
                title: "Erro de Estoque",
                text: "O estoque não pode ser um valor negativo.",
            });
            return;
        }
        // Validação básica: preço deve ser um número válido
        if (isNaN(parseFloat(novoPreco.replace(',', '.')))) {
            Swal.fire({
                icon: "error",
                title: "Erro de Preço",
                text: "O preço deve ser um número válido.",
            });
            return;
        }

        // Formata o preço para salvar (Ex: R$ 1.234,56)
        const precoFormatado = `R$ ${parseFloat(novoPreco.replace(',', '.')).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        listaProdutos[index].NumCad = novoEstoque;
        listaProdutos[index].preco_medioCad = precoFormatado; // Salva o preço formatado

        localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
        carregarProdutos(); // Recarrega a tabela para mostrar as alterações
        editProductModal.style.display = "none"; // Fecha o modal

        // Registrar movimentação de alteração de preço (se o preço realmente mudou)
        if (produtoAntigo.preco_medioCad !== precoFormatado) {
            registrarMovimentacao(
                'Preço Alterado',
                produtoAntigo, // Passa o produto completo para ter acesso a todos os dados
                { precoAntigo: produtoAntigo.preco_medioCad, precoNovo: precoFormatado }
            );
        }

        // Registrar movimentação de entrada/saída (se o estoque realmente mudou)
        if (parseInt(produtoAntigo.NumCad) !== parseInt(novoEstoque)) {
            const tipoMovimentacao = parseInt(novoEstoque) > parseInt(produtoAntigo.NumCad) ? 'Entrada de Produto' : 'Saída de Produto';
            const quantidadeMovimentada = Math.abs(parseInt(novoEstoque) - parseInt(produtoAntigo.NumCad));
            registrarMovimentacao(
                tipoMovimentacao,
                produtoAntigo, // Passa o produto completo
                { quantidade: quantidadeMovimentada }
            );
        }

        Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Produto atualizado com sucesso!",
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Produto não encontrado para atualizar.",
        });
    }
});

// Função para confirmar a deleção do produto
function confirmarDelecao(codigo) {
    Swal.fire({
        title: "Tem certeza?",
        text: "Você não poderá reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, deletar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            deletarProduto(codigo);
        }
    });
}

// Função para deletar o produto
function deletarProduto(codigo) {
    let listaProdutos = JSON.parse(localStorage.getItem("listaProdutos") || "[]");
    // Encontra o produto antes de removê-lo para registrar no histórico
    const produtoDeletado = listaProdutos.find(produto => produto.codigoCad === codigo);
    const novaListaProdutos = listaProdutos.filter(produto => produto.codigoCad !== codigo);

    localStorage.setItem("listaProdutos", JSON.stringify(novaListaProdutos));
    carregarProdutos(); // Recarrega a tabela

    if (produtoDeletado) {
        // Registrar a movimentação de deleção
        registrarMovimentacao('Produto Deletado', produtoDeletado, {});
    }

    Swal.fire({
        title: "Deletado!",
        text: "O produto foi deletado.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });
}