const coffeeService = require('../services/coffeeService');


exports.createCoffee = async (req, res) => {
try {
const coffee = await coffeeService.createCoffee(req.body);
res.status(201).json(coffee);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
};


exports.getAllCoffees = async (req, res) => {
try {
const coffees = await coffeeService.getAllCoffees();
res.json(coffees);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
};