import { Directive, Input,ElementRef} from '@angular/core';
import { Events} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the NotificationDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[notification]' // Attribute selector
})
export class NotificationDirective {
  @Input("notificationId") notificationId:string;
  registerId: any;
  count:number;
  constructor(private elementRef: ElementRef, public dataService: DataService, public events: Events, public storage: Storage, ) {
    this.storage.get('registrationId').then(id => {
      this.registerId = id;
    })
    this.events.subscribe('message:read', (data) => {
      this.ngOnChanges();
    });
    this.events.subscribe('notification', (data) => {
       this.ngOnChanges();
    });
  }

  ngOnChanges() {
    this.dataService.getMessages(this.registerId, this.notificationId,0).then((data)=>{
      if (data) {
        this.count = data ? data.count : 0
        this.elementRef.nativeElement.innerHTML = this.count > 0 ? this.count : '';
      }
    },error=>{
      
    });
}
  ngOnInit(){
    this.elementRef.nativeElement.innerHTML = '';
    this.ngOnChanges();
    }
}
