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

  getData(key: string = null, load: boolean = false): void {
    this.cityService
      .getPersonalStores(key, this._currentDay)
      .do(e => {
        this.showScroll = this.getLoaderStatus(e.length);
        if (load) {e.splice(0, 1)}
        // key for pagination
        this.lastKey = e[(e) ? e.length - 1 : 0]['_id'];
        this.appService.hideLoading();
      })
      .subscribe(names => {
        // names
        names.forEach(item => {
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
    this.getData(this.lastKey, true);
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
