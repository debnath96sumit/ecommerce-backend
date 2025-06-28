// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import userRoutes from './routes/user.routes';
import { InitializeBroker } from './services/BrokerService';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4001;

app.use(express.json());

app.use('/', userRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.send({ message: 'User service is healthy' });
});

// Connect to Mongo and start server
const start = async () => {
  // Connect to Mongo
  await dbConnect();

  //initialize broker
  await InitializeBroker();
  app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
  });
};

start();
