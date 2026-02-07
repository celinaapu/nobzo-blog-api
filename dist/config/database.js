"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });
    }
    catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};
const getConnectionStatus = () => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return {
        state: states[mongoose_1.default.connection.readyState],
        host: mongoose_1.default.connection.host,
        name: mongoose_1.default.connection.name,
        readyState: mongoose_1.default.connection.readyState
    };
};
exports.getConnectionStatus = getConnectionStatus;
exports.default = connectDB;
//# sourceMappingURL=database.js.map