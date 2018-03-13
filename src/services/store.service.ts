import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { storeName } from '../interfaces/city.store';
import { AppService } from './app-service';
import { AuthService } from './auth.service';

@Injectable()
export class StoreService {
  userId: string = null;

  productPath: string = '/products/'

  userStoreNamePath: string = '/user-store-name/';

  storePath: string = '/store-names/';

  companyPath: string = '/companies/';

  usersProductPath: string = '/users-product/';

  usersOrderedProductPath: string = '/users-ordered-product/';

  supplyListPath: string = '/supply/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private authService: AuthService
  ) {
    this.authService
      .authUserId()
      .subscribe(item => {
        this.userId = (item) ? item.uid : null;
      });
  }

  setUserStoreName(storeData: storeName): Promise<void> {
    return this.db.object(this.userStoreNamePath + this.userId).update(storeData);
  }

  getStoreNameOfProduct(): Observable<any> {
    return this.db.object(this.userStoreNamePath + this.userId).valueChanges();
  }

  getCompanies(): Observable<any> {
    return this.db.object(this.companyPath).valueChanges();
  }

  getStoreData(url: string): Observable<any> {
    return this.db.list(this.storePath, 
      ref => ref.orderByChild('url').equalTo(url)).valueChanges();
  }

  getProducts(storeName: string, company: string = null): Observable<any>{
    return this.db.list(
      this.productPath + 'simple_store', // here dynamic storeName
      ref => (company) ? ref.orderByChild('company').equalTo(company) : ref
    ).valueChanges();
  }

  getUserProductList(storeName: string): Observable<any> {
    return this.db.list(`${this.usersProductPath}${storeName}/${this.userId}/${this.getDate()}`).valueChanges();
  }

  getSupplyList(storeName: string, limit: number = null): Observable<any> {
    return this.db.list(
      this.supplyListPath + storeName,
      ref => (limit) ? ref.limitToLast(limit) : ref
    ).snapshotChanges();
  }

  getUserOrderedList(storeName:string): Observable<any> {
    return this.db.list(`${this.usersOrderedProductPath}${storeName}/${this.userId}/${this.getDate()}`).valueChanges();
  }

  updateUsersProductList(product: any, storeName: string): Promise<void> {
    let data = (!product.counter) ? null : product;
  
    return this.db
      .object(`${this.usersProductPath}${storeName}/${this.userId}/${this.getDate()}/${product._name}${product.Weight}`)
      .set(data);
  }

  updateUsersOrderedProductList(product: any, storeName: string): Promise<void> {
    let data = (!product.counter) ? null : product;

    return this.db
      .object(`${this.usersOrderedProductPath}${storeName}/${this.userId}/${this.getDate()}/${product._name}${product.Weight}`)
      .set(data);
  }

  getDate(): string {
    return this.appService.getCurrentDate(true).replace(/\./ig, '-');
  }

  submitCommit(value: string, storeName: string, commentUrl: string): Promise<void> {
    return this.db.object(`comments/${storeName}/${commentUrl}-${this.userId}-${this.getDate()}`).set(value);
  }

  getComment(storeName: string, commentUrl: string): Observable<any> {
    return this.db.object(`comments/${storeName}/${commentUrl}-${this.userId}-${this.getDate()}`).valueChanges();
  }

  updateSupplyItem(storeName: string, product: any): Promise<any> {
    return this.db.object(`supply/${storeName}/${product.key}`).set(product);
  }

}
