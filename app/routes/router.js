const express = require('express');
const router = express.Router();
const session = require('express-session');
const { body, validationResult } = require("express-validator");

// Middleware para proteger rotas e redirecionar usuários logados
function ensureLoggedIn(req, res, next) {
    if (req.session && req.session.logado) {
        return res.redirect('/logado');
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
    req.session.logado = true;
    res.redirect('/logado');
});

// Exemplo de login (ajuste conforme seu sistema de autenticação)
router.post('/login', (req, res) => {
    // Aqui você faria a validação do login
    // Se login OK:
    req.session.logado = true;
    res.redirect('/logado');
    // Se login inválido, renderize a página de login com erro
});

router.post('/colab_login', (req, res) => {
    // Aqui você faria a validação do login do colaborador
    req.session.logado = true;
    res.redirect('/logado');
});

router.post('/login', (req, res) => {
    // Aqui você faria a validação do login
    req.session.logado = true;
    res.redirect('/logado');
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

// Middleware para verificar se o usuário está logado
function checkLogin(req, res, next) {
    if (!req.session.logado) {
        return res.redirect('/');
    }
    next();
}
// Middleware para verificar se o usuário é um colaborador
function checkColab(req, res, next) {
    if (!req.session.colaborador) {
        return res.redirect('/');
    }
    next();
}

router.get('/logado', (req, res) => {
    res.render('pages/logado');
});

router.get('/acess', (req, res) => {
    res.render('pages/acess_cont');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;