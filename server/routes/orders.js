// routes/orders.js

const express = require('express');
const router = express.Router();
const Orders = require('../models/Orders');
const Items = require('../models/Items');

// Route to get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Orders.findAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ error: 'Unable to fetch orders', details: error.message });
    }
});

// Route to get one order by orderId
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Orders.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Unable to fetch order', details: error.message });
    }
});

// Route to create a new order
router.post('/', async (req, res) => {
    try {
        if (!req.body.items_list, !req.body.quantity || !req.body.totalPrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Create the order
        const newOrder = await Orders.create({
            items_list: req.body.items_list,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice
        });

        // items
        await Items.update(
            { OrderId: newOrder.orderId }, // Associate with the newly created order
            { where: { sku: req.body.items_list.map(item => item.sku) } }
        );

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Unable to create order', details: error.message });
    }
});

// Route to delete one order by orderId
router.delete('/:orderId', async (req, res) => {
    try {
        const order = await Orders.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Delete the order
        await order.destroy();

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Unable to delete order', details: error.message });
    }
});

// Route to delete all orders
router.delete('/', async (req, res) => {
    try {
        // Delete all orders
        await Orders.destroy({
            where: {},
            truncate: true // This ensures that the table is truncated (cleared) instead of deleting row by row
        });

        res.status(200).json({ message: 'All orders deleted successfully' });
    } catch (error) {
        console.error('Error deleting all orders:', error);
        res.status(500).json({ error: 'Unable to delete all orders', details: error.message });
    }
});


module.exports = router;
