import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from './model/user';
import {UserCredentials} from './model/userCredentials';
import {Basket, BasketItem} from './model/basket';
import { Order } from './model/order';

import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public basketTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  // tslint:disable-next-line:typedef
  login(userCreds: UserCredentials) {
    const {email, password} = userCreds;
    console.log(userCreds);
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { email, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  // tslint:disable-next-line:typedef
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  // tslint:disable-next-line:typedef
  register(user: UserCredentials) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  // tslint:disable-next-line:typedef
  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  // tslint:disable-next-line:typedef
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  // tslint:disable-next-line:typedef
  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id === this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  // tslint:disable-next-line:typedef
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id === this.userValue.id) {
          this.logout();
        }
        return x;
      }));
  }

  getBasketTotal(): void {
    this.http.get<number>(`${environment.apiUrl}/basket-total`)
      .subscribe(x => {
        console.log(x);
        this.basketTotal.next(x);
      });
  }

  getBasketItems(): Observable<Basket> {
    return this.http.get<Basket>(`${environment.apiUrl}/basket`);
  }

  addToBasket(item: BasketItem): Observable<any> {
    return this.http.put(`${environment.apiUrl}/basket/add`, {item});
  }

  updateBasket(items: Basket): Observable<any> {
    return this.http.put(`${environment.apiUrl}/basket`, {items});
  }

  deleteBasket(basketId: number, itemId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/basket`);
  }

  checkout(basket: Basket): Observable<any> {
    const order = new Order();
    order.basket = basket;
    order.completed = moment().unix().toString();
    return this.http.post(`${environment.apiUrl}/save-order`, order);
  }

  getPastOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/get-orders`);
  }
}


