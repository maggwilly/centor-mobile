import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides ,ActionSheetController, Platform } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { GroupsProvider } from '../../providers/groups/groups';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the CoursViewPage page.
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cours-view',
  templateUrl: 'cours-view.html',
})
export class CoursViewPage {
  @ViewChild(Content) content: Content;
  @ViewChild('slides')slides: Slides;
  concours
  partie
  firecours = firebase.database().ref('/cours');
  start:number=0;
  currentContent:any;
  article: any
  nbrelecteurs
  isEnd
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public notify: AppNotify,
    public dataService: DataService,
    public platform: Platform,
    public groupservice: GroupsProvider,
    public actionSheetCtrl: ActionSheetController,
    private iab: InAppBrowser,
   ) {
  }

  ionViewDidLoad() {
    this.partie = this.navParams.get('partie');
    let id = this.partie.article.id;
    this.concours = this.navParams.get('concours');
    this.getShowArticle(id);
    this.groupservice.getintogroup(this.concours.id);
  }

  getShowArticle(id: number) {
    if (!id)
      return;
    return this.dataService.getShowArticle(id).then(cours => {
      this.article =cours?cours:{} ;
      this.storage.get('start').then((data)=>{
        this.start=data?Number(data):0;
         this.currentContent = this.article && this.article.contents.length?this.article.contents[this.start]:undefined;
      })
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    });
  }

  scrollto() {
    try {
        setTimeout(() => {
          if (this.content._scroll) this.content.scrollToTop(0);
        }, 1000);
    }
    catch (e) {
    }
  }
  restart(){
    setTimeout(() => {
      this.start=0;
        this.slides.slideTo(0, 1000);
    }, 1000)
  } 

  change(slider) {
    this.isEnd=this.slides.isEnd();
    this.scrollto();
    this.storage.set('start',this.slides.getActiveIndex());
    this.currentContent = this.article.contents[this.slides.getActiveIndex()]
    this.firecours.child(this.article.id).child(firebase.auth().currentUser.uid).set(this.progression(this.slides.getActiveIndex()));
  } 

  progression(index:number):number{
    if (!this.article || !this.article.contents||!this.article.contents.length)
     return -1;
     
    return this.slides.isEnd()?100: index* 100 / this.article.contents.length;
  }

  openChat() {
    this.navCtrl.push('GroupchatPage', { groupName: this.concours.id });
  }

  openInfo() {
    this.navCtrl.push('StartPage', { partie: this.partie });
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Des difficultés ?',
      buttons: [
        {
          text: 'Completez sur google',
          icon: 'logo-google' ,
          handler: () => {
            this.iab.create("https://www.google.com/search?q=" + this.currentContent.text, 'to _self', {});
          }
        },
        {
          text: 'Partager avec les autres',
          icon: 'ios-chatboxes-outline',
          handler: () => {
            let newMessage: any = {
              text: this.currentContent.text,
              type: 'cours',
              ref: this.partie.titre + '> ' + this.partie.matiere.titre,
              fileurl: '',
              toAdmin: ''
            }
            this.groupservice.addgroupmsg(newMessage).then(() => {
              this.notify.onSuccess({message:'Vous avez partagé cette partie du cours'})
            })
          }
        }
      ]
    });
    actionSheet.present();
  }
 
}
