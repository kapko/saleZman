import { Injectable, Query } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { city, storeName } from '../interfaces/city.store';

@Injectable()
export class CityService {
  uid: string = localStorage.getItem('auth');

  cityPath: string = '/cities/';

  storeNamesPath: string = '/store-names/';

  constructor(
    private db: AngularFireDatabase,
  ) {}

  getCities(): Observable<any> {
    return this.db.list(this.cityPath).valueChanges();
  }

  getStoreNames(query: storeName): Observable<any> {
    return this.db.list(
      this.storeNamesPath, 
      ref => (Object.keys(query).length) 
        ? ref.orderByChild('city').equalTo(query.city) : ref)
      .valueChanges();
  }

}
