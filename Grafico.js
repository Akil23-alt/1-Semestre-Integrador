document.addEventListener("DOMContentLoaded", function() {
    carregarDadosEGerarGraficos();
    document.getElementById('gerarRelatorioBtn').addEventListener('click', gerarRelatorioPDF);
});

function carregarDadosEGerarGraficos() {
    const listaProdutos = JSON.parse(localStorage.getItem("listaProdutos") || "[]");

    // --- Estatísticas Gerais ---
    const totalProdutos = listaProdutos.length;
    const totalItensEstoque = listaProdutos.reduce((acc, produto) => acc + parseInt(produto.NumCad || 0), 0);
    const valorTotalEstoque = listaProdutos.reduce((acc, produto) => {
        const preco = parseFloat(produto.preco_medioCad.replace('R$', '').replace(/\./g, '').replace(',', '.') || 0);
        const quantidade = parseInt(produto.NumCad || 0);
        return acc + (preco * quantidade);
    }, 0);
    const itensEmAlerta = listaProdutos.filter(produto => {
        const estoqueAtual = parseInt(produto.NumCad || 0);
        const estoqueMinimo = parseInt(produto.estoque_minimoCad || 0);
        return estoqueAtual <= estoqueMinimo;
    }).length;

    document.getElementById('totalProdutos').textContent = totalProdutos;
    document.getElementById('totalItensEstoque').textContent = totalItensEstoque;
    document.getElementById('valorTotalEstoque').textContent = valorTotalEstoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('itensAlertaStats').textContent = itensEmAlerta;

    // --- Dados para Gráficos ---

    // Gráfico 1: Total de Itens em Estoque por Categoria (Gráfico de Barras)
    const categoriasMap = new Map();
    listaProdutos.forEach(produto => {
        const categoria = produto.grupo_produtoCad || 'Outros';
        const quantidade = parseInt(produto.NumCad || 0);
        categoriasMap.set(categoria, (categoriasMap.get(categoria) || 0) + quantidade);
    });
    const categoriasLabels = Array.from(categoriasMap.keys());
    const categoriasData = Array.from(categoriasMap.values());

    new Chart(document.getElementById('categoriasChart'), {
        type: 'bar',
        data: {
            labels: categoriasLabels,
            datasets: [{
                label: 'Itens em Estoque',
                data: categoriasData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });

    // Gráfico 2: Valor Total de Estoque por Categoria (Gráfico de Rosca/Doughnut)
    const valorPorCategoriaMap = new Map();
    listaProdutos.forEach(produto => {
        const categoria = produto.grupo_produtoCad || 'Outros';
        const preco = parseFloat(produto.preco_medioCad.replace('R$', '').replace(/\./g, '').replace(',', '.') || 0);
        const quantidade = parseInt(produto.NumCad || 0);
        valorPorCategoriaMap.set(categoria, (valorPorCategoriaMap.get(categoria) || 0) + (preco * quantidade));
    });
    const valorCategoriasLabels = Array.from(valorPorCategoriaMap.keys());
    const valorCategoriasData = Array.from(valorPorCategoriaMap.values());

    new Chart(document.getElementById('valorEstoqueChart'), {
        type: 'doughnut',
        data: {
            labels: valorCategoriasLabels,
            datasets: [{
                label: 'Valor Total',
                data: valorCategoriasData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.raw !== null) {
                                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.raw);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Gráfico 3: Status do Estoque (Gráfico de Pizza)
    const statusContagem = {
        'Estável': 0,
        'Baixo': 0,
        'Vazio': 0
    };

    listaProdutos.forEach(produto => {
        const estoqueAtual = parseInt(produto.NumCad || 0);
        const estoqueMinimo = parseInt(produto.estoque_minimoCad || 0);
        if (estoqueAtual === 0) {
            statusContagem.Vazio++;
        } else if (estoqueAtual <= estoqueMinimo) {
            statusContagem.Baixo++;
        } else {
            statusContagem.Estável++;
        }
    });

    const statusLabels = Object.keys(statusContagem);
    const statusData = Object.values(statusContagem);

    new Chart(document.getElementById('statusEstoqueChart'), {
        type: 'pie',
        data: {
            labels: statusLabels,
            datasets: [{
                label: 'Número de Produtos',
                data: statusData,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',  // Cores do estoque
                    'rgba(255, 206, 86, 0.6)',  
                    'rgba(255, 99, 132, 0.6)'   
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += `: ${context.raw} produtos`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}


async function gerarRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = 20;

    // Título do Relatório
    doc.setFontSize(22);
    doc.text("Relatório de Estoque - Negrão", 105, yPos, { align: "center" });
    yPos += 15;

    doc.setFontSize(12);
    doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`, 10, yPos);
    yPos += 10;
    doc.text(`Hora do Relatório: ${new Date().toLocaleTimeString('pt-BR')}`, 10, yPos);
    yPos += 20;

    // Estatísticas Gerais
    doc.setFontSize(16);
    doc.text("Estatísticas Gerais do Estoque", 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Total de Produtos Cadastrados: ${document.getElementById('totalProdutos').textContent}`, 10, yPos);
    yPos += 8;
    doc.text(`Total de Itens em Estoque: ${document.getElementById('totalItensEstoque').textContent}`, 10, yPos);
    yPos += 8;
    doc.text(`Valor Total do Estoque: ${document.getElementById('valorTotalEstoque').textContent}`, 10, yPos);
    yPos += 8;
    doc.text(`Itens em Alerta (Estoque Baixo/Vazio): ${document.getElementById('itensAlertaStats').textContent}`, 10, yPos);
    yPos += 20;

    // Gráficos (convertendo canvas para imagem)
    doc.setFontSize(16);
    doc.text("Análise Gráfica", 10, yPos);
    yPos += 10;

    const charts = [
        { id: 'categoriasChart', title: 'Total de Itens em Estoque por Categoria' },
        { id: 'valorEstoqueChart', title: 'Valor Total de Estoque por Categoria' },
        { id: 'statusEstoqueChart', title: 'Status do Estoque' }
    ];

    for (const chartInfo of charts) {
        const canvas = document.getElementById(chartInfo.id);
        if (canvas) {
            const imgData = canvas.toDataURL('image/png');
            
            // Verifica se há espaço suficiente na página atual, senão adiciona uma nova
            if (yPos + 80 > doc.internal.pageSize.height - 20) { // 80 é uma estimativa de altura para o gráfico + título
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.text(chartInfo.title, 10, yPos);
            yPos += 5;
            doc.addImage(imgData, 'PNG', 10, yPos, 180, 80); // Ajuste a largura e altura conforme necessário
            yPos += 90; // Espaço para o gráfico
        }
    }

    doc.save('relatorio_estoque.pdf');
}