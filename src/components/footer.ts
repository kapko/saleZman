import { Component } from '@angular/core';
import { AppService } from '../services/app-service';

@Component({
  selector: 'app-footer',
  template: `<ion-icon class="addNew" name="add-circle" (click)="addNew()" float-right></ion-icon>`,
  styles: [`.addNew {
    color: #5bd8f4; 
    font-size: 45px;
    position: fixed;
    right: 10px;
    bottom: 10px;
    z-index: 10;
  }`]
})

export class FooterComponent {
  constructor(
    private appService: AppService
  ){

  }
  addNew(): void {
    this.appService.showToast('some function for create new ...')
  }
}
