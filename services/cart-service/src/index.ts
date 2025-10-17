// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import cartRoutes from './routes/cart.route';
import { InitializeBroker } from './services/BrokerService';
import { setupSwagger } from './docs/swagger';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4002;

app.use(express.json());
app.use('/', cartRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.send({ message: 'Cart service is healthy' });
});
setupSwagger(app); // Enable Swagger at /api-docs

const start = async () => {
  // Connect to Database
  await dbConnect();
  // Initialize Kafka Message Broker
  await InitializeBroker();

  app.listen(PORT, () => {
    console.log(`🚀 Cart Service running on port ${PORT}`);
    console.log(`🚀 Cart Service Swagger http://localhost:${PORT}/api-docs`);
  });
};

start();
