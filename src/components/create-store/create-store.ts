import { Component, PACKAGE_ROOT_URL } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { AppService } from '../../services/app-service';
import { NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'create-store',
  templateUrl: 'create-store.html',
})

export class CreateStoreComponent {
  form: FormGroup;

  editCompany: boolean = false;

  fields: any [] = [];

  navData: Object | null = null;

  constructor(
    private storeService: StoreService,
    private appService: AppService,
    private navParams: NavParams,
    private authService: AuthService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
    });

    Object.keys(this.form.value).map(key => {
      let val = key[0].toUpperCase() + key.substring(1);
      let name = val.replace('_', ' ');
      let type = this.appService.getType(key);
      this.fields.push({name, controller: key, type});
    });

    // edit
    this.navData = this.navParams.data;
    this.form.controls['name'].setValue(this.navData['name']);
    this.form.controls['discount'].setValue(this.navData['discount']);
  }

  submitForm(form: NgForm): void {
    this.appService.presentLoading(true);

    let val = form.value;
    val.created_by = this.authService.currentUserId;
    val._name = val.name.toLowerCase();
    val.url = val._name.replace(/\s/ig, '_');

    if (Object.keys(this.navData).length) {
      // update
      this.storeService.updateStore(this.navData['key'], val)
        .then(res => {
          this.appService.showToast('Store Updated');
          this.appService.hideLoading();
        })
        .catch(err => console.log(err));
    } else {
      // create
      this.storeService.addStore(val)
        .then(res => {
          this.appService.showToast('Store Created');
          this.appService.hideLoading();
          form.reset();
        })
        .catch(err => console.log(err));
    }

    
  }

}
