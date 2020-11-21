import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductOffersComponent } from './product-offers/product-offers.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent, ProductCardComponent, ProductOffersComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ],
  exports: [
    ProductOffersComponent
  ]
})
export class ProductsModule { }
