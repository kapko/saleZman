import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { storeName } from '../interfaces/city.store';
import { AppService } from './app-service';
import { AuthService } from './auth.service';
import { StoreService } from './store.service';

@Injectable()
export class MyService {
  userId: string = this.storeService.userId;

  mySuppliedDataPath: string = '/my-work-supply/';

  myPaidDataPath: string = '/my-work-supply/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private storeService: StoreService,
  ) { }

  // setUserStoreName(storeData: storeName): Promise<void> {
  //   return this.db.object(this.userStoreNamePath + this.userId).update(storeData);
  // }

  getMySuppliedData(): Observable<any> {
    return this.db.list(this.mySuppliedDataPath + this.userId).valueChanges();
  }

  getMyPaidData(): Observable<any> {
    return this.db.list(this.myPaidDataPath + this.userId).valueChanges();
  }

}
