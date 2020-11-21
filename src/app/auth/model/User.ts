export class User {
  id: number;
  name: string;
  email: string;
  address?: Address[];
}

export class Address {
  city: string;
  zip: string;
  street: string;
  houseNumber: string;
}

export class UserCredentials {
  email: string;
  password: string;
}
