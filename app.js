const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get(['/', '/pag1'], async (req, res) => {
    res.render('pag1');
});

app.get('/pag2', async (req, res) => {
    res.render('pag2');
});

app.get('/pag3', async (req, res) => {
    res.render('pag3');
});

app.get('/pag4', async (req, res) => {
    res.render('pag4');
});

app.get('/pag5', async (req, res) => {
    res.render('pag1');
});

app.listen(3000);