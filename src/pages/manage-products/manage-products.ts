import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../services/app-service';
import { AddCompanyComponent } from '../../components/add-company/add-company';
import { AddProductComponent } from '../../components/add-product/add-product';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: 'manage-products.html'
})

export class ManageProductPage {

  constructor(
    private appService: AppService,
    private navController: NavController,
    private storeService: StoreService
  ) { }

  createItem(): void {
    this.appService.showAlert('I want create ', [{
        text: 'Company',
        handler: e => this.navController.push(AddCompanyComponent)
      },
      {
        text: 'Product',
        handler: e => {
          this.storeService.getCompanies()
            .take(1)
            .subscribe(item => {
              if (item && item.length) {
                this.navController.push(AddProductComponent);
              } else {
                this.appService.showToast('Please create company first');
              }
            })
        }
      },
      'Cancel']);
  }

}
