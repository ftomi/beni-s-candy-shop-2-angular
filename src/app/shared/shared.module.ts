import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { PartnersComponent } from './partners/partners.component';
import { FooterComponent } from './footer/footer.component';
import {RouterModule} from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {ReactiveFormsModule,
  FormsModule} from '@angular/forms';


@NgModule({
    declarations: [NavigationComponent, PartnersComponent, FooterComponent, SearchBarComponent],
  exports: [
    NavigationComponent,
    FooterComponent,
    PartnersComponent,
    SearchBarComponent
  ],
    imports: [
        CommonModule,
      RouterModule,
      ReactiveFormsModule,
      FormsModule
    ]
})
export class SharedModule { }
