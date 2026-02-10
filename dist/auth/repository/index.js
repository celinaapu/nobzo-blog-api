"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("@/models/User"));
class Authrepository {
    constructor() {
        this.userModel = User_1.default;
    }
    async saveUser(userData) {
        const user = new this.userModel(userData);
        return await user.save();
    }
    async findUserByIdentifier(identifier) {
        return await this.userModel.findOne({
            $or: [
                { _id: identifier },
                { email: identifier.toLowerCase() },
                { name: identifier }
            ]
        });
    }
    async findAllUsers() {
        return await this.userModel.find({}).select('-password');
    }
}
exports.default = Authrepository;
//# sourceMappingURL=index.js.map