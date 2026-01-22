const db = require("../config/db");

exports.registerMember = async (req, res) => {
  const { memberId, name, phone } = req.body;

  if (!memberId || !name || !phone)
    return res.status(400).json({ error: "Invalid input" });

  try {
    await db.query(
      "INSERT INTO members (member_id, name, phone, points) VALUES ($1,$2,$3,0)",
      [memberId, name, phone]
    );

    res.json({
      memberId,
      name,
      phone,
      points: 0
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
