import {Component, Input} from '@angular/core';
import {DataService} from '../../providers/data-service';
import {App} from 'ionic-angular';
import {AppNotify} from '../../providers/app-notify';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'short-list',
  templateUrl: 'short-list.html'
})
export class ShortListComponent {
  loaded: boolean = false
  @Input('target')
  target: string;
  @Input('authInfo')
  authInfo: any;
  @Input('header')
  header: string
  sessionList: any[] = [];
  @Input('styleShow')
  style: string;

  constructor(public dataService: DataService, public storage: Storage, public notify: AppNotify, public appCtrl: App) {

  }

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.loaded = false;
    return this.storage.get(this.target).then(dataLocaal => {
      this.sessionList = dataLocaal ? dataLocaal : [];
      this.loaded = true;
      return this.dataService.getShortListOfSessions(this.target).then((data) => {
        this.sessionList = data?data:[];
        this.storage.set(this.target, data);
        this.loaded = true;
      }, error => {
        this.notify.onError({message: 'problème de connexion  !'});
      })
    })
  }

  showOptions(concours: any) {
    this.appCtrl.getRootNav().push('ConcoursOptionsPage', {concours: concours});
  }

}
