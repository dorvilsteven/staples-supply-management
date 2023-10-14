// models/Order.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); // Sequelize configuration 

const Orders = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    items_list: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW'),
    },
});


module.exports = Orders;
