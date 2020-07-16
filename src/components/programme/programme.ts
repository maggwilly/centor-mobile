import { Component, Input, NgZone, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController,App, NavParams ,ModalController, AlertController,Events } from 'ionic-angular';
import { AppNotify } from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
import firebase from 'firebase';
import { FcmProvider } from '../../providers/fcm/fcm';
/*
  Generated class for the Programme component.
  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'programme',
  templateUrl: 'programme.html',

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
    ]),

    trigger('flash', [
      state('first', style({
        opacity: 1, offset: 0.5
      })),
      state('second', style({
        opacity: 0.5, offset: 1
      })),
      state('third', style({
        opacity: 1, offset: 0.5
      })),
      state('fourth', style({
        opacity: 0, offset: 0.75
      })),
      state('fifth', style({
        opacity: 1, offset: 1
      })),
      transition('first => second', animate('200ms linear')),
      transition('second => first', animate('200ms linear')),
      transition('second => third', animate('100ms linear')),
      transition('third => fourth', animate('100ms linear')),
      transition('fourth => fifth', animate('100ms linear')),
      transition('fifth => first', animate('100ms linear'))
    ])

  ]

})
export class ProgrammeComponent {
   categorie:any='prepa';
   alert=false;
   @Input()
   abonnement:any;
    @Input()
   concours:any;
   @Input()
    authInfo:any;
   @Input()
   analyse:any;
   @Input()
   matiereLoaded:any;
  @Input()
  abonnementLoaded:any;
  abonnementExpired: any;
  zone:NgZone;
  buttonToHide: HTMLElement;
  flipState: String = 'notFlipped';
  flyInOutState: String = 'in';
  fadeState: String = 'visible';
  flashState: String = 'first';
  bounceState: String = 'noBounce';
  constructor(
    public navCtrl: NavController,
    public notify:AppNotify,
    public events: Events,
    public alertCtrl: AlertController,
    public appCtrl: App,
    private fcm: FcmProvider,
    public navParams: NavParams,
    public dataService:DataService,
    public modalCtrl: ModalController) {
    this.zone = new NgZone({});
    this.toggleFlash();

  }



inscrire() {
  let modal=  this.modalCtrl.create('FinalisePage',{abonnement:this.abonnement,concours:this.concours})  ;
   modal.onDidDismiss((data)=>{
     this.checkAbonnement();
     });
   modal.present();
 }

 isExpired(abonnement:any){
   if(!abonnement)
     return true;
  let now=Date.now();
  let endDate=new Date(abonnement.endDate).getTime();
   return now>endDate;
   }

  checkAbonnement() {
    this.abonnementExpired = this.isExpired(this.abonnement)
    const ch=this.dataService.getAbonnementObservable( this.concours.id).subscribe(data => {
      this.abonnement = data.json();
      this.abonnementLoaded = true;
      if (this.abonnementExpired && !this.isExpired(this.abonnement) && !this.alert){
        this.fcm.listenTopic('centor-group-' + this.concours.id);
         this.notify.onSuccess({ message: "Felicitation ! Votre inscription a été prise en compte.", position: 'top' });
         this.alert=true;
        this.events.publish('payement:success', this.abonnement);
         ch.unsubscribe();
      }
      //   console.log(data.json());
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    });

  }
getClass(obj:any):string{
  if(!obj||obj.objectif==undefined)
   return 'none';
   else if(obj.objectif<20)
  return 'danger';
  else if(obj.objectif<50)
    return 'warning';
  else if(obj.objectif>50)
     return 'success';
  return 'none';
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

  toggleFlash() {
    this.flashState = 'first';
    setInterval(() => {
      this.flashState = 'second';
    }, 1000);
  setInterval(() => {
     this.flashState = 'first';
    }, 2000);

  }
show(matiere:any){
  if(!this.abonnementLoaded&&this.authInfo){
  this.notify.onError({message:'Patientez un instant pendant que les données chargent...'});
       return;
      }
    matiere.concours=this.concours;
   if(this.authInfo&&this.isExpired(this.abonnement)){
         this.inscrire();
      return ;
   }else if(!this.authInfo) {
        this.signup();
   }else
     this.appCtrl.getRootNav().push('MatiereDetailsPage',{matiere:matiere});
 }
  openRessources(){
    if (!this.authInfo) {
      this.signup();
    } else
      this.appCtrl.getRootNav().push('RessourcesPage', { concours: this.concours });
  }

 openModal(pageName,arg?:any) {
  this.modalCtrl.create(pageName, arg, { cssClass: 'inset-modal' }).present();
}

  signup() {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        this.zone.run(() => {
          if (user) {
            this.authInfo = user;
            this.notify.onSuccess({ message: "Vous êtes connecté à votre compte." });
            unsubscribe();
          } else {
            this.authInfo = undefined;
            unsubscribe();
          }
        });
      });
    this.appCtrl.getRootNav().push('LoginSliderPage', { redirectTo: true });
  }
}
