import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';
import { AppService } from './app-service';

@Injectable()
export class AuthService {

  usersPath: string = '/users/';

  constructor(
    private afAuth: AngularFireAuth,
    private appService: AppService,
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

  signUp(email: string, password: string): Promise<any> {
    // if null return with errors
    if (!email || !password) return Promise.reject('');

    // register & create user on system
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  sendEmailVerify(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        let opt = [];
        
        this.appService.showToast('We have sent on your email verification pleas check and login');
        opt.push(
          this.db.object(this.usersPath + user.uid).set({ email: user.email, status: 'user' }),
          user.sendEmailVerification()
        );

        // create new user and send email verification
        return Promise.all(opt);
      }
    });
  }

  resetPassword(email: string): any {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signOut(): any {
    this.afAuth.auth.signOut();
  }

}
