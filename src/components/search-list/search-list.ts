import { Component, Input } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';
import { CityService } from '../../services/city.service';
// interface
import { storeName } from '../../interfaces/city.store';
// rxjs
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { Subject, Observable } from 'rxjs';
import { ElasticSearchService } from '../../services/elastic-service';

@Component({
  selector: 'search-list',
  templateUrl: 'search-list.html'
})

export class SearchListComponent {
  storeNames: storeName[] = [];
  rowNames: storeName[] = [];
  cityName: string;
  limit: number = 20;
  infiniteScroll: InfiniteScroll;
  subject: Subject<any> = new Subject();
  activeDays: string[] = [];

  personalPage: boolean = true;
  showScroll: boolean = true;

  constructor(
    private cityService: CityService,
    private elasticService: ElasticSearchService,
  ) { }

  // resolve data
  @Input()
  set personalStore(val: boolean | null) {
    this.personalPage = val;
    this.getData({limit: this.limit});
  }

  @Input()
  set activityDays(days: string[]) {
    this.activeDays = days;
  }

  // filter by company name
  @Input()
  set city(city: string) {
    if (!city) return;
    this.cityName = city;
    this.limit = 40;
    this.getData({city: this.cityName, limit: this.limit});
  }

  // search filtering
  @Input()
  set searchEvent(ev: Event) {
    let name = (ev) ? ev.target['value'] : null;
    let length = (name) ? name.length : null;
    if (!name && !length) {
      this.showScroll = true;
      this.storeNames = this.rowNames;
      return;
    };
    this.elasticService
      .getStores(name.toLowerCase())
      .take(1)
      .subscribe(data => {
        this.showScroll = false;
        this.storeNames = data;
      })
  }

  getData(query: any): void {
    if (this.personalPage) {
      // get personal store
      this.resolveData(this.cityService.getPersonalStores(query));
    } else {
      // get common store
      this.resolveData(this.cityService.getStoreNames(query));
    }
  }

  resolveData(data: Observable<any>): void {
    data
      .takeUntil(this.subject)
      .do(() => {
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          this.infiniteScroll = null;
        }
      })
      .map(data => 
        data.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          .sort((a, b) => a._name.localeCompare(b._name))
        )
      .subscribe(names => {
        this.storeNames = names;
        this.rowNames = names;
      });
  }

  loadMore(infiniteScroll: InfiniteScroll): void {
    this.limit += 20;
    let query = {limit: this.limit += 20};

    if (this.cityName) {
      query['city'] = this.cityName;
    }

    this.getData(query);
    this.infiniteScroll = infiniteScroll;
  }

  track(index: number, item: any): string {
    return item.$key;
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
