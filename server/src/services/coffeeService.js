const db = require('../db');
const { v4: uuidv4 } = require('uuid');


exports.createCoffee = async ({ name, price }) => {
if (!name || price == null) throw new Error('Name and price required');
const id = uuidv4();
await db.query('INSERT INTO coffees (id, name, price) VALUES ($1, $2, $3)', [id, name, price]);
return { id, name, price };
};


exports.getAllCoffees = async () => {
const { rows } = await db.query('SELECT * FROM coffees');
return rows;
};