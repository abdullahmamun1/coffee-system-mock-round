const db = require('../db');
const { v4: uuidv4 } = require('uuid');


exports.purchaseCoffee = async ({ memberId, coffeeId, quantity }) => {
if (!memberId || !coffeeId || quantity == null) throw new Error('memberId, coffeeId, quantity required');


const coffeeRes = await db.query('SELECT * FROM coffees WHERE id = $1', [coffeeId]);
if (!coffeeRes.rows.length) throw new Error('Coffee not found');
const coffee = coffeeRes.rows[0];


const totalAmount = coffee.price * quantity;
const pointsEarned = Math.floor(totalAmount / 50);


const memberRes = await db.query('SELECT points FROM members WHERE member_id = $1', [memberId]);
if (!memberRes.rows.length) throw new Error('Member not found');
const totalPoints = memberRes.rows[0].points + pointsEarned;


await db.query('UPDATE members SET points = $1 WHERE member_id = $2', [totalPoints, memberId]);


const purchaseId = uuidv4();
await db.query('INSERT INTO purchases (id, member_id, coffee_id, quantity, total_amount, points_earned) VALUES ($1, $2, $3, $4, $5, $6)',
[purchaseId, memberId, coffeeId, quantity, totalAmount, pointsEarned]);


return { purchaseId, memberId, coffeeId, quantity, totalAmount, pointsEarned, totalPoints };
};