// src/app.ts
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { PRODUCT_SERVICE_URL, USER_SERVICE_URL } from "./config";
import { authLimiter } from "./utils";
const app = express();

// Proxy for user-service
const userServiceProxy = createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/user": "",
  },
});
app.use("/api/user", authLimiter, userServiceProxy);

// Proxy for product-service
const productServiceProxy = createProxyMiddleware({
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/product": "",
  },
});
app.use("/api/product", productServiceProxy);

export default app;
