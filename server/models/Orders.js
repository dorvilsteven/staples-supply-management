// models/Order.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Orders = sequelize.define('Orders', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    items_list: {
        type: DataTypes.JSON, // Use JSON type for an array or list
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});

Orders.sync();

module.exports = Orders;
