const express = require('express');
const router = express.Router();
const users = require('../data/users');
const session = require('express-session');
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');


router.get('/', (req, res) => {
    if(!req.session.token) {
        const loginForm = `
        <form action='/login' method='post'>
            <label for='username'>Usuario:</label>
            <input type='text' id='username' name='username' required />
            <label for='password'>Contraseña:</label>
            <input type='password' id='password' name='password' required />
    
            <button type='submit'>Iniciar sesión</button>
        </form>
        `;
        res.send(loginForm)
    } else {
        res.send(`
        <a href='/dashboard'>Dashboard</a>
        <form action='/logout' method='post'>
            <button type='submit'>Cerrar sesión</button>
        </form>
        `)
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (user) => user.username === username && user.password === password
    );
    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ message: 'Unathorized!' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/dashboard', verifyToken, (req, res) => {
    const id = req.user;
    const user = users.find(user => user.id === id);
    if (user) {
    res.send(`
        <h1>Bienvenido ${user.name}!!</h1>
        <p>${user.id}</p>
        <p>${user.username}</p>
        <a href='/'>Home</a>
        <form action='/logout' method='post'>
            <button type='submit'>Cerrar sesión</button>
        </form>
    `);
    } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }
});

module.exports = router;