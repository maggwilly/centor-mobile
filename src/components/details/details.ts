import { Component,Input } from '@angular/core';
import { Utils} from '../../app/utils';


/*
  Generated class for the Details component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'details-item',
  templateUrl: 'details.html'
})
export class DetailsComponent {
    @Input()
   concours:any;
    constructor() {
     console.log('Hello Details Component');
  }


remaindDays(dateText:string):any{
  let days=Utils.remaindDays(dateText);
  let remain=Utils.remaindDays(dateText);
if(days>=30){
 remain=days%30;
  if(remain>15)
    remain=(days-remain)/30+1;
 else
   remain=(days-remain)/30
    return {nbre:remain,label:'mois',color:'secondary',text:''+remain +' mois'};
 }else if(days>=7 &&days<30){
  remain=days%7;
  if(remain>3) 
    remain=(days-remain)/7+1;
  else
   remain=(days-remain)/7;
   return {nbre:remain,label:remain>1?'semaines':'semaine',color:'orange',text:''+remain +' semaines'};
  }
  return remain>0?{nbre:remain,label:remain>1?'jours':'jour',color:'danger',text:''+remain +' jours'}:null;
}

name(url:string):string{
  if(url.includes('pdf'))
    return 'md-download';
  return 'md-open';
}


}
