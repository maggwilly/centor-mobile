import { Component } from '@angular/core';
import { NavController, NavParams ,ViewController,ModalController} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-abonnement',
  templateUrl: 'abonnement.html'
})
export class AbonnementPage {
  abonnementExpired: any;  
 abonnement:any;
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

    
   dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 


 isExpired(abonnement:any){
   if(!abonnement)
     return true;
  let now=Date.now();
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
    this.dataService.getAbonnementOneObservable(this.abonnement.id).subscribe(data => {
      this.abonnement = data.json();
      if (this.abonnementExpired && !this.isExpired(this.abonnement))
        this.notify.onError({ message: "Felicitation ! Votre renouvellement a été pris en compte.",position:'top' });
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    });
  }
}
