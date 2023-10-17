// models/Supply.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js'); // Sequelize configuration

const Items = sequelize.define('Items', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sku: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    // Existing attributes:
    // name: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    // },
    // quantity: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
});

Items.sync();

module.exports = Items;
