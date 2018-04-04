import { Component, Input } from '@angular/core';
import { MyService } from '../../services/my-service';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'app-my-worked-list',
  templateUrl: 'my-worked-list.html',
})

export class MyWorkedListComponent {
  @Input() options: any[string];
  @Input() date: string;
  @Input() distUserId: string;

  stockList: any[] = [];
  objectKeys = Object.keys;
  orderedList: any[] = [];
  paymentList: any[] = [];
  supplyList: any[] = [];
  choosenDates: any[string] = [];
  priceValue: Object = {};

  constructor(
    private myService: MyService,
    private appService: AppService
  ){
  }

  ngOnInit():void {
    this.choosenDates.push(this.appService.getToday());
  }

  ngOnChanges(): void {
    if (this.date) {
      this.appService.presentLoading(true);
      this.choosenDates = [];
      switch(this.date) {
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
        default: 
          this.choosenDates = [];
      }

      this.getAllData(this.choosenDates, (this.distUserId && this.distUserId === 'All') ? null : this.distUserId);
    }
  }

  getAllData(date: any[string] = null, distUserId: string | null = null): void {
    // stock list
    this.myService.getStockData(distUserId)
      .take(1)
      .do(() => this.appService.hideLoading())
      .map(data => {
        this.priceValue['stock'] = this.getPrice(this.filterByDate(data));
        return this.grupeByStoreName(this.filterByDate(data));
      })
      .subscribe(list => {
        this.stockList = list;
      });
    // ordered list
    this.myService.getOrderedData(distUserId)
      .take(1)
      .map(data => {
        this.priceValue['ordered'] = this.getPrice(this.filterByDate(data));
        return this.grupeByStoreName(this.filterByDate(data));
      })
      .subscribe(list => {
        this.orderedList = list;
      });
    // payment list
    this.myService.getPaymentData(distUserId)
      .take(1)
      .map(data => {
        let filtered = this.filterByDate(data, 'payment_date');
        this.priceValue['payment'] = this.getBillAmount(filtered, 'payment_amount');
        return this.grupeByStoreName(filtered);
      })
      .subscribe(list => {
        this.paymentList = list;
      });
    // supply list
    this.myService.getSupplyData(distUserId)
      .take(1)
      .map(data => {
        let filtered = this.filterByDate(data, 'supply_date');
        this.priceValue['supply'] = this.getBillAmount(filtered);
        return this.grupeByStoreName(filtered);
      })
      .subscribe(list => {
        this.supplyList = list;
      });

  }

  filterByDate(data:any, key: string = 'date'): any {
    if (!this.choosenDates.length) return data;
    return data.filter(el => 
      (el[key].match('.'))
        ? this.choosenDates.includes(el[key].replace(/\./g, '-'))
        : this.choosenDates.includes(el[key])
    );
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
      ob['data'] = group_to_values[i];
      data.push(ob);
    }

    return data;
  }

  getPrice(data): number {
    let totalValue = 0;
    data.forEach(prod => totalValue += prod.Price * prod.counter);
    return totalValue;
  }

  getBillAmount(data: any, key: string = 'amount'): number {
    let amount = 0;
    data.forEach(el => amount += +el[key]);
    return amount;
  }

}
