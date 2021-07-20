const express = require('express');
const { request } = require('http');
const mysql = require('mysql');
const { resolve } = require('path');
const app = express();
const path = require('path');
const dbConn = require('./bin/db')


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// VARIÁVEIS GLOBAIS (SIMULANDO ARMAZENAMENTO)
let PROGRAM = {}
PROGRAM.PROG_O = "";            // Programa O
PROGRAM.PROG_P = "";            // Programa P
PROGRAM.VARS_PROG_O = "";       // Variáveis de O
PROGRAM.VARS_PROG_P = "";       // Variáveis de P
PROGRAM.SUBCAMINHO_O = "";      // Subcaminho de O
PROGRAM.SUBCAMINHO_P = "";      // Subcaminho de P
PROGRAM.SUBCAMINHO_O_NOT = "";  // Subcaminho de O [EM NOTAÇÃO: (n, (m, k), bool, var) ] 
PROGRAM.SUBCAMINHO_P_NOT = "";  // Subcaminho de P [EM NOTAÇÃO: (n, (m, k), bool, var) ] 

PROGRAM.VALUE_VARS_PROG_P = []; // Valores Teste de Mesa de O
PROGRAM.VALUE_VARS_PROG_O = []; // Valores Teste de Mesa de P

PROGRAM.TESTE_TM = [];          // Tabela TESTE_TM, MATRIZ: [ [num_linha, num_equacao, var_de_o, value, var_de_p, value], ...]


function calc_p (results){

    let line_o = {}
    let line_p = {}
    let total_o  = 0
    let total_p  = 0
    for (let i = 0; i < results.length; i++) {
        line_o[results[i].linha] = isNaN(parseInt(line_o[results[i].linha])) ? 0 : line_o[results[i].linha];
        line_p[results[i].linha] = isNaN(parseInt(line_p[results[i].linha])) ? 0 : line_p[results[i].linha];
        if (results[i].equacao === '2'){
            line_o[results[i].linha] += parseInt(results[i].value_var_o, 16);
            line_p[results[i].linha] += parseInt(results[i].value_var_p, 16);
            total_o += parseInt(results[i].value_var_o, 16);
            total_p += parseInt(results[i].value_var_p, 16);
        }
    }
    return [line_o, line_p,[total_o.toString(16),total_p.toString(16)]]

}

function calc_v (results){
    let total_o = 0;    
    let total_p = 0;
    for (let i = 0; i < results.length; i++) {
        if (results[i].equacao === '3'){ 
            total_o += parseInt(results[i].value_var_o, 16);
            total_p += parseInt(results[i].value_var_p, 16);
        }
    }
    return [total_o.toString(16), total_p.toString(16)];
}


app.get('/', function(req, res){
    res.render('index');
});



app.get('/conf', function(req, res){
    console.log("PASSOU NO GET DE PAG1!");

     // LIMPANDO VETOR DE PAG2 (CASO CLIQUE NO BOTÃO DE VOLTAR)
     PROGRAM.VALUE_VARS_PROG_O = [];
     PROGRAM.VALUE_VARS_PROG_P = [];

    res.render('conf', {
        program: PROGRAM,
    });
});




app.post('/testcase', function(req, res){
    // PROGRAMAS O E P
    // VARS PROG O E PROG P
    // SUBCAMINHOS e SUBCAMINHOS COM NOTAÇÃO de O E P
 

    let {prog_o, prog_p,vars_prog_o,vars_prog_p,subcaminho_o,subcaminho_o_not,subcaminho_p,subcaminho_p_not} = req.body;

    // SIMULANDO ARMAZENAMENTO
    PROGRAM.PROG_O = prog_o;
    PROGRAM.PROG_P = prog_p;
    PROGRAM.VARS_PROG_O = vars_prog_o;
    PROGRAM.VARS_PROG_P = vars_prog_p;
    PROGRAM.SUBCAMINHO_O = subcaminho_o;
    PROGRAM.SUBCAMINHO_P = subcaminho_p;
    PROGRAM.SUBCAMINHO_O_NOT = subcaminho_o_not;
    PROGRAM.SUBCAMINHO_P_NOT = subcaminho_p_not;

    // IMPRIMINDO
    console.log(prog_o);
    console.log(prog_p);
    console.log(vars_prog_o);
    console.log(vars_prog_p);
    console.log(subcaminho_o);
    console.log(subcaminho_p);
    console.log(subcaminho_o_not);
    console.log(subcaminho_p_not);

    res.render('testcase', {
        program: PROGRAM,
    });
});

app.get('/testcase', function(req, res){
    console.log("PASSOU NO GET DE CASO DE TESTE!");

    // LIMPANDO A TABELA TM (CASO CLIQUE NO BOTÃO DE VOLTAR NA PAG3)
    PROGRAM.TESTE_TM = []; 
    res.render('testcase', {
        program: PROGRAM,
    });
});


// app.get('/metodop-uso', function(req, res){
//     // const {id_programa} = req.body;
//     id_programa = 1

//     dbConn.query("SELECT * FROM dados_tm WHERE num_equacao = '3' and idpuso = ?", {idpuso: id_programa}, (error, results) => {
//         if (error){
//             console.log(error);
//         }
//         else {
//             calc_p(results);
//             // console.log(results);
//             // console.log(results[1].linha);
//             // return res.json(results);
//             return res.json(calc_p(results));
//             // return results;
//         }
//     })
// })


