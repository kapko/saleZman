import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';
import { MyUserService } from '../../services/my-users-service';

@Component({
  selector: 'app-my-users',
  templateUrl: 'my-users.html'
})

export class MyUsersPage {
  users: any[] = [];

  constructor(
    private modalController: ModalController,
    private myUserService: MyUserService,
    // private navController: NavController,
  ) {
    this.myUserService.getMyUsers()
      .subscribe(users => {
        this.users = users;
      });
  }


  createNewUser(): void {
    let contactModal = this.modalController.create(CreateUserComponent);
    contactModal.present();
    // console.log('createNewUser');
    // let modal = this.modalController.create(CreateUserComponent);
    // modal.present();
  }

}
