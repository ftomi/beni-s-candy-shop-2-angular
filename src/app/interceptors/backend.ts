import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import {Basket} from '../auth/model/basket';

// array in local storage for registered users
const usersKey = 'app-user-key';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];
const products = [
  {
    id: 1,
    name: 'Coca cola 3dl',
    description: 'lorem text here...',
    price: 250,
    discountedPrice: 215,
    image: 'https://www.myamericanmarket.com/873-large_default/coca-cola-classic.jpg',
    sliderImages: [ 'https://www.myamericanmarket.com/873-large_default/coca-cola-classic.jpg',
      'https://www.lacsiboltja.hu/storage_db/image/31915_Izvilageperjoszelet.jpg'
    ]
  },
  {
    id: 2,
    name: 'Milky way',
    description: 'lorem text here...',
    price: 320,
    discountedPrice: 295,
    image: 'https://static.groby.hu/media/c4b/bac/conv/22476_se1_back-full.png',
    sliderImages: [
      'https://static.groby.hu/media/c4b/bac/conv/22476_se1_back-full.png',
      'https://static.groby.hu/media/c4b/bac/conv/22476_se1_back-full.png',
      'https://static.groby.hu/media/c4b/bac/conv/22476_se1_back-full.png'
    ]
  },
  {
    id: 3,
    name: 'Mars szelet',
    description: 'lorem text here...',
    price: 350,
    discountedPrice: 315,
    image: 'https://www.lacsiboltja.hu/storage_db/image/33225_marsszelet.jpg',
    sliderImages: [
      'https://www.lacsiboltja.hu/storage_db/image/33225_marsszelet.jpg',
      'https://www.lacsiboltja.hu/storage_db/image/33225_marsszelet.jpg',
      'https://www.lacsiboltja.hu/storage_db/image/33225_marsszelet.jpg',
      'https://www.lacsiboltja.hu/storage_db/image/33225_marsszelet.jpg'
    ]
  },
  {
    id: 4,
    name: 'Twix',
    description: 'lorem text here...',
    price: 350,
    discountedPrice: 315,
    image: 'https://images.heb.com/is/image/HEBGrocery/000121394',
    sliderImages: [  'https://www.lacsiboltja.hu/storage_db/image/31915_Izvilageperjoszelet.jpg',
      'https://www.lacsiboltja.hu/storage_db/image/31915_Izvilageperjoszelet.jpg'
    ]
  },
  {
    id: 5,
    name: 'Eperjó',
    description: 'lorem text here...',
    price: 350,
    discountedPrice: 315,
    image: 'https://www.lacsiboltja.hu/storage_db/image/31915_Izvilageperjoszelet.jpg',
    sliderImages: [  'https://www.lacsiboltja.hu/storage_db/image/31915_Izvilageperjoszelet.jpg',
      'https://www.lacsiboltja.hu/storage_db/image/31915_Izvilageperjoszelet.jpg'
    ]
  },
  {
    id: 6,
    name: 'Sweet & sour candy',
    description: 'lorem text here...',
    price: 250,
    discountedPrice: 215,
    image: 'https://webshop.sugarshop.hu/sites/default/files/savanyu_meggyes_gumicukor_web.jpg',
    sliderImages: [  'https://webshop.sugarshop.hu/sites/default/files/savanyu_meggyes_gumicukor_web.jpg',
      'https://webshop.sugarshop.hu/sites/default/files/savanyu_meggyes_gumicukor_web.jpg',
    ]
  },
  {
    id: 7,
    name: 'Snickers',
    description: 'lorem text here...',
    price: 200,
    discountedPrice: 185,
    image: 'https://images-na.ssl-images-amazon.com/images/I/71%2Br1gAwsZL._SX425_.jpg',
    sliderImages: [  'https://images-na.ssl-images-amazon.com/images/I/71%2Br1gAwsZL._SX425_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/71%2Br1gAwsZL._SX425_.jpg'
    ]
  },
  {
    id: 8,
    name: 'Snickers mega pack',
    description: 'lorem text here...',
    price: 2500,
    discountedPrice: 2105,
    image: 'https://images-na.ssl-images-amazon.com/images/I/719C2D2iWFL._SL1500_.jpg',
    sliderImages: [ 'https://images-na.ssl-images-amazon.com/images/I/719C2D2iWFL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/719C2D2iWFL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/719C2D2iWFL._SL1500_.jpg',
    ]
  },
  {
    id: 9,
    name: 'Snickers white',
    description: 'lorem text here...',
    price: 200,
    discountedPrice: 185,
    image: 'https://images-na.ssl-images-amazon.com/images/I/71%2Br1gAwsZL._SX425_.jpg',
    sliderImages: [ 'https://images-na.ssl-images-amazon.com/images/I/71%2Br1gAwsZL._SX425_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/71%2Br1gAwsZL._SX425_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/71%2Br1gAwsZL._SX425_.jpg'      ,
    ]
  },
  {
    id: 10,
    name: 'Candy cane',
    description: 'lorem text here...',
    price: 50,
    discountedPrice: 45,
    image: 'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
    sliderImages: [ 'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
      'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
      'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
      'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R'
    ]
  },
  {
    id: 10,
    name: 'Candy cane x10',
    description: 'lorem text here...',
    price: 450,
    discountedPrice: 400,
    image: 'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
    sliderImages: [
      'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
      'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R']
  },
  {
    id: 12,
    name: 'Candy cane x100',
    description: 'lorem text here...',
    price: 4000,
    discountedPrice: 3000,
    image: 'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
    sliderImages: [
      'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R',
      'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555289981/shape/mentalfloss/candyprim.png?itok=vieW9d5R'
    ]
  },
  {
    id: 13,
    name: 'Coca cola 1.75l',
    description: 'lorem text here...',
    price: 250,
    discountedPrice: 250,
    image: 'https://www.myamericanmarket.com/873-large_default/coca-cola-classic.jpg',
    sliderImages: [
      'https://www.myamericanmarket.com/873-large_default/coca-cola-classic.jpg',
      'https://www.myamericanmarket.com/873-large_default/coca-cola-classic.jpg',
      'https://www.myamericanmarket.com/873-large_default/coca-cola-classic.jpg'
    ]
  },
  {
    id: 14,
    name: 'Fanta 1.75',
    description: 'lorem text here...',
    price: 250,
    discountedPrice: 250,
    image: 'https://secure.ce-tescoassets.com/assets/HU/499/5449000132499/ShotType1_540x540.jpg',
    sliderImages: [
      'https://secure.ce-tescoassets.com/assets/HU/499/5449000132499/ShotType1_540x540.jpg',
    'https://secure.ce-tescoassets.com/assets/HU/499/5449000132499/ShotType1_540x540.jpg'
    ]
  },
  {
    id: 15,
    name: 'Fanta vérnarancs 1.75',
    description: 'lorem text here...',
    price: 250,
    discountedPrice: 250,
    image: 'https://www.myamericanmarket.com/873-large_default/coca-cola-classic.jpg',
    sliderImages: [ 'https://secure.ce-tescoassets.com/assets/HU/499/5449000132499/ShotType1_540x540.jpg']
  }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    // tslint:disable-next-line:typedef
    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.endsWith('/products') && method === 'GET':
          return getProducts();
        case url.endsWith('/search-products') && method === 'POST':
          return getProductsByFilter();
        case url.match(/\/products\/\d+$/) && method === 'GET':
          return getProductById();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.endsWith('/basket') && method === 'GET':
          return getBasket();
        case url.endsWith('basket') && method === 'PUT':
          return updateBasket();
        case url.endsWith('basket/add') && method === 'PUT':
          return addToBasket();
        case url.endsWith('basket') && method === 'DELETE':
          return deleteBasket();
        case url.endsWith('/basket-total') && method === 'GET':
          return getBasketTotal();
        case url.endsWith('/save-order') && method === 'POST':
          return addOrder();
        case url.endsWith('/get-orders') && method === 'GET':
          return getOrders();

        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    // tslint:disable-next-line:typedef
    function authenticate() {
      const { email, password } = body;
      console.log(body);
      console.log({users});
      const user = users.find(x => x.email === email && x.password === password);
      console.log({user});
      if (!user) { return error('Username or password is incorrect'); }
      return ok({
        ...basicDetails(user),
        token: 'fake-jwt-token'
      });
    }

    // tslint:disable-next-line:typedef
    function register() {
      const user = body;

      if (users.find(x => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken');
      }

      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      users.push(user);
      console.log({users});
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    // tslint:disable-next-line:typedef
    function getUsers() {
      if (!isLoggedIn()) { return unauthorized(); }
      return ok(users.map(x => basicDetails(x)));
    }

    // tslint:disable-next-line:typedef
    function getUserById() {
      if (!isLoggedIn()) { return unauthorized(); }

      const user = users.find(x => x.id === idFromUrl());
      console.log(user);
      return ok(basicDetails(user));
    }

    // tslint:disable-next-line:typedef
    function updateUser() {
      if (!isLoggedIn()) { return unauthorized(); }

      const params = body;
      const user = users.find(x => x.id === idFromUrl());

      if (!params.password) {
        delete params.password;
      }

      // update and save user
      Object.assign(user, params);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return ok();
    }

    // tslint:disable-next-line:typedef
    function deleteUser() {
      if (!isLoggedIn()) { return unauthorized(); }

      users = users.filter(x => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }


    // tslint:disable-next-line:typedef
    function getProducts() {
      return ok(products);
    }

    // tslint:disable-next-line:typedef
    function getProductById() {
      const product = products.find(x => x.id === idFromUrl());
      console.log(product);
      return ok(product);
    }

    // tslint:disable-next-line:typedef
    function getProductsByFilter() {
      const params = body;
      const items = products.filter(x => x.name.includes(params.filter));
      return ok(items);
    }

    // tslint:disable-next-line:typedef
    function getBasket() {
      if (!isLoggedIn()) { return unauthorized(); }

      const userId = JSON.parse(localStorage.getItem('user')).id;
      const user = users.find(x => x.id === userId);
      return ok(user.basket);
    }

    // tslint:disable-next-line:typedef
    function getBasketTotal() {
      if (!isLoggedIn()) { return unauthorized(); }

      const product = products.find(x => x.id === idFromUrl());

      const userId = JSON.parse(localStorage.getItem('user')).id;
      const user = users.find(x => x.id === userId);
      if (!user.basket) {
        return ok(0);
      }
      console.log(user.basket.items);
      const total =  user.basket.items
        .map(x => x.price * x.quantity)
        // tslint:disable-next-line:no-shadowed-variable
        .reduce((total, num) => total + num);
      return ok(total);
    }

    // tslint:disable-next-line:typedef
    function updateBasket(){
      if (!isLoggedIn()) { return unauthorized(); }

      const params = body;
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const user = users.find(x => x.id === userId);
      if (!user.basket) {
        user.basket = new Basket();
        user.basket.items = [];
      }
      const basket = {...params.items};
      user.basket = basket;
      return ok(user.basket);
    }

    // tslint:disable-next-line:typedef
    function addToBasket(){
      if (!isLoggedIn()) { return unauthorized(); }

      const params = body;
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const user = users.find(x => x.id === userId);
      if (!user.basket) {
        user.basket = new Basket();
        user.basket.items = [];
      }
      console.log(params.item)
      const basket = [...user.basket.items, params.item];
      user.basket.items = basket;
      return ok();
    }

    // tslint:disable-next-line:typedef
    function deleteBasket() {
      if (!isLoggedIn()) { return unauthorized(); }
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const user = users.find(x => x.id === userId);
      if (user.basket) {
        user.basket = null;
      }
      return ok();
    }

    // tslint:disable-next-line:typedef
    function addOrder() {
      if (!isLoggedIn()) { return unauthorized(); }
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const user = users.find(x => x.id === userId);
      const params = body;
      if (!user.orders) {
        user.orders = [];
      }

      user.orders.push(params);
      user.basket = null;

      return ok();
    }

    // tslint:disable-next-line:typedef
    function getOrders() {
      if (!isLoggedIn()) { return unauthorized(); }
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const user = users.find(x => x.id === userId);

      console.log({user});
      return ok(user.orders);
    }

    // tslint:disable-next-line:typedef no-shadowed-variable
    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }))
        .pipe(delay(500)); // delay observable to simulate server api call
    }

    // tslint:disable-next-line:typedef
    function error(message) {
      // tslint:disable-next-line:max-line-length
      return throwError({ error: { message } }).pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    // tslint:disable-next-line:typedef
    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorized' } })
        .pipe(materialize(), delay(500), dematerialize());
    }

    // tslint:disable-next-line:typedef
    function basicDetails(user) {
      const { id, username, firstName, lastName, email, address } = user;
      return { id, username, firstName, lastName, email, address };
    }

    // tslint:disable-next-line:typedef
    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    // tslint:disable-next-line:typedef
    function idFromUrl() {
      const urlParts = url.split('/');
      // tslint:disable-next-line:radix
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
