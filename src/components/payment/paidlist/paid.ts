import { Component, Input } from '@angular/core';
import { storeName } from '../../../interfaces/city.store';

@Component({
  selector: 'app-paid',
  templateUrl: 'paid.html',
})

export class PaidListComponent {
  @Input() paidList: any[] = [];
  constructor(){ }
}
