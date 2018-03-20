import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'keys',
})

@Injectable()
export class KeysPipe {
  transform(product: any): any {
    let data = [];
    for (let key in product) {
      if (typeof product[key] !== 'string') {
        data.push(product[key]);
      }
    }
    return data;
  }
}
