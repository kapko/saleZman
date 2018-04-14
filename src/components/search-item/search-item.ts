import { Component, Input } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { StorePage } from '../../pages/store/store';
import { storeName } from '../../interfaces/city.store';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app-service';
import { CreateStoreComponent } from '../create-store/create-store';
import { StoreMarginComponent } from '../store-margin/store-margin';

@Component({
  selector: 'search-item',
  templateUrl: 'search-item.html'
})

export class SearchItemComponent {
  private _item: Object;

  private _hideIcons: boolean;

  currentUid: string = this.authService.currentUserId;

  constructor(
    private navCtrl: NavController,
    private storeService: StoreService,
    private authService: AuthService,
    private appService: AppService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  get item(): Object {
    return this._item;
  }

  @Input()
  set item(item: Object) {
    this._item = item;
  }

  // hide icons
  get hideIcons(): boolean {
    return this._hideIcons;
  }

  @Input()
  set hideIcons(val: boolean) {
    this._hideIcons = val;
  }

  updateMargin(item: Object): void {
    this.modalController
      .create(StoreMarginComponent, item)
      .present();
  }

  updatePersonStore(item: any): void {
    if (this.checkPersonId(item)) {
      // remove
      this.storeService.setPersonToStore(item.key, null)
        .then(res => {
          this.appService.showToast(`Store ${item.name} removed from your Person Store List.`);
        })
        .catch(err => console.log(err));
    } else {
      // add
      this.storeService.setPersonToStore(item.key)
        .then(res => {
          this.appService.showToast(`Store ${item.name} added to you Person Store.`);
        })
        .catch(err => console.log(err));
    }
    
  }

  updateItem(item: any, action: string = 'update'): void {
    if (action === 'update') {
      this.navController.push(CreateStoreComponent, item);
    } else {
      this.appService.showAlert('Do you want to remove this store?', [
        {
          text: 'yes',
          handler: e => {
            this.storeService.updateStore(item.key);
            this.appService.showToast('Removed');
          }
        },
        'no'
      ]);

    }
  }

  openStore(store: storeName): void {
    this.storeService.setUserStoreName(store);
    this.navCtrl.setRoot(StorePage);
  }

  checkPersonId(item: Object): boolean {
    if (item 
      && item['persons'] 
      && Object.keys(item['persons']).includes(this.authService.currentUserId)
    ) {
      return true
    } else {
      return false;
    }
  }

}
