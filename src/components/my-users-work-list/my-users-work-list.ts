
import { Component, Input } from '@angular/core';
import { MyService } from '../../services/my-service';
import { MyUserService } from '../../services/my-users-service';

@Component({
  selector: 'app-my-users-work-list',
  templateUrl: 'my-users-work-list.html',
})

export class MyUsersWorkedListComponent {
  constructor(
    private myService: MyService,
    private myUserService: MyUserService,
  ) {
    console.log('MyUsersWorkedListComponent');
  }

  ngOnInit(): void {
    // this.myUserService.getMyUserWorks()
    //   .take(1)
    //   .subscribe(works => {
    //     console.log('works', works);
    //     works.subscribe(item => {
    //       console.log('item', item);
    //     });
    //   });
  }
  
}
