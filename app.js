const express = require('express');
const session = require('express-session');
const hashedSecret = require('./crypto/config');
const router = require('./routes/users.js');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: hashedSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server listening http://localhost:${PORT}`)
});