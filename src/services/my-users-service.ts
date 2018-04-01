import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { AuthService } from './auth.service';

@Injectable()

export class MyUserService {
  distributerPath: string = '/distributors-users/';

  userPath: string = '/users/';

  linkUserdPath: string = '/linked-user/'

  distributorsUserPath: string = '/distributors-users/';

  storeBillPath: string = '/store-billing/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private authService: AuthService,
  ) { }

  getMyUsers(): Observable<any> {
    return this.db.list(this.distributerPath + this.authService.currentUserId).snapshotChanges();
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
      .valueChanges();
  }

  getStoreOrderedItem(key: string): Observable<any> {
    return this.db
      .object(`${this.storeBillPath}${this.authService.currentUserId}/${key}`)
      .valueChanges();
  }

  clearStoreBillProduct(key: string): Promise<any> {
    return this.db
      .object(this.storeBillPath+`${this.authService.currentUserId}/${key}`)
      .set(null);
  }

}
