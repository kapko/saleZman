import { Component, Output, EventEmitter } from '@angular/core';
import 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
  @Output() state: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup;

  date: string = this.appService.getCurrentDate(true);

  constructor(
    private appService: AppService,
    private authService: AuthService,
  ) { }

  ngOnInit():void {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.min(5)]),
      confirm_pass: new FormControl('', [Validators.required, Validators.min(5)]),
    });
  }

  submitForm(val: any): void {
    if (val.password !== val.confirm_pass) {
      this.appService.showToast('Confirmation password is wrong');
      return;
    }
    // signup and verify user by email
    this.authService.signUp(val.email, val.password)
      .then(user => {
        this.authService.sendEmailVerify();
      })
      .catch(err => this.appService.showToast(err.message));
  }

}
