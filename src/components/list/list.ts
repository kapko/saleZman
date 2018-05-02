import { Component, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.html',
})

export class ListComponent {
  @Input() products: any;
  @Input() store: any;
  @Input() activeTab: string;

  rowProducts: any;

  usersProduct: any[] = [];

  subject: Subject<any>;

  showOrdered: boolean = false;

  allProducts: boolean = false;  

  comments: string = '';

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private appService: AppService,
  ) {
    this.subject = new Subject();
  }

  ngOnChanges(): void {
    this.usersProduct = [];
    this.comments = '';

    if (!this.store) return;

    this.getComments();

    switch (this.activeTab) {
      case 'list-box':
        this.showOrdered = false;
        this.getProductList();
        break;
      case 'basket':
        this.showOrdered = true;
        this.getOrderedList();
        break;
    }
  }

  getProductList(): void {
    this.storeService
      .getUserProductList(this.store.key)
      .takeUntil(this.subject)
      .subscribe(items => {
        this.usersProduct = items;
      });
  }

  getOrderedList(): void {
    this.storeService
      .getUserOrderedList(this.store.key)
      .takeUntil(this.subject)
      .subscribe(items => {
        this.usersProduct = items;
      });
  }

  selectAllProduct(event: boolean): void {
    this.rowProducts = (event) ? this.products : [];
  }

  searchItems(val: string): void {
    if (!val) {
      this.rowProducts = (this.allProducts) ? this.products : [];
      return;
    }

    this.rowProducts = this.products.filter(item => 
      (item.name.indexOf(val.toLowerCase()) > -1)
    );
  }

  count(product: any, count: boolean): void {
    if (this.showOrdered && this.authService.currentUserStatus) {
      this.appService.showToast("You haven't linked yet by Distributor!");
      return;
    }

    if (!count && +product.counter < 1) return;
    product.counter += (count) ? 1 : -1;
    product.count_date = this.appService.getToday();
    if (this.showOrdered) {
      this.storeService.updateUsersOrderedProductList(product, this.store.key);
    } else {
      this.storeService.updateUsersProductList(product, this.store.key);
    }
  }

  removeProduct(product: any): void {
    product['counter'] = 0;
    if (this.showOrdered) {
      this.storeService.updateUsersOrderedProductList(product, this.store.key);
    } else {
      this.storeService.updateUsersProductList(product, this.store.key);
    }
  }

  submitCommit(event: any): void {
    let value = event.target.value;
    let commentUrl = (this.activeTab === 'list-box') ? 'product' : 'ordered';
    this.storeService.submitCommit(value, this.store.key, commentUrl)
  }

  getComments(): void {
    let commentUrl = (this.activeTab === 'list-box') ? 'product' : 'ordered';
    this.storeService
      .getComment(this.store.key, commentUrl)
      .take(1)
      .subscribe(message => this.comments = message);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
