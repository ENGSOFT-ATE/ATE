const mysql = require('mysql2')

const conn = mysql.createConnection({
    host:'localhost',
    // user:'nome_root',
    // password:'senha_banco',
    user: 'root',
    password: 'root',
    database:'metrica_ate',
});

conn.connect(function(error){
    if(!!error){
        console.log(error);
    }else{
        console.log('Connected..!')
    }
});

module.exports = conn;