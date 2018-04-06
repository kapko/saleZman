import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';
import { MyUserService } from '../../services/my-users-service';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { AddCompanyComponent } from '../../components/add-company/add-company';
import { AddProductComponent } from '../../components/add-product/add-product';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: 'manage-products.html'
})

export class ManageProductPage {
  subject: Subject<any>;

  companies: any[] = [];

  products: any[] = [];

  constructor(
    private modalController: ModalController,
    private myUserService: MyUserService,
    private appService: AppService,
    private authService: AuthService,
    private navController: NavController,
    private storeService: StoreService
  ) {
    this.subject = new Subject();
    this.getData();
  }

  getData(): void {
    this.storeService.getCompanies()
      .takeUntil(this.subject)
      .subscribe(companies => this.companies = companies);
    
    this.storeService.getProductsById()
      .takeUntil(this.subject)
      .subscribe(products => this.products = products);
  }

  deleteItem(key: string, val: string = 'company'): void{
    this.appService.showAlert(`Do you want to remove ${val}?`, [
      {
        text: 'yes',
        handler: e => {
          // action
          if (val === 'company') {
            this.storeService.removeCompanyById(key);
          } else {
            this.storeService.removeProductById(key);
          }
          this.appService.showToast('Removed');
        }
      },
      'no'
    ]);
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

  // unsibscribe
  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
