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
  subject: Subject<any> = new Subject();
  activeDays: string[] = [];
  storeLength: number;
  _currentDay: string;
  lastKey: string;

  personalPage: boolean = true;
  showScroll: boolean = false;

  constructor(
    private cityService: CityService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    // this.appService.presentLoading(true);
  }

  // current day
  @Input()
  set currentDay(day: string) {
    if (day) {
      this.storeNames = [];
      this.rowNames = [];

      this._currentDay = day;
      this.getData();
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

  // search filtering
  @Input()
  set searchEvent(val: string) {
    if (val && val.trim() === '') {
      this.storeNames = this.rowNames;
      return;
    }
    this.storeNames = this.rowNames.filter(item => 
      (item._name.indexOf(val.toLowerCase()) > -1 
      || item.city.toLowerCase().indexOf(val.toLowerCase()) > -1)
    );
    this.showScroll = this.getLoaderStatus(this.storeNames.length);
  }

  getData(key: string = null): void {
    this.resolveData(this.cityService.getPersonalStores(key));
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
        // key for pagination
        this.lastKey = names[0]['key'];

        let data = this.filterByDay(names);
        this.showScroll = this.getLoaderStatus(data.length);
        this.filterByDay(names).forEach(item => {
          this.storeNames.push(item);
          this.rowNames.push(item);
        });
      });
  }

  loadMore(): void {
    let key;
    if (this.lastKey === key) {
      this.showScroll = false;
    }
  
    key = this.lastKey;
    this.getData(this.lastKey);
  }

  getLoaderStatus(length: number): boolean {
    if (length >= 19) {
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
