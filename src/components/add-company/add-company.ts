import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { AppService } from '../../services/app-service';
import { NavController, NavParams } from 'ionic-angular';

export interface AddProductForm {
  name: string;
  controller: string;
}
@Component({
  selector: 'app-add-company',
  templateUrl: 'add-company.html',
})

export class AddCompanyComponent {
  form: FormGroup;

  fields: AddProductForm[] = [];

  editCompany: boolean = false;

  constructor(
    private storeService: StoreService,
    private appService: AppService,
    private navController: NavController,
    private navParams: NavParams,
  ) {
    this.form = new FormGroup({
      company_name: new FormControl('', Validators.required),
      address_1: new FormControl('', Validators.required),
      address_2: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', [Validators.required, Validators.minLength(5)]),
      contact_person: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      certificate_1: new FormControl('', Validators.required),
      certificate_2: new FormControl('', Validators.required),
      gst: new FormControl('', Validators.required),
      bank: new FormControl('', Validators.required),
      account_number: new FormControl('', [Validators.required, Validators.minLength(4)]),
      branch: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    
    Object.keys(this.form.value).map(key => {
      let val = key[0].toUpperCase() + key.substring(1);
      let name = val.replace('_', ' ');
      this.fields.push({name, controller: key});
    });

    // edit
    let params = this.navParams.data;
    if (params !== {}) {
      this.editCompany = true;
      for (let key in params) {
        if (key !== 'key') {
          this.form.controls[key].setValue(params[key]);
        }
      }
    }

  }

  submitForm(form: NgForm): void {
    this.appService.presentLoading(true);
    if (this.editCompany) {
      // update
      this.storeService.updateCompany(form.value, this.navParams.data.key)
        .then(res => this.appService.showToast('Company updated'))
        .catch(err => this.appService.showToast(err.message));
      this.appService.hideLoading();
    } else {
      // create
      this.storeService.addCompany(form.value)
        .then(e => {
          this.appService.showToast('Company created');
          this.appService.hideLoading();
          form.reset();
        })
        .catch(err => this.appService.showToast(err.message));
    }
  }

}
