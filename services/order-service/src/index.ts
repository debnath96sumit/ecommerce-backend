import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import { InitializeBroker } from './services/BrokerService';
import { setupSwagger } from './docs/swagger';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4004;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.send({ message: 'Order service is healthy' });
});
setupSwagger(app);

const start = async () => {
  // Connect to Database
  await dbConnect();
  // Initialize Kafka Message Broker
  await InitializeBroker();

  app.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
    console.log(`🚀 Order Service Swagger http://localhost:${PORT}/api-docs`);
  });
};

start();
