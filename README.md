# Projeto de Controle de Estoque - Negrão

Este projeto é um sistema de controle de estoque robusto e interativo, desenvolvido principalmente com JavaScript, HTML e CSS, utilizando `localStorage` para persistência de dados. Ele oferece funcionalidades completas para o gerenciamento de produtos, incluindo cadastro de usuários, autenticação, adição e edição de produtos, visualização de histórico de movimentações e análise de dados através de gráficos e relatórios.

## Estrutura do Projeto

-   `/HTML/`: Contém os arquivos HTML de cada página.
-   `/CSS/`: Contém os arquivos CSS para estilização de cada página.
-   `/JS/`: Contém os arquivos JavaScript que implementam a lógica do sistema.
-   `/Img/`: Contém as imagens utilizadas no projeto (ex: logos, ícones).
-   `/JSON/`: Contém arquivos de dados, como `Produtos.json` para carga inicial de produtos.

### Arquivos HTML Principais

* `Login.html`: Página de autenticação de usuários.
* `Cadastro.html`: Página para registro de novos usuários.
* `Index.html`: Página principal do sistema de estoque, onde os produtos são listados e gerenciados.
* `CadastroProd.html`: Formulário para o cadastro de novos produtos.
* `Historico.html`: Página que exibe o registro de todas as movimentações de estoque.
* `Grafico.html`: Página que apresenta visualizações gráficas e estatísticas dos dados do estoque.

### Arquivos JavaScript (JS)

* `Login.JS`:
    * **Funcionalidade:** Autenticação de usuários.
    * **Detalhes:** Gerencia a visibilidade da senha, valida credenciais contra `localStorage` (`listaUser`), gera tokens de sessão e armazena informações do usuário logado (`token`, `userLogado`). Redireciona para `Index.html` em caso de sucesso ou exibe erros.
* `Cadastro.js`:
    * **Funcionalidade:** Registro de novos usuários.
    * **Detalhes:** Realiza validações em tempo real para nome, usuário, senha e confirmação. Verifica a unicidade do nome de usuário e a seleção do setor. Adiciona novos usuários à `listaUser` no `localStorage`. Redireciona para `Login.html` após cadastro bem-sucedido.
* `Token.js`:
    * **Funcionalidade:** Controle de acesso e logout.
    * **Detalhes:** Verifica a existência de um `token` de autenticação no `localStorage` ao carregar a página. Caso não exista, redireciona o usuário para `Login.html`. Contém a função `Sair()` para encerrar a sessão.
* `CadastroProd.js`:
    * **Funcionalidade:** Cadastro de novos produtos.
    * **Detalhes:** Coleta e valida dados do produto (código, origem, grupo, NCM, preço, quantidade, estoque mínimo, etc.). Aplica máscaras de entrada (jQuery Mask Plugin) e validações visuais. Permite upload de imagens (convertidas para Base64). Impede o acesso para usuários com `Cargo` "producao". Registra a movimentação de "Cadastro de Produto" no histórico.
* `Index.js`:
    * **Funcionalidade:** Gerenciamento da lista de produtos e movimentações.
    * **Detalhes:** Carrega e exibe produtos em uma tabela. Implementa busca/filtro, edição de estoque e preço via modal. Permite "entrada", "saída" e "exclusão" de produtos, registrando cada ação no `historicoMovimentacoes`. Atualiza o status visual do estoque (baixo/vazio).
* `CarregarJson.js`:
    * **Funcionalidade:** Carga inicial de produtos via JSON.
    * **Detalhes:** Carrega `Produtos.json` e adiciona os produtos ao `listaProdutos` no `localStorage`, evitando duplicações. Chama `carregarGraficos()` após a carga.
* `Historico.js`:
    * **Funcionalidade:** Visualização e filtragem do histórico de movimentações.
    * **Detalhes:** Exibe as movimentações salvas em `historicoMovimentacoes` em uma tabela. Permite pesquisa por diversos campos.
* `Grafico.js`:
    * **Funcionalidade:** Geração de gráficos e relatórios.
    * **Detalhes:** Calcula estatísticas gerais do estoque (total de produtos, itens, valor, itens em alerta). Utiliza uma biblioteca de gráficos (provavelmente Chart.js) para criar visualizações interativas. Permite gerar relatórios em PDF (com jsPDF e html2canvas).

### Arquivos CSS

* `Index.css`: Estilos gerais da aplicação, cabeçalho, navegação, tabelas, modais e responsividade da página principal.
* `Cadastro.css`: Estilos específicos para o formulário de cadastro de usuários (fundo, layout do card, campos de entrada, validação e dropdown).
* `CadastroProd.css`: Estilos para o formulário de cadastro de produtos (grid do formulário, campos de entrada, upload de imagem customizado).
* `Historico.css`: Estilos para a tabela de histórico, cores para tipos de movimentação, e barra de pesquisa.
* `Grafico.css`: Estilos para o layout do dashboard de gráficos e estatísticas, cards de gráficos e estatísticas, e botão de relatório.

### Arquivos JSON

* `Produtos.Json`: Contém uma lista de produtos pré-definidos que podem ser carregados inicialmente no sistema para popular o estoque. Cada objeto de produto inclui detalhes como código, origem, descrição, preço, quantidade, etc.

## Dependências (Bibliotecas Externas)

O projeto utiliza as seguintes bibliotecas externas:

* **Bootstrap v5.3.6:** Framework CSS para componentes de UI e responsividade.
* **jQuery v3.7.1:** Biblioteca JavaScript para manipulação do DOM.
* **jQuery Mask Plugin v1.14.16:** Usado para aplicar máscaras de entrada em campos de formulário (ex: código de produto, NCM, preço).
* **SweetAlert2 v11:** Para exibir alertas e confirmações personalizadas e mais atraentes.
* **Chart.js:** Biblioteca JavaScript para criar gráficos interativos.
* **jsPDF v2.5.1:** Para gerar arquivos PDF no lado do cliente.
* **Font Awesome v4.7.0:** (Observado em `Login.html` e `Cadastro.html`) Para ícones, como o de visibilidade da senha.

## Como Usar/Executar o Projeto

1.  **Clone ou baixe** este repositório para o seu ambiente local.
2.  **Abra o arquivo `Login.html`** em seu navegador web preferido.
3.  Na tela de login, você pode:
    * **Cadastrar um novo usuário** clicando no link "Cadastre-se" para acessar `Cadastro.html`. Preencha os dados e escolha o setor.
    * **Fazer login** com um usuário existente (se houver no `localStorage` ou após cadastrar um).
4.  Após o login bem-sucedido, você será redirecionado para a página de Estoque (`Index.html`).
5.  Explore as diferentes funcionalidades:
    * **Estoque (`Index.html`):** Visualize, pesquise, edite (estoque e preço) e exclua produtos.
    * **Cadastro de Produtos (`CadastroProd.html`):** Adicione novos produtos ao estoque com todos os detalhes e imagem (depende do cargo).
    * **Histórico de Movimentações (`Historico.html`):** Consulte um registro detalhado de todas as operações de entrada, saída, alteração e exclusão.
    * **Gráficos e Dados (`Grafico.html`):** Veja estatísticas e gráficos visuais do seu estoque e gere relatórios em PDF.
6.  Para sair da conta, use o botão "Logout" presente nas páginas.
---