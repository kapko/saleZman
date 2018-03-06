import { Component } from '@angular/core';
import { NavController, InfiniteScroll } from 'ionic-angular';
import { CityService } from '../../services/city.service';
import { StorePage } from '../store/store';
// interface
import { storeName } from '../../interfaces/city.store';
import { AppService } from '../../services/app-service';
// rxjs
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Component({
  selector: 'search-page',
  templateUrl: 'search.html'
})
export class SearchPage {
  cities: Observable<any>;
  storeNames: storeName[] = [];
  rawNames: storeName[] = [];
  date: string;
  cityName: string;
  limit: number = 20;
  infiniteScroll: InfiniteScroll;
  subject: Subject<any> = new Subject();

  constructor(
    private navCtrl: NavController,
    private cityService: CityService,
    private appService: AppService
  ) {
    this.appService.presentLoading(true);
  
    this.cities = this.cityService.getCities().take(1);
    this.date = this.appService.getCurrentDate();
    this.getStoreNamesData({limit: this.limit});
  }

  getStoreNamesData(query: any): void {
    this.cityService.getStoreNames(query)
      .do(() => {
        this.appService.hideLoading();
        // lazy load
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          this.infiniteScroll = null;
        }
      })
      .take(1)
      .map(names => names.sort((a, b) => a._name.localeCompare(b._name)))
      .subscribe(names => {
        this.storeNames = names;
        this.rawNames = names;
      });
  }

  loadMore(infiniteScroll: InfiniteScroll): void {
    this.limit += 20;
    let query = {limit: this.limit += 20};

    if (this.cityName) {
      query['city'] = this.cityName;
    }

    this.getStoreNamesData(query);
    this.infiniteScroll = infiniteScroll;
  }

  track(index: number, item: any): string {
    return item.$key;
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
    this.cityName = city;
    this.limit = 40;
    this.getStoreNamesData({city: this.cityName, limit: this.limit});
  }

  openStore(store: any): void {
    this.navCtrl.push(StorePage, {store});
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
