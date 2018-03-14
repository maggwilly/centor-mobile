import { Component } from '@angular/core';
import { NavController,App, NavParams ,ModalController,ViewController,AlertController} from 'ionic-angular';
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
  public navParams: NavParams,
  public modalCtrl: ModalController,
  public appCtrl: App,
  public viewCtrl: ViewController,
  public alertCtrl: AlertController,

  ) {
   this.partie= this.navParams.get('partie');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }




dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 

}
