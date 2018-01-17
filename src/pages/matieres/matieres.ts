import { Component,NgZone  } from '@angular/core';
import { Events,App, NavController, NavParams ,ViewController,ModalController ,  LoadingController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AppNotify } from '../../providers/app-notify';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-matieres',
  templateUrl: 'matieres.html'
})
export class MatieresPage {
 
   concours:any;
   _analyses:any[];
  abonnementLoaded: boolean = false;
   authInfo;
   analyse:any;
   abonnement:any;
   isShow:boolean=true;
  loaded: boolean=false;
   matiereLoaded
zone:NgZone;
  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public dataService:DataService,
     public viewCtrl: ViewController,
     public modalCtrl: ModalController,
     public events: Events,
     public appCtrl: App, 
     public loadingCtrl: LoadingController,
     public notify:AppNotify,
     public storage: Storage)
     {
      this.zone = new NgZone({});
      this.listenToEvents();
      this.initPage();
      this.isShow=false;
  }


ionViewDidEnter() {
 this.observeAuth(true);
  }  


initPage(){
   this.abonnement=this.navParams.get('abonnement');
    if(!this.abonnement) 
   this.storage.get('_preferences')
     .then((data)=>{
       this.abonnement=data; 
        this.concours=this.abonnement.session; 
         this.getShowConcours().then(()=>{
        this.observeAuth(true);
      });   
          this.loadMatieres()
    },error=>{ });     
else{
this.concours=this.abonnement.session; 
  this.getShowConcours().then(()=>{
    this.observeAuth(true);
  }); 
  this.loadMatieres()
   }
}

observeAuth(show:boolean=false){
  firebase.auth().onAuthStateChanged( user => {
      if (user) 
      { 
        this.authInfo=user
        this.getAnalyse();
        this.getAbonnement(); 
       }else{
           this.authInfo=undefined;
          }
    });
  
}

 isExpired(abonnement:any){
   if(abonnement==null)
     return true;
  let now=Date.now();
  let endDate=new Date(abonnement.endDate).getTime();
   return now>endDate;
   }
   



showOptions(){
    this.navCtrl.push('ConcoursOptionsPage',{concours:this.concours,abonnement:this.abonnement,});
}




  getShowConcours(){
  return   this.dataService.getShowSession(this.concours.id).then(data=>{
       if(data)
           this.concours=data;
            this.loadMatieres();  
     },error=>{
        this.notify.onError({message:'Problème de connexion.'});
     });
  
  }
  getAbonnement() {
    if (!this.concours)
      return
      this.dataService.getAbonnement(this.authInfo.uid, this.concours.id).then(data => {
        this.abonnement = data;
        this.abonnementLoaded = true;
      }, error => {
        this.notify.onError({ message: 'Petit problème de connexion.' });
      });
  }


dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 


findRemplace(list:any[],matiere, data:any){
list.forEach(element => {
     if(matiere && element.matiere==matiere.id)
        element=data;  
   });
}


listenToEvents(){
  this.events.subscribe('score:matiere:updated',(data)=>{
       this.zone.run(() => {
        this.analyse=data.concours;  
        this.isShow=true;
       this.storage.set('_matieres_'+this.concours.id, this.concours.matieres).catch(()=>{ });           
        });
        
  });
}

  getAnalyse(loading?: any) {
    if (!this.concours)
       return
    this.loaded = false;
    return this.dataService.getAnalyseObservable(this.authInfo.uid, this.concours.id, 0, 0).subscribe((analyse) => {
      this.analyse = analyse;
      this.concours.analyse = analyse;
      this.loaded = true;
    }, error => {
      this.loaded = false;
      this.notify.onError({ message: 'Problème de connexion.' });
    })
  }

/*getAnalyse(loading?:any){
  this.loaded=false;
 return   this.dataService.getAnalyse(this.authInfo.uid,this.concours.id,0,0).then((analyse)=>{
        this.analyse=analyse;
        this.concours.analyse=analyse;
        this.loaded=true;  
  },error=>{
    this.loaded=false;
        this.notify.onError({message:'Problème de connexion.'});
  })     
}*/

loadMatieres(){
     return this.storage.get('_matieres_'+this.concours.id).then((data)=>{
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
            this.storage.set('_matieres_'+this.concours.id, this.concours.matieres).then(()=>{
            }).catch(()=>{
             });            
      },error=>{
         this.notify.onError({message:'Petit problème de connexion.'});
      }) 
}

}
