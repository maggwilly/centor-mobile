import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {apiConfig} from "../../app/app.apiconfigs";


@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/users');
  private headers = apiConfig.headers;
  _baseUrl = apiConfig.baseUrl;

  constructor(public http: Http) {}

  adduser(newuser) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
        firebase.auth().currentUser.updateProfile({
          displayName: newuser.displayName,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
        }).then(() => {
          this.firedata.child(firebase.auth().currentUser.uid).set({
            uid: firebase.auth().currentUser.uid,
            displayName: newuser.displayName,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
          }).then(() => {
            resolve({success: true});
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }


  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  addToken(token: any) {
    if (!firebase.auth().currentUser||!token)
      return;
    firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/registrationsId/${token}`).set(true)
  }


  updateimage(imageurl) {
    var promise = new Promise((resolve, reject) => {
      if (!firebase.auth().currentUser)
        reject(false);
      firebase.auth().currentUser.updateProfile({
        displayName: firebase.auth().currentUser.displayName,
        photoURL: imageurl
      }).then(() => {
        firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
          displayName: firebase.auth().currentUser.displayName,
          photoURL: imageurl,
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.http.post(this._baseUrl + 'formated/info/' + firebase.auth().currentUser.uid + '/edit/json', JSON.stringify({
            displayName: firebase.auth().currentUser.displayName,
            photoURL: imageurl,
          }), {headers: this.headers})
            .toPromise()
            .then(response => {
              resolve({success: true});
            })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updatedisplayname(newname) {
    let promise = new Promise((resolve, reject) => {
      if (!firebase.auth().currentUser)
        reject(false);
      firebase.auth().currentUser.updateProfile({
        displayName: newname,
        photoURL: firebase.auth().currentUser.photoURL
      }).then(() => {
        this.firedata.child(firebase.auth().currentUser.uid).update({
          displayName: newname,
          photoURL: firebase.auth().currentUser.photoURL,
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.http.post(this._baseUrl + 'formated/info/' + firebase.auth().currentUser.uid + '/edit/json', JSON.stringify({
            displayName: firebase.auth().currentUser.displayName,
          }), {headers: this.headers})
            .toPromise()
            .then(response => {
              resolve({success: true});
            })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
          temparr.push(userdata[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }


}
