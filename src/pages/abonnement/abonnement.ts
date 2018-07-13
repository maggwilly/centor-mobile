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
    console.log('ionViewDidLoad AbonnementPage');
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

 renouveller(){
   let modal = this.modalCtrl.create('FinalisePage', { abonnement: this.abonnement, concours: this.abonnement.session})  ;
   modal.onDidDismiss((data)=>{
     this.checkAbonnement();
     });
   modal.present();
 }

  checkAbonnement() {
    this.abonnementExpired = this.isExpired(this.abonnement)
   this. ch= this.dataService.getAbonnementOneObservable(this.abonnement.id).subscribe(data => {
      this.abonnement = data.json();
      if (this.abonnementExpired && !this.isExpired(this.abonnement)){
        this.ch.unsubscribe();
        this.notify.onError({ message: "Felicitation ! Votre renouvellement a été pris en compte.", position: 'top' });
      }

    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
      this.ch.unsubscribe();
    });
  }
}
