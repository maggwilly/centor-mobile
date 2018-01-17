import { Component } from '@angular/core';
import { NavController,App, NavParams ,ModalController,ViewController,AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  partie:any={};

  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams, public storage: Storage,
  public modalCtrl: ModalController,
  public appCtrl: App,
  public viewCtrl: ViewController,
  public alertCtrl: AlertController,
  private iab: InAppBrowser,
  ) {
   this.partie= this.navParams.get('partie');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }




dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 

  lireCours(){
    if( this.partie.cours){
       this.iab.create(this.partie.cours);
      return;
      }  
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push('NoclassPage',{partie:this.partie})  ;
   }
}
