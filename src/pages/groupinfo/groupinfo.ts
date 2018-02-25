import { Component, NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, LoadingController} from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import firebase from 'firebase';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the GroupinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-groupinfo',
  templateUrl: 'groupinfo.html',
})
export class GroupinfoPage {
  meingroup:any={};
  groupName: any;
  leaved;
  submited
  moveon: boolean = true;
  photoURL 
  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     public groupservice: GroupsProvider,

    public actionSheet: ActionSheetController, public imgservice: ImghandlerProvider,
    public zone: NgZone, public userservice: UserProvider, public loadingCtrl: LoadingController,
              public events: Events) {
    this.groupName = this.navParams.get('groupName');   
    this.photoURL = firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d' 
  }

  ionViewDidLoad() {
    this.groupservice.getintogroup(this.groupName)
    this.groupservice.getmeingroup(this.groupName).then(me=>{
        this.meingroup=me;
    }) 
  }
  update(){
    this.groupservice.updatemeingroup(this.groupName,this.meingroup)
  }

  joinGroup(){
    let newmember = { uid: firebase.auth().currentUser.uid, 
      displayName: firebase.auth().currentUser.displayName ? firebase.auth().currentUser.displayName:'',
      photoURL: firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL:'',
    }
   
    this.groupservice.joinSessionGroup(newmember).then(()=>{
      this.groupservice.getmeingroup(this.groupName).then(me => {
        this.meingroup = me;
        this.leaved = false;
        this.submited = false;
      }) 
    })
  }

  presentSheetLeaveGroup() {
    let sheet = this.actionSheet.create({enableBackdropDismiss:true,
      title: 'Que voulez-vous faire ?',
      buttons: [
        {
          text: 'Quiter le groupe',
          icon: 'logout',
          handler: () => {
        this.groupservice.leavegroup(this.groupName).then(res=>{
        this.leaved=res;
         })
          }
        },
        {
          text: 'Annuler',
          icon: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    })
    sheet.present();
  }  
  
  chooseimage() {
    let loader = this.loadingCtrl.create({
      dismissOnPageChange:true,
      content: 'Please wait'
    })
    loader.present();
    this.imgservice.uploadimage().then((uploadedurl: any) => {
      loader.dismiss();
      this.zone.run(() => {
        this.photoURL = uploadedurl;
        this.meingroup.photoURL = uploadedurl
        this.moveon = false;
        this.updateproceed();
      })
    })
  }

  updateproceed() {

    this.userservice.updateimage(this.photoURL).then((res: any) => {
      if (res.success) {
        this.update();
      }
      else {
        alert(res);
      }
    })
  }

  updateDisplayName() {
    this.userservice.updatedisplayname(this.meingroup.displayName).then((res: any) => {
      if (res.success) {
        this.update();
      }
      else {
        alert(res);
      }
    })
  }  
}
