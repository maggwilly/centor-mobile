import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
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
    templateUrl: 'home.html',
    animations: [
      trigger('flip', [
        state('flipped', style({
          transform: 'rotate(180deg)',
          backgroundColor: '#f50e80'
        })),
        transition('* => flipped', animate('400ms ease'))
      ]),

      trigger('flyInOut', [
        state('in', style({
          transform: 'translate3d(0, 0, 0)'
        })),
        state('out', style({
          transform: 'translate3d(150%, 0, 0)'
        })),
        transition('in => out', animate('200ms ease-in')),
        transition('out => in', animate('200ms ease-out'))
      ]),

      trigger('fade', [
        state('visible', style({
          opacity: 1
        })),
        state('invisible', style({
          opacity: 0.1
        })),
        transition('visible <=> invisible', animate('200ms linear'))
      ]),

      trigger('bounce', [
        state('bouncing', style({
          transform: 'translate3d(0,0,0)'
        })),
        transition('* => bouncing', [
          animate('300ms ease-in', keyframes([
            style({ transform: 'translate3d(0,0,0)', offset: 0 }),
            style({ transform: 'translate3d(0,-10px,0)', offset: 0.5 }),
            style({ transform: 'translate3d(0,0,0)', offset: 1 })
          ]))
        ])
      ])

    ]
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
