import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
// local
import { CityService } from '../../services/city.service';
import { AppService } from '../../services/app-service';
import { SearchPage } from '../search/search';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'personal-store',
  templateUrl: 'personal-store.html'
})

export class PersonalStorePage {
  cities: string [] = [];
  date: string;
  cityName: string;
  searchText: string | null = null;
  searchEvent: string | null = null;
  activityDays: string[] = [];

  constructor(
    private cityService: CityService,
    private appService: AppService,
    private menuController: MenuController,
    private navController: NavController,
    private storage: Storage
  ) {
    this.menuController.enable(true);
    this.date = this.appService.getCurrentDate();
    // set by default 30 days
    this.activityDays = this.appService
      .getDates(this.appService
      .getCustomDate(30), new Date());
  }

  ngOnInit(): void {
    this.getCities();
  }

  filterByDay(event: Event): void {
    this.getVal(event)
      .subscribe(val => {
        // check activity for valid
        if (val > 150 || val <= 0) {
          this.appService.showToast('Invalid number for Activity day ' + val);
          return;
        }
        
        // filter by activity
        this.activityDays = this.appService
          .getDates(this.appService
          .getCustomDate(val), new Date());
      });
  }

  ionViewWillEnter(): void{
    this.storage.get('searchText')
      .then(text => {
        if (text) {
          this.searchText = text;
          this.searchItems(text);
        }
      });
  }

  ionViewWillLeave(): void {
    this.storage.set('searchText', this.searchEvent);
  }

  searchItems(text: string): void {
    this.searchEvent = text;
  }

  getAllStorePage(): void {
    this.navController.setRoot(SearchPage);
  }

  getVal(event: Event): Observable<any> {
    return fromEvent(event.target, 'keyup')
      .map(ev => +ev['target'].value)
      .debounceTime(700)
      .take(1);
  }

  getCities(): void {
    this.cityService.getPersonalStores({limit: 100})
      .map(data => data.map(c => c.payload.val().city))
      .subscribe(cities => {
        this.cities = cities;
      });
  }

}
