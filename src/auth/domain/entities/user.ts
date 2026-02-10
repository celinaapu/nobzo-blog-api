import { Id } from "@/auth/domain/valueObjects/Id";
import { Email } from "@/auth/domain/valueObjects/Email";
import { Password } from "@/auth/domain/valueObjects/Password";
import { Name } from "@/auth/domain/valueObjects/Name";

export type UserPrimitives = {
  _id?: string;
  email: string;
  password: string;
  name: string;
};

export class User {
  private constructor(
    private readonly _id: Id,
    private readonly _email: Email,
    private readonly _password: Password,
    private readonly _name: Name,
  ) {}

  static createFromPrimitives(data: UserPrimitives): User {
    const id = data._id ? Id.create(data._id) : Id.generate();
    const email = Email.create(data.email);
    const password = Password.create(data.password);
    const name = Name.create(data.name);

    return new User(id, email, password, name);
  }

  get id(): string {
    return this._id.value;
  }

  get email(): string {
    return this._email.value;
  }

  get password(): string {
    return this._password.value;
  }

  get name(): string {
    return this._name.value;
  }

  toPrimitives() {
    return {
      _id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
    } as UserPrimitives;
  }
}
