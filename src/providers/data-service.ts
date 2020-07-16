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
import {Observable} from "rxjs";
import {apiConfig} from "../app/app.apiconfigs";
@Injectable()
export class DataService {
data: any;
  private headers = apiConfig.headers;
  _baseUrl = apiConfig.baseUrl;
  constructor(public http: Http, public storage: Storage, public events: Events, public notify: AppNotify,) {
  }

  search(terms: Observable<string>, entity_code?:any) {
    return terms.debounceTime(200)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term,entity_code));
  }

  searchEntries(term, entity_code?:any) {
    let route='formated/search?'
    let filter=entity_code?'&entity_key='+entity_code:'';
    console.log(`${apiConfig.baseUrl}${route}term=${term}${filter}`)
    return this.http
      .get(`${apiConfig.baseUrl}${route}term=${term}${filter}`)
      .map(res => res.json());
  }

 getAffiches(){
  return  this.http.get(apiConfig.baseUrl+'formated/pub/json',  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());

}

  getUserUID() {
    return firebase.auth().currentUser ? firebase.auth().currentUser.uid:'';
  }

 getSessions(start:number,all?:boolean,order?:string){
   return this.http.get(apiConfig.baseUrl + 'formated/session/json?all=' + all + '&order=' + order + '&start=' + start,  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());

}

getEcoles(start:number){
  return this.http.get(apiConfig.baseUrl + 'formated/concours/json?start=' + start,  { headers:this. headers })
          .toPromise()
           .then(response =>response.json());

}
getSelectedSessions(ecole:number,uid?:any,filter?:string){
  return !uid? new Promise(resolve => undefined):
   this.http.get(apiConfig.baseUrl+ 'formated/session/selected/' + ecole + '/' + uid + '/json?filter='+filter,  { headers:this. headers })
          .toPromise()
           .then(response =>response.json());

}

getCountSessions(uid?:any){
  return  new Promise(resolve =>
      resolve({concoursCount: 81,
      sessionsCount:110,
      forusersCount:16,
      recentsCount:9,
      envueCount:89})) ;/*:
   this.http.get(this._baseUrl + 'formated/session/home/count/' + uid + '/json',  { headers:this. headers })
          .toPromise()
           .then(response =>response.json());*/
}


  /*Recherche la date de derniere mise a jour*/
  getResultats(start: number, all?: boolean, order?: string) {
    return this.http.get(apiConfig.baseUrl+ 'formated/resultat/json?all=' + all + '&order=' + order + '&start=' + start, { headers: this.headers })
      .toPromise()
      .then(response => response.json());

  }
  /*Recherche la date de derniere mise a jour*/
  getShortListOfSessions(tartget:string,uid?: any,) {
    let url:string=''
    switch (tartget) {
      case 'recents':
        url = apiConfig.baseUrl+ 'formated/session/recentment/lances/json'
        break;
      case 'en_vus':
        url = apiConfig.baseUrl + 'formated/session/plus/en/vus/json'
        break;
      case 'owards':
        url = apiConfig.baseUrl + 'formated/session/owards/json'
        break;
      default:
        url =apiConfig.baseUrl+ 'formated/session/for/user/' + uid + '/json' +'?uid= ' + this.getUserUID()
        break;
    }
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }


 /*Recherche la date de derniere mise a jour*/
  getMessages(registrationId: any, uid?: string, start?: number,all?:boolean){
    return this.http.get(apiConfig.baseUrl + 'formated/sending/json?all=' + all + '&registrationId=' + registrationId + '&uid=' + uid  + '&start=' + start,  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());

}

 /*Recherche la date de derniere mise a jour*/
 readMessage(id:number,notificationId?:any,registrationId?:any){
   return this.http.get(apiConfig.baseUrl + 'formated/sending/edit/message/' + id + '/json?notificationId=' + notificationId + '&registrationId=' + registrationId,  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());

}
 /*Recherche la date de derniere mise a jour*/
getShowArticle(id:number){
  return this.http.get(apiConfig.baseUrl + 'formated/article/' + id + '/show/json' + '?uid= ' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());

}

  /*Recherche la date de derniere mise a jour*/
  getShowNotification(id: number, registrationId?:any) {
    return this.http.get(apiConfig.baseUrl + 'formated/notification/' + id + '/show/json?registrationId='+ registrationId+'&uid= ' + this.getUserUID(), { headers: this.headers })
      .toPromise()
      .then(response => response.json());

  }


 /*Recherche la date de derniere mise a jour*/
 addRegistration(registrationId:string,registration:any){
   return this.http.post(apiConfig.baseUrl +'formated/registration/'+registrationId+'/new/json',JSON.stringify(registration ),  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());
}



 /*Recherche la date de derniere mise a jour*/
 getShowSession(id:number){

   return this.http.get(apiConfig.baseUrl + 'formated/session/' + id + '/show/json' + '?uid= ' + this.getUserUID(),  { headers:this. headers })
           .toPromise()
            .then(response =>response.json());

}

 /*Recherche la date de derniere mise a jour*/
