import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
  ) {
    // this.user = afAuth.authState;
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
