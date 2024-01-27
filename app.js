const express = require('express');
const session = require('express-session');
const hashedSecret = require('./crypto/config');
const router = require('./routes/users.js');
const { verifyToken } = require('./middlewares/authMiddleware.js');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router);
app.use('/logout', router);
app.use('/login', router);
app.use(verifyToken)
app.use('/dashboard', router);


app.use(
    session({
        secret: hashedSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.listen(PORT, () => {
    console.log(`Server listening http://localhost:${PORT}`)
});