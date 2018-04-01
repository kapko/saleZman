import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-test-supply',
  templateUrl: 'test-supply.html',
})

export class SupplyTestComponent {
  products: any[] = [];

  subject: Subject<any>;

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
  ) {
    this.subject = new Subject();
    this.getTestSupply();
  }

  getTestSupply(): void {
    this.storeService.getTestSupply()
      .takeUntil(this.subject)
      .subscribe(products => {
        this.products = products;
      });
  }

  approveItem(): void {
    this.appService.showToast('approve this item');
  }

  updateProduct(product: any): void {
    console.log(product);
  }

  deleteItem(): void {
    this.appService.showToast('delete this item');
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
