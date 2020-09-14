import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class GroupmanagerProvider {
  firegroupsession = firebase.database().ref('/session');
  constructor() {}

  getgroupinfos(currentgroupname) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`/session/${currentgroupname}/members/${firebase.auth().currentUser.uid}`).once('value', (snapshot) => {
        let infos = snapshot.val();
        resolve(infos);
      })
    })
  }


  joinSessionGroup(currentgroupname, updates?:any) {
    if(!currentgroupname||!firebase.auth().currentUser)
      return  ;
    return  this.getgroupinfos(currentgroupname).then((info) => {
        return firebase.database().ref(`/groupes/${currentgroupname}/members/${firebase.auth().currentUser.uid}`).update(updates?updates:(info?info:{ acceptNotification: true})).then(()=>{
        })
          .catch((err) => {
            console.log(err)
        })
      })
  }

  updateconfig(acceptNotif,currentgroupname){
    firebase.database().ref(`/groupes/${currentgroupname}/members/${firebase.auth().currentUser.uid}`).update({ acceptNotification: acceptNotif})
  }

  leavegroup(currentgroupname) {
    if(!currentgroupname||!firebase.auth().currentUser)
      return  ;
    return new Promise((resolve, reject) => {
      firebase.database().ref(`/groupes/${currentgroupname}/members/${firebase.auth().currentUser.uid}`).update({ acceptNotification: false, leaved:true}).then(() => {
        firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${currentgroupname}`).remove().then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }

}
