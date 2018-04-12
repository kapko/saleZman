import { Component } from '@angular/core';
import { AppService } from '../services/app-service';
import { NavController } from 'ionic-angular';
import { SearchPage } from '../pages/search/search';
import { CreateStoreComponent } from './create-store/create-store';

@Component({
  selector: 'app-footer',
  template: `<ion-fab right bottom>
  <button ion-fab color="light"><ion-icon name="arrow-dropup"></ion-icon></button>
  <ion-fab-list side="top">
    <button ion-fab (click)="getEvent('search')"><ion-icon name="list-box"></ion-icon></button>
    <button ion-fab (click)="getEvent('add')"><ion-icon name="add-circle"></ion-icon></button>
  </ion-fab-list>
</ion-fab>`,
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
    private appService: AppService,
    private navController: NavController
  ){}

  addNew(): void {
    this.appService.showToast('some function for create new ...')
  }

  getEvent(val: string): void {
    if (val === 'add') {
      this.navController.push(CreateStoreComponent);
    } else {
      this.navController.setRoot(SearchPage);
    }
  }
}
