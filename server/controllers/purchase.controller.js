const db = require("../config/db");
const { v4: uuid } = require("uuid");
const { calculatePoints } = require("../utils/points");

exports.purchaseCoffee = async (req, res) => {
  const { memberId, coffeeId, quantity } = req.body;

  if (!memberId || !coffeeId || quantity <= 0)
    return res.status(400).json({ error: "Invalid input" });

  const coffee = await db.query(
    "SELECT price FROM coffees WHERE id=$1",
    [coffeeId]
  );
  if (!coffee.rows.length)
    return res.status(404).json({ error: "Coffee not found" });

  const member = await db.query(
    "SELECT points FROM members WHERE member_id=$1",
    [memberId]
  );
  if (!member.rows.length)
    return res.status(404).json({ error: "Member not found" });

  const totalAmount = coffee.rows[0].price * quantity;
  const pointsEarned = calculatePoints(totalAmount);
  const totalPoints = member.rows[0].points + pointsEarned;

  const purchaseId = uuid();

  await db.query(
    `INSERT INTO purchases 
     (id, member_id, coffee_id, quantity, total_amount, points_earned)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [purchaseId, memberId, coffeeId, quantity, totalAmount, pointsEarned]
  );

  await db.query(
    "UPDATE members SET points=$1 WHERE member_id=$2",
    [totalPoints, memberId]
  );

  res.json({
    purchaseId,
    memberId,
    coffeeId,
    quantity,
    totalAmount,
    pointsEarned,
    totalPoints
  });
};
