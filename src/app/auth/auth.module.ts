import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import { OrdersComponent } from './orders/orders.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BasketComponent } from './basket/basket.component';


@NgModule({
  declarations: [ProfileComponent, OrdersComponent, BasketComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class AuthModule { }
