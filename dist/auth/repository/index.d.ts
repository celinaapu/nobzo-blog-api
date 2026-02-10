import { IUser } from "@/types";
declare class Authrepository {
    private userModel;
    constructor();
    saveUser(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<IUser>;
    findUserByIdentifier(identifier: string): Promise<IUser | null>;
    findAllUsers(): Promise<IUser[]>;
}
export default Authrepository;
//# sourceMappingURL=index.d.ts.map