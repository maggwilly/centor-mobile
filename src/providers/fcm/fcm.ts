import { Injectable } from '@angular/core';
import { FCM  as Firebase} from '@ionic-native/fcm'


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
    return this.firebaseNative.onNotification();
  }

  setUserId(userId) {}

  listenTopic(topic) {
    return this.firebaseNative.subscribeToTopic(topic);
  }

}
