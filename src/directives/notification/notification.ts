import { Directive, Input,ElementRef} from '@angular/core';
import { Events} from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
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

  @Input("registrationId") registerId: any;
  @Input("groupname") groupname: any;

  count:number;
  firegroup = firebase.database().ref('/messages' +
    '');
  constructor(private elementRef: ElementRef, public dataService: DataService, public events: Events, public storage: Storage, ) {

    this.events.subscribe('message:read', (data) => {
      this.ngOnChanges();
    });
    this.events.subscribe('notification', (data) => {
       this.ngOnChanges();
    });
  }

  ngOnChanges() {
    if (!this.groupname){
      if (!this.registerId && !this.notificationId)
         return;
      if (!this.notificationId && firebase.auth().currentUser)
            this.notificationId = firebase.auth().currentUser.uid;
      this.dataService.getMessages(this.registerId, this.notificationId,0).then((data)=>{
        this.count = data ? data.count : 0
        this.elementRef.nativeElement.innerHTML = this.count > 0 ? this.count : '';
    },error=>{});
    } else{
      if (firebase.auth().currentUser)
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.groupname).child('me').child('msgcount').on('value', (snapshot) => {
        this.count = snapshot.val() ? snapshot.val() : 0
        this.elementRef.nativeElement.innerHTML = this.count > 0 ? this.count : '';
      })
    }
}
  ngOnInit(){
    this.ngOnChanges();
    }


}
