import { Component, ViewChild } from '@angular/core';
import { Events, Searchbar, Platform, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import firebase from 'firebase';
import { IonicPage } from 'ionic-angular';

/**
 * Generated class for the ResultatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public notify: AppNotify,
    public events: Events,
    public platform: Platform,
  ) {

  }



  ionViewDidLoad() {
    let searchText = this.navParams.get('searchText');
      this.storage.get('_resultats').then((data) => {
        this._resultats = data ? data : [];
      if (!this.platform.is('core'))
          this.loadData();
        else
          this.doSearch();
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
        this.search(this.queryText);
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

  doSearch() {
    return this.dataService.getResultats(this._resultats.length, true).then(data => {
      // this.updateList(data);
       this._resultats = data;
      this.storage.set('_resultats', this._resultats).then(() => { }, error => { });
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }

  updateList(array: any[]) {
    if (!(this._resultats && this._resultats.length)) {
      this._resultats = array;
        return this.storage.set('_resultats', this._resultats);
    }
    let queryText = this.queryText ? this.queryText.toLowerCase().replace(/,|\.|-/g, ' ') : '';
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    array.forEach(item => {
      item.hide = true;
      this.filter(item, queryWords);
      this._resultats.push(item);
    });
      return this.storage.set('_resultats', this._resultats);
  }

  search(text?: any) {
    this.doSearch().then(() => {
      if (!(this._resultats && this._resultats.length))
        return;
      let queryText = (text) ? text.toLowerCase().replace(/,|\.|-/g, ' ') : this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      this._resultats.forEach(item => {
        item.hide = true;
        this.filter(item, queryWords);

      });
    });
  }


  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.url && item.url.toLowerCase().indexOf(queryWord) > -1 || item.description && item.description.toLowerCase().indexOf(queryWord) > -1 ) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }


 
}

