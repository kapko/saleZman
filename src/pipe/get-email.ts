import { Injectable, Pipe } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'getEmail'
})

@Injectable()
export class GetEmailPipe {
  constructor(
    private authService: AuthService
  ) { }

  transform(uid: string): Observable<any> {
    return this.authService.getProfile(uid).take(1);
  }
}
