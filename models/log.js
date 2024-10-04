// models/Log.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Log = sequelize.define('Log', {
  type: {
    type: DataTypes.ENUM('request', 'response', 'request-error', 'response-error', 'network-error'),
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  statusText: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});


module.exports = Log;
