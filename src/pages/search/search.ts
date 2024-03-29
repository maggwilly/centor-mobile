import {Component, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {App, IonicPage, NavController, NavParams, Searchbar, ViewController} from 'ionic-angular';
import {DataService} from "../../providers/data-service";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild('searchbar') vc: Searchbar;
  queryText: string = "";
  searchTerm$ = new Subject<string>();
  results$: any[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dataService: DataService,
              public viewCtrl: ViewController,
              public appCtrl: App) {
    this.queryText = navParams.get('queryText');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.vc.setFocus();
    }, 500);

    this.dataService.search(this.searchTerm$)
      .subscribe(results => {
        if (!results || results.length == 0)
          return;
        this.results$ = results;
        setTimeout(() => {
          this.vc.setFocus();
        }, 500);

      });
    this.searchTerm$.next(this.queryText);
  }

  name(url: string): string {
    if (url && url.includes('pdf'))
      return 'md-download';
    return 'md-open';
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  doInfinite($event) {

  }

  color(resultType: any) {
    switch (resultType) {
      case 'Concours':
        return 'primary';
      case 'Document':
        return 'secondary';
      case 'Resultat':
        return 'orange';
      case 'Annonce':
        return 'facebook';
      default:
        return 'google';
    }
  }

  openItem(result: any) {
    this.dismiss().then(() => {
      switch (result.resultType) {
        case 'Concours':
          this.openConcours(result);
          break;
        case 'Document':
          this.openRessource(result);
          break;
        case 'Annonce':
          this.openArticle(result);
          break;
        default:
          this.appCtrl.getRootNav().push('SearchDetailsPage', {searchResult: result});
          break;
      }
    })
  }

  openRessource(document: any) {
    this.appCtrl.getRootNav().push('RessourceDetailsPage', {ressource_id: document.id});
  }

  openConcours(concours: any) {
    this.appCtrl.getRootNav().push('ConcoursOptionsPage', {concours: concours});
  }

  openArticle(article: any) {
    this.appCtrl.getRootNav().push('ArticleDetailsPage', {notification_id: article.id});
  }
}
