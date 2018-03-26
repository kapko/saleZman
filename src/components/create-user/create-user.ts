import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'app-create-user',
  templateUrl: 'create-user.html'
})

export class CreateUserComponent {
  constructor(
    public viewCtrl: ViewController,
  ) { }

  createNewUser(): void {
    console.log('getusers');
  }

  cancel(): void {
    this.viewCtrl.dismiss();
  }

}
