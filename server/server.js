const ExcelJS = require('exceljs'); // Use the appropriate library for reading Excel files
const express = require('express');
const sequelize = require('./config/connection.js'); // Import Sequelize configuration
const cors = require('cors');
const itemRoutes = require('./routes/items.js'); // Import routes for items

// Create an instance of Express
const app = express();

// Import models
const Items = require('./models/Items.js'); // Import Items models
// const Orders = require('./models/Orders.js'); // Import orders models

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
app.use('/items', itemRoutes); // use item routes /items


// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

async function removeItems() {
  try {
    // Remove all items from the "Items" table
    await Items.destroy({
      where: {},
      truncate: false, // Set to true if you want to reset the table completely
    });
    console.log('All items removed from the "Items" table.');
  } catch (error) {
    console.error('Error removing items:', error);
  }
}
async function importDataFromExcel() {
  // Load the Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./db/supplies_book_1.xlsx'); // Excel file.

  // Select the worksheet
  const worksheet = workbook.getWorksheet(1); //

  // Ensure the database connection is established
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return;
  }

  // Loop through rows in the worksheet and insert data into the database
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    const supplyData = {
      sku: row.getCell(1).value,
      description: row.getCell(2).value,
      price: row.getCell(3).value,
      department: row.getCell(4).value,
    };
    const existingItem = await Items.findOne({ where: { sku: supplyData.sku } });
    
    if (!existingItem) {
      try {
        await Items.create(supplyData);
        console.log('Data inserted:', supplyData);
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    }
  }
}

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

importDataFromExcel();
