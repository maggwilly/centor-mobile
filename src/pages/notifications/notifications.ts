import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
import firebase from 'firebase';
import { IonicPage } from 'ionic-angular';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
_articles:any[]; 
notificationId: string //= window.localStorage.getItem('registrationId');
registerId:any;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public storage: Storage , 
      public alertCtrl: AlertController,
      public notify:AppNotify,
      public dataService: DataService,
      public loadingCtrl: LoadingController,    
      public platform: Platform,
      ) {
  
  }


  ionViewDidLoad() {
    this.storage.get('registrationId').then(id=>{
      this.notificationId=id;
      this.observeAuth() 
    })
      

}

  observeAuth() {
   firebase.auth().onAuthStateChanged((user) => {
      if (user) 
        this.registerId = user.uid;
         if (!this.platform.is('core'))
             this.loadData();
          else 
             this.loadData(true);
    });
  }
getIcon(article:any):string{
  let iconName = (!article.readed) ? 'ios-' + article.notification.format : 'ios-' + article.notification.format + '-outline';
  return iconName;
}     

loadData(all?:boolean){
  this._articles=null;
  return this.storage.get('_articles').then((data) => {
    this._articles = data ? data : [];
    this.dataService.getMessages(this.notificationId, this.registerId,0, all).then((data) => {
      this._articles = data.messages;
      this.storage.set('_articles', this._articles).then(() => { });
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  });
  
  }


  isNotForMe(article:any):boolean{
    if (!article.registration)
      return  true;
    return false;//this.registerId != article.registration.registrationId;
  }


showArticle(article){
     this.navCtrl.push('ArticleDetailsPage',{article:article});
}

  doInfinite(infiniteScroll?:any) {
    this.dataService.getMessages(this.notificationId, this.registerId, this._articles.length).then(data=>{
      this.updateList(data ? data.messages : []);
     if(infiniteScroll)
         infiniteScroll.complete();
    },error=>{
   this.notify.onError({message:'Petit problème de connexion.'});
    })
  }


updateList(array:any[]){
  if (array.length)
   array.forEach(element => {
        if(!this._articles.find(conc=>{return conc.id==element.id}))
        this._articles.push(element);
  });
}

}
