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

  stockList: any[] = [];
  orderedList: any[] = [];
  paymentList: any[] = [];
  supplyList: any[] = [];
  choosenDates: any[string] = [];

  constructor(
    private myService: MyService,
    private appService: AppService
  ){
    this.appService.presentLoading(true);
    this.getAllData();
  }

  ngOnInit():void {
    this.choosenDates.push(this.appService.getDate(new Date()).replace(/\./g, '-'));
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
      this.getAllData(this.choosenDates);
    }
  }

  getAllData(date: any[string] = null): void {
    this.myService.getStockData()
      .take(1)
      .do(() => this.appService.hideLoading())
      .subscribe(list => this.stockList = list);
    
    this.myService.getOrderedData()
      .take(1)
      .subscribe(list => {
        this.orderedList = list;
      });
    
    this.myService.getSupplyData()
      .take(1)
      .subscribe(list => {
        this.supplyList = list;
      });

    this.myService.getPaymentData()
      .take(1)
      .subscribe(list => {
        this.paymentList = list;
      });
  }

}
