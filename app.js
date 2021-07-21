const express = require("express");
const { request } = require("http");
const mysql = require("mysql");
const { resolve } = require("path");
const app = express();
const path = require("path");
const dbConn = require("./bin/db");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// VARIÁVEIS GLOBAIS (SIMULANDO ARMAZENAMENTO)
let PROGRAM = {};
PROGRAM.PROG_O = ""; // Programa O
PROGRAM.PROG_P = ""; // Programa P
PROGRAM.VARS_PROG_O = ""; // Variáveis de O
PROGRAM.VARS_PROG_P = ""; // Variáveis de P
PROGRAM.SUBCAMINHO_O = ""; // Subcaminho de O
PROGRAM.SUBCAMINHO_P = ""; // Subcaminho de P
PROGRAM.SUBCAMINHO_O_NOT = ""; // Subcaminho de O [EM NOTAÇÃO: (n, (m, k), bool, var) ]
PROGRAM.SUBCAMINHO_P_NOT = ""; // Subcaminho de P [EM NOTAÇÃO: (n, (m, k), bool, var) ]

PROGRAM.VALUE_VARS_PROG_P = []; // Valores Teste de Mesa de O
PROGRAM.VALUE_VARS_PROG_O = []; // Valores Teste de Mesa de P

PROGRAM.TESTE_TM = []; // Tabela TESTE_TM, MATRIZ: [ [num_linha, num_equacao, var_de_o, value, var_de_p, value], ...]
let size = 0; // Maior Quantidade de Linhas entre os dois programas

function convert_arr_16(arr_convert) {
  for (let i = 0; i < arr_convert.length; i++) {
    arr_convert[i] = arr_convert[i].toString(16);
  }
  return arr_convert;
}

function calc_c(results, resultsP) {
  let line_o = Array(size).fill(0);
  let line_p = Array(size).fill(0);
  let total_o = 0;
  let total_p = 0;
  let o = 0;
  let p = 0;
  for (let i = 0; i < results.length; i++) {
    if (results[i].equacao === "1") {
      o = isNaN(parseInt(results[i].value_var_o, 16))
        ? 0
        : parseInt(results[i].value_var_o, 16);
      p = isNaN(parseInt(results[i].value_var_p, 16))
        ? 0
        : parseInt(results[i].value_var_p, 16);
      line_o[parseInt(results[i].linha)] += o;
      line_p[parseInt(results[i].linha)] += p;
      total_o += o;
      total_p += p;
    }
  }
  for (let i = 0; i < resultsP.length; i++) {
    if (
      resultsP[i].equacao === "1" &&
      resultsP.value_var_o !== "0" &&
      resultsP.value_var_p !== "0"
    ) {
      o = isNaN(parseInt(resultsP[i].value_var_o, 16))
        ? 0
        : parseInt(resultsP[i].value_var_o, 16);
      p = isNaN(parseInt(resultsP[i].value_var_p, 16))
        ? 0
        : parseInt(resultsP[i].value_var_p, 16);
      line_o[parseInt(resultsP[i].linha)] += o;
      line_p[parseInt(resultsP[i].linha)] += p;
      total_o += o;
      total_p += p;
    }
  }
  line_o = convert_arr_16(line_o);
  line_p = convert_arr_16(line_p);
  return [line_o, line_p, [total_o.toString(16), total_p.toString(16)]];
}

function calc_p(results, resultsP) {
  let line_o = Array(size).fill(0);
  let line_p = Array(size).fill(0);
  let total_o = 0;
  let total_p = 0;
  let o = 0;
  let p = 0;
  for (let i = 0; i < results.length; i++) {
    if (results[i].equacao === "2") {
      o = isNaN(parseInt(results[i].value_var_o, 16))
        ? 0
        : parseInt(results[i].value_var_o, 16);
      p = isNaN(parseInt(results[i].value_var_p, 16))
        ? 0
        : parseInt(results[i].value_var_p, 16);
      // console.log(o, p);
      line_o[parseInt(results[i].linha)] += o;
      line_p[parseInt(results[i].linha)] += p;
      total_o += o;
      total_p += p;
    }
  }
  for (let i = 0; i < resultsP.length; i++) {
    if (
      resultsP[i].equacao === "2" &&
      resultsP.value_var_o !== "3" &&
      resultsP.value_var_p !== "3"
    ) {
      o = isNaN(parseInt(resultsP[i].value_var_o, 16))
        ? 0
        : parseInt(resultsP[i].value_var_o, 16);
      p = isNaN(parseInt(resultsP[i].value_var_p, 16))
        ? 0
        : parseInt(resultsP[i].value_var_p, 16);
      line_o[parseInt(resultsP[i].linha)] += o;
      line_p[parseInt(resultsP[i].linha)] += p;
      total_o += o;
      total_p += p;
    }
  }
  line_o = convert_arr_16(line_o);
  line_p = convert_arr_16(line_p);
  return [line_o, line_p, [total_o.toString(16), total_p.toString(16)]];
}

