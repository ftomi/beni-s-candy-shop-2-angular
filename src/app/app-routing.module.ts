import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {FaqComponent} from './faq/faq.component';
import {ContactComponent} from './contact/contact.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'gyik', component: FaqComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
  {path: 'basket', loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule), canActivate: [AuthGuard]},
  {path: 'account', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
