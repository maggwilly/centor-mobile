import { Injectable } from '@angular/core';
//import { Component } from '@angular/core';
import {  ToastController, ToastOptions } from 'ionic-angular';

@Injectable()
export class AppNotify {
  static isShow:boolean=false;
  constructor(
    private toastCtrl: ToastController
  ) {
    this.toastCtrl = toastCtrl;
  
  }

  onSuccess(toastOpts: ToastOptions) {
    if (AppNotify.isShow)
       return
    AppNotify.isShow = true;
    let succesToast = this.toastCtrl.create({
      message: toastOpts.message,
      closeButtonText: toastOpts.closeButtonText || 'Ok',
      duration: toastOpts.duration || 4000,
      position: toastOpts.position || 'bottom',
      showCloseButton: toastOpts.showCloseButton || true,
      //cssClass: 'success',
    });
    succesToast.onDidDismiss(() => {
      AppNotify.isShow = false;
    })
    succesToast.present();


  }

  onError(toastOpts: ToastOptions) {
    if (AppNotify.isShow)
      return
    AppNotify.isShow = true;
    let errorToast = this.toastCtrl.create({
      message: toastOpts.message,
      duration: toastOpts.duration || 5000,
      position: toastOpts.position || 'bottom',
      showCloseButton: toastOpts.showCloseButton || true,
      //cssClass: 'danger',
    });
    errorToast.onDidDismiss(() => {
      AppNotify.isShow = false;
    })
    errorToast.present();

  }

}
