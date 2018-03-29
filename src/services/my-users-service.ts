import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app-service';
import { AuthService } from './auth.service';

@Injectable()

export class MyUserService {
  userId: string = this.authService.currentUserId;

  distributerPath: string = '/distributors-users/';

  userPath: string = '/users/';

  constructor(
    private db: AngularFireDatabase,
    private appService: AppService,
    private authService: AuthService,
  ) { }

  getMyUsers(): Observable<any> {
    return this.db.list(this.distributerPath + this.userId).snapshotChanges();
  }

  getUserByEmail(email: string): Observable<any> {
    return this.db.list(this.userPath,
      ref => ref.orderByChild('email').equalTo(email)
    ).snapshotChanges();
  }

  getDistributorUserByEmail(uid: string): Observable<any> {
    return this.db
      .object(this.distributerPath+`${this.authService.currentUserId}/${uid}`)
      .valueChanges()
  }

  createUserForDistributor(uid: string): Promise<any> {
    return this.db
      .object(this.distributerPath+`${this.authService.currentUserId}/${uid}`)
      .set(true);
  }

}