getMatieres(programme:number){
  return this.http.get(apiConfig.baseUrl + 'formated/matiere/' + programme + '/json' + '?uid=' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());

}


  getParties(contenu: number, session: number, matiere: number){1
    return this.http.get(apiConfig.baseUrl + 'formated/partie/' + contenu + '/json' + '?session=' + session + '&matiere=' + matiere+ '&uid=' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());

}

 /*Recherche la date de derniere mise a jour*/
getQuestions(qcm:number){
  return this.http.get(apiConfig.baseUrl + 'formated/question/' + qcm + '/json' + '?uid= ' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());

}
  getOneRessource(id: number) {
    return this.http.get(apiConfig.baseUrl + 'formated/ressource/' + id + '/show/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .toPromise()
      .then(response => response.json());

  }

  /*Recherche la date de derniere mise a jour*/
  getSessionRessources(session: any) {
    return this.http.get(apiConfig.baseUrl  + 'formated/ressource/' + session + '/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }


  getRessourceObservable(id: number, paymentUrl:any) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/ressource/' + id + '/show/json' + '?uid=' + this.getUserUID() + '&paymentUrl=' + paymentUrl, { headers: this.headers }));
  }



  getAbonnementsObservable() {
    return this.http.get(apiConfig.baseUrl  + 'formated/abonnement/' + this.getUserUID() + '/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .map(response => response.json());
  }

  getAbonnementObservable(id: number) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/abonnement/' + this.getUserUID() + '/' + id + '/json', { headers: this.headers }));
  }

  getAbonnementDetails(id: number) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/abonnement/' + id + '/show/one/json', { headers: this.headers }));
  }


checkAbonnementValidity(uid:any, id:number){
  return this.http.get(apiConfig.baseUrl  + 'formated/abonnement/' + uid + '/' + id + '/json?uid=' + this.getUserUID(),  { headers:this. headers })
              .toPromise()
               .then(response =>response.json());

}



 startCommande(uid:any,sessionid:any,bundle:any){
    return  this.http.get(apiConfig.baseUrl +'formated/commende/'+uid+'/'+sessionid+'/'+bundle+'/json', { headers:this. headers })
             .toPromise()
              .then(response =>response.json());
}


 cancelCommande(id:any){
   return  this.http.delete(apiConfig.baseUrl +'formated/commende/'+id+'/cancel/json', { headers:this. headers })
            .toPromise()
             .then(response =>response.json());
}

confirmFreeCommende(id:any, status:any){
  return  this.http.post(apiConfig.baseUrl +'formated/commende/'+id+'/confirm/json',JSON.stringify(status ), { headers:this. headers })
           .toPromise()
            .then(response =>response.json());
}


 /*Recherche la date de derniere mise a jour*/
 suivreSession(id:any,uid:any,status?:any){
   return this.http.get(apiConfig.baseUrl  + 'formated/session/' + id + '/' + uid + '/follows/json?status=' + status, { headers:this. headers })
           .toPromise()
            .then(response =>response.json());
}



 editInfo(uid:any,info:any){
  return  this.http.post(apiConfig.baseUrl +'formated/info/'+uid+'/edit/json',JSON.stringify(info ), { headers:this. headers })
           .toPromise()
            .then(response =>response.json());
}


getInfo(uid:any,registrationId?:any){
  return this.http.get(apiConfig.baseUrl  + 'formated/info/' + uid + '/show/json?registrationId='+registrationId, { headers:this. headers })
              .toPromise()
               .then(response =>response.json());
}

  /*Recherche la date de derniere mise a jour*/
  getAmbassadorObservable(uid: any) {
    return this.http.get(apiConfig.baseUrl + 'formated/info/' + uid + '/ambassador/json', { headers: this.headers })
      .map(response => response.json());
  }


  /*Recherche la date de derniere mise a jour*/
  getInfoObservable(uid: any, registrationId?: any) {
    return IntervalObservable
      .create(1500)
      .flatMap((i) => this.http.get(this._baseUrl + 'formated/info/' + uid + '/show/json?registrationId=' + registrationId, { headers: this.headers }));
  }

saveAnalyse(uid:any,concours:number,matiere:number,partie:number,analyse:any){
  console.log(apiConfig.baseUrl  + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/new/json');
     return  this.http.post(apiConfig.baseUrl +'formated/analyse/'+uid+'/'+concours+'/'+matiere+'/'+partie+'/new/json',JSON.stringify(analyse ), { headers:this. headers })
              .toPromise()
               .then(response =>response.json());
}



getAnalyse(uid:any,concours:number,matiere:number,partie:number){
  console.log(this._baseUrl + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/json');

     return  this.http.get(apiConfig.baseUrl +'formated/analyse/'+uid+'/'+concours+'/'+matiere+'/'+partie+'/json', { headers:this. headers })
              .toPromise()
               .then(response =>response.json());
}

getAnalyseObservable(uid: any, concours: number, matiere: number, partie: number) {
  console.log(this._baseUrl + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/json');
    return this.http.get(apiConfig.baseUrl + 'formated/analyse/' + uid + '/' + concours + '/' + matiere + '/' + partie + '/json', { headers: this.headers })
    .map(response => response.json());
  }

  isAvalableObservable(session: number,  partie: number) {
    return this.http.get(apiConfig.baseUrl  + 'formated/partie/is/avalable/json?session=' + session + '&partie=' + partie, { headers: this.headers })
      .map(response => response.json());
  }


}
