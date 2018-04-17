import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { MyUserService } from './my-users-service';

@Injectable()
export class StoreIconService {
  private countStockDatePath: string = '/count-stock-date/';

  private countOrderDatePath: string = '/count-order-date/';

  private countSupplyDatePath: string = '/count-supply-date/';

  private countPaymentDatePath: string = '/count-payment-date/';
  
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private myUserService: MyUserService
  ) {}

  // get STOCK for store by user id
  getDateCountStockById(storeKey: string, uid: string = this.authService.currentUserId): Observable<any> {
    return this.db
      .object(this.countStockDatePath+`${uid}/${storeKey}`)
      .valueChanges();
  }

  // get ORDER for store by user id
  getDateCountOrderById(storeKey: string, uid: string = this.authService.currentUserId): Observable<any> {
    return this.db
      .object(this.countOrderDatePath+`${uid}/${storeKey}`)
      .valueChanges();
  }

  // get SUPPLY for store by user id
  getDateCountSupplyById(storeKey: string, uid: string = this.authService.currentUserId): Observable<any> {
    return this.db
      .object(this.countSupplyDatePath+`${uid}/${storeKey}`)
      .valueChanges();
  }

  // get PAYMENT for store by user id
  getDateCountPaymentById(storeKey: string, uid: string = this.authService.currentUserId): Observable<any> {
    return this.db
      .object(this.countPaymentDatePath+`${uid}/${storeKey}`)
      .valueChanges();
  }

  // value: string = 'stock' | 'order' | 'supply' | 'payment';
  getCountDateForDistributor(storeKey: string, value: string): Observable<any> {
    return this.myUserService
      .getSnapShotUsers()
      .flatMap(dists => {
        let data = [];

        // collected data for distributor
        dists.map(item => {
          switch (value) {
            case 'stock':
              data.push(this.getDateCountStockById(storeKey, item.key).take(1));
              break;
            case 'order':
              data.push(this.getDateCountOrderById(storeKey, item.key).take(1));
              break;
            case 'supply':
              data.push(this.getDateCountSupplyById(storeKey, item.key).take(1));
              break;
            case 'payment':
              data.push(this.getDateCountPaymentById(storeKey, item.key).take(1));
              break;
          }
        });

        return Observable
          .forkJoin(...data)
          .defaultIfEmpty([])
          .map((a, b) => {
            if (a.length > 1) {
              return a.concat(b)
            } else {
              return a;
            }
          }, []);
      });
  }

}
