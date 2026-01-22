const express = require('express');
const router = express.Router();
const coffeeController = require('../controllers/coffeeController');


router.post('/', coffeeController.createCoffee);
router.get('/', coffeeController.getAllCoffees);


module.exports = router;