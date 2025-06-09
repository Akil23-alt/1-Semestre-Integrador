// Função para registrar as movimentações no localStorage (mesma função do index.js para consistência)
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
        quantidade: detalhes.quantidade || null,
        unidadeMedida: produto.unidade_medidaCad || null,
        precoAntigo: detalhes.precoAntigo || null,
        precoNovo: detalhes.precoNovo || null,
        usuario: nomeUsuario
    });
    localStorage.setItem("historicoMovimentacoes", JSON.stringify(historico));
}


// Data e horário para o cadastro
let cadastrarPod_data = new Date();
let minuto = cadastrarPod_data.getMinutes();
let hora = cadastrarPod_data.getHours();
let dia = cadastrarPod_data.getDate();
let mes = cadastrarPod_data.getMonth() + 1;
let ano = cadastrarPod_data.getFullYear();

// Formatando a forma que vai ficar estruturado (Era pra movimerntação, mas como ja tem movimentação de cadastro da mesma forma que tem pra modificar, vou deixar assim mesmo)
// E tambem porque deu trabalho pra fazer funcionar de outra forma
let horaCadastro = `${dia.toString().padStart(2, '0')}/${mes.toString()
    .padStart(2, '0')}/${ano} ${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;

// Campos de cadastro do produto
let codigo = document.querySelector("#codigo");
let labelCodigo = document.querySelector("#labelCodigo"); //Chamando a label para poder mecher na coloração e na mensagem mais tarde
let validCodigo = false; //Serve como um boolean para verificar se o campo está válido

let origem = document.getElementById("origem"); // Campo de rádio button de origem

let grupo_produto = document.querySelector("#grupo_produto");
let labelGrupo_produto = document.querySelector("#labelGrupo_produto");
let validGrupo_produto = false;

let ncm = document.querySelector("#ncm");
let labelNcm = document.querySelector("#labelNcm");
let validNcm = false;

let preco_medio = document.querySelector("#preco_medio");
let labelPreco_medio = document.querySelector("#labelPreco_medio");
let validPreco_medio = false;

let num = document.querySelector("#num");
let labelNum = document.querySelector("#labelNum");
let validNum = false;

let estoque_minimo = document.querySelector("#estoque_minimo");
let labelEstoque_minimo = document.querySelector("#labelEstoque_minimo");
let validEstoque_minimo = false;

let unidade_medida = document.querySelector("#unidade_medida");
let labelUnidade_medida = document.querySelector("#labelUnidade_medida");
let validUnidade_medida = false;

let fornecedor = document.querySelector("#fornecedor");
let labelFornecedor = document.querySelector("#labelFornecedor");
let validFornecedor = false;

let fabricante = document.querySelector("#fabricante");
let labelFabricante = document.querySelector("#labelFabricante");
let validFabricante = false;

let descricao_produto = document.querySelector("#descricao_produto");
let labelDescricao_produto = document.querySelector("#labelDescricao_produto");
let validDescricao_produto = false;

let descricao_tecnica = document.querySelector("#descricao_tecnica");
let labelDescricao_tecnica = document.querySelector("#labelDescricao_tecnica");
let validDescricao_tecnica = false;

let observacao = document.querySelector("#observacao");
let labelObservacao = document.querySelector("#labelObservacao");

let imagem_produto = document.querySelector("#img-produto");


let $input = document.getElementById('img-produto'),
    $fileName = document.getElementById('file-name');

// Pegando o usuario logado, para guardar o nome junto a lista
const userLogado_prod = JSON.parse(localStorage.getItem("userLogado"));

// --- Verificação de Cargo para Redirecionamento (INÍCIO DA MUDANÇA) ---
if (userLogado_prod && userLogado_prod.Cargo === "producao") {
    Swal.fire({
        icon: 'warning',
        title: 'Acesso Restrito',
        text: 'Seu cargo não permite acesso a esta página. Você será redirecionado.',
        showConfirmButton: false,
        timer: 3000
    }).then(() => {
        window.location.href = "index.html";
    });
}
// Verifica os campos e impõe regras
codigo.addEventListener("keyup", () => {
    if (codigo.value.length <= 8) {
        labelCodigo.style.color = "red";
        labelCodigo.innerHTML = "Código *Insira 9 caracteres";
        codigo.style.borderColor = "red";
        validCodigo = false;
        if (codigo.value.length == 0) {
            labelCodigo.style.color = "#fffb04";
            labelCodigo.innerHTML = "Código *Campo obrigatório";
            codigo.style.borderColor = "#fffb04";
            validCodigo = false;
        }
    } else {
        labelCodigo.style.color = "green";
        labelCodigo.innerHTML = "Código";
        codigo.style.borderColor = "green";
        validCodigo = true;
    }
});

// Define regras ao escrever e caracteres pre-setados para manter o padrão (Lembrando que A é número e letra)
$(document).ready(function () {
    $("#codigo").mask("A-000-000");
});

grupo_produto.addEventListener("keyup", () => {
    if (grupo_produto.value.length == 0) {
        labelGrupo_produto.style.color = "#fffb04";
        labelGrupo_produto.innerHTML = "Grupo do produto *Campo obrigatório";
        grupo_produto.style.borderColor = "#fffb04";
        validGrupo_produto = false;

    } else {
        labelGrupo_produto.style.color = "#555555";
        labelGrupo_produto.innerHTML = "Grupo do produto";
        grupo_produto.style.borderColor = "#555555";
        validGrupo_produto = true;
    }
});

ncm.addEventListener("keyup", () => {
    if (ncm.value.length <= 9) {
        labelNcm.style.color = "red";
        labelNcm.innerHTML = "NCM *Insira 8 caracteres";
        ncm.style.borderColor = "red";
        validNcm = false;
        if (ncm.value.length == 0) {
            labelNcm.style.color = "#fffb04";
            labelNcm.innerHTML = "NCM *Campo obrigatório";
            ncm.style.borderColor = "#fffb04";
            validNcm = false;
        }
    } else {
        labelNcm.style.color = "green";
        labelNcm.innerHTML = "NCM";
        ncm.style.borderColor = "green";
        validNcm = true;
    }
});

$(document).ready(function () {
    $("#ncm").mask("0000.00.00");
});


preco_medio.addEventListener("keyup", () => {
    if (preco_medio.value.length <= 5) {
        labelPreco_medio.style.color = "red";
        labelPreco_medio.innerHTML = "Preço Médio *Insira no mínimo 5 caracteres";
        preco_medio.style.borderColor = "red";
        validPreco_medio = false;
        if (preco_medio.value.length == 0) {
            labelPreco_medio.style.color = "#fffb04";
            labelPreco_medio.innerHTML = "Preço Médio *Campo obrigatório";
            preco_medio.style.borderColor = "#fffb04";
            validPreco_medio = false;
        }
    } else {
        labelPreco_medio.style.color = "green";
        labelPreco_medio.innerHTML = "Preço Médio";
        preco_medio.style.borderColor = "green";
        validPreco_medio = true;
    }
});

$(document).ready(function () {
    $("#preco_medio").mask("R$ 000.000.000"); // Máscara para moeda
});

num.addEventListener("keyup", () => {
    if (num.value.length == 0) {
        labelNum.style.color = "#fffb04";
        labelNum.innerHTML = "Quantidade *Campo obrigatório";
        num.style.borderColor = "#fffb04";
        validNum = false;

    } else {
        labelNum.style.color = "#555555";
        labelNum.innerHTML = "Quantidade";
        num.style.borderColor = "#555555";
        validNum = true;
    }
});

estoque_minimo.addEventListener("keyup", () => {
    if (estoque_minimo.value.length == 0) {
        labelEstoque_minimo.style.color = "#fffb04";
        labelEstoque_minimo.innerHTML = "Estoque mínimo *Campo obrigatório";
        estoque_minimo.style.borderColor = "#fffb04";
        validEstoque_minimo = false;
   
    } else {
        labelEstoque_minimo.style.color = "#555555";
        labelEstoque_minimo.innerHTML = "Estoque mínimo";
        estoque_minimo.style.borderColor = "#555555";
        validEstoque_minimo = true;
    }
});

unidade_medida.addEventListener("keyup", () => {
    if (unidade_medida.value.length == 0) {
        labelUnidade_medida.style.color = "#fffb04";
        labelUnidade_medida.innerHTML = "Unidade de medida *Campo obrigatório";
        unidade_medida.style.borderColor = "#fffb04";
        validUnidade_medida = false;
    } else {
        labelUnidade_medida.style.color = "#555555";
        labelUnidade_medida.innerHTML = "Unidade de medida";
        unidade_medida.style.borderColor = "#555555";
        validUnidade_medida = true;
    }
});

fornecedor.addEventListener("keyup", () => {
    if (fornecedor.value.length == 0) {
        labelFornecedor.style.color = "#fffb04";
        labelFornecedor.innerHTML = "Fornecedor *Campo obrigatório";
        fornecedor.style.borderColor = "#fffb04";
        validFornecedor = false;

    } else {
        labelFornecedor.style.color = "#555555";
        labelFornecedor.innerHTML = "Fornecedor";
        fornecedor.style.borderColor = "#555555";
        validFornecedor = true;
    }
});

fabricante.addEventListener("keyup", () => {
    if (fabricante.value.length == 0) {
        labelFabricante.style.color = "#fffb04";
        labelFabricante.innerHTML = "Fabricante *Campo obrigatório";
        fabricante.style.borderColor = "#fffb04";
        validFabricante = false;

    } else {
        labelFabricante.style.color = "#555555";
        labelFabricante.innerHTML = "Fabricante";
        fabricante.style.borderColor = "#555555";
        validFabricante = true;
    }
});

descricao_produto.addEventListener("keyup", () => {
    if (descricao_produto.value.length == 0) {
        labelDescricao_produto.style.color = "#fffb04";
        labelDescricao_produto.innerHTML = "Descrição produto *Campo obrigatório";
        descricao_produto.style.borderColor = "#fffb04";
        validDescricao_produto = false;

    } else {
        labelDescricao_produto.style.color = "#555555";
        labelDescricao_produto.innerHTML = "Descrição produto";
        descricao_produto.style.borderColor = "#555555";
        validDescricao_produto = true;
    }
});

descricao_tecnica.addEventListener("keyup", () => {
    if (descricao_tecnica.value.length == 0) {
        labelDescricao_tecnica.style.color = "#fffb04";
        labelDescricao_tecnica.innerHTML = "Descrição técnica *Campo obrigatório";
        descricao_tecnica.style.borderColor = "#fffb04";
        validDescricao_tecnica = false;

    } else {
        labelDescricao_tecnica.style.color = "#555555";
        labelDescricao_tecnica.innerHTML = "Descrição técnica";
        descricao_tecnica.style.borderColor = "#555555";
        validDescricao_tecnica = true;
    }
});


// Nome do arquivo de imagem (mostra o nome do arquivo selecionado)
$input.addEventListener('change', function () {
    $fileName.textContent = this.files[0] ? this.files[0].name : '';
});

// Cadastrando o produto e verificando se está tudo certo para o cadastro
function Cadastrar() {
    let valorOrigem = '';
    const origemSelecionada = document.querySelector('input[name="origem"]:checked');
    if (origemSelecionada) {
        valorOrigem = origemSelecionada.value;
    } else {
        Swal.fire({
            title: "Erro!",
            text: "A origem é obrigatória!",
            icon: "error"
        });
        return; // Sai da função se a origem não estiver selecionada
    }

    let arquivoImagem = imagem_produto.files[0];
    if (!arquivoImagem) {
        Swal.fire({
            title: "Erro!",
            text: "A imagem é obrigatória!",
            icon: "error"
        });
        return; // Sai da função se a imagem não for selecionada
    }

    if (
        validCodigo && validGrupo_produto && validNcm && validPreco_medio &&
        validNum && validEstoque_minimo && validUnidade_medida &&
        validFornecedor && validFabricante && validDescricao_produto &&
        validDescricao_tecnica
    ) {
        var listaProdutos = JSON.parse(
            localStorage.getItem("listaProdutos") || "[]"
        );

        // Verifica se o produto já existe (usando codigoCad)
        if (listaProdutos.some((produto) => produto.codigoCad === codigo.value)) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: `O produto com código "${codigo.value}" já está cadastrado.`,
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const imagemBase64 = e.target.result; // Torna possível a transformação e armazenamento da imagem

            // Adiciona novo produto
            const novoProduto = {
                codigoCad: codigo.value,
                origemCad: valorOrigem,
                grupo_produtoCad: grupo_produto.value,
                ncmCad: ncm.value,
                preco_medioCad: preco_medio.value,
                NumCad: num.value,
                estoque_minimoCad: estoque_minimo.value,
                unidade_medidaCad: unidade_medida.value,
                fornecedorCad: fornecedor.value,
                fabricanteCad: fabricante.value,
                descricao_produtoCad: descricao_produto.value,
                descricao_tecnicaCad: descricao_tecnica.value,
                observacaoCad: observacao.value,
                horaCadastroCad: horaCadastro,
                imagem_produtoCad: imagemBase64,
                userLogadoCad: userLogado_prod
            };
            listaProdutos.push(novoProduto);

            localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));

            // Registrar a movimentação de cadastro
            registrarMovimentacao(
                'Cadastro de Produto',
                novoProduto, // Passa o produto completo
                { quantidade: num.value } // Detalhes específicos para cadastro (quantidade inicial)
            );

            // Mensagem de sucesso
            Swal.fire({
                title: "Sucesso!",
                text: "Produto cadastrado com sucesso!",
                icon: "success"
            });

            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        };
        reader.readAsDataURL(arquivoImagem); // Lê o arquivo como URL de dados (Base64)

    } else {
        // Se algum campo não for válido, exibe mensagem de erro
        Swal.fire({
            icon: "error",
            title: "ERRO",
            text: "Preencha todos os campos obrigatórios corretamente antes de cadastrar o produto!",
            footer: '<a Caso o erro persista relate ao suporte </a>'
        });
    }
}
