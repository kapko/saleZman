import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-store',
  templateUrl: 'manage-store.html'
})

export class ManageStorePage {

  showAddProduct: boolean = true;

  cancelAddPriduct(): void {
    this.showAddProduct = false;
  }

}
