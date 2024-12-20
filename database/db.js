// db.js
//creates a single pool
require('dotenv').config();
const { Pool: Db } = require('pg');
console.log(process.env.DB_PASSWORD)
//const process1 = require('process')
//console.log(JSON.stringify(process1.cwd()))

const pool = new Db({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

console.log(JSON.stringify(pool))
const process1 = require('process')
console.log(JSON.stringify(process1.cwd()))

module.exports = pool;
