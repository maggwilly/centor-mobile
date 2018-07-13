import { Component, NgZone  } from '@angular/core';
import { App, NavController, NavParams, LoadingController,} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { Events } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import firebase from 'firebase';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-article-details',
  templateUrl: 'article-details.html'
})
export class ArticleDetailsPage {
 article:any={};
  rate
  zone: NgZone;
  firearticle = firebase.database().ref('/article');
  loaded=false;
  registrationId
  showMenu
  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public events: Events,
     public notify:AppNotify,
     public firebaseNative: Firebase,
     public appCtrl: App,
     public storage: Storage,
     public loadingCtrl: LoadingController,
     public dataService:DataService,) {
   
    this.showMenu = this.navParams.get('showMenu');
      this.storage.get('registrationId').then((data) => {
      this.registrationId = data;
    })
    this.zone = new NgZone({});
    this.firebaseNative.setScreemName('message_view');
  }

  ionViewDidLoad() {
    if (this.navParams.get('article')) {
      this.article = this.navParams.get('article');
      this.loaded = true;
      this.makeArticleReaded(this.article.id, this.article.notification.id, this.registrationId);
      this.observeAuth();
    }else
      this.dataService.getShowNotification(this.navParams.get('notification_id'), this.registrationId).then((notification)=>{
         this.article.notification = notification;
         this.loaded=true;
        if (this.article.notification){
          this.makeArticleReaded(0, this.article.notification.id, this.registrationId);
          this.observeAuth();
        }
      }, error => {
        this.notify.onError({ message: 'Petit problème de connexion.' });
      })


  }

  makeArticleReaded(articleId:number,notification_id?:any,registrationId?:any){
    return this.dataService.readMessage(articleId, notification_id, registrationId).then(data=>{
             this.article.readed=true;  
             this.events.publish('message:read');            
        },error=>{
              this.notify.onError({message:'Petit problème de connexion.'});
      });
 
  }

  onModelChange(event){
    if (!firebase.auth().currentUser)
       return this.signup();
    if (this.article && this.article.notification)
    this.firearticle.child(this.article.notification.id).child(firebase.auth().currentUser.uid).set(this.rate)  
  } 
  
  observeAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (this.article && this.article.notification)
        this.firearticle.child(this.article.notification.id).child(firebase.auth().currentUser.uid).on('value',snaphost=>{
          this.rate=snaphost.val()
        });
      } 
    })
  } 


  signup() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          if (this.article && this.article.notification)
          this.firearticle.child(this.article.notification.id).child(firebase.auth().currentUser.uid).once('value',snaphost=>{
          this.rate=snaphost.val()
        });
          unsubscribe();
        } else {
          unsubscribe();
        }
      });
    });
    this.appCtrl.getRootNav().push('LoginSliderPage', { redirectTo: true });
  }   
}
