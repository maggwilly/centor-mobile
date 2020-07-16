import { Component,NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';

/**
 * Generated class for the EcolesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ecoles',
  templateUrl: 'ecoles.html',
})
export class EcolesPage {
  zone: NgZone
  _concours;
  queryText=null;
  defaultAvatar = 'assets/images/placeholder.png';
  constructor(
    public navCtrl: NavController,
    public dataService: DataService,
    public notify:AppNotify,
    public storage: Storage ,
    public navParams: NavParams) {

      this.zone = new NgZone({});
  }

  ionViewDidLoad() {
    this.storage.get('_ecoles').then((data)=>{
      this._concours=data?data:[];
            this.loadData();
    },error=>{})
  }

  loadData(){
    return  this.dataService.getEcoles(0).then((data)=>{
               this._concours=data?data:[];
                this.search();
              this.storage.set('_ecoles', this._concours).then(()=>{ },error=>{})  ;
        },error=>{
          this.notify.onError({message:'Petit problème de connexion.'});
        });
  }

  doInfinite(infiniteScroll?:any) {
    this.dataService.getEcoles(this._concours.length).then(data=>{
      this.updateList(data);
     if(infiniteScroll)
         infiniteScroll.complete();
    },error=>{
           this.notify.onError({message:'Petit problème de connexion.'});
    })
  }

  updateList(array: any[]) {
    if (!(this._concours && this._concours.length)) {
      this._concours = array;
      return ;//this.storage.set('_concours', this._concours);
    }
    this.filter(array, this.queryText);
    array.forEach(item => {
      this._concours.push(item);
    });
    return ;//this.storage.set('_concours', this._concours);
  }
  doSearch() {
  return  this.dataService.getEcoles(this._concours.length).then(data => {
     // this.updateList(data);
    this._concours = data;
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    })
  }

  search() {
    this.filter(this._concours, this.queryText);
    this.doSearch().then(()=>{
    if(!(this._concours&&this._concours.length))
       return;
      this.filter(this._concours, this.queryText);
    },error => {
      this.filter(this._concours, this.queryText);
      });
    }

    showSelections(concours: any) {
      this.navCtrl.push('SelectionsPage', {targetTitle: concours.nom, ecole: concours, target: 'ecole'});
    }

    filter(array:any[],text){

    let queryText = (text) ? text.toLowerCase().replace(/,|\.|-/g, ' ') :'';
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      array.forEach(item => {
        item.hide = true;
    let matchesQueryText = false;
      if (queryWords.length) {
        // of any query word is in the session name than it passes the query test
        queryWords.forEach(queryWord => {
          if (item.nomConcours && item.nomConcours.toLowerCase().indexOf(queryWord) > -1 ||item.concours.nom&&item.concours.nom.toLowerCase().indexOf(queryWord) > -1||item.concours.ecole&&item.concours.ecole.toLowerCase().indexOf(queryWord) > -1 ||item.concours.abreviation&&item.concours.abreviation.toLowerCase().indexOf(queryWord) > -1 ) {
             matchesQueryText = true;
          }
        });
      } else {
        // if there are no query words then this session passes the query test
        matchesQueryText = true;
      }

    item.hide = !matchesQueryText;
  });
  }
}