function calc_v(results) {
  let total_o = 0;
  let total_p = 0;
  for (let i = 0; i < results.length; i++) {
    if (results[i].equacao === "3") {
      total_o += parseInt(results[i].value_var_o, 16);
      total_p += parseInt(results[i].value_var_p, 16);
    }
  }
  return [total_o.toString(16), total_p.toString(16)];
}

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/conf", function (req, res) {
  console.log("PASSOU NO GET DE PAG1!");

  // LIMPANDO VETOR DE PAG2 (CASO CLIQUE NO BOTÃO DE VOLTAR)
  PROGRAM.VALUE_VARS_PROG_O = [];
  PROGRAM.VALUE_VARS_PROG_P = [];

  res.render("conf", {
    program: PROGRAM,
  });
});

app.post("/testcase", function (req, res) {
  // PROGRAMAS O E P
  // VARS PROG O E PROG P
  // SUBCAMINHOS e SUBCAMINHOS COM NOTAÇÃO de O E P

  let {
    prog_o,
    prog_p,
    vars_prog_o,
    vars_prog_p,
    subcaminho_o,
    subcaminho_o_not,
    subcaminho_p,
    subcaminho_p_not,
  } = req.body;

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

  dbConn.query(
    "INSERT INTO caminho SET ? ",
    {
      def_usoO: PROGRAM.SUBCAMINHO_O_NOT,
      def_usoP: PROGRAM.SUBCAMINHO_P_NOT,
      subcaminhoO: PROGRAM.SUBCAMINHO_O,
      subcaminhoP: PROGRAM.SUBCAMINHO_P,
    },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
      }
    }
  );

  dbConn.query(
    "INSERT INTO programa_o SET ? ",
    { codigo_o: PROGRAM.PROG_O },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
      }
    }
  );

  dbConn.query(
    "INSERT INTO programa_p SET ? ",
    { codigo_p: PROGRAM.PROG_P },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
      }
    }
  );

  size = Math.max(prog_o.split("\n").length, prog_p.split("\n").length);
  console.log(size);

  res.render("testcase", {
    program: PROGRAM,
  });
});

