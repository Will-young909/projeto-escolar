window.addEventListener('DOMContentLoaded', function() {
    // Captura do botão
    const botao = document.getElementById("btnAdicionar");

    // Adiciona a ação de clique
    botao.addEventListener("click", function(e) {
        e.preventDefault(); // Evita comportamento padrão

        // Cria novo input de Exercícios
        const form = botao.closest('form');
        const br = document.createElement('br');
        const idUnico = 'exercicio_' + Date.now();
        const label = document.createElement('label');
        label.textContent = 'Exercícios:';
        label.setAttribute('for', idUnico);
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'exercicios[]';
        input.id = idUnico;
        input.className = 'input-exercicio';

        // Insere antes do botão de adicionar
        form.insertBefore(label, botao);
        form.insertBefore(input, botao);
        form.insertBefore(br, botao);

        document.getElementById("mensagemResultado").innerText = "Pergunta adicionada!";
        
        // Também pode chamar funções ou atualizar o DOM
        console.log("Botão clicado!");
    });
});
// Função para validar o formulário
function validarFormulario() {
    // Limpa mensagens e bordas anteriores
    // Remove spans de erro do frontend e backend
    document.querySelectorAll('.erro-span, .erro').forEach(span => {
        if (span && span.parentNode) span.parentNode.removeChild(span);
    });
    document.querySelectorAll('input').forEach(input => input.style.borderColor = '');

    let valid = true;

    // Validação dos campos
    const assunto = document.getElementById("Assunto");
    const titulo = document.getElementById("Titulo");
    const explicacao = document.getElementById("Explicacao");
    // Valida campo principal de exercícios
    const exercicios = document.getElementById("Exercicios");
    if (!assunto.value.trim()) {
        showError(assunto, "Preencha o assunto.");
        setErrorBorder(assunto);
        valid = false;
    }
    if (!titulo.value.trim()) {
        showError(titulo, "Preencha o título.");
        setErrorBorder(titulo);
        valid = false;
    }
    if (!explicacao.value.trim()) {
        showError(explicacao, "Preencha a explicação.");
        setErrorBorder(explicacao);
        valid = false;
    }
    if (!exercicios.value.trim()) {
        showError(exercicios, "Preencha os exercícios.");
        setErrorBorder(exercicios);
        valid = false;
    }
    // Valida todos os inputs dinâmicos de exercícios
    const exerciciosDinamicos = document.querySelectorAll("input[name='exercicios[]']");
    exerciciosDinamicos.forEach(function(input) {
        if (!input.value.trim()) {
            showError(input, "Preencha o exercício.");
            setErrorBorder(input);
            valid = false;
        }
    });
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