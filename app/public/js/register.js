function register() {
    let valid = true;

    // Limpa mensagens e bordas anteriores
    document.querySelectorAll('.erro-span').forEach(span => span.remove());
    document.querySelectorAll('input, select').forEach(input => input.style.borderColor = '');

    // Validação dos campos
    const tipo = document.getElementById("tipo");
    const email = document.getElementById("email");
    const usuario = document.getElementById("usuario");
    const senha = document.getElementById("senha");
    const confirmar_senha = document.getElementById("confirmar_senha");

    if (!tipo.value) {
        showError(tipo, "Selecione se você é Aluno ou Professor.");
        setErrorBorder(tipo);
        valid = false;
    }
    if (!email.value) {
        showError(email, "Preencha o e-mail.");
        setErrorBorder(email);
        valid = false;
    } else if (!isEmail(email.value)) {
        showError(email, "Digite um e-mail válido.");
        setErrorBorder(email);
        valid = false;
    }
    if (!usuario.value) {
        showError(usuario, "Preencha o nome de usuário.");
        setErrorBorder(usuario);
        valid = false;
    }
    if (!senha.value) {
        showError(senha, "Preencha a senha.");
        setErrorBorder(senha);
        valid = false;
    }
    if (!confirmar_senha.value) {
        showError(confirmar_senha, "Confirme a senha.");
        setErrorBorder(confirmar_senha);
        valid = false;
    }
    if (senha.value && confirmar_senha.value && senha.value !== confirmar_senha.value) {
        showError(confirmar_senha, "As senhas não coincidem.");
        setErrorBorder(confirmar_senha);
        valid = false;
    }

    return valid;
}

function showError(input, message) {
    const span = document.createElement('span');
    span.className = 'erro-span';
    span.style.color = '#fff';
    span.style.fontSize = '1.1em';
    span.style.display = 'block'; // Garante que o span seja exibido como bloco
    span.style.marginTop = '0.5em'; // Adiciona um espaço acima do span
    span.style.fontWeight = 'bold'; // Deixa o texto em negrito
    span.style.border = '5px solid #ee3737'; // Adiciona uma borda vermelha ao span
    span.style.borderRadius = '20px'; // Adiciona borda arredondada
    span.style.padding = '2.5px'; // Adiciona um pouco de espaço interno
    span.style.backgroundColor = '#ee3737'; // Fundo vermelho claro para destaque
    span.textContent = message;
    input.parentNode.insertBefore(span, input.nextSibling);
}

function setErrorBorder(input) {
    input.style.borderColor = 'red';
}

function isEmail(email) {
    // Regex simples para validação de e-mail
    return /^\S+@\S+\.\S+$/.test(email);
}