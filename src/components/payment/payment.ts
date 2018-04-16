import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import { AuthService } from '../../services/auth.service';
import { MyUserService } from '../../services/my-users-service';
import 'rxjs';

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
  ) { }

  ngOnChanges(): void {
    if (!this.store) return;
    this.getAllPayments();
  }

  getAllPayments(limit: number = 5): void {
    this.appService.presentLoading(true);

    if (!this.authService.currentUserStatus) {
      this.getPaidList(limit);
      this.getPaymentList(limit);
    } else {
      this.getPaymentListForDist(limit);
      this.getPaidListForDist(limit);
    }
  }


  getPaymentListForDist(limit): void {
    this.storeService
      .getPaymentList(this.store.key, this.authService.currentUserId)
      .take(1)
      .map(data => data.slice(0).slice(-limit))
      .subscribe(payments => {
        this.products = payments;
        this.rowProducts = payments;
      });
  }

  getPaymentList(limit: number = 5): void {
    this.myUserService
      .getDistPayment(this.store.key)
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

  getPaidListForDist(limit: number): void {
    this.storeService
      .getPaidList(this.store.key, this.authService.currentUserId)
      .take(1)
      .map(data => {
        this.appService.hideLoading();
        return data.slice(0).slice(-limit)
      })
      .subscribe(paidItems => {
        this.paidList = paidItems;
      });
  }

  getPaidList(limit: number = 5): void {
    this.myUserService.getDistPaid(this.store.key)
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

    this.getAllPayments(limit);
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
        this.storeService.updatePaymentStatus(this.store.key, product['key']);
      }

      this.keyForRemove.forEach(key => delete product[key]);

      product['payment_date'] = this.appService.getCurrentDate(true);
      product['collected_by'] = this.authService.currentUserId;
      Object.assign(product, val);

      this.storeService.addPayment(this.store.key, product);
      this.appService.showToast('Your payment completed.');
      this.getAllPayments();

    } else {
      this.appService.showToast('ERROR: Payment amount more then bill amount for ' + balance);
    }
  }

}
