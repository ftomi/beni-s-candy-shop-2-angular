export class User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  email: string;
  address?: Address[];
}

export class Address {
  active: boolean;
  city: string;
  zip: string;
  street: string;
  houseNumber: string;
}

