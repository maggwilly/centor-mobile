import { Component, NgZone } from '@angular/core';
import { Events, NavController, NavParams, ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-matiere-details',
  templateUrl: 'matiere-details.html'
})

export class MatiereDetailsPage {
  matiere: any;
  analyse: any;
  matiereToUpdate;
  concours: any;
  isShow: boolean = false;
  authInfo: any;
  zone: NgZone;
  loaded: boolean= false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dataService: DataService,
    public storage: Storage,
    public events: Events,
    public notify: AppNotify,
    public viewCtrl: ViewController) {
    
    this.isShow = false;
    this.zone = new NgZone({});
    this.authInfo = firebase.auth().currentUser;
  }


  ionViewDidEnter() {
    this.listenToEvents();
    this.initPage();
  }
  /** Compare le score et le temps de reponse */
  initPage() {
    this.matiereToUpdate = this.navParams.get('matiere');
    this.matiere = Object.assign({}, this.matiereToUpdate);
    this.concours = this.matiere.concours;
    this.observeAuth(false);
    this.setParties();

  }


  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  listenToEvents() {
    this.events.subscribe('score:partie:updated', (data) => {
      this.zone.run(() => {
        this.analyse = data.matiere;
        this.matiereToUpdate.analyse = data.matiere;
        this.events.publish('score:matiere:updated', data);
        this.isShow = true;
        this.storage.set('_parties_' + this.matiere.id, this.matiere.parties).catch(error => { });
      });
    });

  }

  observeAuth(loading: boolean = false) {
    
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authInfo = user
        this.getAnalyse(loading);
      } else {
        this.authInfo = undefined;
      }
    });
  }




  setParties() {
    return this.storage.get('_parties_' + this.matiere.id)
      .then((data) => {
        this.matiere.parties = data ? data : [];
        //if (!this.matiere.parties || !this.matiere.parties.length) 
          return this.loadOnline();
       
      }).catch(error => {
        return this.loadOnline();
      });;
  }

  loadOnline() {
    this.loaded = false;
    return this.dataService.getParties(this.matiere.contenu)
      .then((data) => {
        this.matiere.parties = data;
        this.loaded = true;
           this.storage.set('_parties_' + this.matiere.id, this.matiere.parties);
      }, error => {
        this.loaded = false;
        this.notify.onError({ message: 'Petit problème de connexion.' });
      });

  }
  getAnalyse(show: boolean = true) {
    this.loaded = false;
    return this.dataService.getAnalyseObservable(this.authInfo.uid, this.matiere.concours.id, this.matiere.id, 0).subscribe((analyse) => {
      this.analyse = analyse;
      this.loaded = true;
      this.matiere.analyse = analyse;
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    });
  }



  /** Compare le score et le temps de reponse */
  show(partie: any) {
    partie.matiere.concours = { id: this.matiere.concours.id, nom: this.matiere.concours.nom };
    partie.matiere.titre = this.matiere.titre;
    partie.matiere.id = this.matiere.id;
   // console.log(this.concours);
    console.log(partie.matiere.id);
    this.navCtrl.push('ScorePage', { partie: partie });
  }

 

  getClass(obj: any): string {
    if (!obj || obj.objectif == undefined)
      return 'none';
    else if (obj.objectif < 20)
      return 'danger';
    else if (obj.objectif < 50)
      return 'warning';
    else if (obj.objectif > 50)
      return 'success';
    return 'none';
  }

}
