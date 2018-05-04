import { Directive, Input, ElementRef } from '@angular/core';
import { StoreService } from '../services/store.service';

@Directive({
  selector: '[bill]',
})

export class BillCountDirective {
  tag: HTMLElement;

  constructor(
    private _el: ElementRef,
    private storeService: StoreService
  ) {
    this.tag = this._el.nativeElement;
  }

  @Input()
  set key(item: Object) {
    this.storeService
      .getBalance(item['key'])
      .take(1)
      .subscribe(count => {
        let val = (count) ? count : item['amount'];
        this.setTagValue(val);
      });
  }

  setTagValue(val: string): void {
    this.tag.innerText = val;
  }

}
