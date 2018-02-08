import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
  authInfo:any;
  notificationId: string
  flipState: String = 'notFlipped';
  flyInOutState: String = 'in';
  fadeState: String = 'visible';
  bounceState: String = 'noBounce';
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,) {
  }

  ionViewDidLoad() {
  /*  this.storage.get('registrationId').then(id => {
      this.notificationId = id;
      this.observeAuth()
    })*/
    this.observeAuth();
  }
  toggleFlip() {
    this.flipState = (this.flipState == 'notFlipped') ? 'flipped' : 'notFlipped';
  }
  openPage(page){
      this.navCtrl.push(page)
  }

  observeAuth() {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.notificationId = user.uid;
        this.authInfo = user;
      } else {
        this.authInfo = undefined;
        unsubscribe();
      }
 
    });
  }
  
  openArticles() {
    // close the menu when clicking a link from the menu
    this.navCtrl.push('NotificationsPage');
  }  
}
