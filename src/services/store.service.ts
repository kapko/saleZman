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

}
