import { Injectable } from '@angular/core';
import {User, UserCredentials} from './model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: User[];

  constructor() { }

  login(creds: UserCredentials) {

  }
}
