import {  Http ,  Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import {IntervalObservable} from "rxjs/observable/IntervalObservable";
import {apiConfig} from "../../app/app.apiconfigs";
import firebase from 'firebase';

@Injectable()
export class AbonnementProvider {
  private headers = apiConfig.headers;
  constructor(public http: Http) {

  }
  getUserUID() {
    return firebase.auth().currentUser ? firebase.auth().currentUser.uid:'';
  }

  private readonly path = 'formated/abonnement/';


  getAbonnementsObservable() {
    return this.http.get(apiConfig.baseUrl + this.path + this.getUserUID() + '/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .map(response => response.json());
  }

  getAbonnementObservable(id: number) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(apiConfig.baseUrl + this.path + this.getUserUID() + '/' + id + '/json', { headers: this.headers }));
  }

  getAbonnementDetails(id: number) {
    return IntervalObservable
      .create(1000)
      .flatMap((i) => this.http.get(apiConfig.baseUrl+ this.path + id + '/show/one/json', { headers: this.headers }));
  }


  checkAbonnementValidity(id:number){
    return this.http.get(apiConfig.baseUrl+ this.path +  this.getUserUID() + '/' + id + '/json?uid=' + this.getUserUID(),  { headers:this. headers })
      .toPromise()
      .then(response =>response.json());

  }


  startCommande(sessionid:any,bundle:any){
    return  this.http.get(apiConfig.baseUrl+'formated/commende/'+this.getUserUID() +'/'+sessionid+'/'+bundle+'/json', { headers:this. headers })
      .toPromise()
      .then(response =>response.json());
  }


  cancelCommande(id:any){
    return  this.http.delete(apiConfig.baseUrl+'formated/commende/'+id+'/cancel/json', { headers:this. headers })
      .toPromise()
      .then(response =>response.json());
  }

  confirmFreeCommende(id:any, status:any){
    return  this.http.post(apiConfig.baseUrl+'formated/commende/'+id+'/confirm/json',JSON.stringify(status ), { headers:this. headers })
      .toPromise()
      .then(response =>response.json());
  }


  checkAbonnementStatus(id:number) {
   return  this.checkAbonnementValidity(id).then(abonnement=>{
      if (abonnement == null)
        return true;
      let now = Date.now();
      let endDate = new Date(abonnement.endDate).getTime();
      return now > endDate;
    })
  }
}
