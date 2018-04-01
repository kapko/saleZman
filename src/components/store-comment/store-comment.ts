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
  @Input() bill: any;

  subject: Subject<any>;

  comment: string = '';

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
  ) {
    this.subject = new Subject();
  }

  ngOnChanges(): void {
    if (this.bill) {
      let data = this.bill.data[0];
      let url = this.bill.name.toLowerCase() + '/';
      url += `ordered-${data.order_by}-${data.order_date}`;
      this.getComment(url);
    }
  }

  getComment(url): void {
    this.storeService
      .getStoreBillingComment(url)
      .takeUntil(this.subject)
      .subscribe(comment => {
        this.comment = comment;
      });
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}

