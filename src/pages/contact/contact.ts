import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
 _contacts:any;

 constructor(
   public navCtrl: NavController,
   public storage: Storage , 
   public loadingCtrl: LoadingController,
    public notify:AppNotify, 
 ) {

  }

  ionViewDidLoad() {
     this.storage.get('_contacts').then((data)=>{
               this. _contacts=data;
                   if( !this._contacts){
 
            }    
            firebase.database().ref('/references/contacts').once('value',(contacts)=>{
          if(contacts.val()){
           this._contacts=contacts.val();     
               this.storage.set('_contacts', this._contacts)
          } 

      },error=>{

          this.notify.onError({message:'Petit problème de connexion.'});
      });;     
    });
  }
}
