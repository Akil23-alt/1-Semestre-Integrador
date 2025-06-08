if (localStorage.getItem("token") == null) {
  alert("Você precisa estar logado para acessar essa página");
  window.location.href = "/Login.html";
}

const userLogado = JSON.parse(localStorage.getItem("userLogado"));

const logado = document.querySelector("#logado");




// Função pra sair da conta
function Sair() {
  localStorage.removeItem("token");
  localStorage.removeItem("userLogado");
  window.location.href = "/Login.html";
}