app.post('/tabletest', function(req, res){
    // VALORES DAS VARIÁVEIS DE O E P
    let value_vars_prog_o = req.body.value_vars_prog_o; // ARRAY
    let value_vars_prog_p = req.body.value_vars_prog_p; // ARRAY

    // SIMULANDO ARMAZENAMENTO - LISTA COM VALORES INICIALIZADOS (CASO DE TESTE)
    PROGRAM.VALUE_VARS_PROG_O = value_vars_prog_o;
    PROGRAM.VALUE_VARS_PROG_P = value_vars_prog_p;

    // IMPRIMINDO
    console.log(value_vars_prog_o);
    console.log(value_vars_prog_p);

    res.render('tabletest', {
        program: PROGRAM,
    });
});

app.get('/tabletest', function(req, res){
    console.log("PASSOU NO GET DE TABLETEST!");
    res.render('tabletest', {
        program: PROGRAM,
    });
});




app.post('/result', function(req, res){
    // INFORMAÇÕES DO PASSO 3 (TODOS ARRAYS)
    PROGRAM.TESTE_TM = []

    /*
    VARIÁVEIS DA OUTRA TABELA EM req.body:
    
    numero_linhas_PROPCONST: numero_linhas_PROPCONST, 
    equacoes_PROPCONST: equacoes_PROPCONST,
    tipo_o_PROPCONST: tipo_o_PROPCONST,
    value_var_o_PROPCONST: value_var_o_PROPCONST, 
    tipo_p_PROPCONST: tipo_p_PROPCONST,
    value_var_p_PROPCONST: value_var_p_PROPCONST,
    */

    let {numero_linhas, equacoes, var_o, value_var_o, var_p, value_var_p} = req.body;

    // ARMAZENANDO EM TESTE_TM (MATRIZ)
    if (numero_linhas.length < 2){
        PROGRAM.TESTE_TM.push({
            linha: numero_linhas,
            equacao: equacoes,
            var_o: var_o,
            value_var_o: value_var_o, 
            var_p: var_p, 
            value_var_p: value_var_p,
        });
    }
    else {
        for(var i = 0; i < numero_linhas.length; i++) {
            PROGRAM.TESTE_TM.push({
                linha: numero_linhas[i],
                equacao: equacoes[i],
                var_o: var_o[i],
                value_var_o: value_var_o[i], 
                var_p: var_p[i], 
                value_var_p: value_var_p[i],
        });
        }
    }
    
    let [line_o, line_p, hexa_p_results] = calc_p(PROGRAM.TESTE_TM);
    let hexa_v_results = calc_v(PROGRAM.TESTE_TM);  

    console.log("resultados v_var", hexa_v_results);


// console.log(req.body);



/**
 * FALTA FAZER O INSERT DA TABELA DADOS_TM :
 * 1. PRECISA DO RESULTADO DO MÉTODO C-USO hexa do programa O e do programa P
 * 2. PRECISA DO RESULTADO DO MÉTODO VAR hexa   
 */
/*
const dados_tm = 'INSERT INTO dados_tm (linha,num_equacao,variavel_o,puso_hexa_o,puso_hexa_p,variavel_p,cuso_hexa_o, cuso_hexa_p,dado_hexa_var) VALUES ?'


dbConn.query(dados_tm,[,PROGRAM.VARS_PROG_O,PROGRAM.VARS_PROG_P],(error,results)=>{
         if(error){
             console.log(error);
         }else{
             console.log(PROGRAM.SUBCAMINHO_P);
             console.log(PROGRAM.SUBCAMINHO_O)
         }
})*/



const caminho = 'INSERT INTO caminho (def_usoO,def_usoP,subcaminhoO,subcaminhoP) VALUES ?'


dbConn.query(caminho,[PROGRAM.SUBCAMINHO_O_NOT,PROGRAM.SUBCAMINHO_P_NOT,PROGRAM.SUBCAMINHO_O,PROGRAM.SUBCAMINHO_P],(error,results)=>{
         if(error){
             console.log(error);
         }else{
             console.log(PROGRAM.SUBCAMINHO_P);
             console.log(PROGRAM.SUBCAMINHO_O)
         }
})


const programaO = 'INSERT INTO programaO (codigo_o) VALUES ?'


dbConn.query(programaO,[PROGRAM.PROG_O],(error,results)=>{
         if(error){
             console.log(error);
         }else{
             console.log(results);
         }
})


const programaP = 'INSERT INTO programaP (codigo_p) VALUES ?'


dbConn.query(programaP,[PROGRAM.PROG_P],(error,results)=>{
         if(error){
             console.log(error);
         }else{
             console.log(results);
         }
})

const insert_p_uso = 'INSERT INTO m_p_uso (dt_teste_puso,dt_teste_pusp) VALUES ?'

    dbConn.query(insert_p_uso, [hexa_p_results[0],hexa_p_results[1]],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            console.log(line_o);
            console.log(line_p);
            console.log(hexa_p_results);
        }
    })

    

    // IMPRIMINDO AS LISTAS
    //console.log(PROGRAM.TESTE_TM);

    /**************************************************************************************************** 
     NESSE MOMENTO (ANTES DE RENDERIZAR RESULT) ARMAZENA-SE TODOS OS DADOS DE PROGRAM EM BANCO DE DADOS.

     Os dados estão em strings, listas e matrizes. Quem tiver com a parte de banco de dados deve tratar
     essas informações da melhor maneira a serem inseridas no banco. 
    ****************************************************************************************************/
});



app.listen(3000);
console.log('Porta localhost:3000 ..');
