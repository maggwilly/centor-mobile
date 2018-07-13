
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular'
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';



/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {


  constructor(
    private firebaseNative: Firebase,
    private platform: Platform) {
    console.log('Hello FcmProvider Provider');
  }

  setScreemName(name) {
    this.platform.ready().then(() => {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.firebaseNative.setScreenName(name);
      this.firebaseNative.logEvent(name+'_opened', { page: name })
    }
    });
  }

  logEvent(name,data) {
    this.platform.ready().then(() => {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.firebaseNative.logEvent(name, data)
    }
    });
  }

  getToken(){
    return this.firebaseNative.getToken();
  }

  onTokenRefresh(){
    return this.firebaseNative.onTokenRefresh();
  }  

  onNotification() {
    console.log('Nofified');
    return this.firebaseNative.onNotificationOpen();
  }  
  
  setUserId(userId) {
    return this.firebaseNative.setUserId(userId);
  }  

  listenTopic(topic) {
    return this.firebaseNative.subscribe(topic);
  }  

 
}
