import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Basket} from '../model/basket';
import {FormBuilder, FormGroup} from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket: Basket;
  loading: boolean;

  constructor(private accountService: AuthService) { }

  ngOnInit(): void {
    this.loading = true;
    this.accountService.getBasketItems()
      .pipe(first())
      .subscribe(x => {
        this.loading = false;
        this.basket = x;
      });
  }

  updateBasket(id: string, dir: string): void {
    const item = this.basket.items.findIndex(x => x.productId === id);

    console.log(item);
    if (dir === '+') {
      this.basket.items[item].quantity++;
    } else {
      this.basket.items[item].quantity--;
    }
   this.accountService.updateBasket(this.basket)
      .pipe(first())
      .subscribe(x => {
        this.loading = false;
        this.accountService.getBasketTotal();
        this.basket = x;
      });
  }

  removeItem(id: string): void {
    this.basket.items = this.basket.items.filter(x => x.productId !== id);
    this.accountService.updateBasket(this.basket)
      .pipe(first())
      .subscribe(x => {
        this.loading = false;
        this.accountService.getBasketTotal();
        this.basket = x;
      });
  }

  checkout(): void {
    // clear basket, move to orders
    this.accountService.checkout(this.basket).pipe(first()).subscribe(
      x => {
        this.loading = false;
        this.accountService.getBasketTotal();
        this.basket = null;
      }
    );
  }
}
