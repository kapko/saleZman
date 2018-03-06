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
  ) {

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
          // don't worry about it, it's okay
        });
    }
  }

  showLoading(content: string): Promise<any> {
    this.loading = this.loadingCtrl.create({
      content: content,
      spinner: 'crescent'
    });

    return this.loading.present();
  }

  hideLoading(): Promise<any> {
    if (this.loading) {
      return this.loading.dismiss()
        .catch(error => {
          // don't worry about it, it's okay
        });
    }
  }

  getCurrentDate(): string {
    let days = ['Mon','Tue','Wed','Thu','Fri','Sat', 'Sun'];
    let day = new Date();
    let dd = (day.getDate() < 10) ? '0' + day.getDate() : day.getDate();
    let m = day.getMonth()+1;
    let mm = (m < 10) ? '0' + m : day.getMonth()+1;

    return `${dd}.${mm}.${day.getFullYear()} ${days[day.getDay()]}`;
  }
}
