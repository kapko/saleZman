
import { Component, Input } from '@angular/core';
import { MyService } from '../../services/my-service';
import { MyUserService } from '../../services/my-users-service';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'app-my-users-work-list',
  templateUrl: 'my-users-work-list.html',
})

export class MyUsersWorkedListComponent {
  stock: any[] = [];

  order: any[] = [];

  supply: any[] = [];

  payment: any[] = [];

  _options: string[];

  constructor(
    private myService: MyService,
    private myUserService: MyUserService,
    private appService: AppService,
  ) {
    this.appService.presentLoading(true);
    this.getData();
  }

  getData():void  {
    // get all data
    for (let key of ['stock', 'order', 'supply', 'payment']) {
      this.myUserService.getMyUsers()
        .take(1)
        // .do(e => this.appService.hideLoading())
        .map(users => this.getWorks(users, key))
        .subscribe(items => {
          switch (key) {
            case 'stock':
              this.stock = items;
              break;
            case 'order':
              this.order = items;
              break;
            case 'supply':
              this.supply = items;
              break;
            case 'payment':
              this.payment = items;
              break;
          }
        });
    }

    // hide loader
    this.appService.hideLoading();
  }

  getWorks(users: any[], val: string): any {
    let works = [];
    for (let user of users) {
      let data;
      switch (val) {
        case 'stock':
          data = this.myService.getStockActivity(user.key).take(1);
          break;
        case 'order':
          data = this.myService.getOrderActivity(user.key).take(1);
          break;
        case 'supply':
          data = this.myService.getSupplyActivity(user.key).take(1);
          break;
        case 'payment':
          data = this.myService.getPaymentActivity(user.key).take(1);
          break;
      }
  
      works.push({user: user.key, data});
    }

    return works;
  }

  get options(): string[] {
    return this._options;
  }

  @Input()
  set options(options: string[]) {
    this._options = options;
  }

  // @Input()
  // set date(dates: string[]) {
  //   // this.dates = dates;
  // }

}
