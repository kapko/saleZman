import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'datePipe',
})

@Injectable()
export class DatePipe {
  transform(products: any, dates: any[string], key: string): any {
    if (dates.length) {
      
      return products.filter(el => 
        (el[key].match('.'))
          ? dates.includes(el[key].replace(/\./g, '-'))
          : dates.includes(el[key])
      )

    } else {
      return products;
    }
  }
}
