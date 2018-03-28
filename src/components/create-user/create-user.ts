import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'app-create-user',
  templateUrl: 'create-user.html'
})

export class CreateUserComponent {

  constructor(
    public viewCtrl: ViewController,
    private authService: AuthService,
    private appService: AppService,
  ) { }

  createNewUser(email): any {

    this.authService.signUp(email, '123456789')
      .then(async user => {
        // create new user for distributor
        await this.authService.createUserByDistributor(user);
        // create new user for login
        await this.authService.createNewUser(user, null);
        // show notification
        this.appService.showToast('You have created new user.');
        this.cancel();
      })
      .catch(err => this.appService.showToast(err.message));

  }

  cancel(): void {
    this.viewCtrl.dismiss();
  }

}
