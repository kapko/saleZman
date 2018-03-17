import { Component, Input } from '@angular/core';
import { MyService } from '../../services/my-service';

@Component({
  selector: 'app-my-worked-list',
  templateUrl: 'my-worked-list.html',
})

export class MyWorkedListComponent {
  @Input() options: any[string];
  @Input() date: string;

  supplyList: any[] = [];
  orderedList: any[] = [];
  paymentList: any[] = [];
  paidList: any[] = [];

  constructor(
    private myService: MyService
  ){
    this.getData();
  }

  ngOnChanges(): void {
    console.log('date', this.date);
  }

  getData(options: any[string] = []): void {
    this.myService.getMySuppliedData()
      .take(1)
      .subscribe(list => this.supplyList = list);
    
    this.myService.getMyOrderedData()
      .take(1)
      .subscribe(list => this.orderedList = list);
    
    this.myService.getMyPaymentData()
      .take(1)
      .subscribe(list => this.paymentList = list);

    this.myService.getMyPaidData()
      .take(1)
      .subscribe(list => this.paidList = list);
  }

}
