
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-user-list-card',
  templateUrl: 'my-user-list-card.html',
})

export class MyUserListCardComponent {
  private _arr: any [];

  get data(): any[] {
    return this._arr;
  }

  @Input()
  set data(arr: any[]) {
    this._arr = arr;
  }

}
