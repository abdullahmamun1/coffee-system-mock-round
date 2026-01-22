const express = require("express");
const app = express();

app.use(express.json());

app.use(require("./routes/coffees.routes"));
app.use(require("./routes/members.routes"));
app.use(require("./routes/purchase.routes"));
app.use(require("./routes/redemption.routes"));

app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});
