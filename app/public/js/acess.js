const lista = document.getElementById('listaPostagens');
        const postagens = JSON.parse(localStorage.getItem('postagens')) || [];
        if (postagens.length === 0) {
            lista.innerHTML = '<p>Nenhuma postagem encontrada.</p>';
        } else {
            lista.innerHTML = postagens.map((p, i) => `
                <div class="postagem">
                    <h2>${p.titulo}</h2>
                    <p><strong>Assunto:</strong> ${p.assunto}</p>
                    <p><strong>Explicação:</strong> ${p.explicacao}</p>
                    <p><strong>Exercícios:</strong> ${Array.isArray(p.exercicios) ? p.exercicios.map((ex, idx) => `<br>${idx+1}. ${ex}`).join('') : p.exercicios}</p>
                    <p><em>${p.data}</em></p>
                </div>
                <hr>
            `).join('');
        }