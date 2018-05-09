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

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  getCities(): Observable<any> {
    return this.db.list(this.cityPath, ref => ref.orderByChild('name')).valueChanges();
  }

  getPersonalStores(key: null | string = null): any {
    return this.db.list(
      this.personalStorePath + this.authService.currentUserId,
      ref => (key)
        ? ref.orderByKey().endAt(key).limitToLast(20)
        : ref.limitToLast(20)
      )
      .snapshotChanges()
      .take(1)
  }
}
