import { Component, NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, LoadingController} from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import firebase from 'firebase';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { UserProvider } from '../../providers/user/user';
import { DomSanitizer } from '@angular/platform-browser';
import { FcmProvider as Firebase } from '../../providers/fcm/fcm';
import {GroupmanagerProvider} from "../../providers/groupmanager/groupmanager";
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
  meingroup:any;
  groupName: any;
  leaved;
  submited
  submitedp
  moveon: boolean = true;
  photoURL
  uploapping;
  imageData
  defaultAvatar = 'assets/images/default-avatar.jpg';
  offset = 100;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public groupservice: GroupsProvider,
    public _DomSanitizer: DomSanitizer,
    public actionSheet: ActionSheetController,
    public imgservice: ImghandlerProvider,
    public zone: NgZone, public  grouManager:GroupmanagerProvider,
    public userservice: UserProvider,
    public loadingCtrl: LoadingController,
    public firebaseNative: Firebase,
    public events: Events) {
    this.firebaseNative.setScreemName('tchat_profile');
    this.photoURL = firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d'
  }

  ionViewDidLoad() {
    this.groupName = this.navParams.get('groupName');
    this.meingroup = this.navParams.get('meingroup')
    this.groupservice.getintogroup(this.groupName)

      if (this.meingroup){
        this.meingroup.photoURL = firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fdefault-avatar.jpg?alt=media&token=20d68783-da1b-4df9-bb4c-d980b832338d'
        this.meingroup.displayName = firebase.auth().currentUser.displayName;
      }
  }

  joinGroup(){
      this.grouManager.joinSessionGroup(this.groupName,{leaved:false}).then(()=>{
        this.leaved=false;
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
        this.grouManager.leavegroup(this.groupName).then(res=>{
        this.leaved=res;
        this.meingroup=undefined
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

  update() {
    this.grouManager.updateconfig(this.meingroup.acceptNotification,this.groupName)
  }
}
