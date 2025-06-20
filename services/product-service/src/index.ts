// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.route';

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

// Connect to Mongo and start server
const start = async () => {
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
  });
};

start();
