export class Email {
  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    if (!value) throw new Error("Email is required");
    const normalized = value.trim().toLowerCase();
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!re.test(normalized)) throw new Error("Invalid email address");
    return new Email(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
