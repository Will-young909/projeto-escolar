let exercicioId = 0;

function adicionarExercicio() {
  const container = document.getElementById('Exercicios');
  const div = document.createElement('div');
  div.className = 'exercicio';
  div.innerHTML = `
    <input type="text" placeholder="Pergunta" class="pergunta">
    <input type="text" placeholder="URL da imagem (opcional)" class="imagem">
    <select class="tipo" onchange="atualizarTipo(this)">
      <option value="">...</option>
      <option value="alternativa">Alternativa</option>
      <option value="escrita">Resposta escrita</option>
    </select>
    <div class="alternativas" style="display:none">
      <p>Alternativas:</p>
      <div class="lista-alternativas"></div>
      <button type="button" onclick="adicionarAlternativa(this)">+ Alternativa</button>
    </div>
    <div class="correcao-container" style="display:none">
      <input type="text" placeholder="Resposta correta" class="correcao">
    </div>
  `;
  container.appendChild(div);
}


function atualizarTipo(select) {
  const alternativasDiv = select.parentElement.querySelector('.alternativas');
  const correcaoDiv = select.parentElement.querySelector('.correcao-container');
  if (select.value === 'alternativa') {
    alternativasDiv.style.display = 'block';
    correcaoDiv.style.display = 'none';
    alternativasDiv.querySelector('.lista-alternativas').innerHTML = '';
  } else if (select.value === 'escrita') {
    alternativasDiv.style.display = 'none';
    correcaoDiv.style.display = 'block';
  } else {
    alternativasDiv.style.display = 'none';
    correcaoDiv.style.display = 'none';
  }
}



function adicionarAlternativa(btn) {
  const container = btn.parentElement.querySelector('.lista-alternativas');
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.innerHTML = `
    <input type="text" class="alternativa" placeholder="Texto da alternativa">
    <input type="radio" name="correta-${exercicioId}" class="correta" style="margin-left:8px;"> <span style="font-size:0.95em; color:#333; margin-left:2px;">Correta</span>
  `;
  container.appendChild(div);
}



document.getElementById('form-conteudo').addEventListener('submit', function(e) {
  e.preventDefault();
  // Limpa mensagens e bordas anteriores
  document.querySelectorAll('.erro-span').forEach(span => span.remove());
  document.querySelectorAll('input, select').forEach(input => input.style.borderColor = '');

  let valid = true;

  // Validação dos campos principais
  const titulo = document.getElementById('Titulo');
  const assunto = document.getElementById('Assunto');
  const explicacao = document.getElementById('Explicacao');
  if (!titulo.value.trim()) {
    showErrorArea('erro-titulo', 'Preencha o título.');
    setErrorBorder(titulo);
    valid = false;
  }
  if (!assunto.value.trim()) {
    showErrorArea('erro-assunto', 'Preencha o assunto.');
    setErrorBorder(assunto);
    valid = false;
  }
  if (!explicacao.value.trim()) {
    showErrorArea('erro-explicacao', 'Preencha a explicação.');
    setErrorBorder(explicacao);
    valid = false;
  }
function showErrorArea(areaId, message) {
  const area = document.getElementById(areaId);
  if (area) area.textContent = message;
}

  // Validação dos exercícios
  const exerciciosDivs = Array.from(document.querySelectorAll('.exercicio'));
  if (exerciciosDivs.length === 0) {
    const exerciciosContainer = document.getElementById('Exercicios');
    showError(exerciciosContainer, 'Adicione pelo menos um exercício.');
    setErrorBorder(exerciciosContainer);
    valid = false;
  }

  const exercicios = exerciciosDivs.map((ex, idx) => {
    const pergunta = ex.querySelector('.pergunta');
    const imagem = ex.querySelector('.imagem');
    const tipo = ex.querySelector('.tipo');
    let alternativas = [];
    let correcao = '';

    if (!pergunta.value.trim()) {
      showError(pergunta, `Preencha a pergunta do exercício ${idx + 1}.`);
      setErrorBorder(pergunta);
      valid = false;
    }

    if (tipo.value === '') {
      showError(tipo, `Selecione o tipo do exercício ${idx + 1}.`);
      setErrorBorder(tipo);
      valid = false;
    }

    if (tipo.value === 'alternativa') {
      alternativas = Array.from(ex.querySelectorAll('.alternativa')).map(a => a.value);
      const corretaRadios = Array.from(ex.querySelectorAll('.correta'));
      const corretaIndex = corretaRadios.findIndex(c => c.checked);
      if (alternativas.length === 0 || alternativas.some(a => !a.trim())) {
        showError(ex.querySelector('.lista-alternativas'), `Preencha todas as alternativas do exercício ${idx + 1}.`);
        valid = false;
      }
      if (corretaIndex === -1 || !alternativas[corretaIndex]) {
        showError(ex.querySelector('.lista-alternativas'), `Selecione uma alternativa correta no exercício ${idx + 1}.`);
        valid = false;
      } else {
        correcao = alternativas[corretaIndex];
      }
    } else if (tipo.value === 'escrita') {
      const correcaoInput = ex.querySelector('.correcao');
      if (!correcaoInput || !correcaoInput.value.trim()) {
        showError(correcaoInput, `Preencha a resposta correta do exercício ${idx + 1}.`);
        setErrorBorder(correcaoInput);
        valid = false;
      } else {
        correcao = correcaoInput.value.trim();
      }
    }

    return {
      pergunta: pergunta.value,
      imagem: imagem.value,
      tipo: tipo.value,
      alternativas,
      correcao
    };
  });

  if (!valid) return;

  const conteudo = {
    id: Date.now(),
    titulo: titulo.value,
    assunto: assunto.value,
    explicacao: explicacao.value,
    exercicios
  };

  const lista = JSON.parse(localStorage.getItem('conteudos')) || [];
  lista.push(conteudo);
  localStorage.setItem('conteudos', JSON.stringify(lista));

  // Envia para o backend
  fetch('/api/conteudo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(conteudo)
  })
  .then(response => {
    window.location.href = '/acess';
  })
  .catch(() => {
    // Mesmo se der erro, redireciona para não travar o usuário
    window.location.href = '/acess';
  });
});

