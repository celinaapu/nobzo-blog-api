import Authrepository from "@/auth/repository";
import { RegisterData, LoginData } from "@/types";
import { User as DomainUser } from "@/auth/domain/entities/user";
import { Password } from "@/auth/domain/valueObjects/Password";
import { generateToken, encryptToken } from "@/utils/token";

class AuthService {
  private repo: Authrepository;

  constructor() {
    this.repo = new Authrepository();
  }

  async register(data: RegisterData) {
    // check if user exists
    const existing = await this.repo.findUserByIdentifier(data.email);
    if (existing) {
      const err: any = new Error("User already exists with this email");
      err.statusCode = 400;
      throw err;
    }

    // Create domain entity (will validate via VOs)
    const userEntity = DomainUser.createFromPrimitives({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // Hash the password at the domain layer before persisting
    const hashedPassword = await Password.hash(data.password);

    const primitives = userEntity.toPrimitives();
    primitives.password = hashedPassword;

    const saved = await this.repo.saveUser(primitives);

    return saved;
  }

  async login(data: LoginData) {
    const { email, password } = data;

    const user = await this.repo.findUserByIdentifier(email);
    if (!user) {
      const err: any = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      const err: any = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken(user._id.toString());
    const sessionToken = encryptToken(token);

    return { user, token, sessionToken };
  }
}

export default new AuthService();
