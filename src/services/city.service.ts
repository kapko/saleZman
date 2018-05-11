import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import 'firebase';

@Injectable()
export class CityService {
  uid: string = localStorage.getItem('auth');

  cityPath: string = '/cities/';

  storeNamesPath: string = '/store-names/';

  personalStorePath: string = '/personal-store/';

  personalStoreDayPath: string = '/personal-store-day/';

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  getCities(): Observable<any> {
    return this.db.list(this.cityPath, ref => ref.orderByChild('name')).valueChanges();
  }

  getPersonalStores(key: null | string = null, currentDay: string): any {
    switch (currentDay) {
      case 'All days':
        return this.getPersonalStoreByDay(key, 'all');
      case 'Not Set':
        return this.getPersonalStoreByDay(key);
      default:
        let day = currentDay.toLocaleLowerCase();
        return this.getPersonalStoreByDay(key, day);
    }
  }

  getPersonalStoreByDay(key: string | null, day: string | null = null): Observable<any> {
    let URL;
    if (!day) {
      URL = this.personalStorePath + this.authService.currentUserId;
    } else {
      URL = `${this.personalStoreDayPath}${this.authService.currentUserId}/${day}`;
    }
    console.log('URL', URL);
    return this.db.list(
      URL,
      ref => (key)
        ? ref.orderByKey().endAt(key).limitToLast(20)
        : ref.limitToLast(20)
      )
      .snapshotChanges()
      .take(1)
      .map(data => {
        if (!day) {
          return data
            .filter(item => (!item.payload.val().hasOwnProperty('personal_day')))
            .map(c => ({_id: c.key, ...c.payload.val()})).reverse()
        } else {
          return data.map(c => ({_id: c.key, ...c.payload.val()})).reverse();
        }
      });
  }
}
