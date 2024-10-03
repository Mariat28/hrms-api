const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Define the Role model
const Role = sequelize.define('Role', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'role',
    timestamps: false,
});

module.exports = Role;
