import { Component} from '@angular/core';
import { App, ModalController, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage } from 'ionic-angular';
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

expand(pb:boolean=true) {
  this.expanded = true;
  this.contracted = !this.expanded;
  this.showIcon = false;
  setTimeout(() => {
    const modal = this.modalCtrl.create('AbaoutUsPage',{pb:pb});
    modal.onDidDismiss(data => {
      this.expanded = false;
      this.contracted = !this.expanded;
      window.localStorage.setItem('read-knowledge-centor','readed');
      setTimeout(() => this.showIcon = true, 2000);
    });
    modal.present();
  },         10);
}

}
