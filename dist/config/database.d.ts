import mongoose from "mongoose";
declare const connectDB: () => Promise<void>;
export declare const getConnectionStatus: () => {
    state: string;
    host: string;
    name: string;
    readyState: mongoose.ConnectionStates;
};
export default connectDB;
//# sourceMappingURL=database.d.ts.map