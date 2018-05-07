import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'personalDay',
})

@Injectable()
export class PersonalDayPipe {
  transform(data: any, currentDay: string): any {
    return data.filter(item => {
      let isPerosnalDay = item.hasOwnProperty('personal_day');
      // cases
      switch (currentDay) {
        case 'All days':
          if (isPerosnalDay) return true;
          break;
        case 'Not Set':
          if (!isPerosnalDay) return true;
          break;
        default:
          if (item.personal_day === currentDay) return true;
      }
    });
  }

  // transform(item: any, currentDay: string): boolean {
  //   let isPerosnalDay = item.hasOwnProperty('personal_day');
  //   // cases
  //   switch (currentDay) {
  //     case 'All days':
  //       if (isPerosnalDay) return true;
  //       break;
  //     case 'Not Set':
  //       if (!isPerosnalDay) return true;
  //       break;
  //     default:
  //       if (item.personal_day === currentDay) return true;
  //   }

  // }
}
