const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');


router.post('/', purchaseController.purchaseCoffee);


module.exports = router;