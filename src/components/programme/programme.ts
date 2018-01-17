import { Component, Input ,NgZone } from '@angular/core';
import { NavController,App, NavParams ,ModalController, AlertController,Events } from 'ionic-angular';
import { AppNotify } from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
import firebase from 'firebase';
/*
  Generated class for the Programme component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'programme',
  templateUrl: 'programme.html'
})
export class ProgrammeComponent {
   categorie:any='prepa';
   alert=false;
   text: string;
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
  constructor(
    public navCtrl: NavController,
    public notify:AppNotify,
    public events: Events,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public navParams: NavParams,
    public dataService:DataService,
    public modalCtrl: ModalController) {
    this.text = 'Hello World';
    this.zone = new NgZone({});
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
    this.dataService.getAbonnementObservable(this.authInfo.uid, this.concours.id).subscribe(data => {
      this.abonnement = data.json();
      this.abonnementLoaded = true;
      if (this.abonnementExpired && !this.isExpired(this.abonnement) && !this.alert){
         this.notify.onError({ message: "Felicitation ! Votre inscription a été prise en compte.", position: 'top' });
         this.alert=true;
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


show(matiere:any){
  if(!this.abonnementLoaded&&this.authInfo){
  this.notify.onError({message:'Patientez un instant pendant que les données chargent...'});
       return;
      }
    matiere.concours={nom:this.concours.concours.nom,id:this.concours.id};
   if(this.authInfo&&this.isExpired(this.abonnement)){
         this.inscrire();
      return ;
   }else if(!this.authInfo) {
        this.signup();        
   }else
     this.appCtrl.getRootNav().push('MatiereDetailsPage',{matiere:matiere});  
 }

 openModal(pageName,arg?:any) {
  this.modalCtrl.create(pageName, arg, { cssClass: 'inset-modal' })
                .present();
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
