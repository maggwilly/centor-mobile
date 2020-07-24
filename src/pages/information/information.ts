import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AppNotify} from '../../providers/app-notify';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {SocialSharing} from '@ionic-native/social-sharing';
import {DataService} from '../../providers/data-service';
import firebase from 'firebase';
import {AbonnementProvider} from "../../providers/abonnement/abonnement";

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  commande: any;
  abonnement: any;
  abonnementLoaded: any = false;
  ch
   paymentdata: any ={
     serviceid: '576c98f1-06b0-4e5d-88a1-b9311cd3a001',
     orderid: 'CMD12090',
     amount: 5000.0,
     lang: 'FR',
     currency: 'XAF',
     acceptpartialpayment: true,
     payerphone: '+237694210203',
     payereremail: 'williams.penka@gmail.com'
   }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notify: AppNotify,
    private iab: InAppBrowser,
    public viewCtrl: ViewController,
    private socialSharing: SocialSharing,
    public abonnementProvider:AbonnementProvider,
    public dataService: DataService,) {
  }

  onPaymentCancel($event){
    console.log($event)
  }

  ionViewDidLoad() {
    this.abonnementProvider.checkAbonnementStatus(0).then(expired=>{
      if(expired)
        this.dataService.startCommande(firebase.auth().currentUser.uid, 0, 'standard').then(data => {
          this.commande = data;
        }, error => {
          this.notify.onError({message: 'Problème de connexion.'});
        });
      else this.getAbonnement();
    });
  }

  ionViewWillLeave() {
    if (this.ch)
      this.ch.unsubscribe();
  }

  getAbonnement() {
    this.dataService.checkAbonnementValidity(firebase.auth().currentUser.uid, 0).then(data => {
      this.abonnement = data;
      this.abonnementLoaded = true;
    }, error => {
      this.abonnementLoaded = true;
      this.notify.onError({message: 'Petit problème de connexion.'});
    });
  }


  help() {
    this.notify.onSuccess(
      {
        message: `Obtenez le CODE DE PAIMENT de 06 chiffrespar SMS en composant le #150*4*4*CODE_SECRET_Orange_Money#.`,
        duration: 120000,
        dismissOnPageChange: true,
        showCloseButton: true,
        closeButtonText: 'ok',
        cssClass: 'flash-message'
      }
    );
  }

  payForMe() {
    let textMessage =
      `CMD.` + this.commande.id;
    this.socialSharing.share(textMessage, null, null, this.commande.data.payment_url)
      .catch((error) => {
      })
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

  confirmCommende() {
    this.iab.create(this.commande.data.payment_url);
    this.checkAbonnement();
  }


  checkAbonnement() {
    this.ch = this.dataService.getAbonnementObservable(0).subscribe(data => {
      this.abonnement = data.json();
      this.abonnementLoaded = true;
      if (!this.isExpired(this.abonnement)) {
        this.notify.onSuccess({message: "Felicitation ! Votre abonnement a été prise en compte.", position: 'top'});
        this.ch.unsubscribe();
      }
    }, error => {
      this.notify.onError({message: 'Problème de connexion.'});
    });

  }

  zerofill(arg: String): string {
    if (!arg)
      return '';

    return '';
  }
}
