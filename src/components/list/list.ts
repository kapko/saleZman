import { Component, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';

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

  comments: string = '';

  constructor(
    private storeService: StoreService,
  ) {
    this.subject = new Subject();
  }

  ngOnChanges(): void {
    this.usersProduct = [];
    this.rowProducts = this.products;
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
      .getUserProductList(this.store.name)
      .takeUntil(this.subject)
      .subscribe(items => this.usersProduct = items);
  }

  getOrderedList(): void {
    this.storeService
      .getUserOrderedList(this.store.name)
      .takeUntil(this.subject)
      .subscribe(items => this.usersProduct = items);
  }

  searchItems(ev: any): void {
    let val = (ev.target.value) ? ev.target.value : '';

    if (val && val.trim() === '') {
      this.products = this.rowProducts;
      return;
    }

    this.products = this.rowProducts.filter(item => 
      (item._name.indexOf(val.toLowerCase()) > -1)
    );
  }

  count(product: any, count: boolean): void {
    if (!count && +product.counter < 1) return;
    product.counter += (count) ? 1 : -1;
    if (this.showOrdered) {
      this.storeService.updateUsersOrderedProductList(product, this.store.name);
    } else {
      this.storeService.updateUsersProductList(product, this.store.name);
    }
  }

  removeProduct(product: any): void {
    product['counter'] = 0;
    if (this.showOrdered) {
      this.storeService.updateUsersOrderedProductList(product, this.store.name);
    } else {
      this.storeService.updateUsersProductList(product, this.store.name);
    }
  }

  submiteCommit(event: any): void {
    let value = event.target.value;
    let commentUrl = (this.activeTab === 'list-box') ? 'product' : 'ordered';
    this.storeService.submitCommit(value, this.store._name, commentUrl)
  }

  getComments(): void {
    let commentUrl = (this.activeTab === 'list-box') ? 'product' : 'ordered';
    this.storeService
      .getComment(this.store._name, commentUrl)
      .take(1)
      .subscribe(message => this.comments = message);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
