const express = require('express');
const bodyParser = require('body-parser');


const coffeeRoutes = require('./routes/coffeeRoutes');
const memberRoutes = require('./routes/memberRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');


const app = express();
app.use(bodyParser.json());


app.use('/coffees', coffeeRoutes);
app.use('/members', memberRoutes);
app.use('/purchase', purchaseRoutes);


const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));