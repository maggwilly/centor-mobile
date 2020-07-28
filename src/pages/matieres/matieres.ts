import {Component, NgZone, trigger, state, style, transition, animate, keyframes} from '@angular/core';
import {Events, App, NavController, NavParams, ViewController, ModalController, LoadingController} from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {Storage} from '@ionic/storage';
import firebase from 'firebase';
import {AppNotify} from '../../providers/app-notify';
import {IonicPage} from 'ionic-angular';
import {GroupsProvider} from '../../providers/groups/groups';
import {FcmProvider as Firebase} from '../../providers/fcm/fcm';
import {AbonnementProvider} from "../../providers/abonnement/abonnement";

@IonicPage()
@Component({
  selector: 'page-matieres',
  templateUrl: 'matieres.html',
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
        animate('900ms ease-in', keyframes([
          style({transform: 'translate3d(0,0,0)', offset: 0}),
          style({transform: 'translate3d(0,-30px,0)', offset: 0.5}),
          style({transform: 'translate3d(0,0,0)', offset: 1})
        ]))
      ])
    ])

  ]
})
export class MatieresPage {
  concours: any;
  _analyses: any[];
  abonnementLoaded: boolean = false;
  authInfo;
  analyse: any;
  abonnement: any;
  isShow: boolean = true;
  loaded: boolean = false;
  matiereLoaded
  zone: NgZone;
  notificationId: string = firebase.auth().currentUser ? firebase.auth().currentUser.uid : undefined
  registrationId
  flipState: String = 'notFlipped';
  flyInOutState: String = 'in';
  fadeState: String = 'visible';
  bounceState: String = 'noBounce';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public abonnementProvider: AbonnementProvider,
    public firebaseNative: Firebase,
    public events: Events,
    public appCtrl: App,
    public groupservice: GroupsProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage) {
    this.zone = new NgZone({});
    this.firebaseNative.setScreemName('concours_start');
    this.listenToEvents();
    this.initPage();
    this.isShow = false;
  }


  ionViewDidEnter() {
    this.storage.get('registrationId').then((data) => {
      this.registrationId = data;
    })
    this.observeAuth();
  }


  initPage() {
    this.abonnement = this.navParams.get('abonnement');
    if (!this.abonnement)
      this.storage.get('_preferences')
        .then((data) => {
          this.abonnement = data;
          this.concours = this.abonnement.session;
          this.getShowConcours().then(() => {
            this.observeAuth();
          });
          this.loadMatieres()
        }, error => {
        });
    else {
      this.concours = this.abonnement.session;
      this.getShowConcours().then(() => {
        this.observeAuth();
      });
      this.loadMatieres()
    }
  }

  toggleFlip() {
    this.flipState = (this.flipState == 'notFlipped') ? 'flipped' : 'notFlipped';
  }

  toggleFlyInOut() {

    this.flyInOutState = 'out';

    setInterval(() => {
      this.flyInOutState = 'in';
    }, 2000);

  }

  toggleFade() {
    this.fadeState = (this.fadeState == 'visible') ? 'invisible' : 'visible';
  }

  toggleBounce() {
    this.bounceState = (this.bounceState == 'noBounce') ? 'bouncing' : 'noBounce';
  }

  observeAuth(show: boolean = true) {
    this.notificationId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : undefined;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authInfo = user
        this.notificationId = user.uid;
        this.getAnalyse(show);
        this.getAbonnement();
      } else {
        this.authInfo = undefined;
      }
    });

  }

  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }

  showOptions() {
    this.navCtrl.push('ConcoursOptionsPage', {concours: this.concours, abonnement: this.abonnement,});
  }

  getShowConcours() {
    return this.dataService.getShowSession(this.concours.id).then(data => {
      if (data)
        this.concours = data;
      this.loadMatieres();
    }, error => {
      this.notify.onError({message: 'Problème de connexion.'});
    });

  }

  getAbonnement() {
    if (!this.concours)
      return
    this.abonnementProvider.checkAbonnementValidity(this.concours.id).then(data => {
      this.abonnement = data;
      this.abonnementLoaded = true;
      if (this.abonnement)
        this.firebaseNative.listenTopic('centor-group-' + this.concours.id);

    }, error => {
      this.notify.onError({message: 'Petit problème de connexion.'});
    });
  }

  openChat() {
    this.navCtrl.push('GroupchatPage', {groupName: this.concours.id, groupdisplayname: this.concours.nomConcours});
  }


  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }


  findRemplace(list: any[], matiere, data: any) {
    list.forEach(element => {
      if (matiere && element.matiere == matiere.id)
        element = data;
    });
  }


  listenToEvents() {
    this.events.subscribe('score:matiere:updated', (data) => {
      this.zone.run(() => {
        this.analyse = data.concours;
        this.isShow = true;
        this.storage.set('_matieres_' + this.concours.id, this.concours.matieres).catch(() => {
        });
      });
    });

    this.events.subscribe('payement:success', (data) => {
      this.zone.run(() => {
        this.abonnement = data;
        this.toggleBounce();
      });
    });
  }

  getAnalyse(show) {
    this.storage.get('_analyse_Concours' + this.concours.id).then(data => {
      this.analyse = data;
      this.concours.analyse = data;
      if (!this.concours)
        return
      this.loaded = show;
      return this.dataService.getAnalyseObservable(this.authInfo.uid, this.concours.id, 0, 0).subscribe((analyse) => {
        this.analyse = analyse;
        this.concours.analyse = analyse;
        this.storage.set('_analyse_Concours' + this.concours.id, analyse);
        this.loaded = true;
      }, error => {
        this.loaded = show;
        this.notify.onError({message: 'Problème de connexion.'});
      })
    })

  }


  loadMatieres() {
    return this.storage.get('_matieres_' + this.concours.id).then((data) => {
      this.concours.matieres = data ? data : [];
      if (this.concours.matieres && this.concours.matieres.length)
        this.matiereLoaded = true;
      return this.loadOnline();
    }, error => {
      return this.loadOnline();
    });
  }

  loadOnline() {
    return this.dataService.getMatieres(this.concours.preparation ? this.concours.preparation.id : 0).then((online) => {
      this.concours.matieres = online;
      this.matiereLoaded = true;
      this.storage.set('_matieres_' + this.concours.id, this.concours.matieres).then(() => {
      }).catch(() => {
      });
    }, error => {
      this.notify.onError({message: 'Petit problème de connexion.'});
    })
  }


}
