import { Component, OnInit } from '@angular/core';
import {ProductService} from '../product.service';
import {Product} from '../model/product';
import { first } from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../shared/alert.service';
import * as _ from 'lodash';
import {Subscription} from'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productSub$: Subscription;
  products: Product[];
  productsByPage: Product[];
  page = 1;
  public loading = true;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService) {
    productService.getAll()
      .pipe(first())
      .subscribe(
    next => {
      this.products = next;
      this.page = 1;
      this.loading = false;
      this.productsByPage = _.drop(next, 0).slice(0, 6);
    },
    error => {
      // this.alertService.error(error);
      this.loading = false;
    }
  ); }

  ngOnInit(): void {

  }

  getByPage(page: number): void{

    this.loading = true;
    this.page = page;
    this.productsByPage = _.drop(this.products, (page - 1) * 6).slice(0, 6);
    this.loading = false;
  }

  getNextPage(): void{
    this.getByPage(this.page++);
  }

  getPreviousPage(): void{
    this.getByPage(this.page--);
  }
}
