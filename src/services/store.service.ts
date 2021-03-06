import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { storeName } from '../interfaces/city.store';
import { AppService } from './app-service';
import { AuthService } from './auth.service';

@Injectable()
export class StoreService {
  productPath: string = '/products/'

  userStoreNamePath: string = '/user-store-name/';

  storePath: string = '/store-names/';

  companyPath: string = '/companies/';

  usersProductPath: string = '/users-product/';

  usersOrderedProductPath: string = '/users-ordered-product/';

  supplyListPath: string = '/supply/';

  testSupplyPath: string = '/test-supply/';

  testSupplyItemPath: string = '/test-supply-items/';

  paymentListPath: string = '/payments/';

  paymentPaidListPath: string = '/paid-list/';

  supplyCommentPath: string = '/supply-comments/';

  commentPath: string = '/comments/';

  paymentCommentPath: string = '/payment-comments/';

  balanceOfPaymentPath: string = '/balance-of-payment/';

  persolanStorePath: string = '/personal-store/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private authService: AuthService
  ) {}

  setPersonToStore(storeId: string, val: boolean | null = true): Promise<any> {
    return this.db
      .object(this.storePath+storeId+'/persons/'+this.authService.currentUserId)
      .set(val);
  }

  setUserStoreName(storeData: storeName, uid: string = this.authService.currentUserId): Promise<void> {
    return this.db.object(this.userStoreNamePath + uid).update(storeData);
  }

  getStoreByKey(key: string): Observable<any> {
    return this.db.object(this.storePath + key).valueChanges();
  }

  getStoreNameOfProduct(uid: string = this.authService.currentUserId): Observable<any> {
    return this.db.object(this.userStoreNamePath + uid).valueChanges();
  }

  getCompanies(uid: string = this.authService.currentUserId): Observable<any> {
    return this.db
      .list(this.companyPath+uid)
      .snapshotChanges()
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  removeCompanyById(key: string, uid: string = this.authService.currentUserId): Promise<any> {
    return this.db
      .object(this.companyPath+`${uid}/${key}`)
      .set(null)
  }

  removeProductById(key: string, uid: string = this.authService.currentUserId): Promise<any> {
    return this.db
      .object(this.productPath+`${uid}/${key}`)
      .set(null)
  }

  getStoreData(url: string): Observable<any> {
    return this.db.list(this.storePath, 
      ref => ref.orderByChild('url').equalTo(url)).valueChanges();
  }

  getProducts(uid: string, company: string = null): Observable<any>{
    return this.db
    .list(
      this.productPath + uid,
      ref => (company) ? ref.orderByChild('company').equalTo(company) : ref
    )
    .snapshotChanges()
    .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  getProductsById(uid: string = this.authService.currentUserId, company: string = null): Observable<any>{
    return this.db
      .list(this.productPath+uid)
      .snapshotChanges()
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  getUserProductList(storeName: string, uid: string = this.authService.currentUserId): Observable<any> {
    return this.db.list(`${this.usersProductPath}${storeName}/${uid}/${this.getDate()}`).snapshotChanges()
    .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  getSupplyList(distId: string, storeName: string): Observable<any> {
    return this.db.list(
      this.supplyListPath + storeName,
      ref => ref.orderByChild('dist_id').equalTo(distId)
    )
    .snapshotChanges()
    .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  getPaymentList(storeName: string, distId: string): Observable<any> {
    return this.db.list(
      this.paymentListPath + storeName,
      ref => ref.orderByChild('dist_id').equalTo(distId)
    )
    .snapshotChanges()
    .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  getPaidList(storeName: string, distId: string): Observable<any> {
    return this.db.list(
      this.paymentPaidListPath + storeName,
      ref => ref.orderByChild('dist_id').equalTo(distId)
    )
    .snapshotChanges()
    .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  // getPList(storeName: string, distId: string): Observable<any> {
  //   return this.db.list(
  //     // this.paymentPaidListPath + storeName,
  //     this.paymentListPath + storeName,
  //     ref => ref.equalTo('dist_id').equalTo(distId)
  //   )
  //   .snapshotChanges()
  //   .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  // }

  getUserOrderedList(storeName:string, uid: string = this.authService.currentUserId): Observable<any> {
    return this.db
    .list(`${this.usersOrderedProductPath}${storeName}/${uid}/${this.getDate()}`).snapshotChanges()
    .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  updateUsersProductList(product: any, storeName: string, uid: string = this.authService.currentUserId): Promise<void> {
    let data = (!product.counter) ? null : product;
  
    return this.db
      .object(`${this.usersProductPath}${storeName}/${uid}/${this.getDate()}/${product.key}`)
      .set(data);
  }

  updateUsersOrderedProductList(product: any, storeName: string, uid: string = this.authService.currentUserId): Promise<void> {
    let data = (!product.counter) ? null : product;

    return this.db
      .object(`${this.usersOrderedProductPath}${storeName}/${uid}/${this.getDate()}/${product.key}`)
      .set(data);
  }

  getDate(): string {
    return this.appService.getCurrentDate(true).replace(/\./ig, '-');
  }

  submitCommit(value: string, storeName: string, commentUrl: string, uid: string = this.authService.currentUserId): Promise<void> {
    return this.db.object(`${this.commentPath}${storeName}/${commentUrl}-${uid}-${this.getDate()}`).set(value);
  }

  submitCommonCommit(value: Object, storeName: string, payment: boolean = false): any {
    let commitPath = (payment) ? this.paymentCommentPath : this.supplyCommentPath;

    return this.db.list(`${commitPath}${storeName}/`).push(value);
  }

  getCommonCommit(distId: string, storeName: string, payment: boolean = false): Observable<any> {
    let commitPath = (payment) ? this.paymentCommentPath : this.supplyCommentPath;

    return this.db.list(`${commitPath}${storeName}`, 
      ref => ref.orderByChild('uid').equalTo(distId)
    )
    .valueChanges();
  }

  getComment(storeName: string, commentUrl: string, uid: string = this.authService.currentUserId): Observable<any> {
    return this.db.object(`${this.commentPath}${storeName}/${commentUrl}-${uid}-${this.getDate()}`).valueChanges();
  }

  getOrderCountDate(key): Observable<any> {
    return this.db.object(`/count-order-date/${key}`).valueChanges();
  }

  getSupplyCountDate(key): Observable<any> {
    return this.db.object(`/count-supply-date/${key}`).valueChanges();
  }

  getPaymentCountDate(key): Observable<any> {
    return this.db.object(`/count-payment-date/${key}`).valueChanges();
  }

  getStoreBillingComment(url): Observable<any> {
    return this.db.object(`${this.commentPath}${url}`).valueChanges();
  }

  updateSupplyItem(storeName: string, product: any): Promise<any> {
    return this.db.object(`supply/${storeName}/${product.key}`).set(product);
  }

  addSupplyToPayment(storeName: string, product: any): Promise<any> {
    product.payment_status = 'pending';
    return this.db.object(`payments/${storeName}/${product.key}`).set(product);
  }

  addPayment(storeName: string, product: Object): any {
    return this.db.list(this.paymentPaidListPath + storeName).push(product);
  }
  
  addStore(val: any): any {
    return this.db.list(this.storePath).push(val);
  }

  updateStore(key: string, val: Object | null = null): Promise<any> {
    return this.db.object(this.storePath + key).set(val);
  }

  updatePersonalStore(key: string, val: Object | null = null): Promise<any> {
    return this.db
      .object(`${this.persolanStorePath}${this.authService.currentUserId}/${key}`)
      .update(val);
  }

  getPersonalStoreById(key: string): Observable<any> {
    return this.db
      .list(`${this.persolanStorePath}${this.authService.currentUserId}`, 
      ref => ref.orderByChild('key').equalTo(key))
      .snapshotChanges()
      .take(1)
      .map(data => data.map(c => ({ _id: c.payload.key, ...c.payload.val() }))[0])
  }

  // balance
  setBalance(key: string, balance: number): Promise<any> {
    return this.db.object(this.balanceOfPaymentPath + key).set(balance);
  }

  getBalance(key: string): Observable<any> {
    return this.db.object(this.balanceOfPaymentPath + key).valueChanges();
  }

  updatePaymentStatus(storeName: string, key: string): Promise<any> {
    return this.db.object(`payments/${storeName}/${key}/payment_status`).set('done');
  }

  addTestSupply(data: Object | null, key: number): Promise<any> {
    // key = `order_id`;
    return this.db
      .object(this.testSupplyPath+`${this.authService.currentUserId}/${key}`)
      .set(data);
  }

  addSupply(data: Object, storeName: string): void {
    this.db
      .list(this.supplyListPath+storeName)
      .push(data);
  }

  getSupplyByKey(key: string): Observable<any> {
    return this.db
      .list(this.supplyListPath + key)
      .snapshotChanges()
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })));
  }

  getTestSupply(salezman: string | null = null): Observable<any> {
    return this.db
      .list(this.testSupplyPath + this.authService.currentUserId, 
      ref => (salezman) ? ref.orderByChild('ordered_by').equalTo(salezman) : ref)
      .valueChanges();
  }

  setTestSupplyItem(key: string, product: any): Promise<any> {
    return this.db
      .object(`${this.testSupplyItemPath}${this.authService.currentUserId}/${key}`)
      .set(product);
  }

  getTestSupplyItem(key: string): Observable<any> {
    return this.db
      .object(this.testSupplyItemPath+`${this.authService.currentUserId}/${key}`).valueChanges();
  }

  addProduct(val: Object): any {
    return this.db
      .list(this.productPath+this.authService.currentUserId)
      .push(val);
  }

  updateProduct(val: Object, key: string): Promise<any> {
    return this.db
      .object(`${this.productPath}${this.authService.currentUserId}/${key}`)
      .set(val);
  }

  addCompany(val: Object): any {
    return this.db
      .list(this.companyPath+this.authService.currentUserId)
      .push(val);
  }

  updateCompany(val: Object, key: string): Promise<any> {
    return this.db
      .object(`${this.companyPath}${this.authService.currentUserId}/${key}`)
      .set(val);
  }

}
