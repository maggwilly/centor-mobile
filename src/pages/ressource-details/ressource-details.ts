import { Component, NgZone } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import firebase from 'firebase';
//import { File } from '@ionic-native/file';
/**
 * Generated class for the RessourceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-ressource-details',
  templateUrl: 'ressource-details.html',
})
export class RessourceDetailsPage {
  storageDirectory: string = '';
  ch: any;
  bg: boolean = true;
  id;
  loaded
  estateProperty: any = {}
  showMenu
  /* = {
    id:1,
    nom: 'Calendrier des concours publics 2018-209',
    description: `Liste de tous les concours publics du cameroun avec ls dates. Calendrier produit et publié chaque année par le MINSUP et le
    centre national des examens et concours`,
    price: '200',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/filemsgs%2Fcalendar.PNG?alt=media&token=210c653e-9d27-40a0-933b-0c16dfe72f0d',
    url: 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/filemsgs%2Fcalendar.PNG?alt=media&token=210c653e-9d27-40a0-933b-0c16dfe72f0d',
    style: 'PDF, 15ko',
    size: '10 pages',
    detail1:'51 Concours',
    detail2: '16 Ecoles publics',
    detail3: '4 Ecoles privée',
    detail4: 'Toutes série, tous niveaux'
  }; */
  zone: NgZone;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    private iab: InAppBrowser,
    public appCtrl: App,
    public notify: AppNotify,
    public platform: Platform,
    private transfer: Transfer,
    public firebaseNative: Firebase,
    public loadingCtrl: LoadingController,
    // private file: File
  ) {
    this.zone = new NgZone({});
    this.showMenu = this.navParams.get('showMenu');
    this.firebaseNative.setScreemName('document_view');
  }
  ionViewWillLeave() {
    if (this.ch)
      this.ch.unsubscribe();
  }

  observeAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.id = this.navParams.get('ressource_id');
        this.dataService.getRessource(this.id).then(data => {
          this.estateProperty = data ? data : {};
          this.loaded = true;
        }, error => {
          this.notify.onError({ message: 'Petit problème de connexion.' });
        })
      } else
        this.signup();
    })
  }
  signup() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.id = this.navParams.get('ressource_id');
          this.dataService.getRessource(this.id).then(data => {
            this.estateProperty = data ? data : {};
            this.loaded = true;
          }, error => {
            this.notify.onError({ message: 'Petit problème de connexion.' });
          })
          unsubscribe();
        } else {
          unsubscribe();
        }
      });
    });
    this.appCtrl.getRootNav().push('LoginSliderPage', { redirectTo: true });
  }

  ionViewDidLoad() {
    if (this.navParams.get('ressource')) {
      this.estateProperty = this.navParams.get('ressource');
      this.id = this.estateProperty.id;
      this.loaded = true;
      this.dataService.getRessource(this.id).then(data => {
        this.estateProperty = data ? data : {};
        this.loaded = true;
      }, error => {
        this.notify.onError({ message: 'Petit problème de connexion.' });
      })      
    } else
      this.observeAuth();

  }

  telecharger() {
    this.iab.create(this.estateProperty.paymentUrl);
    this.ch = this.dataService.getRessourceObservable(this.estateProperty.id, this.estateProperty.paymentUrl).subscribe(data => {
      this.estateProperty = data.json();
      if (!this.estateProperty.paymentUrl) {
        this.notify.onSuccess({ message: "Cliquez pour télécharger votre fichier", position: 'top' });
        this.ch.unsubscribe();
      }
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
      this.ch.unsubscribe();
    })
  }

  downloadFile() {
    this.platform.ready().then(() => {
      if (!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if (this.platform.is('android') || this.platform.is('core')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
      const fileTransfer: TransferObject = this.transfer.create();
      const imageLocation = this.estateProperty.url;
      let loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Téléchargement...'
      });

      fileTransfer.download(imageLocation, this.storageDirectory + this.estateProperty.nom).then((entry) => {
        loader.dismiss();
        this.notify.onSuccess({ message: "Téléchargement terminé", position: 'top' });
      }, (error) => {
        loader.dismiss();
        this.notify.onSuccess({ message: "Le fichier n'a pas put être téléchargé", position: 'top' });
      });
      loader.present();
    });
  }
  help() {
    // let modal = this.modalCtrl.create('SlideCarouselPage');
    //modal.present();
    this.notify.onSuccess(
      {
        message: `Vous êtes appelé à payer une faible somme d'argent pour accéder au document.  
        Pour effectuer ce paiement, vous avez besoin d'un CODE DE PAIMENT de 06 chiffres. 
        Obtenez ce  code par SMS en composant le #150*4*4*CODE_SECRET_Orange_Money#
         sur un téléphone aboné orange. Accedez ensuite à la page de paiement en appuyant 
         sur le bouton de couleur orange; Remplissez les champs  sur la page
        avec le numéro de téléphone et le code de paiement. Utilisez le bouton "CONFIRMER" de la page pour valider.`,
        duration: 120000,
        dismissOnPageChange: true,
        showCloseButton: true,
        closeButtonText: 'ok',
        position:'top',
        cssClass: 'flash-message'
      }
    );
  }

}
