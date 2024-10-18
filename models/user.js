const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./role');
// Define the User model
const User = sequelize.define('User', {
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otherName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.BLOB,
    },
    employeeNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'role_id', 
        },
    },
    photoUrl:{
        type: DataTypes.STRING, 
    }
}, {
    tableName: 'employee',
    timestamps: false,
});

module.exports = User;
