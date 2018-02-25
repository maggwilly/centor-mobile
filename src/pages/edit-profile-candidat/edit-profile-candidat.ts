import { Component } from '@angular/core';
import { NavController, App,   NavParams ,ViewController,ActionSheetController,LoadingController,AlertController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-edit-profile-candidat',
  templateUrl: 'edit-profile-candidat.html'
})
export class EditProfileCandidatPage {
  candidat:any={branche:'science',enableNotifications:true};
  imageData: string = '';
  loading;
  authInfo:any;
  photoURL
  fileName
  uploapping
  placeholderPicture = 'assets/images/default-avatar.jpg';
  submited:boolean=false;
 constructor(
  public storage: Storage , 
  public navCtrl: NavController, 
  public appCtrl: App, 
  public viewCtrl: ViewController, 
  public loadingCtrl: LoadingController,
  private iab: InAppBrowser ,
  public actionSheetCtrl: ActionSheetController,
  public navParams: NavParams,
  public dataService:DataService,
  public alertCtrl: AlertController,
   public userProvider: UserProvider,
  private camera: Camera,
  public notify:AppNotify
) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfileCandidatPage');
    let candidat=this.navParams.get('profil');
    this.candidat = Object.assign({ dateMax:'2010-12-31' }, candidat);
    this.authInfo=this.navParams.get('authInfo');
  }

   dismiss(data?:any) {
      this.viewCtrl.dismiss();    
  } 


  editInfo(close:boolean=true){
    this.submited=true;
    this.candidat.photoURL = this.photoURL ? this.photoURL : this.candidat.photoURL ;
    this.dataService.editInfo(this.authInfo.uid, this.candidat).then((info)=>{
    this.candidat=info;
    this.submited = false;
      this.userProvider.updatedisplayname(this.candidat.displayName).then(()=>{
        if (close) {
          this.notify.onSuccess({ message: 'Votre profil a été mis à jour !' })
          this.viewCtrl.dismiss(info);
        }

      })

   },error=>{
      this.submited=false;
     this.notify.onError({ message:'Petit problème de connexion !'});      
   })
  }


  getPicture(sourceType:number){
    const options: CameraOptions = {
     quality: 100,
     destinationType: this.camera.DestinationType.DATA_URL,
     encodingType: this.camera.EncodingType.JPEG,
     allowEdit:true,
     cameraDirection:1,
     targetWidth:200,
     targetHeight:200,
     mediaType: this.camera.MediaType.PICTURE,
     sourceType:sourceType
   } 

    
    this.camera.getPicture(options).then((imageData) => {
      this.candidat.base64Image = 'data:image/png;base64, ' + imageData;
       this.uploapping = true;
      firebase.storage().ref('profilePictures/' + firebase.auth().currentUser.uid)
      .putString(imageData, 'base64', { contentType: 'image/jpeg' }).then(picture => {
        this.candidat.base64Image = picture.downloadURL;
        this.photoURL = picture.downloadURL;
        this.uploapping = false;
        /*if (!this.candidat.photoURL)
          this.editInfo(false);*/
        return   this.userProvider.updateimage(picture.downloadURL);
        }, error => {
        this.notify.onError({ message: 'Un problème est survenu !' });  
       });
     }, error => {
      this.notify.onError({ message: 'Un problème est survenu !' }); 
    });

 /*  this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    this.base64Image = 'data:image/jpeg;base64,' + imageData;
    this.candidat.base64Image='data:image/jpeg;base64,' + imageData;
     this.imageData=imageData;
     const selfieRef = firebase.storage().ref('profilePictures/' + this.authInfo.uid+'.jpeg');
     selfieRef.putString(imageData, 'base64', { contentType: 'image/jpeg' }).then(picture=>{
       this.candidat.photoURl = picture.downloadURL;
     });
   },error=>{
    alert(error);
   }); */
   }

   cancelPicture(){
     firebase.storage().ref('profilePictures/' + firebase.auth().currentUser.uid).delete().then(()=>{
       this.photoURL = undefined;
       //this.userProvider.updateimage(this.photoURL); defqult avatar
     }, error => {
      this.notify.onError({ message: 'Un problème est survenu !' }); 
     });
   }
   
   pictureActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Prendre une photo',
      buttons: [
        {
          text: 'Appareil photo',
          icon:'camera',
          handler: () => {
           this.getPicture(1);
          }
        },
        {
          text: 'Gallerie',
          icon:'images',
          handler: () => {
            this.getPicture(0);
          }
        },
        {
          text: 'Annuler',
          icon:'md-close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
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

  openHelp(){
 this.iab.create(window.localStorage.getItem('_baseUrl')+'mobile/2/help');
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
