const { Pool } = require('pg');


const pool = new Pool({
user: 'postgres',
host: 'db', // matches service name in docker-compose
database: 'coffee_shop',
password: 'postgres',
port: 5432,
});


module.exports = {
query: (text, params) => pool.query(text, params),
};