import {Component} from '@angular/core';
import {Events,IonicPage, NavController,ModalController, NavParams, ViewController} from 'ionic-angular';
import {AppNotify} from '../../providers/app-notify';
import {DataService} from '../../providers/data-service';
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
    public events: Events,
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
  listenToEvents() {
    this.events.subscribe('payement', data=>{
      this.handlePayementEvent(data);
    })}

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
  let modal=  this.modalCtrl.create('PricesPage',{price: this.price, product:0, showfree: this.abonnement} );
    modal.onDidDismiss((data, role)=>{})
    modal.present();
  }

  getAbonnement($event?:any) {
    this.abonnementProvider.checkAbonnementValidity(0).then(data => {
      this.abonnement = data;
      if($event)
        this.events.publish('payement:success', this.abonnement);
    }, error => {
      this.notify.onError({message: 'Petit problème de connexion.'});
    });
  }

  private handlePayementEvent(data) {
    if (data && data.status == 'PAID') {
      this.notify.onSuccess({message: "Felicitation ! Votre inscription a été prise en compte.", position: 'top'});
      this.getAbonnement(true);
    }
  }
}
