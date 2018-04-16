import { Injectable, Pipe } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from '../services/store.service';

@Pipe({
  name: 'getStoreDetails'
})

@Injectable()
export class GetStoreDetailsPipe {
  constructor(
    private storeService: StoreService,
  ) { }

  transform(key: string): Observable<any> {
    return this.storeService.getStoreByKey(key).take(1);
  }
}
