import { Component, Input } from '@angular/core';
import { AppService } from '../../../services/app-service';
import { StoreService } from '../../../services/store.service';
import { storeName } from '../../../interfaces/city.store';
import 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentComponent } from '../payment';

@Component({
  selector: 'app-chq',
  templateUrl: 'cheque.html',
})

export class ChqComponent {
  @Input() store: storeName;
  @Input() product: Object;
  @Input() keys: any[string];

  form: FormGroup;

  date: string = this.appService.getCurrentDate(true);

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private paymentComponent: PaymentComponent,
  ) { }

  ngOnInit():void {
    this.form = new FormGroup({
      chq_number: new FormControl('', Validators.required),
      chq_date: new FormControl('', Validators.required),
      chq_amount: new FormControl('', Validators.required),
      chq_bank: new FormControl('', Validators.required),
      comment: new FormControl(''),
    });
  }

  submitForm(val: any): void {
    this.storeService
      .getBalance(this.product['key'])
      .take(1)
      .subscribe(rest => {
        this.paymentComponent.submiteForm(rest, this.product, val, 'chq_amount');
      });
    
  }
}
