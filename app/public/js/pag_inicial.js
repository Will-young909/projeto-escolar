function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function register() {
    let valid = true;

    // Limpa mensagens e bordas anteriores
    document.querySelectorAll('.erro-area').forEach(div => div.textContent = '');
    document.querySelectorAll('input, select').forEach(input => input.style.borderColor = '');

    // Validação dos campos
    const email = document.getElementById("email");
    const psw = document.getElementById("psw");
    const tipo = document.getElementById("tipo");

    if (!email.value) {
        showErrorArea('erro-email', "Preencha o e-mail.");
        setErrorBorder(email);
        valid = false;
    } else if (!isEmail(email.value)) {
        showErrorArea('erro-email', "Digite um e-mail válido.");
        setErrorBorder(email);
        valid = false;
    }
    if (!psw.value) {
        showErrorArea('erro-psw', "Preencha a senha.");
        setErrorBorder(psw);
        valid = false; 
    }
    if (!tipo.value) {
        showErrorArea('erro-tipo', "Selecione se você é Aluno ou Professor.");
        setErrorBorder(tipo);
        valid = false;
    }
    return valid;
}


function showErrorArea(areaId, message) {
    const area = document.getElementById(areaId);
    if (area) area.textContent = message;
}

function setErrorBorder(input) {
input.style.borderColor = 'red';
}

function isEmail(email) {
// Regex simples para validação de e-mail
return /^\S+@\S+\.\S+$/.test(email);
}