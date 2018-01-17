// import { FormBuilder, FormControl, Validator } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer, } from '@angular/core';
import { AlertController, App, Platform,  LoadingController, Slides, IonicPage,NavParams  } from 'ionic-angular';
import { EmailValidator } from '../../validators/email';
import { FormBuilder, Validators } from '@angular/forms';
import { RepasswordValidator } from '../../validators/repassword';
import { Facebook } from '@ionic-native/facebook'
import firebase from 'firebase';
import { AppNotify } from '../../providers/app-notify';

@IonicPage()
@Component({
  selector: 'page-login-slider',
  templateUrl: 'login-slider.html',
})
export class LoginSliderPage {
  public loginForm: any;
  public resetPasswordForm;
  public signupForm;
  public backgroundImage = 'assets/img/background/background-6.jpg';
  public target=1;
  singupStape=false;
  loginStape=true;
  @ViewChild('login') loginPage: ElementRef;
  @ViewChild('singup') singupPage: ElementRef;
  constructor(
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public navParams: NavParams, 
     private facebook: Facebook,
    public notify: AppNotify, 
    public renderer: Renderer,
    public platform: Platform,
    public appCtrl: App
  ) {
    this.singupStape=this.navParams.get('redirectTo');
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
    })
    this.signupForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
       repassword:['', Validators.compose([Validators.required, RepasswordValidator.isValid])]
    });

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([ Validators.required])]
});
   }
  // Slider methods
 // @ViewChild('slider') slider: Slides;
  @ViewChild('innerSlider') innerSlider: Slides;

  goToLogin() {
    this.singupStape = false;
    this.loginStape = true;
   // this.slider.slideTo(0);
  }

  goToSignup() {
    this.singupStape = true;
    this.loginStape = false;
    //this.slider.slideTo(1);
  }

  slideNext() {
    this.innerSlider.update();
    this.innerSlider.slideTo(1)//.slideNext();
  }

  slidePrevious() {
    this.innerSlider.update();
    this.innerSlider.slideTo(0)//slidePrev();
  }

  facebookLogin(){
    let provider = new firebase.auth.FacebookAuthProvider(); 
   firebase.auth().useDeviceLanguage();
    if (this.platform.is('core'))
      firebase.auth().signInWithRedirect(provider).then((result) => {
        this.appCtrl.getRootNav().pop();
        this.notify.onSuccess({ message: 'Vous êtes connectés à votre compte' });
      }).catch( (error) =>{
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });  
 else 
      this.facebook.login(['public_profile', 'email']).then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            this.appCtrl.getRootNav().pop();
            this.notify.onSuccess({ message: 'Vous êtes connectés à votre compte' });
          })
          .catch((error) => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();

          });

      }, (error) => {
        this.notify.onError({ message: 'Petit problème de connexion.' });
      });


}

  getSignup(){
    if (!this.signupForm.valid){
      this.presentLoading('Certains champs ne sont pas valides !');
        return;
       } else {
          let loading = this.loadingCtrl.create({dismissOnPageChange:true});
         firebase.auth().createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password)
         .then((newUser) => {
          //  loading.dismiss();
            this.appCtrl.getRootNav().pop();
         }, (error) => {
             loading.dismiss();
               let alert = this.alertCtrl.create({
                 message: this.errorMessage(error),
                 buttons: [
                   {
                     text: "Ok",
                     role: 'cancel'
                   }
                 ]
               });
             alert.present();
           });
         loading.present();
       }
     }

  getLogin(){
    if (!this.loginForm.valid){
        this.presentLoading('Certains champs ne sont pas valides !');
    } else {
  let loading = this.loadingCtrl.create({dismissOnPageChange:true});
    firebase.auth().signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        //loading.dismiss();
        this.appCtrl.getRootNav().pop();
      }, error => {
        loading.dismiss()
          let alert = this.alertCtrl.create({
            message: this.errorMessage(error),
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      loading.present();
    }
}

resetPassword(){
  if (!this.resetPasswordForm.valid){
    this.presentLoading('Certains champs ne sont pas valides !');
  } else {
    firebase.auth().sendPasswordResetEmail(this.resetPasswordForm.value.email)
    .then((user) => {
      let alert = this.alertCtrl.create({
        message: "Veillez suivre le lien que nous vous avons envoyé par mail.",
        buttons: [
          {
            text: "Ok",
            role: 'cancel',
            handler: () => {
              this.appCtrl.getRootNav().pop();
            }
          }
        ]
      });
      alert.present();
    }, (error) => {
      var errorMessage: string = error.message;
      let errorAlert = this.alertCtrl.create({
        message: errorMessage,
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      errorAlert.present();
    });
  }
}
errorMessage(error:any):string{
let json=JSON.stringify(error);
let code=JSON.parse(json).code;
switch (code) {
case "auth/wrong-password":  
  return "Le mot de passe ne corresponds pas.";
case "auth/user-not-found":  
  return "Ce compte n'est pas encore créé.";
case "auth/user-not-found":  
  return "Ce compte n'est pas encore créé.";   
case "auth/email-already-in-use":  
  return "Cette adresse e-mail est déjà utilisé pour un autre compte.";
 case "auth/network-request-failed":  
  return "Votre connexion internet est peut-être pertubée.";      
default:
  return "Un problème est survenu et nous n'avons pas put traiter votre démande.";
}
}

presentLoading(message) {
    const alert = this.alertCtrl.create({
      title: 'Champs non valides',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
}


}
