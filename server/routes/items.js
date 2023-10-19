// routes/items.js

const express = require('express');
const router = express.Router();
const Items = require('../models/Items.js'); // Import your Sequelize model for Items

// Get all items
router.get('/', async (req, res) => {
  try {
    const allItems = await Items.findAll();
    res.json(allItems);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Unable to retrieve items.' });
  }
});

// Get a single item by SKU
router.get('/:sku', async (req, res) => {
  try {
    const sku = req.params.sku;
    const item = await Items.findOne({ where: { sku: sku } }); // find item by sku
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ error: 'Unable to retrieve the item.' });
  }
});

// Create an item
router.post('/', async (req, res) => {
  try {
    if (!req.body.sku || !req.body.description || !req.body.price || !req.body.department) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newItem = await Items.create(req.body);
    res.json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Unable to create the item.' });
  }
});

// Delete an item by SKU
router.delete('/:sku', async (req, res) => {
    try {
        const sku = req.params.sku;
        const itemToDelete = await Items.destroy({ where: { sku: sku } });
        if (itemToDelete) {
            return res.status(200).json({ message: 'Success! Item Deleted.' });
        } else {
            return res.status(404).json({ error: 'Item not found.' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Unable to delete the item.' });
    }
  });

// Update an item by SKU
router.put('/:sku', async (req, res) => {
  try {
    const sku = req.params.sku;
    const [updatedRowsCount] = await Items.update(req.body, { where: { sku: sku } });
    if (updatedRowsCount > 0) {
      res.json({ message: 'Item updated successfully.' });
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Unable to update the item.' });
  }
});

module.exports = router;
