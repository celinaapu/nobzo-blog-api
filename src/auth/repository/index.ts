import User from "@/models/User";
import { IUser } from "@/types";

class Authrepository {
    private userModel: typeof User;

    constructor() {
        this.userModel = User;
    }

    // Method to save a new user
    async saveUser(userData: { name: string; email: string; password: string }): Promise<IUser> {
        const user = new this.userModel(userData);
        return await user.save();
    }

    // Method to find user by identifier (email or username)
    async findUserByIdentifier(identifier: string): Promise<IUser | null> {
        return await this.userModel.findOne({
            $or: [
                { _id: identifier },
                { email: identifier.toLowerCase() },
                { name: identifier }
            ]
        });
    }

    // Method to find all users
    async findAllUsers(): Promise<IUser[]> {
        return await this.userModel.find({}).select('-password');
    }
}

export default Authrepository;