import { Component, NgZone } from '@angular/core';
import {Events,App, IonicPage, NavController, NavParams, Platform, LoadingController, ModalController} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import firebase from 'firebase';
import {payGardeConfig} from "../../app/app.apiconfigs";
import {AbonnementProvider} from "../../providers/abonnement/abonnement";

@IonicPage()
@Component({
  selector: 'page-ressource-details',
  templateUrl: 'ressource-details.html',
})
export class RessourceDetailsPage {
  storageDirectory: string = '';
  ch: any;
  bg: boolean = true;
  id: any;
  loaded:any;
  estateProperty: any = {}
  showMenu:any;
  zone: NgZone;
  commande: any;
  page:number = 1;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public appCtrl: App,
    public notify: AppNotify,
    public platform: Platform,
    public events: Events,
    public modalCtrl: ModalController,
    public firebaseNative: Firebase,
    public loadingCtrl: LoadingController,
    public abonnementProvider:AbonnementProvider
  ) {
    this.zone = new NgZone({});
    this.showMenu = this.navParams.get('showMenu');

  }

  ionViewWillLeave() {
    if (this.ch)
      this.ch.unsubscribe();
  }

  ionViewDidLoad() {
    this.firebaseNative.setScreemName('document_view');
    this.id = this.navParams.get('ressource_id');
    this.dataService.getOneRessource(this.id).then(data => {
      this.estateProperty = data ? data : {};
      this.loaded = true;
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }

  startCommande() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.events.publish("logged:in")
          this.createCommande();
          unsubscribe();
          return;
        }
        unsubscribe();
        let modal = this.modalCtrl.create('LoginSliderPage', {redirectTo: true});
        modal.onDidDismiss((data, role) => {
          if (data) {
            this.createCommande();
          }
        })
        modal.present();
      });
    });

  }


  private createCommande() {
    this.abonnementProvider.startCommande(this.estateProperty.id, 'ressource').then(data => {
      this.commande = data;
      if (!data.amount)
        return;
      this.firebaseNative.logEvent(`cmd_started_event`, {bundle: 'ressource', amount: this.estateProperty.price});
      return this.confirm();
    }, error => {
      this.notify.onError({message: 'Problème de connexion.'});
    })
  }

  confirm() {
    let paymentdata: any ={
      serviceid: payGardeConfig.serviceId,
      apikey:payGardeConfig.apiKey,
      orderid: this.commande.order_id,
      amount: this.commande.amount,
      acceptmultipayment:true,
      currency: 'XAF',
      payeremail: firebase.auth().currentUser.email ? firebase.auth().currentUser.email:this.commande.info.email,
      payerphone:  this.commande.info.phone
    }
    let modal=  this.modalCtrl.create('PaymentPage',{paymentdata:paymentdata} );
    modal.onDidDismiss((detail, role)=>{
      console.log(detail);
       this.commande.paid=(detail && detail.data && detail.data.status === 'PAID');
    })
    modal.present();
  }

}
