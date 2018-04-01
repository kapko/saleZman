import { Component, Input } from '@angular/core';
import { AppService } from '../../services/app-service';
import { StoreService } from '../../services/store.service';
import { storeName } from '../../interfaces/city.store';
import 'rxjs';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-store-comment',
  templateUrl: 'store-comment.html',
})

export class StoreCommentComponent {
  @Input() salezman: string;
  @Input() chooseDate: string [];
 
  products: any[] = [];

  subject: Subject<any>;

  comments: any [] = [
    {
        "date" : "17.03.2018",
        "message" : "Test1\n",
        "uid" : "pH5lUh5UR1UZKKME56bvHtl29So1"
      },
    {
        "date" : "17.03.2018",
        "message" : "Test2\n",
        "uid" : "pH5lUh5UR1UZKKME56bvHtl29So1"
      },
    {
        "date" : "17.03.2018",
        "message" : "Test3\n",
        "uid" : "pH5lUh5UR1UZKKME56bvHtl29So1"
      },
    {
        "date" : "17.03.2018",
        "message" : "Test 4\n",
        "uid" : "pH5lUh5UR1UZKKME56bvHtl29So1"
      },
  ];

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
  ) {
    this.subject = new Subject();
  }

  getComments(): void {
    // this.storeService
    //   .getCommonCommit(this.store._name)
    //   .takeUntil(this.subject)
    //   .subscribe(messages => this.commits = messages)
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}

