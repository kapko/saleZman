import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paid',
  templateUrl: 'paid.html',
})

export class PaidListComponent {
  @Input() paidList: any[] = [];
  list: any[] = [];

  constructor( ){ }

  ngOnChanges(): void {
    if (!this.paidList) return;
    this.list = this.paidList;
  }
}
