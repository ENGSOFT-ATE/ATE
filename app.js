const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// VARIÁVEIS GLOBAIS (SIMULANDO ARMAZENAMENTO)
let PROG_O;
let PROG_P;
let VARS_PROG_O;
let VARS_PROG_P;
let VALUE_VARS_PROG_P;
let VALUE_VARS_PROG_O;
let SUBCAMINHO_O;
let SUBCAMINHO_P;
let SUBCAMINHO_O_NOT;
let SUBCAMINHO_P_NOT;


app.get(['/', '/pag1'], function(req, res){
    res.render('pag1');
});

app.post(['/', '/pag1'], function(req, res){
    // PROGRAMAS O E P
    let prog_o = req.body.prog_o.split("\n");
    let prog_p = req.body.prog_p.split("\n");
    // VARS PROG O E PROG P
    let vars_prog_o = req.body.vars_prog_o.split(';');
    let vars_prog_p = req.body.vars_prog_p.split(';');

    // SIMULANDO ARMAZENAMENTO
    PROG_O = prog_o;
    PROG_P = prog_p;
    VARS_PROG_O = vars_prog_o;
    VARS_PROG_P = vars_prog_p;

    //ENVIANDO PARA O PASSO 2 AS VARIÁVEIS DO PROGRAMA
    res.render('../views/pag2', {
        vars_prog_o: vars_prog_o,
        vars_prog_p: vars_prog_p
    });
});


app.post('/pag2', function(req, res){
    // VALORES DAS VARIÁVEIS DE O E P
    let value_vars_prog_o = req.body.value_vars_prog_o;
    let value_vars_prog_p = req.body.value_vars_prog_p;

    // SIMULANDO ARMAZENAMENTO - LISTA COM VALORES INICIALIZADOS (CASO DE TESTE)
    VALUE_VARS_PROG_P = value_vars_prog_o;
    VALUE_VARS_PROG_O = value_vars_prog_p;

    // RENDERIZANDO PÁGINA 03: É necessário enviar para a view: Linhas do código e variáveis do código.
    res.render('pag3', {
        prog_o: PROG_O,
        prog_p: PROG_P,
        vars_prog_o: VARS_PROG_O,
        vars_prog_p: VARS_PROG_P
    });
});


app.post('/pag3', function(req, res){
    // INFORMAÇÕES VINDAS DO PASSO 3 (ARRAYS)
    let numero_linhas = req.body.numero_linhas;
    let equacoes = req.body.equacoes;
    let var_o = req.body.var_o;
    let var_p = req.body.var_p;
    let value_var_o = req.body.value_var_o;
    let value_var_p = req.body.value_var_p;

    // IMPRIMINDO AS LISTAS
    console.log(numero_linhas);
    console.log(equacoes);
    console.log(var_o);
    console.log(var_p);
    console.log(value_var_o);
    console.log(value_var_p);

    // RENDERIZANDO PÁGINA 4: NADA É NECESSÁRIO
    res.render('pag4');
});


app.post('/pag4', function(req, res){
    // SUBCAMINHOS e SUCAMINHOS COM NOTAÇÃO de O E P
    let subcaminho_o = req.body.subcaminho_o;
    let subcaminho_o_not = req.body.subcaminho_o_not;
    let subcaminho_p = req.body.subcaminho_p;
    let subcaminho_p_not = req.body.subcaminho_p_not;

    // SIMULANDO ARMAZENAMENTO
    SUBCAMINHO_O = subcaminho_o;
    SUBCAMINHO_P = subcaminho_p;
    SUBCAMINHO_O_NOT = subcaminho_o_not;
    SUBCAMINHO_P_NOT = subcaminho_p_not;
    
    // RENDERIZAR RESULTADOS NA PÁGINA 5
    res.render('pag5');
});


app.get('/pag5', function(req, res){
    res.render('pag5');
});


app.listen(3000);
console.log('Porta localhost:3000 ..');