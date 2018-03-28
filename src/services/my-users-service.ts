import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { StoreService } from './store.service';
import { AuthService } from './auth.service';

@Injectable()

export class MyUserService {
  userId: string = this.authService.currentUserId;

  distributerPath: string = '/distributors-users/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private storeService: StoreService,
    private authService: AuthService,
  ) { }

  getMyUsers(): Observable<any> {
    return this.db.list(this.distributerPath + this.userId).snapshotChanges();
  }

}
