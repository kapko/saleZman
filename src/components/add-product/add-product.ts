import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { AppService } from '../../services/app-service';
import { NavParams } from 'ionic-angular';

export interface AddProductForm {
  name: string;
  controller: string;
  type: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: 'add-product.html',
})

export class AddProductComponent {
  form: FormGroup;

  fields: AddProductForm[] = [];

  companies: any[] = [];

  editProduct: boolean = false;

  constructor(
    private storeService: StoreService,
    private appService: AppService,
    private navParams: NavParams
  ) {
    this.getCompanies();

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      EAN: new FormControl('', Validators.required),
      HSN: new FormControl('', Validators.required),
      MRP: new FormControl('', Validators.required),
      TAX: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      life: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required)
    });
    
    Object.keys(this.form.value).map(key => {
      let name = key[0].toUpperCase() + key.substring(1), type;
      type = this.appService.getType(key);
      this.fields.push({name, controller: key, type});
    });
    // update values of form
    this.updateForm();
  }

  submitForm(form: NgForm): void {
    this.appService.presentLoading(true);
    // set default counter;
    form.value.counter = 0;

    if (this.editProduct) {
      // update
      this.storeService.updateProduct(form.value, this.navParams.data.key)
        .then(res => {
        this.appService.hideLoading();
        this.appService.showToast('Product updated');
        })
        .catch(err => this.appService.showToast(err.message));
      return;
    }

    // create
    this.storeService.addProduct(form.value)
      .then(e => {
        form.reset();
        this.appService.hideLoading();
        this.appService.showToast('Product created');
      })
      .catch(err => this.appService.showToast(err.message))
  }

  getCompanies(): void {
    // get this.companies
    this.storeService
      .getCompanies()
      .take(1)
      .subscribe(companies => {
        this.companies = companies;
      });
  }

  updateForm(): void {
    let params = this.navParams.data;
    delete params.counter;

    if (Object.keys(params).length) {
      this.editProduct = true;
      for (let key in params) {
        if (key !== 'key') {
          this.form.controls[key].setValue(params[key]); 
        }
      }

    }
  }

}
