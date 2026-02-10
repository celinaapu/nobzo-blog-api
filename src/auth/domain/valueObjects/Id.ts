import crypto from "crypto";

export class Id {
  private constructor(private readonly _value: string) {}

  static create(value: string): Id {
    if (!value) throw new Error("Id is required");
    const trimmed = value.trim();
    const re = /^[0-9a-fA-F]{24}$/;
    if (!re.test(trimmed)) throw new Error("Invalid Id format");
    return new Id(trimmed);
  }

  static generate(): Id {
    // 12 bytes -> 24 hex chars (MongoDB ObjectId length)
    const bytes = crypto.randomBytes(12).toString("hex");
    return new Id(bytes);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Id): boolean {
    return this._value === other._value;
  }
}
