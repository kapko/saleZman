import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'getShopNumber'
})

@Injectable()
export class GetShopNumberPipe {
  constructor() { }

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
