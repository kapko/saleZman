import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { AppService } from '../../services/app-service';
import { NavController } from 'ionic-angular';

export interface AddProductForm {
  name: string;
  controller: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: 'add-product.html',
})

export class AddProductComponent {
  form: FormGroup;

  fields: AddProductForm[] = [];

  constructor(
    private storeService: StoreService,
    private appService: AppService,
    private navController: NavController,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      ean: new FormControl('', Validators.required),
      hsn: new FormControl('', Validators.required),
      mrp: new FormControl('', Validators.required),
      tax: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      life: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required)
    });
    
    Object.keys(this.form.value).map(key => {
      let name = key[0].toUpperCase() + key.substring(1);
      this.fields.push({name, controller: key});
    });
  }

  submitForm(form: NgForm): void {
    this.appService.presentLoading(true);
    this.storeService.addProduct(form.value)
      .then(e => {
        this.appService.showToast('Product created');
        this.appService.hideLoading();
        form.reset();
      })
      .catch(err => this.appService.showToast(err.message))
  }

}
