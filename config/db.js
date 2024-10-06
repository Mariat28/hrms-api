require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
});

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
//synchronize database on first deployment or after any model changes
        await sequelize.sync(); 
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); 
    }
};

// Initialize database connection
initializeDatabase();

module.exports = sequelize;
