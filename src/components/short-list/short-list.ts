import { Component, Input } from '@angular/core';
import { DataService } from '../../providers/data-service';
import { App} from 'ionic-angular';
import { AppNotify } from '../../providers/app-notify';
/**
 * Generated class for the ShortListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'short-list',
  templateUrl: 'short-list.html'
})
export class ShortListComponent {
  loaded:boolean=false
  @Input('target')
  target: string;
  @Input('authInfo')
  authInfo: any;
  @Input('header')
  header:string
  sessionList:any[]=[];
  @Input('styleShow')
  style: string;
  constructor(public dataService: DataService, public notify: AppNotify, public appCtrl: App) {

  }
  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.loaded = false;
    if(!this.target&&!this.authInfo){
      this.loaded = true;
      return 
    }
    this.dataService.getShortListOfSessions(this.target, this.authInfo?this.authInfo.uid:null).then((data)=>{
    this.sessionList=data;
      this.loaded=true;
  },error=>{
    console.log(error);
    this.sessionList = []
    this.notify.onError({ message: 'problème de connexion  !' });
  })
  }  

  showOptions(concours: any) {
    this.appCtrl.getRootNav().push('ConcoursOptionsPage', { concours: concours });
  }
  
}
