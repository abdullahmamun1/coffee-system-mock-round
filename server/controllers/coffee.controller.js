const db = require("../config/db");
const { v4: uuid } = require("uuid");

exports.createCoffee = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !Number.isInteger(price) || price <= 0)
    return res.status(400).json({ error: "Invalid input" });

  try {
    const id = uuid();
    const result = await db.query(
      "INSERT INTO coffees (id, name, price) VALUES ($1,$2,$3) RETURNING *",
      [id, name, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
