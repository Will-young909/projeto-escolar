const express = require('express');
const router = express.Router();
const session = require('express-session');
const { body, validationResult } = require("express-validator");

// Middleware para proteger rotas e redirecionar usuários logados
function ensureLoggedIn(req, res, next) {
    let = req.session;
    let = req.session.logado;
    if (req.session && req.session.logado) {
        return res.redirect('/logado');
    }
    next();
}

// Página inicial pública, redireciona se já estiver logado
router.get('/', ensureLoggedIn, (req, res) => {
    res.render('pages/pag_inicial', {
        errorMessage: "",
        resultado: "",
    });
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
    res.render('pages/colab_login');
});

router.get('/conteudo', (req, res) => {
    res.render('pages/pag_conteudo');
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

// Página inicial do usuário logado
router.get('/logado', (req, res) => {
    res.render('pages/logado');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;