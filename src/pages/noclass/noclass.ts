import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the NoclassPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-noclass',
  templateUrl: 'noclass.html',
})
export class NoclassPage {
  timeout:boolean=false;
  expanded: any;
  partie:any;
   constructor(
     public navCtrl: NavController, 
     public navParams: NavParams, 
     public viewCtrl: ViewController,
     private iab: InAppBrowser,
     public modalCtrl: ModalController
    ) {
      this.partie=this.navParams.get('partie');
   }
 
   
   ionViewDidLoad() {

     setTimeout(()=>{ 
       if(!this.expanded)
           this.searchOnGoogle();
     }, 20000);  
   }
 

   searchOnGoogle() {
    this.expanded=true;
    if(!this.partie)
    return;
    let topic=this.partie.titre;
    this.iab.create("https://www.google.com/search?q="+topic,'to _self',{});
   }

   dismiss() {
    this.viewCtrl.dismiss();
  
  }   
 }
 