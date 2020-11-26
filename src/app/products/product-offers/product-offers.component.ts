import { Component, OnInit } from '@angular/core';
import {Product} from '../model/product';
import {ProductService} from '../product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../shared/alert.service';
import {first} from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-offers',
  templateUrl: './product-offers.component.html',
  styleUrls: ['./product-offers.component.scss']
})
export class ProductOffersComponent implements OnInit {

  products: Product[];
  productsByPage: Product[];
  loading = true;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.productService.getAll().pipe(first()).subscribe(
      next => {
        this.products = next;
        this.productsByPage = _.drop(next, 0).slice(0, 6);
        this.loading = false;
       },
      error => {
        // this.alertService.error(error);
        this.loading = false;
      }
    );
  }
}
