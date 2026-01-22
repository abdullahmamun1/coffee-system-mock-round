const router = require("express").Router();
const controller = require("../controllers/purchase.controller");

router.post("/purchase", controller.purchaseCoffee);

module.exports = router;
