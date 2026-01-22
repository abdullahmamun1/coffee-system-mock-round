const purchaseService = require('../services/purchaseService');


exports.purchaseCoffee = async (req, res) => {
try {
const purchase = await purchaseService.purchaseCoffee(req.body);
res.status(201).json(purchase);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
};