const mysql = require('mysql')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root123',
    database:'metrica_ate'
});

conn.connect(function(error){
    if(!!error){
        console.log(error);
    }else{
        console.log('Connected..!')
    }
});                                                                      

module.exports = conn;