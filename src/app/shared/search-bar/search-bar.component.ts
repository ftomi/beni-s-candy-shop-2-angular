import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../products/product.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';
import { Product } from 'src/app/products/model/product';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  loading: boolean;
  filteredItems: Product[];
  searchForm: FormGroup;
  constructor(private productService: ProductService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      filter: ['']
    });
  }

  onSearch(): void {
    if (this.searchForm.value.filter.length < 3) {
      this.filteredItems = [];
      return;
    }
    this.loading = true;
    this.productService.searchByName(this.searchForm.value.filter)
      .pipe(first())
      .subscribe( x => {
        this.loading = false;
        this.filteredItems = x;
        console.log(this.filteredItems);
      });
  }
}
