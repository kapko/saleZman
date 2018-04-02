import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavController } from 'ionic-angular';
import { EditBillStorePage } from '../../pages/edit-store-bill/edit-store-bill';
import { MyUserService } from '../../services/my-users-service';

@Component({
  selector: 'app-test-supply',
  templateUrl: 'test-supply.html',
})

export class SupplyTestComponent {
  @Input() salezman: string;
  @Input() chooseDate: string [];
 
  products: any[] = [];

  subject: Subject<any>;

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
    private navController: NavController,
    private myUserService: MyUserService,
  ) {
    this.subject = new Subject();
  }

  ngOnChanges(): void {
    if (this.salezman) {
      this.salezman = (this.salezman === 'All') ? null : this.salezman;
    }

    this.getTestSupply();
  }

  getTestSupply(): void {
    this.storeService.getTestSupply(this.salezman)
      .takeUntil(this.subject)
      .map(data => data.filter(el => this.chooseDate.includes(el['order_date'])))
      .subscribe(products => {
        this.products = products;
      });
  }

  approveItem(product: any): void {
    delete product.orderedKeys;
    delete product.edit;
    console.log('product', product);
    
    this.appService.showToast('approve this item');
  }

  editItem(product: any): void {
    this.navController.push(EditBillStorePage, product)
  }

  deleteItem(product: any): void {
    let key = product.order_id;
    // REMOVE    
    this.appService.showAlert('Do you want to remove this product?', [{
      text: 'yes',
      handler: e => {
        this.updateCheckedProducts(product);
        this.storeService.addTestSupply(null, key)
          .then(res => this.appService.showToast('Deleted'))
          .catch(err => this.appService.showToast(err.message));
      }
    }, 'no']);
  }

  updateCheckedProducts(product: any): void {
    let opt = [];
    for (let key of product.orderedKeys) {
      opt.push(
        this.myUserService.checkedSubmitedOrder(key, null)
      )
    }
    Promise.all(opt);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
