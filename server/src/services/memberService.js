const db = require('../db');


exports.registerMember = async ({ memberId, name, phone }) => {
if (!memberId || !name || !phone) throw new Error('memberId, name, phone required');
await db.query('INSERT INTO members (member_id, name, phone, points) VALUES ($1, $2, $3, 0)', [memberId, name, phone]);
return { memberId, name, phone, points: 0 };
};


exports.redeemPoints = async (memberId, { pointsToUse, price }) => {
if (pointsToUse == null || price == null) throw new Error('pointsToUse and price required');
const { rows } = await db.query('SELECT points FROM members WHERE member_id = $1', [memberId]);
if (!rows.length) throw new Error('Member not found');
const availablePoints = rows[0].points;
const usedPoints = Math.min(pointsToUse, availablePoints, price);
const discountedPrice = price - usedPoints;
const remainingPoints = availablePoints - usedPoints;


await db.query('UPDATE members SET points = $1 WHERE member_id = $2', [remainingPoints, memberId]);


return { memberId, usedPoints, discountAmount: usedPoints, discountedPrice, remainingPoints };
};