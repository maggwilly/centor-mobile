import { Component } from '@angular/core';
import { NavController, NavParams ,ViewController,ModalController} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { IonicPage } from 'ionic-angular';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-abonnement',
  templateUrl: 'abonnement.html'
})
export class AbonnementPage {
  abonnementExpired: any;
  abonnement:any;
  ch: any;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
     public notify: AppNotify,
    public dataService: DataService,
    public navParams: NavParams) {}


  ionViewDidLoad() {
    this.abonnement=this.navParams.get('abonnement') ;   }
  ionViewWillLeave() {
    if (this.ch)
      this.ch.unsubscribe();
  }

   dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  }


 isExpired(abonnement:any){
   if(!abonnement)
     return true;
   let now = firebase.database.ServerValue.TIMESTAMP;
  let endDate=new Date(abonnement.endDate).getTime();
   return now>endDate;
   }

}
