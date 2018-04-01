import { Component } from '@angular/core';
import { MyUserService } from '../../services/my-users-service';
import { AppService } from '../../services/app-service';
import { Subject } from 'rxjs';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-store-billing',
  templateUrl: 'store-billing.html',
})

export class StoreBillingPage {
  subject: Subject<any>;

  choosenDates: any[string] = [];

  date: string = 'Today';

  salezman: string = 'All';

  storeDate: string = this.appService.getCurrentDate(true);

  users: any [] = [];

  bills: any [] = [];

  constructor(
    private myUserService: MyUserService,
    private appService: AppService,
    private storeService: StoreService,
  ) {
    this.getUsers();
    this.subject = new Subject();
  }

  ngOnInit():void {
    this.choosenDates.push(this.appService.getToday());
    this.dateEvent('Today');
  }

  dateEvent(date: string): void {
    if (date) {
      // this.appService.presentLoading(true);
      this.choosenDates = [];
      switch(date) {
        case 'Today':
          this.choosenDates.push( this.appService.getDate(new Date()) );
          break;
        case 'Yesterday':
          this.choosenDates.push(
            this.appService.getDate(this.appService.getYesterday(new Date()))
          );
          break;
        case 'This week':
          this.choosenDates = this.appService.getDates(
            this.appService.getMonday(new Date), 
            this.appService.getSunday(new Date)
          );
          break;
        case 'This month':
          this.choosenDates = this.appService.getDates(
            this.appService.getFirstDayOfMonth(new Date()),
            this.appService.getLastDayOfMonth(new Date()),
          );
          break;
      }
      this.getBills();
    }
  }

  getBills(): void {
    this.myUserService
      .getStoreBill((this.salezman === 'All') ? null : this.salezman)
      .takeUntil(this.subject)
      .map(data => this.grupeByStoreName(this.filterByDate(data)))
      .subscribe(bills => {
        this.bills = bills;
      });
  }

  filterByDate(data:any, key: string = 'order_date'): any {
    return data.filter(el => this.choosenDates.includes(el[key]));
  }

  grupeByStoreName(list): any {
    let data = [];
    var group_to_values = list.reduce(function (obj, item) {
        obj[item.store_name] = obj[item.store_name] || [];
        obj[item.store_name].push(item);
        return obj;
    }, []);
    for (let i in group_to_values) {
      let ob = {};
      ob['name'] = i;
      ob['bill_number'];
      ob['amount'];
      ob['bill_date'];
      ob['data'] = group_to_values[i];
      data.push(ob);
    }
    return data;
  }

  orderByUser(salezman: string): void {
    this.salezman = salezman;
    this.getBills();
  }

  getUsers(): void {
    this.myUserService.getMyUsers()
      .take(1)
      .map(data => data.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      .subscribe(users => {
        if (!users && !users.length) return;
        // set salezman
        this.users = users;
      });
  }

  submitValue(bill: any): void {
    let date = '';
    if (!bill.bill_number || !bill.amount) {
      this.appService.showToast('Please re-enter fields');
      return;
    }
    if (bill.bill_date) {
      for (let i = 2; i >= 0; i--) {
        let item = bill.bill_date.split('-')[i];
        date += (i === 2) ? item : '-' + item;
      }
    } else {
      date = this.appService.getToday();
    }

    let supplyObject = {
      bill_date: date,
      bill_number: +bill.bill_number,
      amount: +bill.amount,
      store_name: bill.name,
      ordered_by: (this.salezman === 'All') ? bill.data[0].order_by : this.salezman,
      order_date: this.appService.getToday(),
      order_id: Date.now(),
      supply_status: 'pending',
      orderedKeys: this.getOrderKeys(bill),
    }

    let key = `${supplyObject.order_id}-${this.salezman}`;
    this.storeService.addTestSupply(supplyObject, key)
      .then(res => {
        this.appService.showToast('Please approve you request!');
      })
      .catch(err => this.appService.showToast(err.message));
    // clean store bill
    // this.cleanStoreBill(bill);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  getOrderKeys(bill): string[] {
    let keys = [];
    for (let prod of bill.data) {
      let key = prod.store_name + prod.name;
      keys.push(key);
    }

    return keys;
  }

  cleanStoreBill(bill: any): Promise<any> {
    let opt = [];
    for (let prod of bill.data) {
      let key = prod.store_name + prod.name;
      this.myUserService.clearStoreBillProduct(key);
    }
    return Promise.all(opt);
  }

}
