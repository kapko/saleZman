import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
@Injectable()
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
  ) {}

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
