let btn = document.querySelector('#botao_login')

btn.addEventListener('click', () => {
  let inputSenha = document.querySelector('#senha')
  inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password'
})

function entrar() {
  let usuario = document.querySelector('#usuario')
  let userLabel = document.querySelector('#userLabel')

  let senha = document.querySelector('#senha')
  let senhaLabel = document.querySelector('#senhaLabel')

  let msgError = document.querySelector('#msgError')

  let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]')

  let userValid = {
    nome: '',
    user: '',
    senha: '',
    Cargo: '' 
  }

  listaUser.forEach((item) => {
    if (usuario.value === item.userCad && senha.value === item.senhaCad) {
      userValid = {
        nome: item.nomeCad,
        user: item.userCad,
        senha: item.senhaCad,
        Cargo: item.CargoCad
      }
    }
  })

  if (usuario.value === userValid.user && senha.value === userValid.senha) {
    let token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)

    localStorage.setItem('token', token)
    localStorage.setItem('userLogado', JSON.stringify(userValid))

    window.location.href = '/Index.html'
  } else {
    userLabel.style.color = 'red'
    usuario.style.borderColor = 'red'
    senhaLabel.style.color = 'red'
    senha.style.borderColor = 'red'
    msgError.style.display = 'block'
    msgError.innerHTML = 'Usuário ou senha incorretos'
    usuario.focus()
  }
}