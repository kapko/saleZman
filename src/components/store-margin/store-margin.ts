import { Component } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ViewController, NavParams } from 'ionic-angular';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'store-margin',
  templateUrl: 'store-margin.html',
})

export class StoreMarginComponent {
  days: string[] = this.appService.getDays();

  private storeKey: string;
  private personal_margin: string;
  private personal_description: string;
  private personal_day: string = this.appService.getCurrentDay();
  private storeName: string;

  constructor(
    private storeService: StoreService,
    private viewCtrl: ViewController,
    private params: NavParams,
    private appService: AppService
  ) {
    this.getPersonStore(this.params.get('key'));
  }

  getPersonStore(key: string): void {
    this.storeService
      .getPersonalStoreById(key)
      .subscribe(store => {
        this.storeKey = store._id;
        this.storeName = store.name;

        this.personal_description = (store.hasOwnProperty('personal_description')) ? store.personal_description : '';
        this.personal_day = (store.hasOwnProperty('personal_day')) ? store.personal_day : '';
        this.personal_margin = (store.hasOwnProperty('personal_margin')) ? store.personal_margin : '';
      })
  }

  updateItem(val: string | null = null): void {
    if (val) {
      this.viewCtrl.dismiss();
      return;
    }

    let data = {
      personal_description: (this.personal_description) ? this.personal_description : null,
      personal_margin: (this.personal_margin) ? this.personal_margin : null,
      personal_day: (this.personal_day) ? this.personal_day : null
    }

    this.storeService
      .updatePersonalStore(this.storeKey, data)
      .then(res => {
        this.appService.showToast('Updated Your Store');
        this.viewCtrl.dismiss();
      })
      .catch(err => console.log(err));
  }

}

