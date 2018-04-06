import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';
import { MyUserService } from '../../services/my-users-service';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-manage-store',
  templateUrl: 'manage-store.html'
})

export class ManageStorePage {
  subject: Subject<any>;

  showAddProduct: boolean = true;

  constructor(
    private modalController: ModalController,
    private myUserService: MyUserService,
    private appService: AppService,
    private authService: AuthService,
  ) {
    this.subject = new Subject();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  cancelAddPriduct(): void {
    this.showAddProduct = false;
  }

}
