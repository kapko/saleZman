import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';

@Component({
  selector: 'app-my-users',
  templateUrl: 'my-users.html'
})

export class MyUsersPage {
  users: any[] = [
    {
      id: 1,
      email: 'first@gmail.com',
      pass: '123123',
      admin: false,
      activate: false,
    },
    {
      id: 2,
      email: 'second@gmail.com',
      pass: '3213',
      admin: false,
      activate: false,
    },
    {
      id: 3,
      email: 'third@gmail.com',
      pass: '234234',
      admin: false,
      activate: false,
    },
    {
      id: 2,
      email: 'second@gmail.com',
      pass: '3213',
      admin: false,
      activate: false,
    },
    {
      id: 3,
      email: 'third@gmail.com',
      pass: '234234',
      admin: false,
      activate: false,
    },
    {
      id: 2,
      email: 'second@gmail.com',
      pass: '3213',
      admin: false,
      activate: false,
    },
    {
      id: 3,
      email: 'third@gmail.com',
      pass: '234234',
      admin: false,
      activate: false,
    },
  ];

  constructor(
    private modalController: ModalController
    // private navController: NavController,
  ) { }

  createNewUser(): void {
    let contactModal = this.modalController.create(CreateUserComponent);
    contactModal.present();
    // console.log('createNewUser');
    // let modal = this.modalController.create(CreateUserComponent);
    // modal.present();
  }

}
