import { Component, NgZone } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import { AppNotify } from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
import {AbonnementProvider} from "../../providers/abonnement/abonnement";
import { homeAnnimation } from "../../annimations/annimations";
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
  animations: homeAnnimation
})
export class HomePage {
  queryText="";
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
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public notify: AppNotify,
    public storage: Storage,
    public firebaseNative: Firebase,
    public abonnementProvider:AbonnementProvider,
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
      console.log(error)
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

  openArticles() {
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
  observeAuth() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.getAbonnement();
      if (user) {
        unsubscribe();
      }
    });
  }

  loadData() {
    let uid=firebase.auth().currentUser?firebase.auth().currentUser.uid:undefined
    return this.dataService.getCountSessions(uid).then((data) => {
      this.stats = data ? data : undefined;
      this.storage.set('home_stats_',this.stats).then(() => { }, error => { });
    }, error => {
      console.log(error)
       this.notify.onError({message:'Petit problème de connexion.'});
    });
  }


  startabonnement() {
      this.openPage('InformationPage',{abonnement:this.abonnement} );
    }

  signup() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.goToNex(user, unsubscribe);
          unsubscribe();
        }
        let modal = this.modalCtrl.create('LoginSliderPage', {redirectTo: true});
        modal.onDidDismiss((data, role) => {
          if (data) {
            this.goToNex(user, unsubscribe);
            unsubscribe();
          }
        })
        modal.present();
      });
    });

  }

  private goToNex(user: firebase.User, unsubscribe: () => void) {
    this.authInfo = user;
    this.getAbonnement();
    this.notify.onSuccess({message: "Vous êtes connecté à votre compte."});
    return;
  }

  getAbonnement() {
    this.abonnementProvider.checkAbonnementValidity( 0).then(data => {
      this.abonnement = data;
      this.abonnementLoaded = true;
    }, error => {
      console.log(error)
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

  search($event) {
    this.modalCtrl.create('SearchPage', {queryText:this.queryText} )
      .present();
  }
}
