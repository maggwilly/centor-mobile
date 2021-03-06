import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';


@Injectable()
export class GroupsProvider {
  firegroup = firebase.database().ref('/groups');
  firegroupsession = firebase.database().ref('/session');
  firestore = firebase.storage();
  mygroups: Array<any> = [];
  currentgroup: Array<any> = [];
  currentgroupname:any;
  groupdisplayname :any
  groupmemberscount:any;
  grouppic:any;
  groupmsgs: Array<any> = [];
  limitTo:number=0;

  constructor(public events: Events) {}

  addgroup(newGroup) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(newGroup.groupName).set({
        groupimage: newGroup.groupPic,
        msgboard: '',
        owner: firebase.auth().currentUser.uid
      }).then(() => {
        resolve(true);
        }).catch((err) => {
          reject(err);
      })
    });
    return promise;
  }

  getmygroups() {
    firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}`).once('value', (snapshot) => {
      this.mygroups = [];
      if(snapshot.val() != null) {
        var temp = snapshot.val();
        for (var key in temp) {
          var newgroup = {
            groupName: key,
            groupimage: temp[key].groupimage
          }
          this.mygroups.push(newgroup);
        }
      }
      this.events.publish('newgroup');
    })

  }

  getmeingroup(groupname) {
    var promise = new Promise((resolve, reject) => {
      firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${groupname}`).once('value', (snapshot) => {
        var temp = snapshot.val()
           resolve(temp);
      })
    })
    return promise;
  }


  getintogroup(currentgroupname) {
    if(!currentgroupname||!firebase.auth().currentUser)
      return  ;
    this.currentgroupname = currentgroupname;
    firebase.database().ref(`/groupes/${currentgroupname}/info`).on('value', (snapshot) => {
      if (snapshot.val()) {
        this.groupdisplayname = snapshot.val().groupName;
        this.grouppic = snapshot.val().grouppic ? snapshot.val().grouppic : '';
        this.groupmemberscount = snapshot.val().memberscount
        this.events.publish('gotintogroup');
      }
    })

    return  firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${currentgroupname}/me`).update({ msgcount: 0, lastLogin: firebase.database.ServerValue.TIMESTAMP });
  }

  getownership(groupname) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(groupname).once('value', (snapshot) => {
        var temp = snapshot.val().owner;
        if (temp == firebase.auth().currentUser.uid) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      }).catch((err) => {
          reject(err);
      })
    })
    return promise;
  }



  getgroupimage() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
        this.grouppic = snapshot.val().groupimage;
        resolve(true);
      })
    })
  }

  getsessionownerimage() {
    return new Promise((resolve, reject) => {
      this.firegroupsession.child(this.currentgroupname).child('info').once('value', (snapshot) => {
        this.grouppic = snapshot.val().groupimage;
        resolve(true);
      })
    })
  }


  addmember(newmember) {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').push(newmember).then(() => {
      this.getgroupimage().then(() => {
        this.firegroup.child(newmember.uid).child(this.currentgroupname).set({
          groupimage: this.grouppic,
          owner: firebase.auth().currentUser.uid,
          msgboard: ''
        }).catch((err) => {
          console.log(err);
        })
      })
      this.getintogroup(this.currentgroupname);
    })
  }



  getgroupmembers() {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
      var tempdata = snapshot.val().owner;
      this.firegroup.child(tempdata).child(this.currentgroupname).child('members').once('value', (snapshot) => {
        var tempvar = snapshot.val();
        for (var key in tempvar) {
          let item = tempvar[key];
          this.currentgroup.push(item);
        }
      })
    })
    this.events.publish('gotmembers');
  }



  deletegroup() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').once('value', (snapshot) => {
        var tempmembers = snapshot.val();
        for (var key in tempmembers) {
          this.firegroup.child(tempmembers[key].uid).child(this.currentgroupname).remove();
        }
        this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).remove().then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })

      })
    })
  }
  addMsg(newmessage, addinlist = true,sentTo?:string){
  let message = {
    sentby: firebase.auth().currentUser.uid,
    displayName: firebase.auth().currentUser.displayName,
    photoURL: firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d',
    message: newmessage,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    sentTo: sentTo?sentTo:'',
    pending: addinlist,
    uiniqid: this.guid()
  };
    if (addinlist){
      this.groupmsgs.push(message);
      this.events.publish('groupmsg');
    }
  return message;
}

  //nouvelle version cloud function send
  addgroupmsg(newmessage, addinlist = true) {
    if(!this.currentgroupname||!firebase.auth().currentUser)
      return  ;
    let message = this.addMsg(newmessage,addinlist);
    let copie = Object.assign({}, message);
    copie.pending = false;
  return new Promise((resolve, reject) => {
    firebase.database().ref(`/groupes/${this.currentgroupname}/msgboard`).push(message).then(() => {
     firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${this.currentgroupname}/msgboard`).push(copie).then(() => {
               resolve(true);
     }, (err) => {

     })
   }, (err) => {
     reject(err);
   })
    })
  }

  toggleImportant(msg) {
    return new Promise((resolve, reject) => {
      let importance = msg.important?true:false;
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('msgboard').orderByChild('uiniqid').equalTo(msg.uiniqid).once('value', snapshot => {
        snapshot.ref.update({ important: !importance}).then(()=>{
          resolve(true);
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }
  deletemember(member) {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname)
      .child('members').orderByChild('uid').equalTo(member.uid).once('value', (snapshot) => {
        snapshot.ref.remove().then(() => {
          this.firegroup.child(member.uid).child(this.currentgroupname).remove().then(() => {
            this.getintogroup(this.currentgroupname);
          })
        })
      })
  }

 deletemsg(msg) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${this.currentgroupname}/msgboard`).orderByChild('uiniqid').equalTo(msg.uiniqid)
      .once('value', snapshot => {
        snapshot.forEach( (itemSnapshot)=> {
          itemSnapshot.ref.remove();
          return true;
        })
      })
      .catch((err) => {
        reject(err);
      })
    })
  }



  addnewmessage(newmessage, addinlist = true, toUser: any) {
    let message = this.addMsg(newmessage, addinlist, toUser);
    let copie = Object.assign({}, message);
    copie.pending = false;
    new Promise((resolve, reject) => {
      firebase.database().ref(`/messages/${toUser}/${this.currentgroupname}/msgboard`).push(copie).then(() => {
        firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${this.currentgroupname}/msgboard`).push(copie).then(() => {
          resolve(true);
        })

        })

    })
  }

  postmsgstoadmin(newmessage, addinlist = true) {
    let message = this.addMsg(newmessage, addinlist);
    let copie = Object.assign({}, message);
    copie.pending = false;
    return new Promise((resolve, reject) =>
    {
      this.firegroupsession.child(this.currentgroupname).child('owner').once('value', (snapshot) => {
        let groupowner = snapshot.val();
        if (groupowner)
          this.firegroup.child(groupowner).child(this.currentgroupname).child(firebase.auth().currentUser.uid).child('msgboard').push(copie).then(() => {
            this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('msgboard').push(copie).then(() => {
            resolve(true);
            })
        })
      })
    })
  }

  loockforgroupmsgs(groupname) {
    firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${groupname}/msgboard`).off()
    firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${groupname}/msgboard`).on('child_added', (snapshot) => {
      this.events.publish('newgroupmsg');
    })
  }

  getgroupmsgs(groupname) {
    this.limitTo += 100;
    return firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${groupname}/msgboard`).orderByChild('timestamp').limitToLast(this.limitTo).on('value', (snapshot) => {
      var tempmsgholder = snapshot.val();
      this.groupmsgs = [];
      for (var key in tempmsgholder)
        this.groupmsgs.push(tempmsgholder[key]);
      this.events.publish('groupmsg');
   })
  }

  getmsgcount(groupname) {
    var promise = new Promise((resolve, reject) => {
      firebase.database().ref(`/messages/${firebase.auth().currentUser.uid}/${groupname}/msgcount`).on('value', (snapshot) => {
        let msgcount = snapshot.val();
        resolve(msgcount);
      })
  })
 return promise;
}
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}
