import { Directive, Input, ElementRef } from '@angular/core';
import { Observable } from '@firebase/util';

@Directive({
  selector: '[count]',
})

export class CountDirective {
  tag: HTMLLIElement;

  constructor(private _el: ElementRef) {
    this.tag = this._el.nativeElement;
  }

  @Input()
  set data(data: Observable<any>) {
    data.subscribe(item => {
      let totalValue = 0;
      for (let key of item) {
        totalValue += key;
      }

      this.setTagValue(totalValue);
    });
  }

  setTagValue(val: number): void {
    this.tag.innerText = '' + val.toFixed(2);
  }

}
