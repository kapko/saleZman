import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { MyService } from './my-service';
import { StoreService } from './store.service';

@Injectable()

export class MyUserService {
  distributerPath: string = '/distributors-users/';

  userPath: string = '/users/';

  linkUserdPath: string = '/linked-user/'

  distributorsUserPath: string = '/distributors-users/';

  storeBillPath: string = '/store-billing/';

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private myService: MyService,
    private storeService: StoreService
  ) { }

  getMyUsers(): Observable<any> {
    return this.db
      .list(this.distributerPath + this.authService.currentUserId)
      .snapshotChanges();
  }

  getDistCompany(): Observable<any> {
    return this
      .getSnapShotDist()
      .flatMap(data => {
          let companies = [];
          data.map(item => {
            companies.push(this.storeService.getCompanies(item.key).take(1));
          });
          return Observable.forkJoin(...companies).defaultIfEmpty([]);
        });
  }

  getComments(storeName: string): Observable<any> {
    return this
      .getSnapShotDist()
      .flatMap(data => {
          let comments = [];
          data.push({ key: this.authService.currentUserId });

          data.map(item => {
            comments.push(
              this.storeService.getCommonCommit(item.key, storeName).take(1)
            );
          });

          return Observable.forkJoin(...comments).defaultIfEmpty([]);
        });
  }

  getDistComments(storeName: string): Observable<any> {
    return this
      .getMyUsers()
      .take(1)
      .flatMap(data => {
          let comments = [];
          data.push({ key: this.authService.currentUserId });

          data.map(item => {
            comments.push(
              this.storeService.getCommonCommit(item.key, storeName).take(1)
            );
          });

          return Observable.forkJoin(...comments).defaultIfEmpty([]);
        });
  }

  getDistPayment(storeName: string): Observable<any> {
    return this
      .getSnapShotDist()
      .flatMap(data => {
        let payments = [];
        data.map(dist => {
          // store_name && distributor_id
          payments.push(this.storeService.getPaymentList(storeName, dist.key).take(1));
        });
        // return list of payment by dist.
        return Observable.forkJoin(...payments).defaultIfEmpty([]);
      });
  }

  getDistPaid(storeName: string): any {
    return this
      .getSnapShotDist()
      .flatMap((data: any) => {
        let paid = [];

        data.map(dist => {
          // store_name && distributor_id
          paid.push(this.storeService.getPaidList(storeName, dist.key).take(1));
        });
        // return list of payment by dist.
        return Observable.forkJoin(...paid).defaultIfEmpty([]);
      });
  }
  

  getDistProducts(company: string): Observable<any>{
    return this
      .getSnapShotDist()
      .flatMap(dists => {
          let products = [];
          dists.map(item => {
            products.push(
              this.storeService.getProducts(item.key, company).take(1)
            );
          });
          return Observable.forkJoin(...products).defaultIfEmpty([]);
        });
  }

  getDistSupply(storeName: string): Observable<any> {
    return this.getSnapShotDist()
      .flatMap(dists => {
        let supplies = [];
        dists.map(item => {
          supplies.push(
            // dist_id && store_name
            this.storeService.getSupplyList(item.key, storeName).take(1)
          )
        })
        return Observable
          .forkJoin(...supplies)
          .defaultIfEmpty([]);
      });
  }

  getSnapShotDist(): Observable<any> {
    return this.db
      .list(this.linkUserdPath+this.authService.currentUserId)
      .snapshotChanges()
      .take(1);
  }

  getSnapShotUsers(): Observable<any> {
    return this.db
      .list(this.distributorsUserPath+this.authService.currentUserId)
      .snapshotChanges()
      .take(1);
  }

  getMyUserWorks(): Observable<any> {
    return this.getMyUsers()
      .take(1)
      .flatMap(users => {

        let observables = [];

        for (let item of users) {
          observables.push(this.myService.getStockActivity(item.key).take(1));
        }

        return Observable.forkJoin(...observables);
      });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.db.list(this.userPath,
      ref => ref.orderByChild('email').equalTo(email)
    ).snapshotChanges();
  }

  getDistributorUserByEmail(uid: string): Observable<any> {
    return this.db
      .object(this.distributerPath+`${this.authService.currentUserId}/${uid}`)
      .valueChanges()
  }

  createUserForDistributor(uid: string): Promise<any> {
    return this.db
      .object(this.distributerPath+`${this.authService.currentUserId}/${uid}`)
      .update({
        activated: false,
        status: false,
      });
  }

  updateDistributorsUser(uid: string, status: boolean): Promise<any> {
    return this.db
      .object(`${this.distributorsUserPath}${this.authService.currentUserId}/${uid}/status`)
      .set(status);
  }

  updateUserForAdmin(uid: string, status: string | null): Promise<any> {
    return this.db
      .object(`${this.userPath}${uid}/status`)
      .set(status);
  }

  createNewUser(user: any, status: string | null = 'user'): Promise<any> {
    return this.db
      .object(this.userPath + user.uid)
      .set({ email: user.email, status: status });
  }

  createUserByDistributor(user: any): Promise<any> {
    return this.db
      .object(`${this.distributorsUserPath}${this.authService.currentUserId}/${user.uid}`)
      .set({email: user.email, admin: false});
  }

  linkUser(distId: string): Promise<any> {
    return this.db
      .object(this.linkUserdPath+`${this.authService.currentUserId}/${distId}`)
      .set(true);
  }

  updateLinkOfUser(uid: string, status: boolean | null): Promise<any> {
    return this.db
      .object(this.linkUserdPath+`/${uid}/${this.authService.currentUserId}`)
      .set(status);
  }

  getStoreBill(order_by: string | null = null): Observable<any> {
    return this.db
      .list(this.storeBillPath+this.authService.currentUserId, 
      ref => (order_by) ? ref.orderByChild('order_by').equalTo(order_by) : ref)
      .snapshotChanges()
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })))
  }

  getStoreOrderedItem(key: string): Observable<any> {
    return this.db
      .object(`${this.storeBillPath}${this.authService.currentUserId}/${key}`)
      .valueChanges();
  }

  checkedSubmitedOrder(key: string, checked: boolean | null = true): Promise<any> {
    return this.db
      .object(this.storeBillPath+`${this.authService.currentUserId}/${key}/checked`)
      .set(checked);
  }

  clearStoreBillProduct(key: string): Promise<any> {
    return this.db
      .object(this.storeBillPath+`${this.authService.currentUserId}/${key}`)
      .set(null);
  }

}
