import { Component, Input } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';
import { CityService } from '../../services/city.service';
// interface
import { storeName } from '../../interfaces/city.store';
// rxjs
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'search-list',
  templateUrl: 'search-list.html'
})

export class SearchListComponent {
  storeNames: storeName[] = [];
  rawNames: storeName[] = [];
  cityName: string;
  limit: number = 20;
  infiniteScroll: InfiniteScroll;
  subject: Subject<any> = new Subject();
  activeDays: string[] = [];

  personalPage: boolean = true;

  constructor(
    private cityService: CityService,
  ) { }

  // resolve data
  @Input()
  set personalStore(val: boolean | null) {
    this.personalPage = val;
    this.getData({limit: this.limit});
  }

  // @Input()
  // set activityDays(days: string[]) {
    // console.log('days', days);
    // this.activeDays = days;
  // }

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
    if (!ev) return;
    if (!ev.target['value']) {
      this.storeNames = this.rawNames;
      return;
    }
    let val = ev.target['value'];

    if (val && val.trim() === '') {
      this.storeNames = this.rawNames;
      return;
    }
    this.storeNames = this.rawNames.filter(item => 
      (item._name.indexOf(val.toLowerCase()) > -1)
    );
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
        this.rawNames = names;
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
