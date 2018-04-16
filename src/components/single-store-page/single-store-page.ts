import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'single-store-page',
  templateUrl: 'single-store-page.html'
})

export class SingleStorePage {
  store: Object;

  constructor(
    private navParams: NavParams,
  ) {
    this.store = this.navParams.data;
  }

}
