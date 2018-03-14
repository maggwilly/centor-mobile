import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, Content, Events, TextInput, ModalController} from 'ionic-angular';
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
/**
 * Generated class for the GroupchatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {
 // @ViewChild('content') content: Content;
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  owner: boolean = false;
  groupName:any;
  newmessage='';
  allgroupmsgs;
  alignuid;
  photoURL;
  imgornot;
  showEmojiPicker = false;
  sendToAdmin = false;
  fileurl: any=''
  fileData: any = ''
  mesagetype: any ='simplemsg'
  abonnement:any;
  abonnementLoaded=false;
  groupdisplayname:any
  groupnberofmembers;
  meingroup={};
  scrollingToTop:boolean=false;
  showInfinite=false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public groupservice: GroupsProvider,
    public actionSheet: ActionSheetController,
    public notify: AppNotify,
    public events: Events, 
    private clipboard: Clipboard,
    public imgstore: ImghandlerProvider,
    private transfer: Transfer, 
    public modalCtrl: ModalController,
    public dataService: DataService, 
    private file: File,
    public storage: Storage,
    public _DomSanitizer: DomSanitizer,
    private socialSharing: SocialSharing,
    public loadingCtrl: LoadingController) {
   
  }
  ionViewDidLoad() {
    this.groupName = this.navParams.get('groupName');
    this.alignuid = firebase.auth().currentUser.uid;
    this.photoURL = firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d'
    this.storage.get('_messages_'+this.groupName).then(data=>{
     this.allgroupmsgs = data?data:[];
      this.groupservice.groupmsgs = data ? data : [];
     this.scrollto();
      setTimeout(() => {
        this.showInfinite = true;
      }, 2000);    
      });
    this.events.subscribe('newgroupmsg', () => {
      this.scrollto();
    })
    this.events.subscribe('gotintogroup', () => {
      this.groupdisplayname = this.groupservice.groupdisplayname;
      this.groupnberofmembers = this.groupservice.groupmemberscount;
    })
    this.groupName = this.navParams.get('groupName');
    this.groupservice.getintogroup(this.groupName).catch(error=>{
      this.notify.onError({ message: 'Problème de connexion' }); 
    })
    this.groupservice.loockforgroupmsgs(this.groupName);
    this.groupservice.getmeingroup(this.groupName).then(me => {
      this.meingroup = me;
      if (!this.meingroup)
        this.sendToAdmin = true;
    })
    this.groupservice.getgroupmsgs(this.groupName);
    this.events.subscribe('groupmsg', () => {
      this.allgroupmsgs = [];
      this.allgroupmsgs = this.groupservice.groupmsgs;
      this.storage.set('_messages_' + this.groupName, this.allgroupmsgs);
      this.scrollto();
    })
  
    if (!this.groupName)
      return
    this.groupdisplayname = this.groupservice.groupdisplayname;
    this.dataService.getAbonnement(firebase.auth().currentUser.uid, this.groupName).then(data => {
      this.abonnement = data;
      this.abonnementLoaded = true;
    }, error => {
      this.notify.onError({ message: 'Problème de connexion' });
    });

  }

  ionViewWillLeave() {
    this.events.unsubscribe('groupmsg');
    this.events.unsubscribe('gotintogroup');
  }

  doInfinite(ev?: any) {
    this.scrollingToTop=true
   setTimeout(() => {
    this.groupservice.getgroupmsgs(this.groupName);
     ev.complete();
    },200);
   
  }


  toggleDest(){
    this.sendToAdmin = !this.sendToAdmin;
  }  

  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = firebase.database.ServerValue.TIMESTAMP;
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }


  cancelFile(){
    this.fileurl='';
    this.mesagetype ='simplemsg';
    this.fileData='';
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
      this.navCtrl.push('GroupinfoPage', { groupName: this.groupName });
  }

  addgroupmsg() {
    this.showEmojiPicker = false;
    let newMessage :any = { 
       text: this.urlify(this.newmessage),
       type: this.mesagetype,
       fileurl:this.fileurl,
       toAdmin: this.sendToAdmin
      }
    if(!this.newmessage && !this.fileurl)
        return
    if (this.sendToAdmin && this.isExpired(this.abonnement))
       return
    this.newmessage = '';
    this.fileurl = '';
    this.mesagetype = 'simplemsg'
    this.onFocus();
    if (newMessage.type=='image'){
      this.groupservice.addMsg(newMessage)
      this.imgstore.storeImage(this.fileData).then(url=>{
        newMessage.fileurl=url;
        if (this.sendToAdmin)
          this.groupservice.postmsgstoadmin(newMessage,false)
        else
          this.groupservice.addgroupmsg(newMessage, false)        
      })
      return
    }
    if(this.sendToAdmin)
     this.groupservice.postmsgstoadmin(newMessage)
      else
      this.groupservice.addgroupmsg(newMessage)
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollto();
  }

  onScroll(event){
    if (this.content.directionY =='down')
       this.scrollingToTop = false;
    console.log(this.content.directionY);
      
  }


  scrollto() {
    this.scrollingToTop = false;
    try {
      if (!this.scrollingToTop)
        setTimeout(() => {
          if (this.content._scroll) this.content.scrollToBottom(500);
        }, 200);
    }
    catch (e) {
      console.log((<Error>e).message);//conversion to Error type
    }

  }

  urlify(text:string) {
   /* var urlRegex = /(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n]+)/g;
    if (!text)
       return "";
    return text.replace(urlRegex,  (url)=> {
     return '<a class="a" href="' + url + '">' + url + '</a>';
    })*/
    // or alternatively
     return text
  }

  openRessource(ressource: any) {
    this.navCtrl.push('RessourceDetailsPage', { ressource: ressource });
  }



  presentSheet(msg: any){
    if (msg.type == 'question' || msg.type == 'ressource')
         return;
    let sheet = this.actionSheet.create({
      enableBackdropDismiss: true,
      title: 'Que voulez vous faire',
      buttons: [
        {
          text: 'Transferer',
          icon: 'md-share-alt',
          handler: () => {
            this.socialSharing.share(msg.text + ' ' + msg.fileurl, null , null,null)
                .catch((error) => {
                  this.notify.onSuccess({ message: error })
                  })
          }
        },
        {
          text: 'Copier',
          icon: 'md-copy',
          handler: () => {
            this.clipboard.copy(msg.text).then(()=>{
              this.notify.onSuccess({ message: 'Copié' })
            });
           
          }
        },
        {
          text: 'Ne rien faire',
          icon: 'md-close',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    })
    sheet.present();
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
            })
            /*
           let loader = this.loadingCtrl.create({dismissOnPageChange:true,
              content: 'Chargement...'
            });
            
            this.imgstore.picmsgstore().then((fileurl) => {
              loader.dismiss();
              this.fileurl = fileurl;
              this.mesagetype = 'image'  
               this.scrollto();
              this.content.resize();
            }).catch((err) => {
              alert(err);
              loader.dismiss();
            })
           loader.present();*/
          }
        },
   /*    {
          text: 'Envoyer un document',
          icon: 'md-document',
          handler: () => {
            this.imgstore.filemsgstore().then((imgurl) => {
              this.fileurl = imgurl;
              this.mesagetype = 'file' 
               this.scrollto();
              this.content.resize();
            }).catch((err) => {
              alert(err);
            })
          }
       },*/
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