import { Injectable } from '@angular/core';
import {  Http ,  Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { AppNotify } from '../providers/app-notify';
import firebase from 'firebase';
@Injectable()
export class DataService {
data: any;
  private headers = new Headers({ 'Content-Type': 'application/json'});
  _baseUrl = 'https://concours.centor.org/v1/'
  constructor(public http: Http, public storage: Storage, public events: Events, public notify: AppNotify,) {
    this.storage.get('_baseUrl').then(data => {
      this._baseUrl = data ? data : this._baseUrl;
    }, error => {
      this.notify.onError({ message: JSON.stringify(error) }); 
    });
  }

 /*Recherche la date de derniere mise a jour*/
 getAffiches(){
  return  this.http.get(this._baseUrl+'formated/pub/json',  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());    
 
}

  getUserUID() {
    return firebase.auth().currentUser ? firebase.auth().currentUser.uid:'';
  }
 /*Recherche la date de derniere mise a jour*/


 /*Recherche la date de derniere mise a jour*/
 getSessions(start:number,all?:boolean,order?:string){
   return this.http.get(this._baseUrl + 'formated/session/json?all=' + all + '&order=' + order + '&start=' + start,  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());    
 
}

  /*Recherche la date de derniere mise a jour*/
  getResultats(start: number, all?: boolean, order?: string) {
    return this.http.get(this._baseUrl + 'formated/resultat/json?all=' + all + '&order=' + order + '&start=' + start, { headers: this.headers })
      .toPromise()
      .then(response => response.json());

  }
  /*Recherche la date de derniere mise a jour*/
  getShortListOfSessions(tartget:string,uid?: any,) {
    let url:string=''
    switch (tartget) {
      case 'recents':
        url = this._baseUrl + 'formated/session/recentment/lances/json'
        break;
      case 'en_vus':
        url = this._baseUrl + 'formated/session/plus/en/vus/json'
        break; 
      case 'owards':
        url = this._baseUrl + 'formated/session/owards/json'
        break;         
      default:
        url = this._baseUrl + 'formated/session/for/user/' + uid + '/json' +'?uid= ' + this.getUserUID()
        break;
    }
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }


 /*Recherche la date de derniere mise a jour*/
  getMessages(registrationId: any, uid?: string, start?: number,all?:boolean){
    
    return this.http.get(this._baseUrl + 'formated/sending/json?all=' + all + '&registrationId=' + registrationId + '&uid=' + uid  + '&start=' + start,  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());    
    
}

 /*Recherche la date de derniere mise a jour*/
 readMessage(id:number,notificationId?:any,registrationId?:any){
   return this.http.get(this._baseUrl + 'formated/sending/edit/message/' + id + '/json?notificationId=' + notificationId + '&registrationId=' + registrationId,  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());    
 
}
 /*Recherche la date de derniere mise a jour*/
getShowArticle(id:number){
  return this.http.get(this._baseUrl + 'formated/article/' + id + '/show/json' + '?uid= ' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());    
    
}

  /*Recherche la date de derniere mise a jour*/
  getShowNotification(id: number, registrationId?:any) {
    return this.http.get(this._baseUrl + 'formated/notification/' + id + '/show/json?registrationId='+ registrationId+'&uid= ' + this.getUserUID(), { headers: this.headers })
      .toPromise()
      .then(response => response.json());

  }


 /*Recherche la date de derniere mise a jour*/
 addRegistration(registrationId:string,registration:any){
   return this.http.post(this._baseUrl +'formated/registration/'+registrationId+'/new/json',JSON.stringify(registration ),  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());    
}



 /*Recherche la date de derniere mise a jour*/
 getShowSession(id:number){
   
   return this.http.get(this._baseUrl + 'formated/session/' + id + '/show/json' + '?uid= ' + this.getUserUID(),  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());    
 
}

 /*Recherche la date de derniere mise a jour*/
getMatieres(programme:number){
  return this.http.get(this._baseUrl + 'formated/matiere/' + programme + '/json' + '?uid=' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());    
    
}


  getParties(contenu: number, session: number, matiere: number){1
    return this.http.get(this._baseUrl + 'formated/partie/' + contenu + '/json' + '?session=' + session + '&matiere=' + matiere+ '&uid=' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());    
    
}

 /*Recherche la date de derniere mise a jour*/
getQuestions(qcm:number){
  return this.http.get(this._baseUrl + 'formated/question/' + qcm + '/json' + '?uid= ' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());    
    
}


  /*Recherche la date de derniere mise a jour*/
  getRessources(session: any) {
    // console.log(this._baseUrl + 'formated/abonnement/' + uid + '/json');
    return this.http.get(this._baseUrl + 'formated/ressource/' + session + '/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  /*Recherche la date de derniere mise a jour*/
  getRessourceObservable(id: number, paymentUrl:any) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/ressource/' + id + '/show/json' + '?uid=' + this.getUserUID() + '&paymentUrl=' + paymentUrl, { headers: this.headers }));
  }

  /*Recherche la date de derniere mise a jour*/
  getRessource(id: number) {
    return this.http.get(this._baseUrl + 'formated/ressource/' + id + '/show/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .toPromise()
      .then(response => response.json());

  }

 /*Recherche la date de derniere mise a jour*/
getAbonnements(uid:any){

  return this.http.get(this._baseUrl + 'formated/abonnement/' + uid + '/json' + '?uid=' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());      
}

  /*Recherche la date de derniere mise a jour*/
  getAbonnementsObservable(uid: any) {
    return this.http.get(this._baseUrl + 'formated/abonnement/' + uid + '/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .map(response => response.json());
  }


 /*Recherche la date de derniere mise a jour*/
getAbonnement(uid:any,id:number){
  console.log(this._baseUrl + 'formated/abonnement/' + uid + '/' + id + '/json' + '? uid=' + this.getUserUID());
  return this.http.get(this._baseUrl + 'formated/abonnement/' + uid + '/' + id + '/json' + '? uid=' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());    
    
}

  /*Recherche la date de derniere mise a jour*/
  getAbonnementObservable(uid: any, id: number) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/abonnement/' + uid + '/' + id + '/json', { headers: this.headers }));
  }

  getAbonnementOneObservable( id: number) {
    console.log(this._baseUrl + 'formated/abonnement/one/' + id + '/json');
    
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/abonnement/' + id + '/show/one/json', { headers: this.headers }));
  }
  
 startCommande(uid:any,sessionid:any,bundle:any){
 
    return  this.http.get(this._baseUrl+'formated/commende/'+uid+'/'+sessionid+'/'+bundle+'/json', { headers:this. headers })
             .toPromise()
              .then(response =>response.json());     
}


 cancelCommande(id:any){
  //alert(this._baseUrl+'formated/commende/'+uid+'/'+sessionid+'/'+bundle+'/json');
   return  this.http.delete(this._baseUrl+'formated/commende/'+id+'/cancel/json', { headers:this. headers })
            .toPromise()
             .then(response =>response.json());     
}

confirmCommande(id:any,status:any){
  return  this.http.post(this._baseUrl+'formated/commende/'+id+'/confirm/json',JSON.stringify(status ), { headers:this. headers })
           .toPromise()
            .then(response =>response.json());     
}


 /*Recherche la date de derniere mise a jour*/
 suivreSession(id:any,uid:any,status?:any){
   return this.http.get(this._baseUrl + 'formated/session/' + id + '/' + uid + '/follows/json?status=' + status, { headers:this. headers })
           .toPromise()
            .then(response =>response.json());     
}



 editInfo(uid:any,info:any){
  return  this.http.post(this._baseUrl+'formated/info/'+uid+'/edit/json',JSON.stringify(info ), { headers:this. headers })
           .toPromise()
            .then(response =>response.json());      
}


getInfo(uid:any,registrationId?:any){
  console.log(this._baseUrl + 'formated/info/' + uid + '/show/json?registrationId=' + registrationId);

  return this.http.get(this._baseUrl + 'formated/info/' + uid + '/show/json?registrationId='+registrationId, { headers:this. headers })
              .toPromise()
               .then(response =>response.json());      
}

  /*Recherche la date de derniere mise a jour*/
  getAmbassadorObservable(uid: any) {
    return this.http.get(this._baseUrl + 'formated/info/' + uid + '/ambassador/json', { headers: this.headers })
      .map(response => response.json());
  }


  /*Recherche la date de derniere mise a jour*/
  getInfoObservable(uid: any, registrationId?: any) {
    return IntervalObservable
      .create(1500)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/info/' + uid + '/show/json?registrationId=' + registrationId, { headers: this.headers }));
  }

saveAnalyse(uid:any,concours:number,matiere:number,partie:number,analyse:any){
  console.log(this._baseUrl + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/new/json');
     return  this.http.post(this._baseUrl+'formated/analyse/'+uid+'/'+concours+'/'+matiere+'/'+partie+'/new/json',JSON.stringify(analyse ), { headers:this. headers })
              .toPromise()
               .then(response =>response.json());      
}



getAnalyse(uid:any,concours:number,matiere:number,partie:number){
  console.log(this._baseUrl + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/json');
 
     return  this.http.get(this._baseUrl+'formated/analyse/'+uid+'/'+concours+'/'+matiere+'/'+partie+'/json', { headers:this. headers })
              .toPromise()
               .then(response =>response.json());      
}

getAnalyseObservable(uid: any, concours: number, matiere: number, partie: number) {
  console.log(this._baseUrl + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/json');
    return this.http.get(this._baseUrl + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/json', { headers: this.headers })
    .map(response => response.json());
  }

  isAvalableObservable(session: number,  partie: number) {
    return this.http.get(this._baseUrl + 'formated/partie/is/avalable/json?session=' + session + '&partie=' + partie, { headers: this.headers })
      .map(response => response.json());
  }


}
