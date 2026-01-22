const memberService = require('../services/memberService');


exports.registerMember = async (req, res) => {
try {
const member = await memberService.registerMember(req.body);
res.status(201).json(member);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
};


exports.redeemPoints = async (req, res) => {
try {
const { memberId } = req.params;
const result = await memberService.redeemPoints(memberId, req.body);
res.json(result);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
};