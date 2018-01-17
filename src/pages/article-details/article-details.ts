import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
import { Events } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-article-details',
  templateUrl: 'article-details.html'
})
export class ArticleDetailsPage {
 article:any={};
  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
    public events: Events,
     public notify:AppNotify,
     public loadingCtrl: LoadingController,
     public dataService:DataService,) {
     this.article=this.navParams.get('article');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArticleDetailsPage');
    this.makeArticleReaded(this.article.id,this.article);
  }

  makeArticleReaded(id:number,article:any){
    article.readed=true;
    return this.dataService.readMessage(id).then(data=>{
             this.article.readed=true;  
      this.events.publish('message:read');            
        },error=>{
      this.notify.onError({message:'Petit problème de connexion.'});
      });
 
  }
}
