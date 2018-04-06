import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { AppService } from '../../services/app-service';

export interface AddProductForm {
  name: string;
  controller: string;
}

@Component({
  selector: 'app-add-store',
  templateUrl: 'add-store.html',
})

export class AddStoreComponent {
  @Output()
  cancelAddPriduct: EventEmitter<void> = new EventEmitter();

  form: FormGroup;

  fields: AddProductForm[] = [];

  constructor(
    private storeService: StoreService,
    private appService: AppService,
  ) {
    this.form = new FormGroup({
      company_name: new FormControl('', Validators.required),
      address_1: new FormControl('', Validators.required),
      address_2: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      contact_person: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      certificate_1: new FormControl('', Validators.required),
      certificate_2: new FormControl('', Validators.required),
      gst: new FormControl('', Validators.required),
      bank: new FormControl('', Validators.required),
      account_number: new FormControl('', Validators.required),
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
  }

  submitForm(val: any): void {
    val.key = Date.now();
    this.storeService.addProduct(val)
      .then(e => this.appService.showToast('Product created'))
      .catch(err => this.appService.showToast(err.message))
  }

  cancelForm(): void {
    this.cancelAddPriduct.emit();
  }

}
