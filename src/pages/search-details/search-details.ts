import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-details',
  templateUrl: 'search-details.html',
})
export class SearchDetailsPage {
 result:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.result=this.navParams.get('searchResult');
  }

  ionViewDidLoad() {

  }

}
