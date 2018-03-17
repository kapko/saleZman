import { Component, Input } from '@angular/core';
import { MyService } from '../../services/my-service';

@Component({
  selector: 'app-my-worked-list',
  templateUrl: 'my-worked-list.html',
})

export class MyWorkedListComponent {
  list: any[] = [];

  constructor(
    private myService: MyService
  ){
    this.myService.getMySuppliedData()
      .take(1)
      .subscribe(list => this.list = list);
  }

}
