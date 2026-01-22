const db = require("../config/db");

exports.redeemPoints = async (req, res) => {
  const { memberId } = req.params;
  const { pointsToUse, price } = req.body;

  if (pointsToUse < 0 || price < 0)
    return res.status(400).json({ error: "Invalid input" });

  const member = await db.query(
    "SELECT points FROM members WHERE member_id=$1",
    [memberId]
  );

  if (!member.rows.length)
    return res.status(404).json({ error: "Member not found" });

  const available = member.rows[0].points;

  if (pointsToUse > available)
    return res.status(400).json({ error: "Insufficient points" });

  const discountedPrice = price - pointsToUse;

  await db.query(
    "UPDATE members SET points=$1 WHERE member_id=$2",
    [available - pointsToUse, memberId]
  );

  res.json({
    memberId,
    usedPoints: pointsToUse,
    discountAmount: pointsToUse,
    discountedPrice,
    remainingPoints: available - pointsToUse
  });
};
