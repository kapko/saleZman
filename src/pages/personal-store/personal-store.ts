import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { Observable } from 'rxjs';
// local
import { CityService } from '../../services/city.service';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'personal-store',
  templateUrl: 'personal-store.html'
})

export class PersonalStorePage {
  cities: Observable<any>;
  date: string;
  cityName: string;
  searchEvent: Event | null = null;

  constructor(
    private cityService: CityService,
    private appService: AppService,
    private menuController: MenuController,
  ) {
    this.menuController.enable(true);
    this.cities = this.cityService.getCities().take(1);
    this.date = this.appService.getCurrentDate();
  }

  searchItems(e: Event): void {
    this.searchEvent = e;
  }

}
