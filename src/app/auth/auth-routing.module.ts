import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {OrdersComponent} from './orders/orders.component';
import {BasketComponent} from './basket/basket.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: ProfileComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'basket', component: BasketComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
