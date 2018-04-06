import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';
import { MyUserService } from '../../services/my-users-service';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { AddCompanyComponent } from '../../components/add-company/add-company';
import { AddProductComponent } from '../../components/add-product/add-product';

@Component({
  selector: 'app-manage-products',
  templateUrl: 'manage-products.html'
})

export class ManageProductPage {
  subject: Subject<any>;

  constructor(
    private modalController: ModalController,
    private myUserService: MyUserService,
    private appService: AppService,
    private authService: AuthService,
    private navController: NavController,
  ) {
    this.subject = new Subject();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  createItem(): void {
    this.appService.showAlert('I want create ', [
      {
        text: 'Company',
        handler: e => this.navController.push(AddCompanyComponent)
      },
      {
        text: 'Product',
        handler: e => this.navController.push(AddProductComponent)
      },
      'Cancel'
    ]);
  }

}
