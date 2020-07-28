import {  Http  } from '@angular/http';
import { Injectable } from '@angular/core';
import {apiConfig} from "../../app/app.apiconfigs";
import firebase from 'firebase';
import {Observable} from "rxjs";

@Injectable()
export class AbonnementProvider {
  private headers = apiConfig.headers;
  constructor(public http: Http) {

  }
  getUserUID() {
    return firebase.auth().currentUser ? firebase.auth().currentUser.uid:'';
  }

  private readonly path = 'formated/abonnement/';

  loadPrice(id:number){
    return this.http.get(`${apiConfig.baseUrl}formated/price/${id}/show/json`,  { headers:this. headers })
      .toPromise()
      .then(response =>response.json());

  }

  getAbonnementsObservable() {
   return  !this.getUserUID()? new Observable(subscriber => {
     return subscriber.next(null);
   }):this.http.get(apiConfig.baseUrl + this.path + this.getUserUID() + '/json' + '?uid=' + this.getUserUID(), { headers: this.headers })
      .map(response => response.json());
  }

  checkAbonnementValidity(id:number){
   return !this.getUserUID()? new Promise(resolve => {
      resolve(null)
    }):this.http.get(apiConfig.baseUrl+ this.path +  this.getUserUID() + '/' + id + '/json?uid=' + this.getUserUID(),  { headers:this. headers })
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

  confirmFreeCommende(status:any){
    console.log(JSON.stringify(status ))
    console.log(apiConfig.baseUrl+'formated/commende/confirm/json')
    return  this.http.post(apiConfig.baseUrl+'formated/commende/confirm/json',JSON.stringify(status ), { headers:this. headers })
      .toPromise()
      .then(response =>response.json());
  }

}
