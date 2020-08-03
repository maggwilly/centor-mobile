import { Component  } from '@angular/core';
import { DataService } from '../../providers/data-service';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../providers/app-notify';
/**
 * Generated class for the CarouselComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
export interface Slide {
  title: string;
  description: string;
  image: string;
}
@Component({
  selector: 'carousel',
  templateUrl: 'carousel.html'
})
export class CarouselComponent {
  slides: Slide[]=[];
  showSkip = true;
  constructor(public dataService: DataService, public storage: Storage ,public notify: AppNotify,) {
    this.loadAffiches();
  }

  loadAffiches(){
    this.storage.get('_slides').then((local)=>{
      this.slides=local?local:[];
      return this.dataService.getAffiches().then(data=>{
           this.slides=data?data:[];
            this.storage.set('_slides',data);
      }, error => {
        this.notify.onError({ message: 'Problème de connexion.' });
      })
   });
  }
  
}
