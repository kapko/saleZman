import { Component } from '@angular/core';
import { NavController, InfiniteScroll, MenuController } from 'ionic-angular';
import { CityService } from '../../services/city.service';
import { StorePage } from '../store/store';
// interface
import { storeName } from '../../interfaces/city.store';
import { AppService } from '../../services/app-service';
// rxjs
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { Subject, Observable } from 'rxjs';
import { StoreService } from '../../services/store.service';

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
    private appService: AppService,
    private menuController: MenuController,
    private storeService: StoreService,
  ) {
    this.menuController.enable(true);
    this.cities = this.cityService.getCities().take(1);
    this.date = this.appService.getCurrentDate();
    this.getStoreNamesData({limit: this.limit});
  }

  getStoreNamesData(query: any): void {
    this.cityService.getStoreNames(query)
      .do(() => {
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
    if (!ev.target.value) {
      this.storeNames = this.rawNames;
      return;
    }
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

  openStore(store: storeName): void {
    this.storeService.setUserStoreName(store);
    this.navCtrl.setRoot(StorePage);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
