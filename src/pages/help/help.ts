import { Component } from '@angular/core';
import { NavController, NavParams,ViewController  } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

showArticle(article:any){

}
  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }  

}
