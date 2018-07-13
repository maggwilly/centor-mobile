import { Component, ViewChild  } from '@angular/core';
import { Events, NavController, NavParams, Slides, ViewController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { ConcoursPage} from '../concours/concours';
import { Storage } from '@ionic/storage';
import { AppNotify} from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
import firebase from 'firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage } from 'ionic-angular';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
@IonicPage()
@Component({
  selector: 'page-finalise',
  templateUrl: 'finalise.html'
})
export class FinalisePage {
  concours:any={};
  submitted = false;
  abonnement:any;
  status:any={status:'SUCCESS'}
  starter:any;
  standard:any;
  premium:any;
  commande:any;
  bundle:any
  uid:any;
  @ViewChild('innerSlider') innerSlider: Slides;
  public loading: any;
  constructor(
  public navCtrl: NavController,
  public navParams:NavParams, 
  public viewCtrl: ViewController, 
  public notify:AppNotify,
  public dataService:DataService,
  public firebaseNative: Firebase,
  public modalCtrl: ModalController,
  private iab: InAppBrowser,
  private socialSharing: SocialSharing,
  public alertCtrl: AlertController,
  public storage: Storage ,
  public events: Events,
  public loadingCtrl: LoadingController,) {
    this.firebaseNative.setScreemName('payment_page');
  }

  ionViewDidEnter() {
     this.concours=this.navParams.get('concours'); 
     this.abonnement=this.navParams.get('abonnement');  
     this.uid= firebase.auth().currentUser.uid;
  }


  goBack() {;
    if(this.commande)
    this.dataService.cancelCommande(this.commande.id).then(data=>{
    },error=>{})
     this.dismiss();
   }


   slideNext(bundle:any) {
    this.bundle=bundle;
    this.innerSlider.slideNext();
    switch (bundle) {
      case 'starter':
        this.dataService.startCommande(this.uid,this.concours.id,bundle).then(data=>{
          this.starter=data;
          this.commande=this.starter;
          this.commande.plan = bundle;
          this.firebaseNative.logEvent('free_plan_start',{price:0});
        },error=>{
          this.notify.onError({ message: 'Problème de connexion.' });
        })
        break;
        case 'standard':
        this.dataService.startCommande(this.uid,this.concours.id,bundle).then(data=>{
          this.standard=data;
          this.commande=this.standard;
          this.commande.plan = bundle;
          this.firebaseNative.logEvent('standard_plan_start', { price: this.concours.price.standard });         
        },error=>{
          this.notify.onError({ message: 'Problème de connexion.' });
        })
        break;    
      default:
      this.dataService.startCommande(this.uid,this.concours.id,bundle).then(data=>{
        this.premium=data;
        this.commande=this.premium;
        this.firebaseNative.logEvent('premium_plan_start', { price: this.concours.price.premium });
        this.commande.plan = bundle;       
      },error=>{
        this.notify.onError({ message: 'Problème de connexion.' });
      }) 
    //  else this.commande=this.premium;  
        break;
    }
  }


  confirmCommende(){
    switch (this.commande.plan) {
      case 'starter':
        let status = {
          status: "SUCCESS",
          notif_token: "dd497bda3b250e536186fc0663f32f40",
          txnid: "CENTOR_" + this.commande.id
        };
        this.dataService.confirmCommande(this.commande.id, status).then(data => {
          this.dismiss();
        }, error => {
          this.notify.onError({ message: 'Nous avons rencontré un problème !' });
        })    
        break;
      default:
       this.iab.create(this.commande.data.payment_url);
        this.dismiss();
        break;
    }

  }

  slidePrevious() {
    this.innerSlider.slidePrev();
    if(this.commande)
    this.dataService.cancelCommande(this.commande.id).then(data=>{
    },error=>{})
    this.commande=undefined;
  }

dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  }  

openConcours() {
       this.navCtrl.setRoot(ConcoursPage);
  }
  
 isExpired(abonnement:any){
   if(!abonnement)
     return true;
   let now=Date.now();
   return abonnement.endDate?now>abonnement.endDate:false;
   }

  help(){
   // let modal = this.modalCtrl.create('SlideCarouselPage');
    //modal.present();
    this.notify.onSuccess(
      {
        message: `Vous êtes appelé à payer les frais pour vous inscrire à ce programme de préparation. 
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

  payForMe(){
    let textMessage =
      `CMD.` + this.commande.id;
    this.socialSharing.share(textMessage, null, null, this.commande.data.payment_url)
      .catch((error) => {
      })
  }

  helpCore() {
    this.navCtrl.push('SlideCarouselPage');
    
  }  
}
