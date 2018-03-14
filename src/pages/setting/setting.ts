import { Component } from "@angular/core";
import { Events, App, NavController, LoadingController, ModalController, ActionSheetController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { AppNotify } from '../../providers/app-notify';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { IonicPage } from 'ionic-angular';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
  authInfo: any = {};
  loading;
  user: any = {};
  paidConcours: any;
  prefRef: any;
  constructor(
    public storage: Storage,
    public appCtrl: App,
    public events: Events,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public nav: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public notify: AppNotify) {
   
  }
  ionViewDidLoad() {
    this.authInfo = firebase.auth().currentUser;
    this.initPage();
  }

  initPage() {
    this.user.info = { 
      displayName: this.authInfo.displayName,
       email: this.authInfo.email,
      photoURL: this.authInfo.photoURL ? this.authInfo.photoURL: 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d'
       };
    this.getUserProfile().then(() => {
      this.loadAbonnement();
    });

  }


  loadAbonnement() {
    return this.dataService.getAbonnements(firebase.auth().currentUser.uid).then(data => {
      this.paidConcours = data ? data : [];
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    });
  }


  getUserProfile() {
    return this.dataService.getInfo(firebase.auth().currentUser.uid).then((info) => {
      if (info) {
        this.user.info = info;
      }
    },
      error => {
        this.notify.onError({ message: 'Petit problème de connexion.' });
      })
  }


  showAbonnement(abonnement) {
    let modal = this.modalCtrl.create('AbonnementPage', { abonnement: abonnement });
    modal.onDidDismiss((data) => {
    });
    modal.present();
  }



  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = firebase.database.ServerValue.TIMESTAMP;
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }

  editProfileCandidat() {
    let modal = this.modalCtrl.create('EditProfileCandidatPage', { authInfo: firebase.auth().currentUser, profil: this.user.info });
    modal.onDidDismiss((data) => {
      if (data) {
        this.user.info = data;
        this.events.publish('profil:updated', data);
        //  this.getUserProfile();  
      }
      //

    });
    modal.present();
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.storage.clear().catch(error => { });
      this.viewCtrl.dismiss(true);
      this.notify.onSuccess({ message: 'Vous êtes déconnectés !' });
      this.appCtrl.getRootNav().setRoot('HomePage');
    }, (error) => {
      this.loading.dismiss().then(() => {
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
    this.loading = this.loadingCtrl.create({ dismissOnPageChange: true });
    this.loading.present();
  }



  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Que voulez-vous faire ?',
      buttons: [
        {
          text: 'Me déconnecter',
          icon: 'power',
          handler: () => {
            console.log('Destructive clicked');

            this.logout();
          }
        },
        {
          text: 'Ne rien faire',
          icon: 'md-close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }




}
