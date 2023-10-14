const express = require('express');
const sequelize = require('./config/connection.js'); // Import Sequelize configuration
const Supplies = require('./models/Supplies.js'); // Import supplies models
const Orders = require('./models/Orders.js'); // Import orders models
// const { Supplies, Orders } = require('./models');

// Create an instance of Express
const app = express();

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Define a sample route to fetch supplies
app.get('/supplies', async (req, res) => {
  try {
    const supplies = await Supplies.findAll();
    res.json(supplies);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching supplies.' });
  }
});

// Define a sample route to fetch past orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Orders.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching past orders.' });
  }
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

