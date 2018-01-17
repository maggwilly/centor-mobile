import { Component , Input} from '@angular/core';
import { NavController, NavParams ,ModalController } from 'ionic-angular';
import { App } from 'ionic-angular';
/*
  Generated class for the ConcoursList component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'concours-list',
  templateUrl: 'concours-list.html'
})
export class ConcoursListComponent {
    @Input()
   concoursList:any[];
   authInfo
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public modalCtrl: ModalController,
      public appCtrl: App) {

  }

showContenu(concours:any){
  if(concours.abonnement)
    this.appCtrl.getRootNav().push('MatieresPage',{concours:concours});
      else
      this.showOptions(concours);
}
  showOptions(concours: any) {
    this.appCtrl.getRootNav().push('ConcoursOptionsPage', { concours: concours });
  }


}
