import { Injectable } from '@angular/core';
import { FCM  as Firebase} from '@ionic-native/fcm'
import {Observable} from "rxjs";

@Injectable()
export class FcmProvider {

  constructor(
    private firebaseNative: Firebase) {

  }

  setScreemName(name) {

  }

  logEvent(name,data) {

  }

  getToken(){
    return this.firebaseNative.getToken();
  }

  onTokenRefresh(){
    return this.firebaseNative.onTokenRefresh();
  }

  onNotification() {
  // return  Observable.of({page:'resultat'}).delay(5000)
    return this.firebaseNative.onNotification();
  }

  getNotification() {
    return new Promise( resolve => {
      this.firebaseNative.onNotification()
     /* Observable.of({page:'document', id:10,groupdisplayname:"Essai"})
        .delay(1000)*/
        .pipe()
        .timeoutWith(700, Observable.of(null))
        .subscribe( data=>resolve(data))
    });
  }

  setUserId(userId) {}

  listenTopic(topic) {
    return this.firebaseNative.subscribeToTopic(topic);
  }

}
