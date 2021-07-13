const mysql = require('mysql2')

const conn = mysql.createConnection({
    host:'localhost',
<<<<<<< HEAD
    user:'root',
    password:'root123',
    database:'metrica_ate'
=======
    // user:'nome_root',
    // password:'senha_banco',
    user: 'root',
    password: 'root',
    database:'metrica_ate',
>>>>>>> 50ee017fca2254bda8c39b474b8d46331b7f5cd1
});

conn.connect(function(error){
    if(!!error){
        console.log(error);
    }else{
        console.log('Connected..!')
    }
});                                                                      

module.exports = conn;