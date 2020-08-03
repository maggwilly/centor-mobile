import { Component, ViewChild } from '@angular/core';
import { Events, Searchbar, Platform, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { IonicPage } from 'ionic-angular';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import {Subject} from "rxjs/Subject";

@IonicPage()
@Component({
  selector: 'page-resultats',
  templateUrl: 'resultats.html',
})
export class ResultatsPage {
  _resultats: any[] = [];
 queryText = null;
  authInfo: any;
  @ViewChild("searchbar") searchbar: Searchbar;
  searchTerm$ = new Subject<string>();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public notify: AppNotify,
    public events: Events,
    public firebaseNative: Firebase,
    public platform: Platform,

  ) {
  //  this.firebaseNative.setScreemName('document_list');
  }

  ngAfterViewInit() {
    this.dataService.search(this.searchTerm$, 'Resultat')
      .subscribe(results => {
        if(!results||results.length==0)
          return;
        this._resultats = results;
      });
    this.searchTerm$.next('Resultat');
  }


  ionViewDidLoad() {
      this.storage.get('_resultats').then((data) => {
        this._resultats = data ? data : [];
      if (!this.platform.is('core'))
          this.loadData();
      }, error => { })
  }



  observeAuth() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authInfo = user;
        unsubscribe();
      } else {
        this.authInfo = undefined;
        unsubscribe();
      }
    });
  }


  loadData() {
    return this.dataService.getResultats(0).then((data) => {
      this._resultats = data ? data : [];
        this.storage.set('_resultats', this._resultats).then(() => { }, error => { });
    }, error => {
      this.notify.onError({ message: 'problème de connexion.' });
    });
  }



  doInfinite(infiniteScroll?: any) {
    this.dataService.getResultats(this._resultats.length).then(data => {
      this.updateList(data);
        this.storage.set('_resultats', this._resultats).then(() => { }, error => { });
      if (infiniteScroll)
        infiniteScroll.complete();
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }



  updateList(array: any[]) {
    if (!(this._resultats && this._resultats.length)) {
      this._resultats = array;
        return this.storage.set('_resultats', this._resultats);
    }
      return this.storage.set('_resultats', this._resultats);
  }


}

