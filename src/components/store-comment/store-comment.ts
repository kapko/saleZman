import { Component, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-store-comment',
  templateUrl: 'store-comment.html',
})

export class StoreCommentComponent {
  @Input() bill: any;

  subject: Subject<any>;

  comment: string = '';

  constructor(
    private storeService: StoreService,
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

