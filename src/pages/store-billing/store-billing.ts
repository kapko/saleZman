import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';
import { MyUserService } from '../../services/my-users-service';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-store-billing',
  templateUrl: 'store-billing.html'
})

export class StoreBillingPage {
  subject: Subject<any>;

  choosenDates: any[string] = [];

  date: string;

  storeDate: string = this.appService.getCurrentDate(true);

  users: any [] = [
    {
      key: '1',
      name: 'first',
    },
    {
      key: '2',
      name: 'second',
    },
  ];

  constructor(
    private modalController: ModalController,
    private myUserService: MyUserService,
    private appService: AppService,
    private authService: AuthService,
  ) {
    this.subject = new Subject();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  ngOnInit():void {
    this.choosenDates.push(this.appService.getDate(new Date()).replace(/\./g, '-'));
    this.filterByDate('Today');
  }

  filterByDate(date: string): void {
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
        default: 
          this.choosenDates = [];
      }
      console.log('choosenDates', this.choosenDates);
      // this.getAllData(this.choosenDates);
    }
  }

  orderByUser(user: any): void {
    console.log('user', user);
  }

}
