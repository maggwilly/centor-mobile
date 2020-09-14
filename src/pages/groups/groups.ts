import {Component, NgZone, ViewChild} from '@angular/core';
import {Events, Searchbar, Platform, NavController, NavParams, LoadingController, AlertController,ModalController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {DataService} from '../../providers/data-service';
import {AppNotify} from '../../providers/app-notify';
import firebase from 'firebase';
import {IonicPage} from 'ionic-angular';
import {Subject} from "rxjs/Subject";
import {AbonnementProvider} from "../../providers/abonnement/abonnement";

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  _concours: any[] = [];
  searchTerm$ = new Subject<string>();
  authInfo: any;
  segment = 'all';
  zone: NgZone
  abonnement: any;
  notificationId: string = window.localStorage.getItem('registrationId');
  @ViewChild("searchbar") searchbar: Searchbar;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public dataService: DataService,
    public notify: AppNotify,
    public modalCtrl: ModalController,
    public abonnementProvider:AbonnementProvider,
    public events: Events,
    public platform: Platform,
  ) {
    this.zone = new NgZone({});
    this.observeAuth();
  }
  ngAfterViewInit() {
    this.dataService.search(this.searchTerm$, 'Concours')
      .subscribe(results => {
        if(!results||results.length==0)
          return;
        this._concours = results;
      });
    this.search();
  }

  private search($event?:any) {
    this.searchTerm$.next($event);
  }

  ionViewDidLoad() {
    this.storage.get('_concours').then((data) => {
      this._concours = data ? data : [];
      this.loadData();
    }, error => {
      this.loadData();
    })
  }
  observeAuth() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.getAbonnement();
      if (user) {
        unsubscribe();
      }
    });
  }
  getAbonnement() {
    this.abonnementProvider.checkAbonnementValidity(0).then(data => {
      this.abonnement = data;
    }, error => {
      this.notify.onError({message: 'Petit problème de connexion.'});
    });
  }

  openPage(page, arg?: any) {
    this.navCtrl.push(page, arg)
  }

  startabonnement() {
    this.openPage('InformationPage',{abonnement:this.abonnement});
  }

  loadData() {
    return this.dataService.getSessions(0).then((data) => {
      this._concours = data ? data : [];
      this.storage.set('_concours', this._concours).then(() => {
      }, error => {
      });
    }, error => {
      console.log(error)
      this.alert();
    });
  }

  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }


  doInfinite(infiniteScroll?: any) {
    this.dataService.getSessions(this._concours.length).then(data => {
      this.updateList(data);
      if (infiniteScroll)
        infiniteScroll.complete();
    }, error => {
      this.notify.onError({message: 'Petit problème de connexion.'});
    })
  }

  updateList(array: any[]) {
    if (!(this._concours && this._concours.length)) {
      this._concours = array;
      return;
    }
    array.forEach(item => {
      this._concours.push(item);
    });
    return;
  }



  filter(array: any[], text) {
    let queryText = (text) ? text.toLowerCase().replace(/,|\.|-/g, ' ') : '';
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    array.forEach(item => {
      item.hide = true;
      let matchesQueryText = false;
      if (queryWords.length) {
        queryWords.forEach(queryWord => {
          if (item.nomConcours && item.nomConcours.toLowerCase().indexOf(queryWord) > -1 || item.concours.nom && item.concours.nom.toLowerCase().indexOf(queryWord) > -1 || item.concours.ecole && item.concours.ecole.toLowerCase().indexOf(queryWord) > -1 || item.concours.abreviation && item.concours.abreviation.toLowerCase().indexOf(queryWord) > -1) {
            matchesQueryText = true;
          }
        });
      } else {
        // if there are no query words then this session passes the query test
        matchesQueryText = true;
      }
      let matchesSegment = false;
      if ('all' === this.segment || item.niveau === this.segment) {
        matchesSegment = true;
      }
      item.hide = !(matchesSegment && matchesQueryText);
    });
  }


  alert() {
    let alert = this.alertCtrl.create({
      message: "Il se peut que votre connexion à internet soit quelque peu perturbée. Les données n'ont pas put être chargées",
      buttons: [
        {
          text: "Ok",
          role: 'cancel'
        },
        {
          text: "Ressayer",
          role: 'cancel',
          handler: () => {
            this.loadData();
          }

        }
      ]
    });
    alert.present()
  }

  openChat(concours) {
    let modal = this.modalCtrl.create('LoginSliderPage', {redirectTo: true});
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          modal.dismiss(user);
          this.navCtrl.push('GroupchatPage', {
            groupName: concours.id,
            groupdisplayname: concours.nomConcours
          });
          this.events.publish("logged:in")
          unsubscribe();
          return;
        }
        unsubscribe();
        modal.onDidDismiss((data, role) => {
            if (data) {
              this.navCtrl.push('GroupchatPage', {
                groupName: concours.id,
                groupdisplayname: concours.nomConcours
              });
            }
          }
        )
        modal.present();
      })
    })
  }
}
