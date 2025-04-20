"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4001;
app.use(express_1.default.json());
// Health check
app.get('/api/health', (req, res) => {
    res.send({ message: 'Product service is healthy' });
});
// Connect to Mongo and start server
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.default)();
    app.listen(PORT, () => {
        console.log(`🚀 Product Service running on port ${PORT}`);
    });
});
start();
