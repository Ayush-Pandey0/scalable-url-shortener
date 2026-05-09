import express from 'express';
import urlRoutes from './routes/urlRoutes.js';

const app = express();

app.use(express.json());

// Add a logger so you can clearly see when a request hits your server
app.use((req, res, next) => {
  console.log(`\n---> [SERVER] Received ${req.method} request for ${req.url}`);
  next();
});

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'URL Shortener API is running' }));

app.use('/', urlRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;