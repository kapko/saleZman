import { Component } from '@angular/core';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  cities: Observable<any>;
  date: string;

  constructor(
    private appService: AppService
  ) {
    this.date = this.appService.getCurrentDate();
  }
}
