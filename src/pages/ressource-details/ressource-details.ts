import { Component, NgZone } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import firebase from 'firebase';
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
  zone: NgZone;
  page:number = 1;
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
    public loadingCtrl: LoadingController
  ) {
    this.zone = new NgZone({});
    this.showMenu = this.navParams.get('showMenu');
    //this.firebaseNative.setScreemName('document_view');
  }


  ionViewWillLeave() {
    if (this.ch)
      this.ch.unsubscribe();
  }

  observeAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.id = this.navParams.get('ressource_id');
        this.dataService.getOneRessource(this.id).then(data => {
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
          this.dataService.getOneRessource(this.id).then(data => {
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
      this.dataService.getOneRessource(this.id).then(data => {
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
    this.notify.onSuccess(
      {
        message: `Obtenez le CODE DE PAIMENT de 06 chiffrespar SMS en composant le #150*4*4*CODE_SECRET_Orange_Money#.`,
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
