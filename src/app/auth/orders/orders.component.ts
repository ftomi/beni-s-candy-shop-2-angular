import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {Order} from '../model/order';
import * as moment from 'moment';
import {BasketItem} from '../model/basket';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  loading: boolean;
  orders: Order[];
  itemsToDisplay: any[];

  constructor(private accountService: AuthService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.accountService.getPastOrders()
      .pipe(first())
      .subscribe(x => {
        const items = x;
        console.log(items);
        this.itemsToDisplay = [];
        if (items && items.length > 0) {
          for (const item of items) {
            // tslint:disable-next-line:no-shadowed-variable
            const sum = item.basket.items.reduce((total, item: BasketItem) => {
              return total + item.quantity * item.price;
            }, 0);
            this.itemsToDisplay.push({
              date: moment().format('YYYY-MM-DD HH:mm:ss'),
              itemsSummary: sum
            });
          }
          this.orders = items;
        }
        this.loading = false;
      }, err => this.loading = false);
  }

}
