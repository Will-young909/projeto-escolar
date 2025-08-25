const lista = JSON.parse(localStorage.getItem('conteudos')) || [];
    const container = document.getElementById('lista-cards');

    if (lista.length === 0) {
      container.innerHTML = "<p>Nenhum conteúdo publicado ainda.</p>";
    } else {
      lista.reverse().forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h2>${item.titulo}</h2>
          <p><strong>Assunto:</strong> ${item.assunto}</p>
          <p>${item.explicacao.substring(0, 100)}...</p>
          <a class="btn" href="/ver?id=${item.id}">Ver conteúdo</a>
        `;
        container.appendChild(card);
      });
    }