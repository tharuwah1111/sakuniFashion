const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "Sakuni_fashion_Management"
});

module.exports = db; 