app.get("/testcase", function (req, res) {
  console.log("PASSOU NO GET DE CASO DE TESTE!");

  // LIMPANDO A TABELA TM (CASO CLIQUE NO BOTÃO DE VOLTAR NA PAG3)
  PROGRAM.TESTE_TM = [];
  res.render("testcase", {
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

app.post("/tabletest", function (req, res) {
  // VALORES DAS VARIÁVEIS DE O E P
  let value_vars_prog_o = req.body.value_vars_prog_o; // ARRAY
  let value_vars_prog_p = req.body.value_vars_prog_p; // ARRAY

  // SIMULANDO ARMAZENAMENTO - LISTA COM VALORES INICIALIZADOS (CASO DE TESTE)
  PROGRAM.VALUE_VARS_PROG_O = value_vars_prog_o;
  PROGRAM.VALUE_VARS_PROG_P = value_vars_prog_p;

  // IMPRIMINDO
  console.log(value_vars_prog_o);
  console.log(value_vars_prog_p);

  res.render("tabletest", {
    program: PROGRAM,
  });
});

app.get("/tabletest", function (req, res) {
  console.log("PASSOU NO GET DE TABLETEST!");
  res.render("tabletest", {
    program: PROGRAM,
  });
});

app.post("/result", function (req, res) {
  // INFORMAÇÕES DO PASSO 3 (TODOS ARRAYS)
  PROGRAM.TESTE_TM = [];
  PROGRAM.TESTE_PROP = [];

  let {
    numero_linhas,
    equacoes,
    var_o,
    value_var_o,
    var_p,
    value_var_p,
    numero_linhas_PROPCONST,
    equacoes_PROPCONST,
    tipo_o_PROPCONST,
    value_var_o_PROPCONST,
    tipo_p_PROPCONST,
    value_var_p_PROPCONST,
  } = req.body;

  // ARMAZENANDO EM TESTE_TM (MATRIZ)
  if (numero_linhas.length < 2) {
    PROGRAM.TESTE_TM.push({
      linha: numero_linhas,
      equacao: equacoes,
      var_o: var_o,
      value_var_o: value_var_o,
      var_p: var_p,
      value_var_p: value_var_p,
    });
  } else {
    for (var i = 0; i < numero_linhas.length; i++) {
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

  if (numero_linhas_PROPCONST.length < 2) {
    PROGRAM.TESTE_PROP.push({
      linha: numero_linhas_PROPCONST,
      equacao: equacoes_PROPCONST,
      var_o: tipo_o_PROPCONST,
      value_var_o: value_var_o_PROPCONST,
      var_p: tipo_p_PROPCONST,
      value_var_p: value_var_p_PROPCONST,
    });
  } else {
    for (var i = 0; i < numero_linhas_PROPCONST.length; i++) {
      PROGRAM.TESTE_PROP.push({
        linha: numero_linhas_PROPCONST[i],
        equacao: equacoes_PROPCONST[i],
        var_o: tipo_o_PROPCONST[i],
        value_var_o: value_var_o_PROPCONST[i],
        var_p: tipo_p_PROPCONST[i],
        value_var_p: value_var_p_PROPCONST[i],
      });
    }
  }

  // console.log(PROGRAM.TESTE_PROP)

  let [line_o, line_p, hexa_c_results] = calc_c(
    PROGRAM.TESTE_TM,
    PROGRAM.TESTE_PROP
  );
  let [line_o, line_p, hexa_p_results] = calc_p(
    PROGRAM.TESTE_TM,
    PROGRAM.TESTE_PROP
  );
  let hexa_v_results = calc_v(PROGRAM.TESTE_TM);

  console.log("resultados c_var", line_x, line_y, hexa_c_results);
  console.log("resultados p_var", line_o, line_p, hexa_p_results);
  console.log("resultados v_var", hexa_v_results);

  // console.log(req.body);

  /**Verificar Método P- Uso se funcina */
  const insert_c_uso =
    "INSERT INTO m_c_uso (dt_teste_cuso,dt_teste_cusp) SET ?";
  const insert_p_uso =
    "INSERT INTO m_p_uso (dt_teste_puso,dt_teste_pusp) SET ?";
  /*
    dbConn.query(insert_p_uso, [hexa_p_results[0], hexa_p_results[1]], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(line_o);
            console.log(line_p);
            console.log(hexa_p_results);
        }
    });
    */

  /**
   * FALTA FAZER O INSERT DA TABELA DADOS_TM :
   * 1. PRECISA DO RESULTADO DO MÉTODO P-uso em hexadecimal do programa O e do programa P
   * 2. PRECISA DO RESULTADO DO MÉTODO VAR em hexa
   * 3. PRECISA DO RESULTADO DO MÉTODO  C-uso em hexadecimal do programa O e do programa P
   * 4. Inserir cada query de inserção nas rotas
   */
  const dados_tm = "INSERT INTO dados_tm SET ?";

  for (let i = 0; i < PROGRAM.TESTE_TM.length; i++) {
    console.log(PROGRAM.TESTE_TM[i]);
    dbConn.query(
      dados_tm,
      {
        linha: PROGRAM.TESTE_TM[i].linha,
        num_equacao: PROGRAM.TESTE_TM[i].equacao,
        variavel_o: PROGRAM.TESTE_TM[i].var_o,
        variavel_p: PROGRAM.TESTE_TM[i].var_p,
      },
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results);
        }
      }
    );
  }

  /**
   * Colocar na rota programO e programaP - inserir no banco
   */

  // IMPRIMINDO AS LISTAS
  //console.log(PROGRAM.TESTE_TM);

  /**************************************************************************************************** 
     NESSE MOMENTO (ANTES DE RENDERIZAR RESULT) ARMAZENA-SE TODOS OS DADOS DE PROGRAM EM BANCO DE DADOS.

     Os dados estão em strings, listas e matrizes. Quem tiver com a parte de banco de dados deve tratar
     essas informações da melhor maneira a serem inseridas no banco. 
    ****************************************************************************************************/

  res.render("result", {
    program: PROGRAM,
    line_o: line_o,
    line_p: line_p,
    hexa_p_results: hexa_p_results,
    hexa_v_results: hexa_v_results,
    line_x: line_x,
    line_y: line_y,
    hexa_c_results: hexa_c_results,
  });
});

app.listen(3000);
console.log("Porta localhost:3000 ..");
