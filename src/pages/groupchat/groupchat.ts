import { Component, ViewChild, NgZone } from '@angular/core';
import { App,IonicPage, NavController, NavParams, ActionSheetController, LoadingController, Content, Events, TextInput, ModalController} from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import firebase from 'firebase';
import { AppNotify } from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
import { Transfer } from '@ionic-native/transfer';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { FcmProvider as Firebase} from '../../providers/fcm/fcm';
import {AbonnementProvider} from "../../providers/abonnement/abonnement";

@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  groupBg = 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/grouppic%2Fchat.jpg?alt=media&token=0cdae16c-2625-43fe-b370-bee39adc55f7'
  defaultImage = 'assets/images/default-image.jpg'
  defaultAvatar = 'assets/images/default-avatar.jpg';  offset = 100;
  owner: boolean = false;
  groupName:any;
  newmessage:string='';
  allgroupmsgs;
  alignuid:any;
  photoURL:any;
  imgornot:any;
  showEmojiPicker:boolean = false;
  sendToAdmin:boolean = false;
  fileurl: string=''
  fileData: string = ''
  mesagetype: string ='simplemsg'
  groupdisplayname:any
  groupnberofmembers;
  meingroup:any ={};
  bg: boolean = true;
  scrollingToTop:boolean=true;
  showInfinite=false;
  toUser:any;
  showMenu:boolean;
  textZise:any;
  zone: NgZone;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public groupservice: GroupsProvider,
    public actionSheet: ActionSheetController,
    public notify: AppNotify,
    public events: Events,
    public appCtrl: App,
    private clipboard: Clipboard,
    public imgstore: ImghandlerProvider,
    private transfer: Transfer,
    public modalCtrl: ModalController,
    public firebaseNative: Firebase,
    public dataService: DataService,
    private file: File,
    public storage: Storage,
    public abonnementProvider:AbonnementProvider,
    public _DomSanitizer: DomSanitizer,
    private socialSharing: SocialSharing,
    public loadingCtrl: LoadingController) {
    this.zone = new NgZone({});
    this.firebaseNative.setScreemName('tchat_room');
    this.showMenu = this.navParams.get('showMenu');
  }

  ionViewDidLoad() {
    this.authUser();
    this.groupName = this.navParams.get('groupName');
    this.groupdisplayname=this.navParams.get('groupdisplayname');
    this.events.subscribe('newgroupmsg', () => {
      this.scrollto();
    })
    this.groupdisplayname = this.navParams.get('groupdisplayname');
    this.events.subscribe('gotintogroup', () => {
      this.groupdisplayname = this.groupservice.groupdisplayname ? this.groupservice.groupdisplayname : this.groupdisplayname;
      this.groupBg = this.groupservice.grouppic ? this.groupservice.grouppic : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/grouppic%2Fchat.jpg?alt=media&token=0cdae16c-2625-43fe-b370-bee39adc55f7'
      this.groupnberofmembers = this.groupservice.groupmemberscount;
    })
    this.groupName = this.navParams.get('groupName');
    this.groupservice.getintogroup(this.groupName).then(()=>{}).catch(error => {
      this.notify.onError({ message: 'Problème de connexion' });
    })
    this.groupservice.loockforgroupmsgs(this.groupName);
    this.groupservice.getmeingroup(this.groupName).then(me => {
      this.meingroup = me;
    })
    this.groupservice.getgroupmsgs(this.groupName);
    this.events.subscribe('groupmsg', () => {
      this.allgroupmsgs = [];
      this.allgroupmsgs = this.groupservice.groupmsgs;
      setTimeout(() => {
        this.scrollto();
      }, 1000);
    })
    if (!this.groupName)
      return
    this.groupdisplayname = this.groupservice.groupdisplayname ? this.groupservice.groupdisplayname : this.groupdisplayname;

  }

  private authUser() {
  const us= firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.alignuid = firebase.auth().currentUser.uid;
        this.photoURL = firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d'
        us();
      }});
   }

  ionViewWillLeave() {
    //this.events.unsubscribe('groupmsg');
   // this.events.unsubscribe('gotintogroup');
  }

  doInfinite(ev?: any) {
   // this.scrollingToTop=true
   setTimeout(() => {
    this.groupservice.getgroupmsgs(this.groupName);
     ev.complete();
    // this.scrollingToTop = false;
    },200);

  }

  goBackToGroup(){
    this.sendToAdmin =false;
    this.toUser=undefined;
    this.scrollto();
  }

  toggleDest(){
    this.sendToAdmin = !this.sendToAdmin;
    this.toUser = undefined;
    this.messageInput.setFocus();
    if (this.sendToAdmin){
    setTimeout(() => {
      this.groupservice.getgroupmsgs(this.groupName);
      }, 200);
    }
  }

  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now=Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }


  cancelFile(){
    this.fileurl='';
    this.mesagetype ='simplemsg';
    this.fileData='';
    this.content.resize();
  }


  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.messageInput.setFocus();
    }
    this.content.resize();
    this.scrollto();
  }

  download(msg:any) {
    let desc:string=this.file.dataDirectory+'/'+ this.imgstore.guid();
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    this.transfer.create().download(msg.fileurl, desc,true).then((entry) => {
      loader.dismiss();
      this.notify.onSuccess({ message: 'download complete: ' + entry.toURL()})
      }, (error) => {
        loader.dismiss();
        this.notify.onError({ message: error})
      });
  }

  openGroupeSetting() {
    this.navCtrl.push('GroupinfoPage', { groupName: this.groupName, meingroup: this.meingroup  });

  }

  addgroupmsg() {
    let newMessage :any = {
       text: this.urlify(this.newmessage),
       type: this.mesagetype,
       fileurl:this.fileurl,
       toAdmin: this.sendToAdmin
      }
    this.firebaseNative.logEvent('message_send', { newMessage: newMessage.type });
    if(!this.newmessage )
        return
    this.newmessage = '';
    this.fileurl = '';
    this.mesagetype = 'simplemsg'
    this.scrollto(true);
    this.messageInput.setFocus()
      this.groupservice.addgroupmsg(newMessage)
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
   this.scrollto(true);

  }

  onImageLoad($event: any){
  this.scrollto();
}


  scrollto(forceScroll=false) {
      if (forceScroll)
         this.scrollingToTop = false;
    if (this.scrollingToTop)
          return;
    if (!this.content)
      return  setTimeout(() => {
         this. scrollto();
        }, 200);
    if (this.content.isScrolling )
      return setTimeout(() => {
        this.scrollto();
      }, 200);
    if (!this.content)
      return;
        if (this.content._scroll)
     this.content.scrollToBottom(200);
    }

  placeholder():string{
    if(this.sendToAdmin)
       return "Ecrire à un enseignant"
       else if(this.toUser)
         return "Saisir un message privé";
        return "Ecrire un message a tous les camarades de prepa"
  }


  urlify(text:string) {
   var urlRegex = /(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n]+)/g;
    if (!text)
       return "";
    return text.replace(urlRegex,  (url)=> {
     return '<a class="a" href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text
  }

  openRessource(ressource: any) {
    this.navCtrl.push('RessourceDetailsPage', { ressource_id: ressource.id });
  }


  presentSheet(msg: any){
    this.alignuid = firebase.auth().currentUser.uid;
    let sheet = this.actionSheet.create({
      enableBackdropDismiss: true,
      title: 'Que voulez vous faire',
      buttons: [
        {
          text: 'Repondre en privée',
          icon: 'ios-person',
          handler: () => {
            if (msg.sentby == this.alignuid || msg.message.type == 'ressource')
                return;
            this.sendToAdmin = false;
            this.toUser = { uid: msg.sentby, displayName: msg.displayName ? msg.displayName : msg.sentby};
            this.messageInput.setFocus()
            setTimeout(() => {
              this.groupservice.getgroupmsgs(this.groupName);
            }, 200);
          }
        },

        {
          text: 'Transferer ce message',
          icon: 'md-share-alt',
          handler: () => {
            if (msg.message.type == 'question' || msg.message.type == 'ressource'){
              this.notify.onSuccess({ message: "Le contenu de ce type message n'est pas supporté" })
              return;
            }

            this.socialSharing.share(msg.message.text + ' ' + msg.message.fileurl, null , null,null)
                .catch((error) => {
                  this.notify.onSuccess({ message: error })
                  })
          }
        },
        {
          text: 'Supprimer pour moi',
          icon: 'md-close',
          handler: () => {
            if (msg.uiniqid)
            this.groupservice.deletemsg(msg).then(() => {
            });
          }
        },
        {
          text: 'Copier ce message',
          icon: 'md-copy',
          handler: () => {
            this.clipboard.copy(msg.message.text).then(()=>{
              this.notify.onSuccess({ message: 'Texte copié' })
            });

          }
        },
        {
          text: 'Ne rien faire',
          icon: 'ios-close',
          handler: () => {
          }
        }
      ]
    })
    sheet.present();
  }
 secureUrl(url):any{
     if(!url||url==='null')
      return this.defaultImage;
   if(url.substring(0, 4) === 'http') {
     return url;
      }
   return  this._DomSanitizer.bypassSecurityTrustUrl(url);
 }
  presentSheetSendFile() {
    let sheet = this.actionSheet.create({
      enableBackdropDismiss: true,
      title: 'Que voulez-vous faire ?',
      buttons: [
        {
          text: 'Envoyer une image',
          icon: 'image',
          handler: () => {
            this.imgstore.getImage().then(ImageData=>{
              this.fileurl = 'data:image/png;base64, '+ImageData;
              this.fileData =  ImageData;
              this.mesagetype = 'image'
              this.messageInput.setFocus();
              this.scrollto();

            })
          }
        },

        {
          text: 'Annuler',
          icon: 'md-close',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    })
    sheet.present();
  }

  onProfilePicError(this){

  }
}
