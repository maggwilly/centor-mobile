import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,LoadingController} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
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
  estateProperty:any={}/* = {
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
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      public dataService: DataService,
    private iab: InAppBrowser,
    public notify: AppNotify, 
    public platform: Platform,
     private transfer: Transfer, 
    public loadingCtrl: LoadingController,
     private file: File
      ) {
      this.estateProperty=this.navParams.get('ressource');
    
  }

  ionViewDidLoad() {
    this.dataService.getRessource(this.estateProperty.id).then(data=>{
     this.estateProperty=data;
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }

  telecharger() {
    this.iab.create(this.estateProperty.paymentUrl);
    const ch = this.dataService.getRessourceObservable(this.estateProperty.id).subscribe(data=>{
      this.estateProperty = data.json();
      if (!this.estateProperty.paymentUrl){
        this.notify.onSuccess({ message: "Cliquez pour télécharger votre fichier", position: 'top' });
        ch.unsubscribe();
      }
 }, error => {
   this.notify.onError({ message: 'Problème de connexion.' });
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
      else if (this.platform.is('android')) {
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
    });
}

}
