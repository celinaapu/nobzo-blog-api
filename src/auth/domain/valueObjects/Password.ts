import bcrypt from "bcryptjs";

export class Password {
  private constructor(
    private readonly _value: string,
    private readonly _isHashed = false,
  ) {}

  static create(value: string): Password {
    if (typeof value !== "string" || !value)
      throw new Error("Password is required");
    const trimmed = value;
    if (trimmed.length < 6)
      throw new Error("Password must be at least 6 characters long");
    // At least one lowercase, one uppercase and one number
    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!complexity.test(trimmed)) {
      throw new Error(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
    }
    return new Password(trimmed, false);
  }

  static createFromHash(hashed: string): Password {
    if (typeof hashed !== "string" || !hashed)
      throw new Error("Hashed password is required");
    return new Password(hashed, true);
  }

  static async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(value, salt);
  }

  get value(): string {
    return this._value;
  }

  get isHashed(): boolean {
    return this._isHashed;
  }

  equals(other: Password): boolean {
    return this._value === other._value && this._isHashed === other._isHashed;
  }
}
