import { Component} from '@angular/core';
import { App, ModalController, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook'
export interface PageInterface {
  title: string;
  link: string;
  icon: string;
}
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  appPages: PageInterface[] = [
    { title: 'A propos de centor', link: 'http://abaout.centor.org', icon: 'information-circle' },
    { title: "Obtenir de l'aide", link: 'http://help.centor.org', icon: 'help-circle' },
    { title: "Conditions d'utilisation", link: 'http://condition.centor.org', icon: 'ios-finger-print' },
  ];

 expanded: any;
 contracted: any;
 showIcon = true;
 preload  = true;
 constructor(
    private iab: InAppBrowser,
   private facebook: Facebook,
     public appCtrl: App, 
     public navCtrl: NavController,
     private modalCtrl: ModalController 
 ) {

  }

  ionViewDidLoad() {  
  }

  openHelp(link:PageInterface){
    this.iab.create(link.link);
}
openContact(){
  // close the menu when clicking a link from the menu
  this.navCtrl.push('ContactPage');
}

  appInvite(){
   this.facebook.appInvite(
     {
       url:'https://play.google.com/store/apps/details?id=com.centor.mobile.app',
       picture:'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fapp-features2.png?alt=media&token=9a8a1c97-55cf-410a-af34-52ce9df3a8dc'
  }
).then((data)=>{
     console.log('invited');
})
  }

}
