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

  form: FormGroup;

  billArray: any = ['Last 5 bills', 'Last 10 bills', 'Last 15 bills', 'All'];

  keyForRemove: any[string] = ['comment', 'supply_status', 'supply_date', 'supplied_by', 'cash_amount','chq_number','chq_amount','chq_date','order_by','ordered_date','key','payOptions','chq_bank'];

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
    this.form = new FormGroup({
      chq_number: new FormControl('', Validators.required),
      chq_date: new FormControl('', Validators.required),
      chq_amount: new FormControl('', Validators.required),
      chq_bank: new FormControl('', Validators.required),
      comment: new FormControl(''),
    });
  }

  ngOnChanges(): void {
    if (!this.store) return;
    this.getPaymentList(this.store._name, 5);
    this.getPaidList();
  }

  getPaymentList(storeName: string, limit: number = null): void {
    this.storeService
      .getPaymentList(storeName, limit)
      .do(() => this.appService.hideLoading())
      .take(1)
      .map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(supplies => {
        this.products = supplies;
        this.rowProducts = supplies;
      });
  }

  getPaidList(): void {
    this.storeService.getPaidList()
      .takeUntil(this.subject)
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
    if (!opt) {product['payOptions'] = true}
    // reset values
    for (let key in this.form.controls) {
      this.form.controls[key].setValue('');
    }

    this.cash_amount = null;
    this.comment = '';
    product['cash'] = false;
    product['chq'] = false;
    if (opt === 'cancel') {
      product['payOptions'] = false;
    } else {
      (opt) ? product[opt] = true : null;
    }
  }

  submitForm(val: any, product: Object): void {
    this.keyForRemove.forEach(key => delete product[key]);

    if (!val) return;
    let data = {};
    if (typeof val === 'string') {
      data['comment'] = this.comment;
      data['cash_amount'] = val;
    } else {
      Object.assign(data, val);
    }

    product['payment_date'] = this.appService.getCurrentDate(true);
    product['payment_by'] = this.storeService.userId;

    Object.assign(product, data);
    this.storeService.addPayment(product);

    this.appService.showToast('Your payment completed.');
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
