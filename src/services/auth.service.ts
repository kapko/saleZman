import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class AuthService {

  usersPath: string = '/users/';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) {
  }

  authUserId(): Observable<any> {
    return this.afAuth.authState;
  }

  getProfile(uid: string): Observable<any> {
    return this.db.object(this.usersPath + uid).valueChanges();
  }

  signIn(email: string, password: string): any {
    if (!email || !password) {
      return Promise.reject('');
    }

    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): any {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signOut(): any {
    this.afAuth.auth.signOut();
  }

}
