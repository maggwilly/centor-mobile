import { Component, Input } from '@angular/core';
import { Utils} from '../../app/utils';
import { Storage } from '@ionic/storage';
import { ModalController} from 'ionic-angular';

/*
  Generated class for the DashboordItem component.
  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

@Component({
  selector: 'dashboord-item',
  templateUrl: 'dashboord-item.html'
})
export class DashboordItemComponent {
    @Input()
    partie: any;
     @Input()
    matiere: any;
     @Input()
   concours: any;
     @Input()
   isShow:any=false;
     @Input()
   showToggle=true;
     @Input()
   dashBoardClass='dasboard  ep';
   _analyses:any[];
    @Input()
    analyse:any;
    ref:any;
    @Input()
    authInfo:any;
  constructor(public storage: Storage,  public modalCtrl: ModalController) {
    
      }
remainDays(concours):number{
  return Utils.remaindDays(concours); 
}
/**/ 
format(s:any){
 return Utils.format(s);
}

toFixed(value:any,dec:number=0):any{
    let formated=Number(value).toFixed(dec);
    return formated;
}

openHelp(){
 // this.iab.create('http://help.centor.org/kpi.html');
  const modal = this.modalCtrl.create('HelpPage');
  modal.onDidDismiss(data => {
    window.localStorage.setItem('read-knowledge-kpi', 'readed');
  });
  modal.present();
}

noteClass(obj:any):string{
  if(!obj||obj.note==undefined)
   return 'span-value none';
   else if(obj.note<10)
  return 'span-value danger';
  else if(obj.note<12)
    return 'span-value warning';
  else if(obj.note>=12)
     return 'span-value success';
  return 'span-value none';    
}


objectifClass(obj:any):string{
  if(!obj||obj.objectif==undefined)
   return 'span-value none';
   else if(obj.objectif<20)
  return 'span-value danger';
  else if(obj.objectif<=50)
    return 'span-value warning';
  else if(obj.objectif>50)
     return 'span-value success';
  return 'span-value none';    
}

programmeClass(obj:any):string{
  if(!obj||obj.programme==undefined)
   return 'span-value none';
   else if(obj.programme<20)
  return 'span-value danger';
  else if(obj.programme<=65)
    return 'span-value warning';
  else if(obj.programme>65)
     return 'span-value success';
  return 'span-value none';    
}

}
