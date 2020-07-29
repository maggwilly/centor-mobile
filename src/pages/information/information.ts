import {Component} from '@angular/core';
import {IonicPage, NavController,ModalController, NavParams, ViewController} from 'ionic-angular';
import {AppNotify} from '../../providers/app-notify';
import {DataService} from '../../providers/data-service';
import firebase from 'firebase';
import {AbonnementProvider} from "../../providers/abonnement/abonnement";

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  abonnement: any;
  price: any;
  ch:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notify: AppNotify,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public abonnementProvider:AbonnementProvider,
    public dataService: DataService,) {
    this.abonnement= this.navParams.get('abonnement');
  }


  ionViewDidLoad() {
   this.abonnementProvider.loadPrice(0).then(price =>{
    this.price =price;
   }, err=>{
     console.log(err);
     this.notify.onError({message: 'Problème de connexion.'});})
  }

  ionViewWillLeave() {
    if (this.ch)
      this.ch.unsubscribe();
  }


  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }

  processPayment() {
  let modal=  this.modalCtrl.create('PricesPage',{price: this.price, product:0} );
    modal.onDidDismiss((data, role)=>{

    })
    modal.present();
  }


  zerofill(arg: String): string {
    if (!arg)
      return '';
    return '';
  }
}
