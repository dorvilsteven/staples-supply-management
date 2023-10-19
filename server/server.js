const ExcelJS = require('exceljs'); // Use the appropriate library for reading Excel files
const express = require('express');
const sequelize = require('./config/connection.js'); // Import Sequelize configuration

// Create an instance of Express
const app = express();

// Import models
const Items = require('./models/Items.js'); // Import Items models
// const Orders = require('./models/Orders.js'); // Import orders models

// Middleware to parse JSON request bodies
app.use(express.json());

//  get all items
app.get('/items', async (req, res) => {
  try {
    const allItems = await Items.findAll();
    res.json(allItems);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Unable to retrieve items.' });
  }
});

// get single item
app.get('/items/:sku', async (req, res) => {
  try {
    const sku = req.params.sku;
    // Find item by sku
    const item = await Items.findOne({ where: { sku: sku } });
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ error: 'Unable to retrieve item.' });
  }
});

// create item to add to database
app.post('/items', async (req, res) => {
  try {
    if (!req.body.sku || !req.body.description || !req.body.price || !req.body.department) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newItem = await Items.create(req.body);
    res.json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Unable to create item.' });
  }
});

// delete item 
app.delete('/items/:sku', async (req, res) => {
  try {
    const sku = req.params.sku;
    // Find the item by sku and delete it
    const itemToDelete = await Items.destroy({ where: { sku: sku } });

    if (itemToDelete) {
      return res.status(200).json({ message: 'Success! Item Deleted.' });
    } else {
      return res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Unable to delete item.' });
  }
}); 

// Update an item
app.put('/items/:sku', async (req, res) => {
  const sku = req.params.sku;
  
  try {
    const [updatedRowsCount] = await Items.update(req.body, { where: { sku: sku } });
    if (updatedRowsCount > 0) {
      res.json({ message: 'Item updated successfully.' });
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
   console.error('Error updating item:', error);
   res.status(500).json({ error: 'Unable to update item.' }); 
  }
});

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
  // remove the items in the table before starting
  removeItems();
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

  // Close the database connection
  // await sequelize.close();
  // console.log('Database connection closed.');
}

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// removeItems();
importDataFromExcel();
