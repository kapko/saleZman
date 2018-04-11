import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'demicalPipe',
})

@Injectable()
export class DemicalPipe {
  transform(value: number): string {
    if (value) {
      return value.toFixed(2);
    }
  }
}
