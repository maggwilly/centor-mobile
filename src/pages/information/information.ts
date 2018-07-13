import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppNotify } from '../../providers/app-notify';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DataService } from '../../providers/data-service';
import firebase from 'firebase';
/**
 * Generated class for the InformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  commande: any;
  abonnement:any;
  abonnementLoaded:any=false;
  ch
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      public notify: AppNotify, 
      private iab: InAppBrowser,
    public viewCtrl: ViewController,
    private socialSharing: SocialSharing,
    public dataService: DataService,) {
  }

  ionViewDidLoad() {
     this.abonnement = this.navParams.get('abonnement');
     if(!this.abonnement)
       this.getAbonnement()
    else if (this.isExpired(this.abonnement))
      this.dataService.startCommande(firebase.auth().currentUser.uid, 0, 'standard').then(data => {
        this.commande = data;
        console.log(data);
      }, error => {
        this.notify.onError({ message: 'Problème de connexion.' });
      }) 
  }

  ionViewWillLeave() {
    if (this.ch)
      this.ch.unsubscribe();
  }
  getAbonnement() {
    this.dataService.getAbonnement(firebase.auth().currentUser.uid, 0).then(data => {
      this.abonnement = data;
      this.abonnementLoaded = true;
      if (this.isExpired(this.abonnement))
        this.dataService.startCommande(firebase.auth().currentUser.uid, 0, 'standard').then(data => {
          this.commande = data;
          console.log(data);
        }, error => {
          this.notify.onError({ message: 'Problème de connexion.' });
        }) 
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    });
  }  


  help() {
    // let modal = this.modalCtrl.create('SlideCarouselPage');
    //modal.present();
    this.notify.onSuccess(
      {
        message: `Vous êtes appelé à payer les frais pour vous abonner au flux d'information et alerte sur les concours et les bourses d'étude. 
          Pour effectuer ce paiement, vous aurez besoin d'un CODE DE PAIMENT de 06 chiffres. 
          Obtenez ce  code par SMS en composant le #150*4*4*CODE_SECRET_Orange_Money#
         sur un téléphone aboné orange. Accedez ensuite à la page de paiement en appuyant 
         sur le bouton de couleur orange; Remplissez les champs sur la page
          avec le numéro de téléphone et le code de paiement.
          Utilisez le bouton "CONFIRMER" de la page pour valider.`,
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
    this. ch = this.dataService.getAbonnementObservable(firebase.auth().currentUser.uid, 0).subscribe(data => {
      this.abonnement = data.json();
      this.abonnementLoaded = true;
      if (!this.isExpired(this.abonnement) ) {
        this.notify.onSuccess({ message: "Felicitation ! Votre abonnement a été prise en compte.", position: 'top' });
        this.ch.unsubscribe();
      }
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    });

  }

  zerofill(arg:String):string{
    if(!arg)
    return '';
  
    return '';
  }
}
