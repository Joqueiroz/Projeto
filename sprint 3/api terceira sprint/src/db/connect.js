const mysql = require("mysql2");

const pool = mysql.createPool({
    connectionLimit:10,
    host:"10.89.240.77",
    user:"joaopedro",
    password:"senai@604",
    database:"banco_salas"
});

module.exports = pool;