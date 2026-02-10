export class Name {
  private constructor(private readonly _value: string) {}

  static create(value: string): Name {
    if (typeof value !== "string" || !value.trim())
      throw new Error("Name is required");
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 50)
      throw new Error("Name must be between 2 and 50 characters");
    return new Name(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Name): boolean {
    return this._value === other._value;
  }
}
