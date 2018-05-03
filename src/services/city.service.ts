import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class CityService {
  uid: string = localStorage.getItem('auth');

  cityPath: string = '/cities/';

  storeNamesPath: string = '/store-names/';

  personalStorePath: string = '/personal-store/';

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
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
      .snapshotChanges();
  }

  getPersonalStores(query: any): Observable<any> {
    return this.db.list(
      this.personalStorePath + this.authService.currentUserId,
      ref => (query.city) 
        ? ref.orderByChild('city').equalTo(query.city) 
        : ref.limitToFirst(query.limit))
      .snapshotChanges()
      .take(1)
  }

}
