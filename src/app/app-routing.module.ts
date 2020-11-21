import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {FaqComponent} from './faq/faq.component';
import {ContactComponent} from './contact/contact.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'gyik', component: FaqComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
