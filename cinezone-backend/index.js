require('dotenv').config();

// Global error handlers to help debugging sudden exits
process.on('unhandledRejection', (reason, promise) => {
  console.error('✖ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('✖ Uncaught Exception thrown:', err);
  // keep default behavior after logging
  process.exit(1);
});
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { connectDB } = require('./src/utils/db');
const routes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middlewares/errorhandler');


require('./src/models');

const app = express();

app.use(cors({
  origin: "*",
  exposedHeaders: ['Content-Type', 'Content-Length']
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API CineZone', status: 'active' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API CineZone', status: 'active' });
});

app.use('/api', routes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Server + DB
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();  
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
  });


})();
