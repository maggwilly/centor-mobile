import { Component, ViewChild  } from '@angular/core';
import { Events, NavController, NavParams, Slides, ViewController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { ConcoursPage} from '../concours/concours';
import { Storage } from '@ionic/storage';
import { AppNotify} from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
import firebase from 'firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage } from 'ionic-angular';

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
  public modalCtrl: ModalController,
  private iab: InAppBrowser,
  public alertCtrl: AlertController,
  public storage: Storage ,
  public events: Events,
  public loadingCtrl: LoadingController,) {

  }

  ionViewDidEnter() {
    
     this.concours=this.navParams.get('concours'); 
     this.abonnement=this.navParams.get('abonnement');  
     this.uid= firebase.auth().currentUser.uid;
    console.log(JSON.stringify(this.concours.price));
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
        },error=>{
          this.notify.onError({ message: 'Problème de connexion.' });
        })
        break;
        case 'standard':
        this.dataService.startCommande(this.uid,this.concours.id,bundle).then(data=>{
          this.standard=data;
          this.commande=this.standard;
          this.commande.plan = bundle;
          console.log(this.commande);
          
          this.notify.onSuccess(
            {
            message: "Pour effectuer votre paiment,vous aurez besoin d'un CODE DE PAIMENT de 06 chiffres. Obtenez le par SMS en composant le #150*4*4*CODE_SECRET# sur votre telephone. Le code de paiment  est différent de votre code secret Orange Money",
            duration: 120000,
            dismissOnPageChange:true,
            showCloseButton:true,
            closeButtonText:'ok',
            cssClass:'flash-message'
          }
          );
        },error=>{
          this.notify.onError({ message: 'Problème de connexion.' });
        })
       // else this.commande=this.standard;
        break;    
      default:
      this.dataService.startCommande(this.uid,this.concours.id,bundle).then(data=>{
        this.premium=data;
        this.commande=this.premium;
        console.log(this.commande);
        this.commande.plan = bundle;
        this.notify.onSuccess(
          {
            message: "Pour effectuer votre paiment,vous aurez besoin d'un CODE DE PAIMENT de 06 chiffres. Obtenez le par SMS en composant le #150*4*4*CODE_SECRET# sur votre telephone. Le code de paiment  est différent de votre code secret Orange Money",
            duration: 120000,
            dismissOnPageChange: true,
            showCloseButton: true,
            closeButtonText: 'ok',
            cssClass: 'toast-message'
          }
        );        
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
          this.notify.onSuccess({ message: 'Vous êtes inscrit au programme !' });
          this.events.publish('payement:success');
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
    // close the menu when clicking a link from the menu
       this.navCtrl.setRoot(ConcoursPage);
  }
  
 isExpired(abonnement:any){
   if(!abonnement)
     return true;
   let now=Date.now();
   return abonnement.endDate?now>abonnement.endDate:false;
   }

  help(){
    let modal = this.modalCtrl.create('SlideCarouselPage');
    modal.present();
  }

  helpCore() {
    this.navCtrl.push('SlideCarouselPage');
    
  }  
}
