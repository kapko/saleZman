import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MyUserService } from '../../services/my-users-service';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.html',
})

export class PaymentComponent {
  @Input() store: storeName;

  billArray: any = ['Last 5 bills', 'Last 10 bills', 'Last 15 bills', 'All'];

  options: any = ['cash', 'chq', 'neft', 'cancel'];

  keyForRemove: any[string] = ['comment', 'supply_status', 'supply_date', 'supplied_by', 'cash_amount','chq_number','chq_amount','chq_date','order_by','ordered_date','payOptions','chq_bank', 'neft_amount', 'neft_date'];

  rowProducts: any[] = [];

  products: any[] = [];

  commits: any[] = [];

  paidList: any[] = [];

  billIds: any[string] = [];

  billValue: string = 'Last 5 bills';

  comment: string = '';

  cash_amount: number = null;


  date: string = this.appService.getCurrentDate(true);

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
    private myUserService: MyUserService
  ) {
    this.appService.presentLoading(true);
  }

  ngOnChanges(): void {
    if (!this.store) return;
    this.getPaidList(this.store._name);
    this.getPaymentList(this.store._name);
  }


  getPaymentList(storeName: string, limit: number = 5): void {
    this.myUserService.getDistPayment(storeName)
      .map(data => data
        .reduce((a, b) => a.concat(b), [])
        .slice(0).slice(-limit)
      )
      .do(e => this.appService.hideLoading())
      .subscribe(payments => {
        this.products = payments;
        this.rowProducts = payments;
      });
  }

  getPaidList(storeName: string, limit: number = 5): void {
    this.myUserService.getDistPaid(storeName)
      .map(data => data
        .reduce((a, b) => a.concat(b), [])
        .slice(0).slice(-limit)
      )
      .subscribe(paidItems => {
        this.paidList = paidItems;
      });
  }

  sortByBill(value: string): void {
    let limit;
    switch (value) {
      case 'Last 5 bills':
        limit = 5;
        break;
      case 'Last 10 bills':
        limit = 10;
        break;
      case 'Last 15 bills':
        limit = 15;
        break;
      default:
        limit = null;
    }

    this.getPaymentList(this.store._name, limit);
  }

  payOptionEvent(product: Object, opt: string): void {
    if (product['payment_status'] === 'done') return;
    // reset values
    this.cash_amount = null;
    this.comment = '';
    product['method'] = opt;
    product['payOptions'] = true;

    if (opt === 'cancel') {
      product['payOptions'] = false;
      product['method'] = '';
    }
  }

  /*
    rest is result of amout api
    product current product
    val data from event
    amountKey string key of amount event
  */
  submiteForm(rest: any, product: Object, val: Object, amountKey: string): void {
    let billAmount = (typeof rest === 'number' && rest >= 0) ? rest : product['amount']
    let balance = billAmount - val[amountKey];

    if (balance >= 0) {
      this.storeService.setBalance(product['key'], balance);
      if (balance === 0) {
        // update payment status to 'done'
        this.storeService.updatePaymentStatus(this.store._name, product['key']);
      }

      this.keyForRemove.forEach(key => delete product[key]);

      product['payment_date'] = this.appService.getCurrentDate(true);
      product['collected_by'] = this.authService.currentUserId;
      Object.assign(product, val);

      this.storeService.addPayment(this.store._name, product);
      this.appService.showToast('Your payment completed.');
      this.getPaidList(this.store._name);

    } else {
      this.appService.showToast('ERROR: Payment amount more then bill amount for ' + balance);
    }
  }

}
