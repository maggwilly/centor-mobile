import { Injectable } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser';
import firebase from 'firebase';
import { Http } from '@angular/http';
import { window } from 'rxjs/operator/window';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
/*
  Generated class for the ImghandlerProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImghandlerProvider {
  nativepath: any;
  firestore = firebase.storage();
  constructor(public filechooser: FileChooser, public FilePath: FilePath, private camera: Camera,public http: Http,) {
  }



  uploadimage(sourceType=0) {
    var promise = new Promise((resolve, reject) => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        allowEdit: true,
        cameraDirection: 1,
        targetWidth: 200,
        targetHeight: 200,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: sourceType
      }

        this.camera.getPicture(options).then((imageData) => {
        firebase.storage().ref('/profileimages').child(firebase.auth().currentUser.uid)
          .putString(imageData, 'base64', { contentType: 'image/jpeg' }).then(picture => {
            resolve(picture.downloadURL);
          });
      });   
     

     
      /*

        this.filechooser.open().then((url) => {
          (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
              res.file((resFile) => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                  var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                  imageStore.put(imgBlob).then((res) => {
                    this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                      resolve(url);
                    }).catch((err) => {
                        alert(err);
                    })
                  }).catch((err) => {
                    alert(err);
                  })
                }
              })
            })
          })
      })*/
    })    
     return promise;   
  }
  getImageTest() {
    return this.http.get('assets/data/image', {})
      .toPromise()
      .then(response => response.text());
  } 

  getImage(targetWidth?: number, targetHeight?:number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: 1,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 0
    }
    if (targetWidth &&targetHeight){
      options.targetWidth = targetWidth;
      options.targetHeight = targetHeight;
      options.allowEdit=true;
    }
    return this.camera.getPicture(options)
  } 

  storeImage(imageData, path: string = '/picmsgs'){
    return firebase.storage().ref(path).child(this.guid())
    .putString(imageData, 'base64', { contentType: 'image/jpeg' }).then(picture => picture.downloadURL)
}


  grouppicstore(groupname) {
    var promise = new Promise((resolve, reject) => {
        this.filechooser.open().then((url) => {
          (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
              res.file((resFile) => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                  var imageStore = this.firestore.ref('/groupimages').child(firebase.auth().currentUser.uid).child(groupname);
                  imageStore.put(imgBlob).then((res) => {
                    this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).child(groupname).getDownloadURL().then((url) => {
                      resolve(url);
                    }).catch((err) => {
                        reject(err);
                    })
                  }).catch((err) => {
                    reject(err);
                  })
                }
              })
            })
          })
      })
    })    
     return promise;   
  }

  picmsgstore(sourceType=0) {
    var promise = new Promise((resolve, reject) => {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          cameraDirection: 1,
          mediaType: this.camera.MediaType.PICTURE,
          sourceType: sourceType
        }
       this.camera.getPicture(options).then((imageData) => {
         firebase.storage().ref('/picmsgs').child(this.guid())
          .putString(imageData, 'base64', { contentType: 'image/jpeg' }).then(picture => {
            resolve(picture.downloadURL);
          });
      });   
      
     /*   this.filechooser.open().then((url) => {
          (<any>window).FilePath.resolveNativePath(url,result=> {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
              res.file((resFile) => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                  var uuid = this.guid();
                  var imageStore = this.firestore.ref('/picmsgs').child('picmsg' + uuid);
                  imageStore.put(imgBlob).then((res) => {
                      resolve(res.downloadURL);
                    }).catch((err) => {
                      alert(err);
                    })
                  .catch((err) => {
                    alert(err);
                  })
                }
              })
            })
          })
      })*/
    })   
     return promise;   
  }

  filemsgstore() {
    var promise = new Promise((resolve, reject) => {
      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url,(fileentry) => {
          this.nativepath = fileentry;
          let filename = this.getfilename(fileentry);
          let fileext = this.getfileext(fileentry);
          let type = "application/pdf"
          switch (fileext) {
            case "pdf":
              type = "application/pdf"
              break;
            case "docx":
              type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              break; 
            case "jpg":
            case "png":
              type = 'image/jpeg'
              break; 
            case "doc":
              type = 'application/msword'
              break; 
            case "xlsx":
              type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              break;                                                   
            default:
              break;
          }
          this.makeFileIntoBlob(fileentry, filename, type).then(blob=>{
           let file = {
              blob: blob,
              type: type,
              fileext: fileext,
             filename: this.guid()
            }

            let imageStore = this.firestore.ref('/filemsgs').child(file.filename);
            imageStore.put(file.blob, { contentType: file.type }).then((res) => {
              resolve(res.downloadURL);
            }).catch((err) => {
              alert(err);
            })           
          });

        })
      })
    })
    return promise;
  }

  makeFileIntoBlob(_imagePath, name, type) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      (<any>window).resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: type });
            imgBlob.name = name;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            alert('Failed file read: ' + e.toString());
            reject(e);
          };

          
        });
      });
    });
  }
  
  getfilename(filestring) {

    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    return file;
  }

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file;
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
