const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connexion simple et propre
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
      allowPublicKeyRetrieval: true,
      timezone: 'Etc/GMT-1'
    },
    define: {
      timestamps: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Recréation des tables SI elles n'existent pas
    await sequelize.sync(); 

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
