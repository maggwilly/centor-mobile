import { Component, NgZone, trigger, transition, style, state, animate, keyframes  } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Events, ModalController, Platform, Nav, MenuController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataService } from '../providers/data-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AppNotify } from '../providers/app-notify';
import { Push, PushObject, PushOptions, NotificationEventResponse, RegistrationEventResponse } from '@ionic-native/push';

const options: PushOptions = {
  android: {
    sound: true,
    vibrate:true,
    forceShow:true},
  ios: {
    alert: 'true',
    badge: true,
    sound: 'true'
  },
  windows: {},
  browser: {
    pushServiceURL: 'http://push.api.phonegap.com/v1/push'
  }
};

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}
@Component({
  templateUrl: 'app.html',
    animations: [
    trigger('bounce', [
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition('* => rightSwipe', animate('700ms ease-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-65px)', offset: .3 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ]))),
      transition('* => leftSwipe', animate('700ms ease-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(65px)', offset: .3 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ])))
    ])
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = (!document.URL.startsWith('http') || this.platform.is('core') || this.platform.is('mobileweb')) ? 'ProcessingPage' : 'HomePage';//TabsPage;TutorialPage;// MatieresPage;//
  authInfo: any;
  concours: any;
  paidConcours: any[];
  preference: any = {};
  _concours: any[];
  user: any;
  zone: NgZone;
  mode = 'prod';
  registrationId;
  notificationId: string //= window.localStorage.getItem('registrationId');
  appPages: PageInterface[] = [
    { title: 'Accueil', component: 'HomePage', icon: 'home' },
    { title: 'Concours', component: 'ConcoursPage', icon: 'school' },
    { title: 'Resultats', component: 'ResultatsPage', icon: 'md-list' },
    { title: 'A propos', component: 'AboutPage', icon: 'information-circle' }
  ];
  skipMsg: string = "Skip";
  state: string = 'x';
  constructor(public platform: Platform,
    public menu: MenuController,
    public dataService: DataService,
    public notify: AppNotify,
    public af: AngularFireDatabase,
    private push: Push,
    public storage: Storage,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events) {
    this.zone = new NgZone({});
    platform.ready().then(() => {
     // alert(platform.platforms());
      // this.statusBar.styleBlackTranslucent();
      //this.statusBar.overlaysWebView(true);
      this.storage.get('registrationId').then((data)=>{
        //this.notificationId=data;
        this.registrationId = data;
      })
      this.statusBar.backgroundColorByHexString("#065C79");
     //this.storage.clear().then().catch(error=>{});
     // window.localStorage.setItem('registrationId', 'fsQPkDT8QSU:APA91bFGFx8ps41oOgZ-oSf9R1L20ZAfPxC4OwIErve_-O50NmM6afG3f7TnEo7wtsCOmjIIruKNl8Qkh2VkHd98APbtohuBJY3bSLhxn2TqV8oaNp9aRueW4u__iCXqgA2w-Xg1VUS-');
      this.registerForNotification();
      this.getUrlBase(this);
      this.splashScreen.hide();
    });

  }

  animationDone() {
    this.state = 'x';
  }


  getUrlBase(obj: any) {
    let _baseUrl = 'https://concours.centor.org/v1/'
    if (this.mode=='dev')
      _baseUrl = 'http://localhost:8000/v1/'
    if (!this.platform.is('mobileweb'))
    this.storage.set('_baseUrl', _baseUrl).then(()=>{
      this.startApp();
    }, error => {
      this.notify.onError({ message: JSON.stringify(error) }); 
      this.startApp();
    });
    else 
    this.startApp();
  }

  startApp() {
    this.observeAuth();
    this.storage.get('read-tutorial-centor').then(data=>{
      if (!data) {
        const modal = this.modalCtrl.create('TutorialPage');
        modal.onDidDismiss(data => {
            this.storage.set('read-tutorial-centor', true).catch(error=>{
              //this.notify.onError({ message: JSON.stringify(error) });
            });
        });
        modal.present();
      }
    },error=>{
      this.notify.onError({ message: JSON.stringify(error) });
    })
    console.log(this.platform.platforms());
    
    if (!document.URL.startsWith('http') || this.platform.is('core') || this.platform.is('mobileweb'))
    this.storage.get('_preferences')
      .then((data) => {
        this.concours = data;
        if (this.concours)
          this.showDetails(this.concours);
        else
          this.nav.setRoot('HomePage');
          //this.rootPage = 'ConcoursPage';
      },error=>{
        this.notify.onError({ message: JSON.stringify(error) });
        this.nav.setRoot('HomePage');
      });
      else
        this.nav.setRoot('HomePage');
  }

  openPage(page: PageInterface) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.push(page.component);
  }

  openMessages() {
    // navigate to the new page if it is not the current page
    this.nav.push('NotificationsPage');
    this.menu.close();
  }



  getUserProfile() {
    return this.dataService.getInfo(this.authInfo.uid, this.registrationId).then((info) => {
      if (info){
        this.user.info = info;
        //this.user.info.photoURL = this.photoURL ? this.photoURL : this.user.info.photoURL;
      }
    }, error => {
      //this.openModal('ProfilModalPage', { authInfo: this.authInfo, user: this.user });
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }

checkInfo(info:any){
  if(!info){
    this.dataService.getInfoObservable(this.authInfo.uid, this.registrationId).subscribe(data => {
      this.user.info = data.json();
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    });
  }

}


  openModal(pageName, arg?: any) {
    this.modalCtrl.create(pageName, arg, { cssClass: 'inset-modal' })
      .present();
  }




  openSettingPage() {
  
    if (firebase.auth().currentUser)
      this.nav.push('SettingPage', { authInfo: firebase.auth().currentUser });
    else {
      this.nav.push('LoginSliderPage', { redirectTo: true });
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        this.zone.run(() => {
          if (user) {
            this.notificationId = user.uid;
            this.nav.push('SettingPage', { authInfo: user });
            this.notify.onSuccess({ message: "Vous êtes connecté à votre compte." });
            unsubscribe();
          } else {
            this.user = undefined;
            this.paidConcours = [];
            unsubscribe();
          }

        });
      })
    }
    this.menu.close();
  }

  registerForNotification() {
     firebase.messaging().onMessage(data=>{
      console.log("Message received. ", data);
       this.events.publish('notification') 
    });
    
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: NotificationEventResponse) =>
        this.events.publish('notification') 
    ,error=>{});
    pushObject.on('registration').subscribe((registration: RegistrationEventResponse) => {
      this.registration(registration.registrationId);
    }, error => { }
    );
  }


  registration(registrationId: any) {
    this.registrationId = registrationId;
   // this.notificationId = registrationId;
    this.storage.set('registrationId', registrationId).then(()=>{
      console.log(registrationId);
      this.dataService.addRegistration(registrationId, { registrationId: registrationId }).then((data) => {
      }, error => {
        // this.notify.onError({message:'Petit problème de connexion.'}); 
      })  
    },error=>{
      console.log(registrationId);
      this.dataService.addRegistration(registrationId, { registrationId: registrationId }).then((data) => {
      }, error => {
        // this.notify.onError({message:'Petit problème de connexion.'}); 
      })  
    });

  }



  loadAbonnement() {
    this.dataService.getAbonnementsObservable(this.authInfo.uid).subscribe(data => {
      this.paidConcours = data ? data : [];
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    })
  }
  observeAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       // this.photoURL = user.photoURL;
        this.authInfo = user;
        console.log(user.providerId);       
        this.user = { info: this.authInfo };
        this.notificationId = user.uid;
        this.getUserProfile().then(()=>{
        this.loadAbonnement();
        });
      } else {
        this.user = undefined;
        this.paidConcours = [];
      }
    });
    this.events.subscribe('payement:success', (data) => {
      this.zone.run(() => {
        this.loadAbonnement();
      });
    });

    this.events.subscribe('profil:updated', (data) => {
      this.zone.run(() => {
        this.user = { info: data };
      });
    });
  }




  showDetails(abonnement: any) {
  
    this.nav.setRoot('MatieresPage', { abonnement: abonnement });
    this.storage.set('_preferences', abonnement).catch(error => { });
    this.menu.close();
  }
 
}


