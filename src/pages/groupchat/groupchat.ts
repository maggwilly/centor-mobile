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
  mesagetype: any =''
  abonnement:any;
  abonnementLoaded=false;
  groupdisplayname:any
  groupnberofmembers;
  meingroup={};
  scrollingToTop:boolean=false;
  question: any = {
    "id": 576,
    "type": "text",
    "showLink": "https:\/\/entrances.herokuapp.com\/v1\/question\/576\/show\/from\/mobile",
    "text": "Soit la fonction <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mi>f<\/mi><\/math> d\u00e9finie sur <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mi mathvariant=\"normal\">&#x211D;<\/mi><\/math> par <math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><mi>f<\/mi><mo>(<\/mo><mi>x<\/mi><mo>)<\/mo><mo>&#xA0;<\/mo><mo>=<\/mo><mo>&#xA0;<\/mo><mo>(<\/mo><msup><mi>x<\/mi><mn>2<\/mn><\/msup><mo>+<\/mo><mi>x<\/mi><mo>+<\/mo><mn>1<\/mn><mo>)<\/mo><msup><mi>e<\/mi><mrow><mo>-<\/mo><mi>x<\/mi><\/mrow><\/msup><mo>-<\/mo><mn>1<\/mn><\/math>",
    "validated": true,
    "partie": {
      "id": 43
    },
    "time": 7,
    "rep": "c",
    "propA": "<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><munder><mi>lim<\/mi><mrow><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mi>x<\/mi><mo>&#x2192;<\/mo><mo>+<\/mo><mo>&#x221E;<\/mo><\/mrow><\/munder><mi>f<\/mi><mo>(<\/mo><mi>x<\/mi><mo>)<\/mo><mo>&#xA0;<\/mo><mo>=<\/mo><mo>&#xA0;<\/mo><mo>+<\/mo><mo>&#x221E;<\/mo><\/math>",
    "propB": "<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><munder><mi>lim<\/mi><mrow><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mi>x<\/mi><mo>&#x2192;<\/mo><mo>+<\/mo><mo>&#x221E;<\/mo><\/mrow><\/munder><mi>f<\/mi><mo>(<\/mo><mi>x<\/mi><mo>)<\/mo><mo>&#xA0;<\/mo><mo>=<\/mo><mo>&#xA0;<\/mo><mo>-<\/mo><mo>&#x221E;<\/mo><\/math>",
    "propC": "<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><munder><mi>lim<\/mi><mrow><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mi>x<\/mi><mo>&#x2192;<\/mo><mo>+<\/mo><mo>&#x221E;<\/mo><\/mrow><\/munder><mi>f<\/mi><mo>(<\/mo><mi>x<\/mi><mo>)<\/mo><mo>&#xA0;<\/mo><mo>=<\/mo><mo>&#xA0;<\/mo><mo>-<\/mo><mn>1<\/mn><\/math>",
    "propD": "<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\"><munder><mi>lim<\/mi><mrow><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mo>&#xA0;<\/mo><mi>x<\/mi><mo>&#x2192;<\/mo><mo>+<\/mo><mo>&#x221E;<\/mo><\/mrow><\/munder><mi>f<\/mi><mo>(<\/mo><mi>x<\/mi><mo>)<\/mo><mo>&#xA0;<\/mo><mo>=<\/mo><mo>&#xA0;<\/mo><mn>0<\/mn><\/math>"
  }
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
    private socialSharing: SocialSharing,
    public loadingCtrl: LoadingController) {
    this.alignuid = firebase.auth().currentUser.uid;
    this.photoURL = firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL:'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d'
     firebase.auth().currentUser.photoURL;

    this.events.subscribe('newgroupmsg', () => {
      console.log('newgroupmsg');
         this.scrollto();
    })
    this.events.subscribe('gotintogroup', () => {
      this.groupdisplayname = this.groupservice.groupdisplayname;
      this.groupnberofmembers = this.groupservice.groupmemberscount;
      console.log('gotintogroup');
    })
    this.groupName = this.navParams.get('groupName');
    this.groupservice.getintogroup(this.groupName)
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
      console.log('groupmsg');
      this.scrollto();
    })  
    //eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub])');
  }

  ionViewDidLoad() {
    this.groupName = this.navParams.get('groupName');
    if (!this.groupName)
      return
      this.groupdisplayname = this.groupservice.groupdisplayname;
     this.dataService.getAbonnement(firebase.auth().currentUser.uid, this.groupName).then(data => {
      this.abonnement = data;
      this.abonnementLoaded = true;
    }, error => {  
    });
  }

  doInfinite(infiniteScroll?: any) {
    this.scrollingToTop=true
    setTimeout(() => {
    this.groupservice.getgroupmsgs(this.groupName);
        infiniteScroll.complete();
    },2000);
    setTimeout(() => {
      this.scrollingToTop = false
    }, 3000);    
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
    this.mesagetype='';
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
    let desc=this.imgstore.guid();
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

  sendpicmsg() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgstore.picmsgstore().then((imgurl) => {
      loader.dismiss();
      this.groupservice.addgroupmsg(imgurl).then(() => {
        this.scrollto();
        this.newmessage = '';
        this.fileurl = '';
        this.mesagetype = ''
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })
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
        //fromAdmin: true,
        //question:this.question,
       toAdmin: this.sendToAdmin
      }
    if(!this.newmessage && !this.fileurl)
        return
    if (this.sendToAdmin && this.isExpired(this.abonnement))
       return
    if(this.sendToAdmin)
      this.groupservice.postmsgstoadmin(newMessage).then(() => {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollto();
        this.newmessage = '';
        this.fileurl = '';
        this.mesagetype = ''
      })
      else
      this.groupservice.addgroupmsg(newMessage).then(() => {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollto();
      this.newmessage = '';
        this.fileurl = '';
        this.mesagetype = ''
    })
  }
  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollto();
  }

  scrollto() {
    try {
      if (!this.scrollingToTop)
        setTimeout(() => {
          if (this.content._scroll) this.content.scrollToBottom(0);
        }, 1000);
    }
    catch (e) {
      console.log((<Error>e).message);//conversion to Error type
    }

  }

  urlify(text:string) {
    var urlRegex = /(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n]+)/g;
    if (!text)
       return "";
    return text.replace(urlRegex,  (url)=> {
     return '<a class="a" href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }

  presentSheet(msg: any){
    if (msg.type=='question')
         return;
    let sheet = this.actionSheet.create({
      enableBackdropDismiss: true,
      title: 'Que voulez vous faire',
      buttons: [
        {
          text: 'Transferer',
          icon: 'md-share-alt',
          handler: () => {
            this.socialSharing.share(msg.message + ' ' + msg.fileurl, null , null,null)
                .catch((error) => {
                  this.notify.onSuccess({ message: error })
                  })
          }
        },
        {
          text: 'Copier',
          icon: 'md-copy',
          handler: () => {
            this.clipboard.copy(msg.message).then(()=>{
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
            //this.fileurl = "https://www.uml.edu/Images/Pic-of-CRC-for-About-Us-page_tcm18-229269.jpg?w=x";
            //this.mesagetype = 'image' 
           // this.scrollto();
           
            let loader = this.loadingCtrl.create({dismissOnPageChange:true,
              content: 'Chargement...'
            });
            
            this.imgstore.picmsgstore().then((fileurl) => {
              loader.dismiss();
              this.fileurl = fileurl;
              this.mesagetype = 'image'  
               this.scrollto();
            }).catch((err) => {
              alert(err);
              loader.dismiss();
            })
            loader.present();
          }
        },
        {
          text: 'Envoyer un document',
          icon: 'md-document',
          handler: () => {
           /* this.fileurl = "https://www.uml.edu/Images/Pic-of-CRC-for-About-Us-page_tcm18-229269.jpg?w=x";
            this.mesagetype = 'file'  
            this.scrollto();*/
            let loader = this.loadingCtrl.create({
              dismissOnPageChange: true,
              content: 'Chargement...'
            });
            this.imgstore.filemsgstore().then((imgurl) => {
              loader.dismiss();
              this.fileurl = imgurl;
              this.mesagetype = 'file' 
               this.scrollto();
            }).catch((err) => {
              alert(err);
              loader.dismiss();
            })
            loader.present();
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