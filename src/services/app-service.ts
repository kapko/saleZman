import { Injectable } from '@angular/core';
import { ToastController, Toast, AlertController, Alert, LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class AppService {

  alert: Alert;
  loading: Loading;

  toast: Toast;

  constructor(private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController
  ) {}

  presentLoading(active: boolean): void {
    this.loading = this.loadingCtrl.create({content: 'Please wait'});
    this.loading.present();
  }

  showToast(message: string, duration: number = 3e3): Promise<any> {
    if (this.toast) {
      return;
    }

    // show error message
    this.toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });

    this.toast.onDidDismiss(() => {
      this.toast = null;
    });

    return this.toast.present();
  }

  showAlert(message: string, buttons: any[], title: string = '', enableBackdropDismiss: boolean = true): Promise<any> {
    this.alert = this.alertCtrl.create({
      message: message,
      buttons: buttons,
      title: title,
      enableBackdropDismiss
    });

    return this.alert.present();
  }

  hideAlert(): Promise<any> {
    if (this.alert) {
      return this.alert.dismiss()
        .catch(error => {
        });
    }
  }

  hideLoading(): Promise<any> {
    if (this.loading) {
      return this.loading.dismiss();
    }
  }

  getCurrentDate(withoutDate: boolean = false): string {
    let days = ['Mon','Tue','Wed','Thu','Fri','Sat', 'Sun'];
    let day = new Date();
    let dd = (day.getDate() < 10) ? '0' + day.getDate() : day.getDate();
    let m = day.getMonth()+1;
    let mm = (m < 10) ? '0' + m : day.getMonth()+1;

    let date = `${dd}.${mm}.${day.getFullYear()}`;
    return (withoutDate) ? date : `${date} ${days[(!day.getDay()) ? 6 : day.getDay() - 1]}`;
  }

  getDate(date): string {
    let dd = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    let m = date.getMonth()+1;
    let mm = (m < 10) ? '0' + m : date.getMonth()+1;
    return `${dd}-${mm}-${date.getFullYear()}`;
  }

  getMonday(d): Date {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
    return new Date(d.setDate(diff));
  }

  getSunday(date: Date): Date {
    return new Date(date.setDate(date.getDate() - date.getDay()+7));
  }

  getYesterday(date: Date): Date {
    return new Date(date.setDate(date.getDate() - 1));
  }

  getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  getDates(startDate: Date, endDate: Date) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {
      dates.push(this.getDate(currentDate));
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };

  getKeys(data): any[] {
    return data.foreach(c => ({ key: c.payload.key, ...c.payload.val() }));
  }

}
