
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-list-head',
  templateUrl: 'my-list-head.html',
})

export class MyListHeadComponent {
  private _header: string;

  private shops: number = 0;

  private counter: number = 0;

  get header(): string {
    return this._header;
  }

  @Input()
  set header(head: string) {
    this._header = head;
  }

  get data(): Object {
    return {
      shops: this.shops,
      counter: this.counter,
    };
  }

  @Input()
  set data(arr: Object) {

    for (let i in arr) {
      arr[i].data.subscribe(item => {
        this.shops += item.length;
        for (let key of item) {this.counter += key}
      });
    }

  }

}
