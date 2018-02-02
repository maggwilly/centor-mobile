import { Component,ViewChild } from '@angular/core';
import {Events, Searchbar,Platform,  NavController,NavParams, LoadingController,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-concours',
  templateUrl: 'concours.html'
})
export class ConcoursPage {
  _concours:any[]=[];
  queryText=null;
  authInfo:any;
  segment = 'all';
 notificationId:string=window.localStorage.getItem('registrationId');
  @ViewChild("searchbar") searchbar:Searchbar;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage ,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
     public dataService: DataService,
     public notify:AppNotify,
     public events: Events,
    public platform: Platform,
    ) {
    this.observeAuth();
  }

  ionViewDidLoad() {
     this.storage.get('_concours').then((data)=>{
      this._concours=data?data:[]; 
         if (!this.platform.is('core'))
                   this.loadData(); 
               else    
                 this.doSearch();          
    },error=>{})  
}




observeAuth(){
  const  unsubscribe=firebase.auth().onAuthStateChanged((user) => {
if (user) {
  this.authInfo = user;
     unsubscribe();
} else {
  this.authInfo = undefined;
  unsubscribe();
}
}); 
}


loadData(){
    return  this.dataService.getSessions(0).then((data)=>{
               this._concours=data?data:[];    
                this.search(); 
              this.storage.set('_concours', this._concours).then(()=>{ },error=>{})  ;  
        },error=>{ 
             this.alert();
        });
  }




  doInfinite(infiniteScroll?:any) {
    this.dataService.getSessions(this._concours.length).then(data=>{
      this.updateList(data);
     // this.storage.set('_concours', this._concours).then(() => { }, error => { });
     if(infiniteScroll)
         infiniteScroll.complete();
    },error=>{
           this.notify.onError({message:'Petit problème de connexion.'});
    })
  }

  doSearch() {
  return  this.dataService.getSessions(this._concours.length,true).then(data => {
     // this.updateList(data);
    this._concours = data;
      //this.storage.set('_concours', this._concours).then(() => { }, error => { });
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }

  updateList(array: any[]) {
    if (!(this._concours && this._concours.length)) {
      this._concours = array;
      return ;//this.storage.set('_concours', this._concours);
    }
    this.filter(array, this.queryText);
    array.forEach(item => {
      this._concours.push(item);
    });
    return ;//this.storage.set('_concours', this._concours);
  }

search() {
  this.filter(this._concours, this.queryText);
  this.doSearch().then(()=>{
  if(!(this._concours&&this._concours.length))
     return;
    this.filter(this._concours, this.queryText);
  },error => {
    this.filter(this._concours, this.queryText);
    });
  }



  filter(array:any[],text){
    console.log(text);
  let queryText = (text) ? text.toLowerCase().replace(/,|\.|-/g, ' ') :'';
  let queryWords = queryText.split(' ').filter(w => !!w.trim().length); 
    array.forEach(item => {
      item.hide = true;
  let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nomConcours && item.nomConcours.toLowerCase().indexOf(queryWord) > -1 ||item.concours.nom&&item.concours.nom.toLowerCase().indexOf(queryWord) > -1||item.concours.ecole&&item.concours.ecole.toLowerCase().indexOf(queryWord) > -1 ||item.concours.abreviation&&item.concours.abreviation.toLowerCase().indexOf(queryWord) > -1 ) {
           matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
  let matchesSegment = false;
  if ('all' === this.segment || item.niveau === this.segment) {
        matchesSegment = true;
  }
  item.hide = !(matchesSegment && matchesQueryText);
});
}


alert() {
  let alert = this.alertCtrl.create({
    message: "Il se peut que votre connexion à internet soit quelque peu perturbée. Les données n'ont pas put être chargées",
    buttons: [
      {
        text: "Ok",
        role: 'cancel'
      },
      {
        text: "Ressayer",
        role: 'cancel',
        handler: () => {
          this.loadData();
        }

      }
    ]
  });
  alert.present()
}
}
