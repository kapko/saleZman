import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { storeName } from '../interfaces/city.store';

@Injectable()
export class StoreService {
  userId: string = localStorage.auth;

  productPath: string = '/products/'

  userStoreNamePath: string = '/user-store-name/';

  storePath: string = '/store-names/';

  companyPath: string = '/companies/';

  usersProductPath: string = '/users-product/';

  usersOrderedProductPath: string = '/users-ordered-product/';

  supplyListPath: string = '/supply/';

  constructor(
    private db: AngularFireDatabase,
  ) {}

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

  getUserProductList(): Observable<any> {
    return this.db.list(`${this.usersProductPath}${this.userId}`).valueChanges();
  }

  getSupplyList(): Observable<any> {
    return this.db.list(this.supplyListPath).valueChanges();
  }

  getUserOrderedList(): Observable<any> {
    return this.db.list(`${this.usersOrderedProductPath}${this.userId}`).valueChanges();
  }

  updateUsersProductList(product: any): Promise<void> {
    let data = (!product.counter) ? null : product;
  
    return this.db
      .object(`${this.usersProductPath}${this.userId}/${product._name}${product.Weight}`)
      .set(data);
  }

  updateUsersOrderedProductList(product: any): Promise<void> {
    let data = (!product.counter) ? null : product;

    return this.db
      .object(`${this.usersOrderedProductPath}${this.userId}/${product._name}${product.Weight}`)
      .set(data);
  }



}
