import {Component, NgZone} from '@angular/core';
import {NavController, App, NavParams, ModalController, LoadingController, Events} from 'ionic-angular';
import firebase from 'firebase';
import {MatieresPage} from '../matieres/matieres';
import {Storage} from '@ionic/storage';
import {ConcoursPage} from '../concours/concours';
import {DataService} from '../../providers/data-service';
import {AppNotify} from '../../providers/app-notify';
import {SocialSharing} from '@ionic-native/social-sharing';
import {IonicPage} from 'ionic-angular';
import {FcmProvider, FcmProvider as Firebase} from '../../providers/fcm/fcm';
import {concoursDetailsAnimation} from "../../annimations/annimations";
import {AbonnementProvider} from "../../providers/abonnement/abonnement";

@IonicPage()
@Component({
  selector: 'page-concours-options',
  templateUrl: 'concours-options.html',
  animations: concoursDetailsAnimation
})
export class ConcoursOptionsPage {
  concours: any = {};
  authInfo;
  abonnement: any;
  abonnementLoaded: boolean = false;
  matiereLoaded: boolean = false;
  status = false;
  public loading: any;
  zone: NgZone;
  flipState: String = 'notFlipped';
  flyInOutState: String = 'in';
  fadeState: String = 'visible';
  bounceState: String = 'noBounce';
  showMenu:any;
  alert=false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public dataService: DataService,
    public firebaseNative: Firebase,
    public events: Events,
    public loadingCtrl: LoadingController,
    private fcm: FcmProvider,
    public abonnementProvider:AbonnementProvider,
    public notify: AppNotify,
    public appCtrl: App,
    private socialSharing: SocialSharing,
    public storage: Storage) {
    this.showMenu = this.navParams.get('showMenu');
    this.initPage();
    this.zone = new NgZone({});
      this.firebaseNative.setScreemName('concours_view');
  }

  ionViewDidEnter() {
    this.initPage();
    this.events.subscribe('payement:success', (data) => {
      this.zone.run(() => {
        this.abonnement = data;
        this.toggleBounce();
      });
    });

  }

  initPage() {
    this.concours = this.navParams.get('concours');
    this.abonnement = this.navParams.get('abonnement');
    let id = this.navParams.get('id');
    if (this.concours) {
      this.getShowConcours(this.concours.id);
      this.loadMatieres().then(() => {
        this.observeAuth();
      });
    } else
      this.getShowConcours(id).then(() => {
         this.observeAuth();
      })
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

  observeAuth() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.getAbonnement();
      this.toggleBounce();
      if (user) {
        unsubscribe();
       }
    });
  }

  openModal(pageName, arg?: any) {
    this.modalCtrl.create(pageName, arg, {cssClass: 'inset-modal'})
      .present();
  }


  explorer() {
    if (!this.concours.matieres || !this.concours.matieres.length)
      return;
    this.navCtrl.push(MatieresPage, {concours: this.concours});
  }

  startabonnement() {
      this.openPage('InformationPage');

  }

  inscrire() {
    let modal=  this.modalCtrl.create('PricesPage',{price: this.concours.price, product:this.concours.id} );
     modal.onDidDismiss((data, role)=>{
      if(data&&data.status=='PAID'){
        this.fcm.listenTopic('centor-group-' + this.concours.id);
        this.notify.onSuccess({ message: "Felicitation ! Votre inscription a été prise en compte.", position: 'top' });
        this.alert=true;
        this.events.publish('payement:success', this.abonnement);
      }
    })
    modal.present();
  }


  openConcours() {
    this.navCtrl.setRoot(ConcoursPage);
  }


  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }


  getAbonnement() {
    if (!this.concours)
      return;
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

  getShowConcours(id: number) {
    return this.dataService.getShowSession(id).then(data => {
      if (data)
        this.concours = data;
      this.loadMatieres();
    }, error => {
      this.notify.onError({message: 'Petit problème de connexion.'});
    });

  }


  loadMatieres() {
    return this.storage.get('_matieres_' + this.concours.id)
      .then((data) => {
        this.concours.matieres = data ? data : [];
        if (!this.concours.matieres || !this.concours.matieres.length)
          return this.loadOnline();
        this.matiereLoaded = true;
      }, error => {
        return this.loadOnline();
      });
  }


  loadOnline() {
    return this.dataService.getMatieres(this.concours.preparation ? this.concours.preparation.id : 0).then((online) => {
      this.concours.matieres = online;
      this.matiereLoaded = true;
      this.storage.set('_matieres_' + this.concours.id, this.concours.matieres).catch(() => {
      });
    }, error => {
      this.notify.onError({message: 'Petit problème de connexion.'});
    })
  }


  listenToEvents() {
    this.events.subscribe('score:matiere:updated', (data) => {
      this.zone.run(() => {
        if (!this.concours)
          return
        this.storage.set('_matieres_' + this.concours.id, this.concours.matieres)
      });
    });

  }

  openPage(page) {
    this.navCtrl.push(page)
  }

  share(url: any) {
    let textMessage = this.concours.nomConcours;
    this.socialSharing.share(textMessage, null, null, this.dataService._baseUrl + 'session/' + this.concours.id + '/show/from/mobile')
      .catch((error) => {
      })
  }

}
