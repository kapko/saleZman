import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CityService } from '../../services/city.service';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs';
import { storeName } from '../../interfaces/city.store';
import { AppService } from '../../services/app-service';

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
    // private navCtrl: NavController,
    private cityService: CityService,
    private appService: AppService
  ) {
    this.cities = this.cityService.getCities().take(1);
    this.getStoreNamesData({});
    this.date = this.appService.getCurrentDate();
  }

  getStoreNamesData(query: any): void {
    this.cityService.getStoreNames(query)
      .take(1)
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

}
