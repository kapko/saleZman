import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../../pages/profile/profile';
import { SearchPage } from '../../pages/search/search';

@Component({
  selector: 'app-list',
  templateUrl: 'list.html',
})

export class ListComponent {
  @Input() products: any;
  rowProducts: any;

  constructor(
    private nav: NavController,
    private appService: AppService,
  ) {}

  ngOnChanges(): void {
    this.rowProducts = this.products;
  }

  searchItems(ev: any): void {
    if (!ev) return; 
    let val = ev.target.value;

    if (val && val.trim() === '') {
      this.products = this.rowProducts;
      return;
    }
    this.products = this.rowProducts.filter(item => 
      (item._name.indexOf(val.toLowerCase()) > -1)
    );
  }

  count(product: any, count: boolean): void {
    if (!count && +product.counter < 1) return;
    product.counter += (count) ? 1 : -1;
  }

}
