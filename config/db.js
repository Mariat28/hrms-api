require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
});

// Function to test the connection and synchronize models
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Synchronize models
        await sequelize.sync(); // Call this to create tables if they don't exist
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit the process if the connection fails
    }
};

// Initialize database connection
initializeDatabase();

module.exports = sequelize;
