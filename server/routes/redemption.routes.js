const router = require("express").Router();
const controller = require("../controllers/redemption.controller");

router.post("/members/:memberId/redeem", controller.redeemPoints);

module.exports = router;
