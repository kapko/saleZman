import { Component, Input } from '@angular/core';
// interface
import { storeName } from '../../interfaces/city.store';
// rxjs
import { Subject, Observable } from 'rxjs';
import { ElasticSearchService } from '../../services/elastic-service';

@Component({
  selector: 'elastic-stores',
  templateUrl: 'elastic-stores.html'
})

export class ElasticStoreComponent {
  storeNames: storeName[] = [];
  activeDays: string[] = [];
  scrollCount: number = 0;
  showScroll: boolean = false;
  searchName: string;

  constructor(
    private elasticService: ElasticSearchService,
  ) { }

  // search filtering
  @Input()
  set searchEvent(text: string) {
    this.searchName = text;
    if (!this.searchName) return;

    this.getSearchedStores(0)
      .subscribe(stores => {
        this.storeNames = stores;
      })
  }

  getMoreStores(): void {
    this.scrollCount ++;
    let from = 20 * this.scrollCount;
    this.getSearchedStores(from)
      .subscribe(stores => {
        if (!stores.length) {
          this.showScroll = false;
        }
  
        stores.forEach(element => this.storeNames.push(element));
      });

  }

  getSearchedStores(from: number): Observable<any> {
    return this.elasticService
      .getStores(this.searchName.toLowerCase(), from)
      .take(1)
      .map(res => {
        // show scroll on UI
        this.showScroll = (res.json().hits && res.json().hits.total > 20)
        ? true : false;

        return res
          .json().hits.hits
            .map(item => Object.assign({key: item._id}, item._source));
      });
  }

}
