import { Component } from '@angular/core';
import { NavController, NavParams,ViewController} from 'ionic-angular';
import { Utils} from '../../app/utils';
import { IonicPage } from 'ionic-angular';
/*
  Generated class for the Popup page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-popup',
  templateUrl: 'popup.html'
})
export class PopupPage {
  option: string;
  question:any;
  questionNumber;
  time;
  partie;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  this.option=this.navParams.get('option');
  this.questionNumber=this.navParams.get('questionNumber');
  this.question=this.navParams.get('question');
  this.time=this.navParams.get('time');
    this.partie=this.navParams.get('partie');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopupPage');
  }
format(s,hrSep='h ',minSep='min'):string{
   return Utils.format(s,hrSep,minSep);
}

 dismiss() {
    this.viewCtrl.dismiss();
  }
}