function showError(input, message) {
  const span = document.createElement('span');
  span.className = 'erro-span';
  span.style.color = '#fff';
  span.style.fontSize = '1.1em';
  span.style.display = 'block';
  //span.style.marginTop = '0.5em';
  span.style.marginBottom = '2.2em'; // Espaço maior abaixo da mensagem de erro
  span.style.fontWeight = 'bold';
  span.style.border = '5px solid #ee3737';
  span.style.borderRadius = '20px';
  //span.style.padding = '2.5px';
  span.style.backgroundColor = '#ee3737';
  span.textContent = message;
  if (input) input.parentNode.insertBefore(span, input.nextSibling);
}

function setErrorBorder(input) {
  if (input) input.style.borderColor = 'red';
}
// Função para validar o formulário
function validarFormulario() {
    // Limpa mensagens e bordas anteriores
    document.querySelectorAll('.erro-span, .erro').forEach(span => {
        if (span && span.parentNode) span.parentNode.removeChild(span);
    });
    document.querySelectorAll('input').forEach(input => input.style.borderColor = '');

    let valid = true;

    // Validação dos campos
    const assunto = document.getElementById("Assunto");
    const titulo = document.getElementById("Titulo");
    const explicacao = document.getElementById("Explicacao");
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
    if (!valid) return false;

    // Coleta todos os exercícios em um array
    let listaExercicios = [exercicios.value];
    exerciciosDinamicos.forEach(function(input) {
        listaExercicios.push(input.value);
    });

    // Cria objeto da postagem
    const novaPostagem = {
        assunto: assunto.value,
        titulo: titulo.value,
        explicacao: explicacao.value,
        exercicios: listaExercicios,
        data: new Date().toLocaleString()
    };

    // Recupera postagens existentes
    let postagens = JSON.parse(localStorage.getItem('postagens')) || [];
    postagens.push(novaPostagem);

    // Salva de volta
    localStorage.setItem('postagens', JSON.stringify(postagens));

    // Redireciona para /acess
    window.location.href = '/acess';

    // Impede envio do formulário para o backend
    return false;
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