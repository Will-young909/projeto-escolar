function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function register() {
let valid = true;

// Limpa mensagens e bordas anteriores
document.querySelectorAll('.erro-span').forEach(span => span.remove());
document.querySelectorAll('input').forEach(input => input.style.borderColor = '');

// Validação dos campos
const email = document.getElementById("email");
const psw = document.getElementById("psw");

if (!email.value) {
showError(email, "Preencha o e-mail.");
setErrorBorder(email);
valid = false;
} else if (!isEmail(email.value)) {
showError(email, "Digite um e-mail válido.");
setErrorBorder(email);
valid = false;
}
if (!psw.value) {
showError(psw, "Preencha a senha.");
setErrorBorder(psw);
valid = false; 
} 
return valid;
}

function showError(input, message) {
const span = document.createElement('span');
span.className = 'erro-span';
span.style.color = '#fff';
span.style.fontSize = '1.1em';
span.style.display = 'block';
span.style.marginTop = '0.1em'; // Menor espaço acima
span.style.marginBottom = '0.1em'; // Menor espaço abaixo
span.style.fontWeight = 'bold';
span.style.border = '2px solid #ee3737'; // Borda mais fina
span.style.borderRadius = '10px';
span.style.padding = '2px 8px'; // Mais horizontal, menos vertical
span.style.backgroundColor = '#ee3737'; // Fundo vermelho claro para destaque
span.textContent = message;
// Insere logo após o input, mas antes de qualquer outro elemento (ex: label)
if (input.nextElementSibling) {
input.parentNode.insertBefore(span, input.nextElementSibling);
} else {
input.parentNode.appendChild(span);
}
}

function setErrorBorder(input) {
input.style.borderColor = 'red';
}

function isEmail(email) {
// Regex simples para validação de e-mail
return /^\S+@\S+\.\S+$/.test(email);
}