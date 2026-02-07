import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=auth.d.ts.map