import { Component } from '@angular/core';
import { ViewController, App, NavParams , IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-signup-modal',
  templateUrl: 'signup-modal.html'
})
export class SignupModalPage {
 info:any;
  defaultAvatar = 'assets/images/default-avatar.jpg';
  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    public navParams: NavParams) {
    this.info = this.navParams.get('info');
  }



  completer() {
    this.viewCtrl.dismiss().then(()=>{
      this.appCtrl.getRootNav().setRoot('SettingPage');
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
