const router = require("express").Router();
const controller = require("../controllers/coffee.controller");

router.post("/coffees", controller.createCoffee);

module.exports = router;
