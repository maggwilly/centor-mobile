import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
/**
 * Generated class for the RessourcesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ressources',
  templateUrl: 'ressources.html',
})
export class RessourcesPage {
  concours:any
  ressources:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public notify: AppNotify,) {
    this.concours = this.navParams.get('concours');
  }

  ionViewDidLoad() {
    this.dataService.getRessources(this.concours.id).then(data=>{
      this.ressources=data?data:[];
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }

openRessource(ressource:any){
  this.navCtrl.push('RessourceDetailsPage',{ressource:ressource});
}


}
