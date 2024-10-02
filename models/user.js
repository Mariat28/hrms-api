const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otherName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.TEXT
    },
    employeeNumber: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'role', // Assumes role table exists
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'employee',
    timestamps: false // We manage timestamps manually
});

module.exports = User;
