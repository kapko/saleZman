import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { storeName } from '../interfaces/city.store';

@Injectable()
export class CityService {
  uid: string = localStorage.getItem('auth');

  cityPath: string = '/cities/';

  storeNamesPath: string = '/store-names/';

  constructor(
    private db: AngularFireDatabase,
  ) {}

  getCities(): Observable<any> {
    return this.db.list(this.cityPath, ref => ref.orderByChild('name')).valueChanges();
  }

  getStoreNames(query: any): Observable<any> {
    return this.db.list(
      this.storeNamesPath,
      ref => (query.city) 
        ? ref.orderByChild('city').equalTo(query.city) 
        : ref.limitToFirst(query.limit))
      .valueChanges();
  }

}
