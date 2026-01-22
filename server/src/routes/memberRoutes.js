const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');


router.post('/', memberController.registerMember);
router.post('/:memberId/redeem', memberController.redeemPoints);


module.exports = router;