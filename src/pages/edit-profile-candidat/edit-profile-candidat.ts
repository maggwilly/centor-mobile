import { Component, NgZone  } from '@angular/core';
import {Events, NavController, App,   NavParams ,ViewController,ActionSheetController,LoadingController,AlertController} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { IonicPage } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { DomSanitizer } from '@angular/platform-browser';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
@IonicPage()
@Component({
  selector: 'page-edit-profile-candidat',
  templateUrl: 'edit-profile-candidat.html'
})
export class EditProfileCandidatPage {
  candidat:any={branche:'science',enableNotifications:true};
  imageData: string = '';
  loading;
 // authInfo:any;
  photoURL
  fileName
  uploapping
  placeholderPicture = 'assets/images/default-avatar.jpg';
  defaultAvatar = 'assets/images/default-avatar.jpg';

  offset = 100;
  submited:boolean=false;
 constructor(
  public storage: Storage ,
  public navCtrl: NavController,
  public appCtrl: App,
  public viewCtrl: ViewController,
  public loadingCtrl: LoadingController,
  public events: Events,
  public actionSheetCtrl: ActionSheetController,
  public navParams: NavParams,
  public dataService:DataService,
  public alertCtrl: AlertController,
   public firebaseNative: Firebase,
   public userProvider: UserProvider,
   public zone: NgZone,
   public _DomSanitizer: DomSanitizer,
   public imgservice: ImghandlerProvider,
  public notify:AppNotify
) {

   this.firebaseNative.setScreemName('partie_edit');
}

  ionViewDidLoad() {
    let candidat=this.navParams.get('profil');
    this.candidat = Object.assign({ dateMax:'2010-12-31' }, candidat);
    this.photoURL = candidat.photoURL ? candidat.photoURL : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d'
  }

   dismiss(data?:any) {
      this.viewCtrl.dismiss();
  }


  editInfo(){
    this.submited = true;
    if(this.uploapping)
      this.events.publish('picture:change',this.imageData);
      this.events.publish('displayName:change',this.candidat.displayName);
    return this.dataService.editInfo(this.candidat).then((info)=>{
        this.candidat=info;
      this.submited = false;
       this.firebaseNative.logEvent('profil_update', { profil: true });
       this.notify.onSuccess({ message: 'Votre profil a été mis à jour !' })
       this.viewCtrl.dismiss(info);
    },error=>{
      this.submited=false;
      this.notify.onError({ message:'Petit problème de connexion !'});
   })
  }


  chooseimage() {
    this.imgservice.getImage(200, 200).then(imageData => {
      this.zone.run(() => {
        this.uploapping = true;
        this.photoURL = 'data:image/png;base64, ' + imageData;
        this.imageData = imageData;
      })
    });
  }





   logout() {
    firebase.auth().signOut().then(() => {
          this.storage.clear().catch(error=>{});
          this.viewCtrl.dismiss(true);
          this.notify.onSuccess({ message:'Vous êtes déconnectés !'});
      this.appCtrl.getRootNav().setRoot('HomePage');
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
        });
      });
     this.loading = this.loadingCtrl.create({dismissOnPageChange:true});
      this.loading.present();
  }



  presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Que voulez-vous faire ?',
     buttons: [
       {
         text: 'Me déconnecter',
         icon:'power',
         handler: () => {
           console.log('Destructive clicked');

           this.logout();
         }
       },
       {
         text: 'Ne rien faire',
         icon:'md-close',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
 }
}
