import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import { Product } from '../model/product';
import {ProductService} from '../product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, first } from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BasketItem} from '../../auth/model/basket';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  loading = true;
  formItemToBasket: FormGroup;
  constructor(private fb: FormBuilder, private accountService: AuthService, private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.pipe(
      first(),
      switchMap((params: ParamMap) =>
        this.productService.getById( params.get('id'))
      )
    ).subscribe(
      x => {
        this.loading = false;
        this.product = x;
      }
    );
    this.formItemToBasket = this.fb.group({
      quantity: ['1', Validators.required]
    });
  }

  addToBasket(): void {
    const item = new BasketItem();
    item.productId = this.product.id;
    item.price = this.product.discountedPrice;
    item.quantity = this.formItemToBasket.value.quantity;
    this.accountService.addToBasket(item).pipe(first()).subscribe();
    this.accountService.getBasketTotal();
  }

}
