import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
// local
import { CityService } from '../../services/city.service';
import { AppService } from '../../services/app-service';
import { PersonalStorePage } from '../personal-store/personal-store';

@Component({
  selector: 'search-page',
  templateUrl: 'search.html'
})
export class SearchPage {
  cities: Observable<any>;
  date: string;
  cityName: string;
  searchEvent: Event | null = null;

  constructor(
    private cityService: CityService,
    private appService: AppService,
    private menuController: MenuController,
    private navController: NavController
  ) {
    this.menuController.enable(true);
    this.cities = this.cityService.getCities().take(1);
    this.date = this.appService.getCurrentDate();
  }

  searchItems(e: Event): void {
    this.searchEvent = e;
  }

  getMyStorePage(): void {
    this.navController.setRoot(PersonalStorePage);
  }

}
