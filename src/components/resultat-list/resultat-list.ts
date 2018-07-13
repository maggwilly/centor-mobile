import { Component, Input } from '@angular/core';
import {  NavParams, Platform, LoadingController } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
/**
 * Generated class for the ResultatListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
declare var cordova: any;
@Component({
  selector: 'resultat-list',
  templateUrl: 'resultat-list.html'
})
export class ResultatListComponent {

  loaded: boolean = false
  @Input ()
  resultatList: any[] = [];
  @Input()
  style: string ='';
  storageDirectory: string = '';
  constructor(
    public dataService: DataService, 
    public notify: AppNotify ,  
    private socialSharing: SocialSharing,
    public platform: Platform,
    private transfer: Transfer,
    public loadingCtrl: LoadingController,
    private file: File   
    ) {

  }
  ngOnInit() {
    this.loaded = false;
    if (this.resultatList.length)
      return;
    this.dataService.getResultats(0).then((data) => {
      this.resultatList = data;
      this.loaded = true;
    }, error => {
      this.notify.onError({ message: 'problème de connexion  !' });
    })
  }



  name(url: string): string {
    if (url&&url.includes('pdf'))
      return 'md-download';
    return 'md-open';
  }
  
  share(resultat: any) {
    let textMessage = resultat.description;
    this.socialSharing.share(textMessage, null, null, this.dataService._baseUrl + 'resultat/' + resultat.id + '/get/mobile')
       .catch((error) => {
       })
  }

  downloadFile(resultat: any) {
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
      const imageLocation = resultat.url;
      let loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Téléchargement...'
      });

      fileTransfer.download(imageLocation, this.storageDirectory + resultat.description).then((entry) => {
        loader.dismiss();
        this.notify.onSuccess({ message: "Téléchargement terminé", position: 'top' });
      }, (error) => {
        loader.dismiss();
        this.notify.onSuccess({ message: "Le fichier n'a pas put être téléchargé", position: 'top' });
      });
      loader.present();
    });
  }

}
