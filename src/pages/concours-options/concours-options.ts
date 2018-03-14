import { Component, NgZone, trigger, state, style, transition, animate, keyframes} from '@angular/core';
import { NavController, App,NavParams ,ModalController, LoadingController,Events } from 'ionic-angular';
import firebase from 'firebase';
import { MatieresPage } from '../matieres/matieres';
import { Storage } from '@ionic/storage';
import { ConcoursPage} from '../concours/concours';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage } from 'ionic-angular';
//import { Facebook } from '@ionic-native/facebook'
@IonicPage()
@Component({
  selector: 'page-concours-options',
  templateUrl: 'concours-options.html',

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
export class ConcoursOptionsPage {
 concours:any={};
 authInfo;  
  abonnement:any;
  abonnementLoaded:boolean=false;
  matiereLoaded:boolean=false;
  status=false;
  public loading: any;
  zone:NgZone;
  flipState: String = 'notFlipped';
  flyInOutState: String = 'in';
  fadeState: String = 'visible';
  bounceState: String = 'noBounce';
   constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    public modalCtrl: ModalController,
    public dataService:DataService,
    public events: Events,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public appCtrl: App,
  //  private facebook: Facebook,
    private socialSharing: SocialSharing,
    public storage: Storage ) {
    this.initPage();
    this.zone = new NgZone({});
    //this.listenToEvents();
  }

ionViewDidEnter() {
   this.initPage();
  
  } 

  initPage() {
    this.concours=this.navParams.get('concours');
    this.abonnement=this.navParams.get('abonnement');
    let id=this.navParams.get('id');
    if(this.concours){
    this.getShowConcours(this.concours.id);
    this.loadMatieres().then(()=>{
         this.observeAuth();
      }); 
    }else
      this.getShowConcours(id).then(()=>{
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

suivre(status:any=''){
  if (!this.concours)
    return;
  if(this.authInfo){
    this.status = status!='' ? status : this.status;
    this.dataService.suivreSession(this.concours.id, this.authInfo.uid, status).then((data)=>{
      this.status = data;
     // if (this.status)
       // this.notify.onSuccess({ message: 'Vous suivez ce concours.' });
     }, error => {
       this.status = !this.status
         this.notify.onError({ message: 'problème de connexion  !' });
     })
   return ;
}else if(!this.authInfo) 
    this.signup();  
}

  openModal(pageName,arg?:any) {
    this.modalCtrl.create(pageName, arg, { cssClass: 'inset-modal' })
                  .present();
  }


explorer(){
   if(!this.concours.matieres||!this.concours.matieres.length)
   return;
   this.navCtrl.push(MatieresPage,{concours:this.concours})  ;
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


openConcours() {
    // close the menu when clicking a link from the menu
       this.navCtrl.setRoot(ConcoursPage);
  }
  more(){
    this.iab.create(this.dataService._baseUrl+'session/'+this.concours.id+'/show/from/mobile');
 }
 

 isExpired(abonnement:any){
   if(abonnement==null)
     return true;
   let now = firebase.database.ServerValue.TIMESTAMP;
  let endDate=new Date(abonnement.endDate).getTime();
   return now>endDate;
   }

 getAbonnement(){
   if (!this.concours)
   return;
     this.dataService.getAbonnement(this.authInfo.uid,this.concours.id).then(data=>{
           this.abonnement=data;
           this.abonnementLoaded=true;
     },error=>{
        this.notify.onError({message:'Petit problème de connexion.'});
     });
  }

  openChat() {
    this.navCtrl.push('GroupchatPage', { groupName: this.concours.id });
  }

  getShowConcours(id:number){
    return this.dataService.getShowSession(id).then(data=>{
           if(data)
             this.concours=data;
             this.loadMatieres();  
      },error=>{
         this.notify.onError({message:'Petit problème de connexion.'});
      });
 
  }
   

observeAuth(){
  const  unsubscribe= firebase.auth().onAuthStateChanged( user => {
      if (user) 
      { 
           this.authInfo=user;
           this.getAbonnement();
           this.suivre();
       }else{
           this.authInfo=undefined;
          unsubscribe();    
          }
        
    });
}


loadMatieres(){
     return this.storage.get('_matieres_'+this.concours.id)
     .then((data)=>{
          this.concours.matieres=data?data:[]; 
     if(!this.concours.matieres||!this.concours.matieres.length)
       return this.loadOnline();
       this.matiereLoaded=true;      
    },error=>{
      return this.loadOnline();
    });
}

loadOnline(){   
      return this.dataService.getMatieres(this.concours.preparation?this.concours.preparation.id:0).then((online)=>{
            this.concours.matieres=online;
            this.matiereLoaded=true;
            this.storage.set('_matieres_'+this.concours.id, this.concours.matieres).catch(()=>{ });  
      },error=>{
         this.notify.onError({message:'Petit problème de connexion.'});
      }) 
}

listenToEvents(){
  this.events.subscribe('score:matiere:updated',(data)=>{
       this.zone.run(() => {
         if (!this.concours)
            return
              this.storage.set('_matieres_'+this.concours.id, this.concours.matieres)           
        });
        
  });
}



  share(url: any) {
    let textMessage = this.concours.nomConcours;
  /**   this.facebook.showDialog({
      method:'share',
      href:this.dataService._baseUrl + 'session/' + this.concours.id + '/show/from/mobile',
      caption: textMessage,
      hashtag: '#centor'
    }).catch(error => { })
   */
   this.socialSharing.share(textMessage, null , null,this.dataService._baseUrl + 'session/' + this.concours.id + '/show/from/mobile')
      .catch((error) => {
      })
  }

}
