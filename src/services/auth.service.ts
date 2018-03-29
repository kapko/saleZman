import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFireDatabase} from 'angularfire2/database';
import { AppService } from './app-service';

@Injectable()
export class AuthService {

  currentUserId: string;

  currentUserEmail: string;

  emailVerified: boolean;

  usersPath: string = '/users/';

  distributorsUserPath: string = '/distributors-users/';

  constructor(
    private afAuth: AngularFireAuth,
    private appService: AppService,
    private db: AngularFireDatabase,
  ) {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    if (localStorage.getItem('uid')) {
      this.currentUserId = localStorage.getItem('uid');
      this.currentUserEmail = localStorage.getItem('email');
      this.emailVerified = (localStorage.getItem('emailVerified') === 'true') ? true : false;
      return;
    };
    this.authUserId()
      .take(1)
      .subscribe(user => {
        if (!user) return;
        localStorage.setItem('uid', user['uid']);
        localStorage.setItem('email', user['email']);
        localStorage.setItem('emailVerified', user['emailVerified'])
        this.currentUserId = user.uid;
        this.currentUserEmail = user.email;
      });
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

  createNewUser(user: any, status: string | null = 'user'): Promise<any> {
    return this.db
      .object(this.usersPath + user.uid)
      .set({ email: user.email, status: status });
  }

  createUserByDistributor(user: any): Promise<any> {
    return this.db
      .object(`${this.distributorsUserPath}${this.currentUserId}/${user.uid}`)
      .set({email: user.email, admin: false});
  }

  resetPassword(email: string): any {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signOut(): any {
    this.afAuth.auth.signOut();
  }

  updateDistributorsUser(uid: string, status: boolean): Promise<any> {
    return this.db
      .object(`${this.distributorsUserPath}${this.currentUserId}/${uid}/status`)
      .set(status);
  }

  updateUserForAdmin(uid: string, status: string | null): Promise<any> {
    return this.db
      .object(`${this.usersPath}${uid}/status`)
      .set(status);
  }

}
