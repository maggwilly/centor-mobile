import { Component, ViewChild, NgZone, } from '@angular/core';
import { Events, NavController, Content, PopoverController, NavParams, MenuController, ModalController, ViewController, LoadingController, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Utils } from '../../app/utils';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import firebase from 'firebase';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-score',
  templateUrl: 'score.html'
})
export class ScorePage {
  @ViewChild('slides') slides: any;
  @ViewChild('slides2') slides2: any;
  @ViewChild(Content) content: Content;
  partie: any = {};
  popover: any;
  _parties: any[];
  hasAnswered: boolean = false;
  currentQuestion: any = {};
  slideOptions: any;
  time;
  isShow: boolean = false;
  isTheEnd: boolean = true;
  isTheBegining: boolean = true;
  modal: any;
  isAmswering: boolean = true;
  timer = 0;
  isMathProcessed = false;
  start: number;
  authInfo: any;
  partieToUpdate;
  analyse: any;
  option: any;
  zone: NgZone;
  loaded: boolean= false;
  connected: boolean = false;
  openMenu = false;
  concours:any;
  notificationId:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events,
    public dataService: DataService,
    public menu: MenuController,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private iab: InAppBrowser,
    public notify: AppNotify,
    public storage: Storage) {
    this.slideOptions = { parallax: true };
    this.zone = new NgZone({});
    this.initPage();
    this.isShow = false;
    this.events.subscribe('questions:loaded', (data) => {

    })
  }

  ionViewDidEnter() {
    this.initPage();

  }


  initPage() {
    this.notificationId = firebase.auth().currentUser.uid;
    this.partieToUpdate = this.navParams.get('partie');
    this.partie = Object.assign({}, this.partieToUpdate);
    this.concours=this.partie.matiere.concours;
    return this.storage.get('_partie_' + this.partie.id).then((data) => {
      this.partie = data ? data : this.partie;
      this.isTheBegining = this.partie.lastIndex ? false : true;
     if (!this.partie.questions || (this.partie.questions && !this.partie.questions.length)) {
        return this.dataService.getQuestions(this.partie.qcm).then((data) => {
          this.partie.questions = data;
          this.storage.set('_partie_' + this.partie.id, this.partie);  
          this.evalMathlowly().then(() => {
            this.observeAuth();
          }, error => { });
        }, error => {
          this.notify.onError({ message: 'Petit problème de connexion.' });
        })
    } else {
        this.evalMathlowly().then(() => {
          this.observeAuth();
        }, error => { });
      }
    });
   
  }


  evalMathlowly(): Promise<any> {
    eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub])');
    return new Promise(resolve => {
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub])');
      resolve(true);
    }).then(success => {
      this.isMathProcessed = true;
    }, error => {
    
    });
  }


  getSlides(): any {
    if (this.isAmswering)
      return this.slides;  
    return this.slides2;
  }

  ngAfterViewInit() {
    this.events.publish('after:init');
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }


  observeAuth(loading?: boolean) {
    Utils.setScore(this.partie);
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authInfo = user;
        this.getAnalyse(loading);
      }
    });
  }

  /*Question suivante */
  next() {
    this.getSlides().slideNext();
  }

  scrollto() {
    setTimeout(() => {
      if (this.content._scroll) this.content.scrollToTop(0);
    }, 3000);
  }

  /*Question precedente*/
  preview() {
    this.getSlides().slidePrev();
  }
  /*Parcours */
  didGoToNext() {
    this.option = null;;
    if (this.currentQuestion) {
      if (this.isAmswering)
        this.currentQuestion.restOfTime = this.time;
      if (!this.currentQuestion.firstAmswer)
        this.currentQuestion.firstAmswer = this.currentQuestion.amswer;
    }
    if (this.popover)
      return this.popover.dismiss()

  }

  change(slider) {
    this.didGoToNext();
    this.isTheEnd = this.getSlides().isEnd();
    if (this.isTheEnd && this.isAmswering) {
      clearInterval(this.timer);
      this.setResult();
    } else {
      let activeIndex = this.getSlides().getActiveIndex();
      this.partie.lastIndex = activeIndex;
      this.start = activeIndex;
      this.currentQuestion = this.partie.questions[activeIndex];
      this.isTheBegining = this.isBeginning();
      if (this.currentQuestion && this.isAmswering)
        this.counter();
      this.scrollto();
    }
    this.storage.set('_partie_' + this.partie.id, this.partie).catch(error => { });
  }


  /*Parcours fin du test et retour a la liste */
  end() {
    this.didGoToNext()
    this.getSlides().slideTo(this.partie.questions.length, 100);
    this.isTheEnd = true;
    if (this.isTheEnd && this.isAmswering) {
      clearInterval(this.timer);
      this.setResult();
    }

  }

  /**/
  isBeginning() {
    return this.start == 0;
  }


  /*Compteur de temps*/
  counter() {
    // this.maxTime=this.currentQuestion.time; 
    this.time = this.currentQuestion.restOfTime == undefined ? this.currentQuestion.time * 60 * 1000 : this.currentQuestion.restOfTime;
    this.currentQuestion.restarting = false;
    setTimeout(() => {
      if (!this.timer)
        this.timer = setInterval(() => {
          if (this.time != 0) {
            this.time -= 1000;
          } else {
            this.next();
          }
        }, 1000)
    }, 1000);

  }


  /*Quelles toute les réponses */
  reset() {
    this.start = (this.partie.lastIndex &&( this.partie.lastIndex < this.partie.questions.length - 1 ))? this.partie.lastIndex : 0;
    setTimeout(() => {
      this.getSlides().slideTo(this.start);
      this.isTheEnd = false;
      this.timer = undefined;
      this.isAmswering = true;
      this.getSlides().update();
      this.isTheBegining = this.isBeginning();
    }, 0);
    this.currentQuestion = this.partie.questions[this.start];
    if (this.currentQuestion)
      this.counter();
    if (this.start == 0)
      this.partie.questions.forEach(element => {
        element.restOfTime = undefined;
        element.amswer = undefined;
      });

  }



  /*Parcours pour voir le corrigé*/
  startVisit() {
    this.start = 0;
    this.time = this.partie.analyse?this.partie.analyse.time:0;
    if (!this.partie.questions || !this.partie.questions.length)
      this.initPage().then(() => {
        setTimeout(() => {
          this.getSlides().slideTo(0);
          this.isTheEnd = false;
          this.getSlides().update();
        }, 10);
        this.isAmswering = false;
        this.isTheBegining = this.getSlides().isBeginning();
        this.currentQuestion = this.partie.questions[0];
      })
    else {
      setTimeout(() => {
        this.getSlides().slideTo(0);
        this.isTheEnd = false;
        this.getSlides().update();
      }, 10);
      this.isAmswering = false;
      this.isTheBegining = this.getSlides().isBeginning();
      this.currentQuestion = this.partie.questions[0];
    }
  }

  isOlympia(partie: any) {
    if (!partie || !(partie.type == 'OL' || partie.type == 'CB'))
      return false;
    let now = firebase.database.ServerValue.TIMESTAMP;;
        let endDate = new Date(partie.endDate).getTime();
    return now < endDate;
  }


  showInfo() {
    let modal = this.modalCtrl.create('StartPage', { partie: this.partie });
    modal.present();
  }

  /*Parcour pour voir le corrigé*/
  hasAmswer(question: any): boolean {
    return Utils.hasAmswer(question); //(this.isAmswering &&  question.amswer &&question.restOfTime<=0 )?true:question.restOfTime<=0;
  }


  /*Vrai si la reponse est celle de choisie */
  isThis(question: any, amswer: any): boolean {
    return Utils.isThis(question, amswer);
  }



  /*Vrai si la reponse choisie est la bonne */
  isCorrect(question: any, amswer?: any): boolean {
    return Utils.isCorrect(question, amswer);
  }


  /*Vrai si la reponse choisie est la bonne */
  isFirstCorrect(question: any): boolean {
    return Utils.isFirstCorrect(question);
  }



  questionNumber() {
    let activeIndex = this.start + 1;
    return (this.partie && this.partie.questions) ? activeIndex + '/' + this.partie.questions.length : '...';
  }



  /** Calcul du nombre de points*/
  canHasScore() {
    return Utils.canHasScore(this.partie);
  }

  setResult() {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authInfo = user;
        this.partieToUpdate.analyse = Utils.setScore(this.partie);
        if (this.partieToUpdate.analyse)
          this.zone.run(() => {
            this.loaded = false;
            this.dataService.saveAnalyse(this.authInfo.uid, this.partie.matiere.concours.id, this.partie.matiere.id, this.partie.id, this.partieToUpdate.analyse)
              .then(data => {
                this.analyse = data.partie;
                this.partieToUpdate.analyse = data.partie;
                this.isShow = true;
                this.events.publish('score:partie:updated', data.parents);
                this.storage.set('_partie_' + this.partie.id, this.partie).catch(error => { });
                this.loaded=true;
              }, error => {
               this.loaded = true;
                this.storage.set('_partie_' + this.partie.id, this.partie);
                let alert = this.alertCtrl.create({
                  message: "Les données n'ont pas put être enrégistrée.Votre connexion à internet est peut-être perturbée.",
                  buttons: [
                    {
                      text: "Ok",
                      role: 'cancel'
                    },
                    {
                      text: "Soumttre à nouveau",
                      role: 'cancel',
                      handler: () => {
                        this.setResult()
                      }
                    }
                  ]
                });
                alert.present()
              });
         
          })
      }
      unsubscribe();
    });
  }

  format(s, hrSep = 'h ', minSep = 'min'): string {
    return Utils.format(s, hrSep, minSep);
  }

  getAnalyse(show: boolean = true) {
    this.loaded = false;
    return this.dataService.getAnalyseObservable(this.authInfo.uid, this.partie.matiere.concours.id, this.partie.matiere.id, this.partie.id).subscribe((analyse) => {
      this.analyse = analyse;
      this.partie.analyse = analyse;
      this.isMathProcessed = true;
      this.loaded = true;
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
      
    })
  }

  /*Affiche le paneau */
  show(action: string) {
    this.option = action;
    if (action == 'hint' && !this.isAmswering)
      this.option = 'explication';
  }


  presentPopover(myEvent, action: string) {
    this.popover = this.popoverCtrl.create('PopupPage', {
      option: action,
      question: this.currentQuestion,
      time: this.time, questionNumber: this.questionNumber(),
      partie: this.partie,
    });
    this.popover.present({
      ev: myEvent
    });
  }

  lireCours() {
    if (this.partie.cours) {
      this.iab.create(this.partie.cours);
      return;
    }

    this.navCtrl.push('NoclassPage', { partie: this.partie });
  }

  explication() {
    if (this.currentQuestion && this.currentQuestion.explication) {
      this.iab.create(this.currentQuestion.explication);
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Explications du  corrigé',
      message: "Aucune explication disponible pour cette réponse.",
      buttons: [
        {
          text: "Ok",
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  openModal(pageName, arg: any) {
  return  this.modalCtrl.create(pageName, arg, { cssClass: 'inset-modal' })
     
  }


  share() {
    if (this.currentQuestion) {
      let textMessage = '<strong>Question \n\n'
        + this.questionNumber() + '\n\t >'
        + this.partie.titre + '\n\t >'
        + this.partie.matiere.titre + '\n >'
        + this.partie.matiere.concours.nomConcours + ':\n\n</strong>'
      let modal = this.openModal('ShareQuestionPage', { groupName: this.partie.matiere.concours.id,question:this.currentQuestion, ref:textMessage})
      modal.onDidDismiss((data)=>{
        if(!data)
        return
        switch (data) {
          case 1:
            this.notify.onSuccess({ message: "Cette question a été partagée." })
            break;   
          default:
            this.notify.onSuccess({ message: "Question envoyée à un enseignant" })
            break;
        }    
      })
      modal.present();
    }
  }

  presentActionSheet(textMessage, url, image: string = null) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Question trop dificile ?',
      buttons: [
        {
          text: 'Rechercher sur google',
          icon: !this.platform.is('android') ? 'logo-google' : null,
          handler: () => {
            let topic = this.currentQuestion.text;
            this.iab.create("https://www.google.com/search?q=" + topic, 'to _self', {});
          }
        },
        {
          text: 'Partager avec les autres',
          icon: !this.platform.is('android') ? 'ios-chatboxes-outline' : null,
          handler: () => {
           this. share() 
          }
        }
      ]
    });
    actionSheet.present();
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  goToAccount() {
    this.togglePopupMenu();
    this.navCtrl.push('SettingPage')
  }
  openChat() {
    this.navCtrl.push('GroupchatPage', { groupName: this.concours.id });
  }

  goToChat(){
    this.togglePopupMenu();
    this.navCtrl.push('GroupchatPage', { groupName: this.partie.matiere.concours.id });
  }

  goToHome() {
 
    this.togglePopupMenu();
    this.navCtrl.push('HomePage')
  }

  goToNotifications(){
    this.togglePopupMenu();
    this.navCtrl.push('NotificationsPage')
  }


  goToAbout() {
    this.togglePopupMenu();
    this.navCtrl.push('AboutPage')
  }

  goToMenu() {
    this.togglePopupMenu();
    this.menu.open("menu-material");
    
  }  
}
