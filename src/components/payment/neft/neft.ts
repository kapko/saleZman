import { Component, Input } from '@angular/core';
import { AppService } from '../../../services/app-service';
import { StoreService } from '../../../services/store.service';
import { storeName } from '../../../interfaces/city.store';
import 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentComponent } from '../payment';

@Component({
  selector: 'app-neft',
  templateUrl: 'neft.html',
})

export class NeftComponent {
  @Input() store: storeName;
  @Input() product: Object;
  @Input() keys: any[string];

  neftForm: FormGroup;

  date: string = this.appService.getCurrentDate(true);

  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private paymentComponent: PaymentComponent,
  ) { }

  ngOnInit():void {
    this.neftForm = new FormGroup({
      neft_date: new FormControl('', Validators.required),
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
