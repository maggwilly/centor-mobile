import { Component } from '@angular/core';
import {  NavController, NavParams,ModalController } from 'ionic-angular';
import { IonicPage} from 'ionic-angular';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-processing',
  templateUrl: 'processing.html',
})
export class ProcessingPage {
 expanded: any;
 contracted: any;
 showIcon = true;
  timeout: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.timeout = true;
    }, 40000);
  }

  expand() {
    this.expanded = true;
    this.contracted = !this.expanded;
    this.showIcon = false;
      const modal = this.modalCtrl.create('TutorialPage');
      modal.onDidDismiss(data => {
        this.expanded = false;
        this.contracted = !this.expanded;
        //window.localStorage.setItem('read-tutorial-centor', 'readed');
        this.storage.set('read-tutorial-centor', true).then(()=>{
          setTimeout(() => this.showIcon = true, 5);
        }, error => { 
         // setTimeout(() => this.showIcon = true, 5);
        });
      });
      modal.present();
    
  }

 
}
