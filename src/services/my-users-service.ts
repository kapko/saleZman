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

  distributorsUserPath: string = '/distributors-users/';

  currentUserId: string = this.authService.currentUserId;

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
      .update({
        activated: false,
        status: false,
      });
  }

  updateDistributorsUser(uid: string, status: boolean): Promise<any> {
    return this.db
      .object(`${this.distributorsUserPath}${this.currentUserId}/${uid}/status`)
      .set(status);
  }

  updateUserForAdmin(uid: string, status: string | null): Promise<any> {
    return this.db
      .object(`${this.userPath}${uid}/status`)
      .set(status);
  }

  createNewUser(user: any, status: string | null = 'user'): Promise<any> {
    return this.db
      .object(this.userPath + user.uid)
      .set({ email: user.email, status: status });
  }

  createUserByDistributor(user: any): Promise<any> {
    return this.db
      .object(`${this.distributorsUserPath}${this.currentUserId}/${user.uid}`)
      .set({email: user.email, admin: false});
  }

}
