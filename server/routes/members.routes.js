const router = require("express").Router();
const controller = require("../controllers/member.controller");

router.post("/members", controller.registerMember);

module.exports = router;
