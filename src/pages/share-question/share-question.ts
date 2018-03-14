import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, TextInput, ViewController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
/**
 * Generated class for the ShareQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share-question',
  templateUrl: 'share-question.html',
})
export class ShareQuestionPage {
  @ViewChild('chat_input') messageInput: TextInput;
  question:any={};
  newmessage="Je voudrais votre avis sur cette question SVP"
  showEmojiPicker = false;
  sendToAdmin = false;
  mesagetype: any = 'question'
  groupName:any;
  ref:any
  constructor(public navCtrl: NavController, public navParams: NavParams, public groupservice: GroupsProvider, public viewCtrl: ViewController,) {
    this.question=this.navParams.get('question');
    this.groupName = this.navParams.get('groupName');
    this.ref = this.navParams.get('ref');
    this.groupservice.getintogroup(this.groupName);
  }

  dismiss(data?:any) {
    this.viewCtrl.dismiss(data);
  }

  ionViewDidLoad() {
    eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub])');
    this.messageInput.autocorrect = 'On';
    this.messageInput.setFocus()
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.messageInput.setFocus()

    }

  }

  toggleDest() {
    this.sendToAdmin = !this.sendToAdmin;  
}

  addgroupmsg() {
    this.showEmojiPicker = false;
    let newMessage: any = {
      text:  this.urlify(this.newmessage),
      type: this.mesagetype,
      ref:this.ref,
      fileurl: '',
      question:JSON.parse(JSON.stringify(this.question)),
     toAdmin: this.sendToAdmin
    }
    if (!this.newmessage)
      return
    this.newmessage = '';
    if (this.sendToAdmin)
      this.groupservice.postmsgstoadmin(newMessage).then(() => {
      //  this.newmessage = '';
        this.dismiss(1);
      })
    else
      this.groupservice.addgroupmsg(newMessage).then(() => {
      //  this.newmessage = '';
        this.dismiss(0);
      })
  }
  onFocus() {
    this.showEmojiPicker = false;
  }


  urlify(text: string) {
    /* var urlRegex = /(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n]+)/g;
     if (!text)
        return "";
     return text.replace(urlRegex,  (url)=> {
      return '<a class="a" href="' + url + '">' + url + '</a>';
     })*/
    // or alternatively
    return text
  }
}