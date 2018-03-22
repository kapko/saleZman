import { Component, Input } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { storeName } from '../../../interfaces/city.store';
import 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentComponent } from '../payment';

@Component({
  selector: 'app-cash',
  templateUrl: 'cash.html',
})

export class CashComponent {
  @Input() store: storeName;
  @Input() product: Object;
  @Input() keys: any[string];

  form: FormGroup;

  constructor(
    private storeService: StoreService,
    private paymentComponent: PaymentComponent,
  ) { }

  ngOnInit():void {
    this.form = new FormGroup({
      payment_amount: new FormControl('', [Validators.required, Validators.min(1)]),
      comment: new FormControl(''),
    });
  }

  submitForm(val: any): void {
    this.storeService
      .getBalance(this.product['key'])
      .take(1)
      .subscribe(rest => {
        this.paymentComponent.submiteForm(rest, this.product, val, 'payment_amount');
      });
  }
}
