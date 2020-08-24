import {Component, NgZone, ViewChild} from '@angular/core';
import {Events,App, IonicPage, ModalController, NavController, NavParams, Slides, ViewController} from 'ionic-angular';
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
  showfree: any;
  commande: any;
  bundle: any
  @ViewChild('innerSlider') innerSlider: Slides;
  zone: NgZone;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public firebaseNative: Firebase,
              public notify: AppNotify,
              public viewCtrl: ViewController,
              public events: Events,
              public modalCtrl: ModalController,
              public appCtrl: App,
              public abonnementProvider: AbonnementProvider) {
    this.zone = new NgZone({});
    this.price = this.navParams.get('price');
    this.product = this.navParams.get('product');
    this.showfree = this.navParams.get('showfree');
  }

  slideNext(bundle) {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.bundle = bundle;
          this.events.publish("logged:in")
          this.innerSlider.slideNext();
          this.createCommande(bundle);
          unsubscribe();
          return;
        }
        unsubscribe();
        let modal = this.modalCtrl.create('LoginSliderPage', {redirectTo: true});
        modal.onDidDismiss((data, role) => {
          if (data) {
            this.bundle = bundle;
            this.innerSlider.slideNext();
            this.createCommande(bundle);

          }
        })
        modal.present();
      });
    })
  }

  private createCommande(bundle) {
    this.abonnementProvider.startCommande(this.product, bundle).then(data => {
      console.log(data)
      this.commande = data;
      this.firebaseNative.logEvent(`cmd_started_event`, {bundle: bundle, amount: data.amount});
    }, error => {
      this.notify.onError({message: 'Problème de connexion.'});
    })
  }

  confirmCommende() {
    if (!this.commande.amount) {
      console.log(this.commande)
      this.abonnementProvider.confirmFreeCommende({status: "PAID",orderid: this.commande.order_id})
        .then(data => {
          if(data&&data.abonnement)
              this.dismiss({status: "PAID", amount:0});
          else throw 'Nous avons rencontré un problème !';
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
      currency: 'XAF',
      payeremail: firebase.auth().currentUser.email || this.commande.info.email,
      payerphone:  this.commande.info.phone
    }
    let modal = this.modalCtrl.create('PaymentPage', {paymentdata: paymentdata});
    modal.onDidDismiss((data) => {
         this.dismiss(data);
    })
    modal.present();
  }

  slidePrevious() {
    this.innerSlider.slidePrev();
    this.commande = undefined;
  }

  dismiss(data?: any) {
    this.events.publish('payement',data);
    this.viewCtrl.dismiss(data);
  }
}
