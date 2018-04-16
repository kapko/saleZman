import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
// local
import { CityService } from '../../services/city.service';
import { AppService } from '../../services/app-service';
import { SearchPage } from '../search/search';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'personal-store',
  templateUrl: 'personal-store.html'
})

export class PersonalStorePage {
  cities: Observable<any>;
  date: string;
  cityName: string;
  searchEvent: Event | null = null;
  activityDays: string[] = [];

  constructor(
    private cityService: CityService,
    private appService: AppService,
    private menuController: MenuController,
    private navController: NavController,
    private storeService: StoreService
  ) {
    this.getSupplyCheckedDay();

    this.menuController.enable(true);
    this.cities = this.cityService.getCities().take(1);
    this.date = this.appService.getCurrentDate();
  }

  filterByDay(event: Event): void {
    this.getVal(event)
      .subscribe(val => {
        // check activity for valid
        if (val > 30 || val <= 0) {
          this.appService.showToast('Invalid number for Activity day ' + val);
          return;
        }
        
        // filter by activity
        this.activityDays = this.appService
          .getDates(this.appService
          .getCustomDate(val), new Date());
      });
  }

  getSupplyCheckedDay(): void {
    // this.storeService.getComment()
  }

  searchItems(e: Event): void {
    this.searchEvent = e;
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

  filterByActivity(days): void {

  }

}
