//Подключение к БД >>
const mysql = require("mysql2");
let config = require('./../config.json');
  
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password
});

 connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

module.exports = connection;
//<<