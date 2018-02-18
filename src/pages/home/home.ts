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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,) {
  }

  ionViewDidLoad() {

    this.observeAuth();
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
