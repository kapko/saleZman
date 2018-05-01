import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
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
  searchEvent: string | null = null;
  searchText: string;

  constructor(
    private cityService: CityService,
    private appService: AppService,
    private menuController: MenuController,
    private navController: NavController,
    private storage: Storage
  ) {
    this.menuController.enable(true);
    this.cities = this.cityService.getCities().take(1);
    this.date = this.appService.getCurrentDate();
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

  getMyStorePage(): void {
    this.navController.setRoot(PersonalStorePage);
  }

}
