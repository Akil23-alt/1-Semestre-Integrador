function entrar(tipo) {
  // O mesmo de sempre, mas agora com verificação de cargo/setor
  const tipoLower = tipo.toLowerCase();
  const usuario = document.querySelector(`#usuario${tipo}`);
  const userLabel = document.querySelector(`#userLabel${tipo}`);
  const senha = document.querySelector(`#senha${tipo}`);
  const senhaLabel = document.querySelector(`#senhaLabel${tipo}`);
  const msgError = document.querySelector(`#msgError${tipo}`);
  const setorSelect = document.querySelector(`#setor-${tipoLower}`); // Pega o dropdown do setor

  const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
  let userValid = null;
  let loginStatus = 'notFound'; 

  // Obra de arte
  for (const item of listaUser) {
    // Verifica primeiro se usuário e senha batem
    if (usuario.value === item.userCad && senha.value === item.senhaCad) {
      // Se baterem, verifica o cargo/setor
      if (setorSelect.value === item.CargoCad) {
        // SUCESSO: Tudo correto
        loginStatus = 'success';
        userValid = {
          nome: item.nomeCad,
          user: item.userCad,
          senha: item.senhaCad,
          Cargo: item.CargoCad
        };
        break; // Para o loop pois já encontrou o usuário correto
      } else {
        loginStatus = 'wrongRole';
        break; // Para o loop pois já encontrou o usuário, mas com erro de setor
      }
    }
  }

  // Age de acordo com o status do login
  if (loginStatus === 'success') {
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    localStorage.setItem('token', token);
    localStorage.setItem('userLogado', JSON.stringify(userValid));
    window.location.href = 'index.html';
  } else {
    // Se o login falhou, mostra o erro apropriado
    msgError.style.display = 'block';
    
    if (loginStatus === 'wrongRole') {
      msgError.innerHTML = 'Setor selecionado está incorreto para este usuário.';
    } else { 
      msgError.innerHTML = 'Usuário ou senha incorretos.';
      userLabel.style.color = 'red';
      usuario.style.borderColor = 'red';
      senhaLabel.style.color = 'red';
      senha.style.borderColor = 'red';
    }
    usuario.focus();
  }
}

// Ok o css era melhor que o JS, mas o JS é mais divertido (dor e sofrimento)
// Eu n sei oq vc fez mas funcionou, então evitei mexer muito
// Esse JS é pra fazer o login funcionar, esconder os cards e mostrar o card de login
// Também tem a parte de mostrar/esconder a senha com o ícone de olho
// E também tem a parte de centralizar o card de login na tela

document.addEventListener('DOMContentLoaded', () => {

  const allCards = document.querySelectorAll(".col-container");
  const loginButtons = document.querySelectorAll(".js-login-btn");
  const passwordToggles = document.querySelectorAll('.password-toggle-icon');

  loginButtons.forEach(button => {
    button.addEventListener('click', handleLoginClick);
  });

  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', handlePasswordToggle);
  });

  function handleLoginClick(event) {
    const cardSelecionado = event.target.closest(".col-container");
    if (!cardSelecionado) return;

    const rect = cardSelecionado.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + 70;

    const currentX = rect.left + rect.width / 2;
    const currentY = rect.top + rect.height / 2;

    const deltaX = centerX - currentX;
    const deltaY = centerY - currentY;

    allCards.forEach(card => {
      if (card !== cardSelecionado) {
        card.style.transition = "opacity 0.4s ease";
        card.style.opacity = "0";
        setTimeout(() => card.style.display = "none", 400);
      }
    });

    const sobre = cardSelecionado.querySelector(".sobre");
    const login = cardSelecionado.querySelector(".login");
    if (sobre) sobre.style.display = "none";
    if (login) login.style.display = "block";

    cardSelecionado.style.transition = "transform 0.6s ease-in-out";
    cardSelecionado.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    cardSelecionado.classList.add("fixo");
  }

  function handlePasswordToggle(event) {
    const icon = event.target;
    const passwordInput = icon.closest('.label-float').querySelector('.password-input');

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }
});