import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { storeName } from '../../interfaces/city.store';

@Component({
  selector: 'store-page',
  templateUrl: 'store.html'
})
export class StorePage {
  store: storeName;

  constructor(
    private navParams: NavParams,
  ) {
    this.store = this.navParams.data.store;
  }
}
