// src/app.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { PRODUCT_SERVICE_URL, USER_SERVICE_URL } from './config';

const app = express();

// Proxy for user-service
app.use(
  '/api/user',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/user': '', // Remove /api/user before forwarding
    },
  })
);

// Proxy for product-service
app.use(
  '/api/product',
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/product': '',
    },
  })
);

export default app;
