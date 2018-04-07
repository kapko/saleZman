import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { CreateUserComponent } from '../../components/create-user/create-user';
import { AppService } from '../../services/app-service';
import { Subject } from 'rxjs';
import { AddCompanyComponent } from '../../components/add-company/add-company';
import { AddProductComponent } from '../../components/add-product/add-product';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-manage-product-list',
  templateUrl: 'manage-product-list.html'
})

export class ManageProductListCompany {
  subject: Subject<any> = new Subject();

  companies: any[] = [];

  products: any[] = [];

  constructor(
    private appService: AppService,
    private navController: NavController,
    private storeService: StoreService
  ) {
    this.getData();
  }

  getData(): void {
    // get companies
    this.storeService.getCompanies()
      .takeUntil(this.subject)
      .subscribe(companies => {
        this.companies = companies;
      });

    // get products
    this.storeService.getProductsById()
      .takeUntil(this.subject)
      .subscribe(products => {
        this.products = products;
      });
  }

  // edit
  editItem(data: Object, val: string = null): void {

    if (val) {
      this.navController.push(AddProductComponent, data);
    } else {
      this.navController.push(AddCompanyComponent, data);
    }

  }

  //delete
  deleteItem(key: string, val: string = 'company'): void{
    let text = (val === 'company')
      ? 'Do you want to remove this company and all product linked to this company?'
      : 'Do you want to remove this product?';

    this.appService.showAlert(text, [
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

  // unsibscribe
  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
