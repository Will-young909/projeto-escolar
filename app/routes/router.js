const express = require('express');
const router = express.Router();
const session = require('express-session');
const { body, validationResult } = require("express-validator");


// Rota para receber e salvar conteúdos via POST
router.post('/api/conteudo', (req, res) => {
    const conteudosPath = path.join(__dirname, '../../conteudos.json');
    let lista = [];
    if (fs.existsSync(conteudosPath)) {
        try {
            lista = JSON.parse(fs.readFileSync(conteudosPath, 'utf8'));
        } catch (e) {
            lista = [];
        }
    }
    const novoConteudo = req.body;
    lista.push(novoConteudo);
    fs.writeFileSync(conteudosPath, JSON.stringify(lista, null, 2), 'utf8');
    res.status(201).json({ sucesso: true });
});

// Middleware para proteger rotas e redirecionar usuários logados
function ensureLoggedIn(req, res, next) {
    if (req.session && req.session.logado) {
        return res.redirect('/logado');
    }else if (req.session.colaborador) {
        return res.redirect('/colab_pag');
    }
    next();
}

// Página inicial pública, redireciona se já estiver logado
router.get('/', ensureLoggedIn, (req, res) => {
    res.render('pages/pag_inicial');
});

router.get('/login', (req, res) => {
    res.render('pages/login');
});

router.get('/register', (req, res) => {
    res.render('pages/register', {
        errorMessage: "",
        resultado: "",
    });
});

router.get('/forgot', (req, res) => {
    res.render('pages/forgot-password');
});

router.get('/colab_login', (req, res) => {
    res.render('pages/colab_login', {
        errorMessage: "",
        resultado: "",
    });
});

router.get('/conteudo', (req, res) => {
    res.render('pages/pag_conteudo', { valores: {}, erros: {}, sucesso: false, session: req.session });
});

router.post('/register', (req, res) => {
    const tipo = req.body.tipo;
    if (tipo === 'professor') {
        req.session.professor = true;
        res.redirect('/logado');
    } else {
        req.session.logado = true;
        res.redirect('/logado');
    }
});

// Exemplo de login (ajuste conforme seu sistema de autenticação)

router.post('/login', (req, res) => {
    // Aqui você faria a validação do login
    const tipo = req.body.tipo;
    if (tipo === 'professor') {
        req.session.professor = true;
        // Remove session.logado caso exista
        if (req.session.logado) delete req.session.logado;
        res.redirect('/logado');
    } else {
        req.session.logado = true;
        // Remove session.professor caso exista
        if (req.session.professor) delete req.session.professor;
        res.redirect('/logado');
    }
    // Se login inválido, renderize a página de login com erro
});

router.post('/colab_login', (req, res) => {
    // Aqui você faria a validação do login do colaborador
    req.session.colaborador = true;
    res.redirect('/colab_pag');
});


router.post('/forgot', (req, res) => {
    // Aqui você faria a validação do login
    req.session.logado = true;
    res.redirect('/logado');
});

router.post('/conteudo', (req, res) => {
    // Exemplo de validação simples
    let erros = {};
    let valores = req.body || {};
    if (!req.body.Assunto) erros.Assunto = 'Preencha o assunto.';
    if (!req.body.Titulo) erros.Titulo = 'Preencha o título.';
    if (!req.body.Explicacao) erros.Explicacao = 'Preencha a explicação.';
    if (!req.body.Exercicios) erros.Exercicios = 'Preencha os exercícios.';
    // ... outras validações ...
    if (Object.keys(erros).length > 0) {
        return res.render('pages/pag_conteudo', {
            erros: erros,
            valores: valores,
            sucesso: false,
            session: req.session
        });
    }
    // ... lógica de sucesso ...
    res.render('pages/pag_conteudo', { sucesso: true, erros: {}, valores: {}, session: req.session });
});


// Middleware para verificar se o usuário é aluno
function checkAluno(req, res, next) {
    if (!req.session.logado) {
        return res.redirect('/');
    }
    next();
}



// Middleware para verificar se o usuário é professor, aluno ou colaborador
function checkPerfil(req, res, next) {
    if (!req.session.professor && !req.session.logado && !req.session.colaborador) {
        return res.redirect('/');
    }
    next();
}

// Middleware para verificar se o usuário é colaborador
function checkColab(req, res, next) {
    if (!req.session.colaborador) {
        return res.redirect('/');
    }
    next();
}


router.get('/logado', (req, res) => {
    // Permite acesso tanto para aluno quanto para professor
    if (!req.session.logado && !req.session.professor) {
        return res.redirect('/');
    }
    res.render('pages/logado', { session: req.session });
});

router.get('/acess', (req, res) => {
    res.render('pages/acess_conte');
});

router.get('/colab_pag', checkColab, (req, res) => {
    res.render('pages/colab_pag', { session: req.session.colaborador });
});


router.get('/perfil', checkPerfil, (req, res) => {
    res.render('pages/perfil', { session: req.session });
});

// Rota para criar conteúdo colaborativo
router.post('/colab_pag', checkColab, (req, res) => {
    // Aqui você faria a lógica para criar o conteúdo colaborativo
    res.redirect('/colab_pag');
});

const fs = require('fs');
const path = require('path');

router.get('/ver', (req, res) => {
    const id = parseInt(req.query.id);
    // Simula leitura do localStorage: lê arquivo conteudos.json na raiz do projeto
    const conteudosPath = path.join(__dirname, '../../conteudos.json');
    let lista = [];
    if (fs.existsSync(conteudosPath)) {
        try {
            lista = JSON.parse(fs.readFileSync(conteudosPath, 'utf8'));
        } catch (e) {
            lista = [];
        }
    }
    const item = lista.find(c => c.id === id);
    if (!item) {
        return res.render('pages/ver_conteudo', { conteudo: null });
    }
    res.render('pages/ver_conteudo', { conteudo: item });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;