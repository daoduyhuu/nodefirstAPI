const dotenv = require("dotenv");
const mysql = require('mysql');
dotenv.config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'nodejsexample1'
});
//test connection
function testConnect(){
    connection.connect((err) => {
        if (err) {
            console.log('err1');
            throw err;
        }
        else
            console.log("Mysql connected");
    });
}

module.exports = {connection, testConnect};