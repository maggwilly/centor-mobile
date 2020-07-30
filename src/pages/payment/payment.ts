import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  paymentdata:any;
  primarycolor:string='#065c79'
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
    this.paymentdata= this.navParams.get('paymentdata');
    console.log(this.paymentdata);
  }

  ionViewDidLoad() {}

  onFrameError($event){
    console.log($event)
  }

  onPaymentComplete($event){
    console.log($event)
    this.dismiss($event)
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

}
