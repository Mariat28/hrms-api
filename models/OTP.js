const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const employeeOtp = sequelize.define('employeeotp', {
    OTP: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    emailAddress: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    tableName: 'employeeotp',
    timestamps: false,
});

module.exports = employeeOtp;
