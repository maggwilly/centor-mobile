import { NgZone, Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { App } from 'ionic-angular';
/**
 * Generated class for the SelectionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-selections',
  templateUrl: 'selections.html',
})
export class SelectionsPage {
  target
  targetTitle
  ecole:any;
  loaded=false;
  _concours: any[] = [];
  authInfo: any;
  zone: NgZone
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public dataService: DataService,
    public storage: Storage,
    public notify: AppNotify,
    public appCtrl: App ) {
    this.target = this.navParams.get('target');
    this.targetTitle = this.navParams.get('targetTitle');
    this.ecole = this.navParams.get('ecole');
    this.zone = new NgZone({});
    this.observeAuth();
  }


  ionViewDidLoad() {
   /* this.storage.get('_concours_'+this.target).then((data)=>{
      this._concours=data?data:[];
            this.loadData();
    },error=>{

    }) */
  }

  loadData() {
    let id=this.ecole?this.ecole.id:0
    return this.dataService.getSelectedSessions(id,this.target).then((data) => {
      this._concours = data ? data : [];
      this.loaded=true;
      this.storage.set('_concours_'+this.target, this._concours).then(() => { }, error => { });
    }, error => {
       this.notify.onError({message:'Petit problème de connexion.'});
    });
  }

  observeAuth(){
    const  unsubscribe=firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    this.authInfo = user;
        unsubscribe();
  } else {
    this.authInfo = undefined;
  }
  });
  }

  showOptions(concours: any) {
    this.appCtrl.getRootNav().push('ConcoursOptionsPage', { concours: concours });
  }
}
