import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CityService } from '../../services/city.service';
import { Observable } from 'rxjs';
import { storeName } from '../../interfaces/city.store';
import { AppService } from '../../services/app-service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { StorePage } from '../store/store';

@Component({
  selector: 'search-page',
  templateUrl: 'search.html'
})
export class SearchPage {
  cities: Observable<any>;
  storeNames: storeName[] = [];
  rawNames: storeName[] = [];
  date: string;

  constructor(
    private navCtrl: NavController,
    private cityService: CityService,
    private appService: AppService
  ) {
    this.appService.presentLoading(true);
  
    this.cities = this.cityService.getCities().take(1);
    this.getStoreNamesData({});
    this.date = this.appService.getCurrentDate();
  }

  getStoreNamesData(query: any): void {
    this.cityService.getStoreNames(query)
      .do(() => this.appService.hideLoading())
      .take(1)
      .map(names => names.sort((a, b) => a._name.localeCompare(b._name)))
      .subscribe(names => {
        this.storeNames = names;
        this.rawNames = names;
      });
  }

  searchItems(ev: any): void {
    let val = ev.target.value;

    if (val && val.trim() === '') {
      this.storeNames = this.rawNames;
      return;
    }
    this.storeNames = this.rawNames.filter(item => 
      (item._name.indexOf(val.toLowerCase()) > -1)
    );
  }

  sortByCity(city: string): void {
    this.getStoreNamesData({city});
  }

  openStore(store: any): void {
    this.navCtrl.push(StorePage, {store});
  }

}
