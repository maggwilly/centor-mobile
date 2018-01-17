import { Component, Input } from '@angular/core';
import { DataService } from '../../providers/data-service';
import { AppNotify } from '../../providers/app-notify';
/**
 * Generated class for the ResultatListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'resultat-list',
  templateUrl: 'resultat-list.html'
})
export class ResultatListComponent {

  loaded: boolean = false
  @Input ()
  resultatList: any[] = [];
  @Input()
  style: string ='';
  constructor(public dataService: DataService, public notify: AppNotify) {

  }
  ngOnInit() {
    this.loaded = false;
    if (this.resultatList.length)
      return;
    this.dataService.getResultats(0).then((data) => {
      this.resultatList = data;
      this.loaded = true;
    }, error => {
      this.notify.onError({ message: 'problème de connexion  !' });
    })
  }



  name(url: string): string {
    if (url&&url.includes('pdf'))
      return 'md-download';
    return 'md-open';
  }
  
}
