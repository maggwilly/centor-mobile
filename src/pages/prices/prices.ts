import {Component, NgZone, ViewChild} from '@angular/core';
import {App, IonicPage, ModalController, NavController, NavParams, Slides, ViewController} from 'ionic-angular';
import {AbonnementProvider} from "../../providers/abonnement/abonnement";
import {FcmProvider as Firebase} from "../../providers/fcm/fcm";
import {AppNotify} from "../../providers/app-notify";
import firebase from "firebase";
import {payGardeConfig} from "../../app/app.apiconfigs";

@IonicPage()
@Component({
  selector: 'page-prices',
  templateUrl: 'prices.html',
})
export class PricesPage {
  price: any;
  product: any;
  commande: any;
  bundle: any
  @ViewChild('innerSlider') innerSlider: Slides;
  zone: NgZone;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public firebaseNative: Firebase,
              public notify: AppNotify,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public appCtrl: App,
              public abonnementProvider: AbonnementProvider) {
    this.zone = new NgZone({});
    this.price = this.navParams.get('price');
    this.product = this.navParams.get('product');
  }

  slideNext(bundle) {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.bundle = bundle;
          this.innerSlider.slideNext();
          this.abonnementProvider.startCommande(this.product, bundle).then(data => {
            this.commande = data;
            this.firebaseNative.logEvent(`cmd_started_event`, {bundle: bundle, amount: data.amount});
          }, error => {
            console.log(error)
            this.notify.onError({message: 'Problème de connexion.'});
          })
          unsubscribe();
          return;
        }
        this.appCtrl.getRootNav().push('LoginSliderPage', {redirectTo: true});
      });
    })
  }

  confirmCommende() {
    if (!this.commande.amount) {
      let status = {
        status: "SUCCESS",
        order_id: this.commande.order_id
      };
      this.abonnementProvider.confirmFreeCommende(status).then(data => {
        this.dismiss(true);
      }, error => {
        this.notify.onError({message: 'Nous avons rencontré un problème !'});
      })
      return;
    }
    this.confirm();
  }

  confirm() {
    let paymentdata: any = {
      serviceid: payGardeConfig.serviceId,
      apikey: payGardeConfig.apiKey,
      orderid: this.commande.order_id,
      amount: this.commande.amount,
      payereremail: firebase.auth().currentUser.email
    }
    let modal = this.modalCtrl.create('PaymentPage', {paymentdata: paymentdata});
    modal.onDidDismiss((data, role) => {
      this.dismiss(data);
    })
    modal.present();
  }

  slidePrevious() {
    this.innerSlider.slidePrev();
    this.commande = undefined;
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }
}
