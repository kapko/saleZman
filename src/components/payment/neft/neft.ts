import { Component, Input } from '@angular/core';
import { AppService } from '../../../services/app-service';
import { StoreService } from '../../../services/store.service';
import { storeName } from '../../../interfaces/city.store';
import 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  ) { }

  ngOnInit():void {
    this.neftForm = new FormGroup({
      neft_date: new FormControl('', Validators.required),
      neft_amount: new FormControl('', Validators.required),
      comment: new FormControl(''),
    });
  }

  submitForm(val: any): void {
    this.storeService
      .getBalance(this.product['key'])
      .take(1)
      .subscribe(rest => {
        let billAmount = (typeof rest === 'number' && rest >= 0) ? rest : this.product['amount']
        let balance = billAmount - val.neft_amount;

        if (balance >= 0) {
          this.storeService.setBalance(this.product['key'], balance);
          if (balance === 0) {
            // update payment status to 'done'
            this.storeService.updatePaymentStatus(this.store._name, this.product['key']);
          }

          this.keys.forEach(key => delete this.product[key]);

          this.product['payment_date'] = this.appService.getCurrentDate(true);
          this.product['collected_by'] = this.storeService.userId;
          Object.assign(this.product, val);

          this.storeService.addPayment(this.store._name, this.product);
          this.appService.showToast('Your payment completed.');
        } else {
          this.appService.showToast('ERROR: Payment amount more then bill amount for ' + balance);
        }
      });
    
  }
}
