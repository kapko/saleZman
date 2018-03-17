import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.html',
})

export class PaymentComponent {
  @Input() store: storeName;

  neftForm: FormGroup;

  billArray: any = ['Last 5 bills', 'Last 10 bills', 'Last 15 bills', 'All'];

  options: any = ['cash', 'chq', 'neft', 'cancel'];

  keyForRemove: any[string] = ['comment', 'supply_status', 'supply_date', 'supplied_by', 'cash_amount','chq_number','chq_amount','chq_date','order_by','ordered_date','payOptions','chq_bank', 'neft_amount', 'neft_date'];

  rowProducts: any[] = [];

  products: any[] = [];

  commits: any[] = [];

  paidList: any[] = [];

  billValue: string = 'Last 5 bills';

  subject: Subject<any>;

  comment: string = '';

  cash_amount: number = null;

  date: string = this.appService.getCurrentDate(true);

  constructor(
    private appService: AppService,
    private storeService: StoreService,
  ) {
    this.subject = new Subject();
    this.appService.presentLoading(true);
  }

  ngOnInit():void {
    this.neftForm = new FormGroup({
      neft_date: new FormControl('', Validators.required),
      neft_amount: new FormControl('', Validators.required),
      comment: new FormControl(''),
    });
  }

  ngOnChanges(): void {
    if (!this.store) return;
    this.getPaymentList(this.store._name, 5);
    this.getPaidList(this.store._name, 5);
  }

  getPaymentList(storeName: string, limit: number = null): void {
    this.storeService
      .getPaymentList(storeName, limit)
      .do(() => this.appService.hideLoading())
      .takeUntil(this.subject)
      .map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(supplies => {
        this.products = supplies;
        this.rowProducts = supplies;
      });
  }

  getPaidList(storeName: string, limit: number): void {
    this.storeService.getPaidList(storeName, limit)
      .takeUntil(this.subject)
      .map(data => data.reverse())
      .subscribe(paidItems => this.paidList = paidItems);
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

    if (+val[amountKey] && balance >= 0) {
      this.storeService.setBalance(product['key'], balance);
      if (balance === 0) {
        // update payment status to 'done'
        this.storeService.updatePaymentStatus(this.store._name, product['key']);
      }

      this.keyForRemove.forEach(key => delete product[key]);

      product['payment_date'] = this.appService.getCurrentDate(true);
      product['collected_by'] = this.storeService.userId;
      Object.assign(product, val);

      this.storeService.addPayment(this.store._name, product);
      this.appService.showToast('Your payment completed.');
    } else {
      this.appService.showToast('ERROR: Payment amount more then bill amount for ' + balance);
    }
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
