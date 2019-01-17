import { Component, NgZone, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import { AppNotify } from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
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
        })),
        transition('* => flipped', animate('400ms ease'))
      ]),

      trigger('flyInOut', [
        state('in', style({
          transform: 'translate3d(0, 0, 0)'
        })),
        state('out', style({
          transform: 'translate3d(-35%, 0, 0)'
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
          animate('900ms ease-in', keyframes([
            style({ transform: 'translate3d(0,0,0)', offset: 0 }),
            style({ transform: 'translate3d(0,-30px,0)', offset: 0.5 }),
            style({ transform: 'translate3d(0,0,0)', offset: 1 })
          ]))
        ])
      ])

    ]  
})
export class HomePage {
  authInfo: any;
  notificationId: string
  registrationId
  bounceState: String = 'noBounce';
  flipState: String = 'notFlipped';
  flyInOut: String = 'out'
  zone: NgZone
  abonnement: any;
  abonnementLoaded: any = false;
  stats:any
  tooltipEvent: 'click' | 'press' = 'click';
  showArrow: boolean = true;
  duration: number = 3000;  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notify: AppNotify,
    public storage: Storage,
    public firebaseNative: Firebase,
    public dataService: DataService, ) {
    this.zone = new NgZone({});
    this.firebaseNative.setScreemName('home_page');
  }

  ionViewDidLoad() {

    this.storage.get('registrationId').then((data) => {
      this.registrationId = data;
    })

    this.storage.get('home_stats_').then((data)=>{
      this.stats=data?data:undefined; 
          this.loadData();          
    },error=>{

    })  
    this.observeAuth();
  }
  toggleBounce() {
    this.bounceState = (this.bounceState == 'noBounce') ? 'bouncing' : 'noBounce';
  }
  toggleFlip() {
    this.flipState = (this.flipState == 'notFlipped') ? 'flipped' : 'notFlipped';
  }

  toggleFly() {
    this.flyInOut = (this.flyInOut == 'out') ? 'in' : 'out';
  }
  openPage(page,arg?:any) {
    this.navCtrl.push(page, arg)
  }

  observeAuth() {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.notificationId = user.uid;
        this.authInfo = user;
        this.getAbonnement();
        this.loadData()
      } else {
        this.authInfo = undefined;
        unsubscribe();
      }
    });
    setInterval(() => {
      this.toggleFlip();
    }, 2000);
    setInterval(() => {
      this.toggleBounce();
    }, 1000);   

    setInterval(() => {
      this.toggleFly();
    }, 2000);  
  }

  openArticles() {
    // close the menu when clicking a link from the menu
    this.navCtrl.push('NotificationsPage');
  }

  showSelections(target: string) {
    if(target=='interessants'&&!this.authInfo)
      return this.signup()
      let targetTitle="Pouvant m'interresser"
      switch (target) {
        case 'interessants':
            targetTitle="Pouvant m'interresser"
          break;
          case 'recents':
          targetTitle="Concours déjà lancés"
        break;     
        default:
        targetTitle= 'Concours populaires'
          break;
      }
    this.navCtrl.push('SelectionsPage', {targetTitle: targetTitle, target: target });
  }


  loadData() {
    let uid=firebase.auth().currentUser?firebase.auth().currentUser.uid:'null'
    return this.dataService.getCountSessions(uid).then((data) => {
      this.stats = data ? data : undefined;
      console.log(this.stats);
      
      this.storage.set('home_stats_',this.stats).then(() => { }, error => { });
    }, error => {
       this.notify.onError({message:'Petit problème de connexion.'});
    });
  }


  startabonnement() {
    if (firebase.auth().currentUser)
      this.openPage('InformationPage', { abonnement: this.abonnement});
    else
       this.signup()
    }

  signup() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.authInfo = user;
          this.getAbonnement();
          this.notify.onSuccess({ message: "Vous êtes connecté à votre compte." });
          unsubscribe();
        } else {
          this.authInfo = undefined;
          unsubscribe();
        }
      });
    });
    this.navCtrl.push('LoginSliderPage', { redirectTo: true });
  }

  getAbonnement() {
    this.dataService.getAbonnement(firebase.auth().currentUser.uid, 0).then(data => {
      this.abonnement = data;
      this.abonnementLoaded = true;   
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    });
  }  

  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }  
}
