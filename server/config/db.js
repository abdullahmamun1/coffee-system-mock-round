const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "postgres",   // change if needed
    database: "coffee_shop",
    port: 5432
});

module.exports = pool;
