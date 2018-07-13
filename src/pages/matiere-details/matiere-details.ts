import { Component, NgZone } from '@angular/core';
import { Events, NavController, NavParams, ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { IonicPage } from 'ionic-angular';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';

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
    public firebaseNative: Firebase,
    public viewCtrl: ViewController) {
    this.firebaseNative.setScreemName('matiere_start');
    this.isShow = false;
    this.zone = new NgZone({});
    this.authInfo = firebase.auth().currentUser;
  }


  ionViewDidLoad() {
    this.listenToEvents();
    this.initPage();
  }
  
  ionViewDidEnter() {
    this.observeAuth();
  }  
  /** Compare le score et le temps de reponse */
  initPage() {
    this.matiereToUpdate = this.navParams.get('matiere');
    this.matiere = Object.assign({}, this.matiereToUpdate);
    this.concours = this.matiere.concours;
    this.observeAuth();
    this.loadOnline()
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

  observeAuth(loading: boolean = true) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authInfo = user
        this.getAnalyse(loading);
      } else {
        this.authInfo = undefined;
      }
    });
  }


  loadOnline() {
    return this.storage.get('_Matieres_' + this.concours.id + '_' + this.matiere.contenu).then(data => {
         this.matiere.parties = data;
        return this.dataService.getParties(this.matiere.contenu, this.concours.id, this.matiere.id)
      .then((data) => {
        this.matiere.parties = data;
        this.storage.set('_Matieres_' + this.concours.id + '_' + this.matiere.contenu, this.matiere.parties)
        this.loaded = true;
      }, error => {
        this.notify.onError({ message: 'Petit problème de connexion.' });
      });
    });     

  }

 openRessource(ressource:any){
  this.navCtrl.push('RessourceDetailsPage',{ressource:ressource});
 }

  
  getAnalyse(show: boolean) {
    return this.storage.get('_analyse_Matiere_' + this.concours.id+'_' + this.matiere.id).then(data => {
       this.analyse = data;
       this.matiere.analyse = data;
       this.loaded = show;
     return this.dataService.getAnalyseObservable(this.authInfo.uid, this.matiere.concours.id, this.matiere.id, 0).subscribe((analyse) => {
      this.analyse = analyse;
      this.loaded = true;
      this.matiere.analyse = analyse;
       this.storage.set('_analyse_Matiere_' + this.concours.id + '_' + this.matiere.id, analyse);
    }, error => {
      this.loaded = show;
      this.notify.onError({ message: 'Petit problème de connexion.' });
    });
    });
  }



  /** Compare le score et le temps de reponse */
  show(partie: any) {
 if (!partie.isAvalable)
      return this.navCtrl.push('StartPage', { partie: partie });
    partie.matiere=this.matiere;
    partie.matiere.concours = { id: this.concours.id, nom: this.concours.nomConcours, nomConcours: this.concours.nomConcours };
    partie.matiere.titre = this.matiere.titre;
    partie.matiere.id = this.matiere.id;

    this.navCtrl.push('ScorePage', { partie: partie });
  }

  openChat() {
    this.navCtrl.push('GroupchatPage', { groupName: this.concours.id, groupdisplayname: this.concours.nomConcours });
  }

  getClass(obj: any): string {
    if (!obj || obj.note == undefined)
      return 'none';
    else if (obj.note < 5)
      return 'danger';
    else if (obj.note < 10)
      return 'warning';
    else if (obj.note > 10)
      return 'success';
    return 'none';
  }

alert() {
  let alert = this.alertCtrl.create({
    subTitle: "Cette partie du programme n'est pas encore activée.",
    message:"Cette partie du programme est encore verrouillée. Continuez de travailler sur la partie précedente.",
    buttons: [
      {
        text: "Ok merci",
        role: 'cancel'
      }
      
    ]
  });
return  alert.present()
}
}
