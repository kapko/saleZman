import { Injectable, Pipe } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'getShopNumber'
})

@Injectable()
export class GetShopNumberPipe {
  constructor(
    private authService: AuthService
  ) { }

  transform(shops: any): number {
    let totalShopNumber = 0;
    // get length of products in shops array
    shops.forEach(stores => {
      for (let i in stores) {
        if (typeof stores[i] !== 'string') {
          totalShopNumber ++;
        }
      } 
    });
    return totalShopNumber;
  }
}
