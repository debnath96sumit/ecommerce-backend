// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.route';
import { InitializeBroker } from './services/BrokerService';
import { setupSwagger } from './docs/swagger';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4002;

app.use(express.json());
app.use('/', productRoutes);
app.use('/category', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.send({ message: 'Product service is healthy' });
});
setupSwagger(app); // Enable Swagger at /api-docs

// Connect to Mongo and start server
const start = async () => {
  await dbConnect();
  await InitializeBroker();
  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
    console.log(`🚀 Product Service Swagger http://localhost:${PORT}/api-docs`);
  });
};

start();
