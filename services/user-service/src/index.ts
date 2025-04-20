// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4002;

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.send({ message: 'User service is healthy' });
});

// Connect to Mongo and start server
const start = async () => {
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
  });
};

start();
