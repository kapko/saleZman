import { Component, Input } from '@angular/core';
import { CityService } from '../../services/city.service';
// interface
import { storeName } from '../../interfaces/city.store';
// rxjs
import { Subject, Observable } from 'rxjs';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'search-list',
  templateUrl: 'search-list.html'
})

export class SearchListComponent {
  storeNames: storeName[] = [];
  rowNames: storeName[] = [];
  cityName: string;
  limit: number = 20;
  subject: Subject<any> = new Subject();
  activeDays: string[] = [];
  storeLength: number;
  _currentDay: string;

  personalPage: boolean = true;
  showScroll: boolean = false;

  constructor(
    private cityService: CityService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.presentLoading(true);
  }

  // current day
  @Input()
  set currentDay(day: string) {
    if (day) {
      this._currentDay = day;
      this.getData({limit: this.limit});
    }
  }

  // resolve data
  @Input()
  set personalStore(val: boolean | null) {
    this.personalPage = val;
    // this.getData({limit: this.limit});
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
  set searchEvent(val: string) {
    if (val && val.trim() === '') {
      this.storeNames = this.rowNames;
      return;
    }
    this.storeNames = this.rowNames.filter(item => 
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

  filterByDay(data: any): storeName[] {
    return data.filter(item => {
      let isPerosnalDay = item.hasOwnProperty('personal_day');
      // cases
      switch (this._currentDay) {
        case 'All days':
          if (isPerosnalDay) return true;
          break;
        case 'Not Set':
          if (!isPerosnalDay) return true;
          break;
        default:
          if (item.personal_day === this._currentDay) return true;
      }
    });
  }

  resolveData(data: Observable<any>): void {
    data
      .takeUntil(this.subject)
      .do(e => this.appService.hideLoading())
      .map(data => 
        data.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          .sort((a, b) => a._name.localeCompare(b._name))
        )
      .subscribe(names => {
        let data = this.filterByDay(names);
        this.showScroll = this.getLoaderStatus(data.length);

        this.storeNames = data;
        this.rowNames = data;
      });
  }

  loadMore(): void {
    this.limit += 20;
    let query = {limit: this.limit};

    if (this.cityName) {
      query['city'] = this.cityName;
    }

    this.getData(query);
  }

  getLoaderStatus(length: number): boolean {
    if (length >= 20) {
      return true;
    }

    if (this.storeLength === length) {
      return false;
    }

    this.storeLength = length;
  }

  track(index: number, item: any): string {
    return item.$key;
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

}
