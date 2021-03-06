import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { Storage } from '@ionic/storage';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';


@IonicPage()
@Component({
  selector: 'page-ressources',
  templateUrl: 'ressources.html',
})
export class RessourcesPage {
  concours:any
  ressources:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseNative: Firebase,
    public dataService: DataService,
    public modalCtrl: ModalController,
    public notify: AppNotify,
     public storage: Storage
    ) {
    this.concours = this.navParams.get('concours');
    this.firebaseNative.setScreemName('document_list');
  }

  ionViewDidLoad() {
    this.storage.get('_ressources_' + this.concours.id).then((data)=>{
      this.ressources = data ;
      this.dataService.getSessionRessources(this.concours.id).then(data => {
        this.ressources = data ? data : [];
        this.storage.set('_ressources_' + this.concours.id, data);
      }, error => {
        this.notify.onError({ message: 'Problème de connexion.' });
      })
    })
  }

openRessource(ressource:any){
  this.navCtrl.push('RessourceDetailsPage',{ressource_id:ressource.id});
}

  openSearchPage() {
    this.modalCtrl.create('SearchPage', {queryText:"Document"} )
      .present();
  }

}
