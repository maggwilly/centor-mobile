import { Directive, Input} from '@angular/core';
import { DataService } from '../../providers/data-service';
/**
 * Generated class for the AvalabilityDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[avalability]' // Attribute selector
})
export class AvalabilityDirective {

  @Input('session')
  session: any
  @Input('partie')
  partie: any

  constructor(public dataService: DataService, ) {
  }

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.dataService.isAvalableObservable( this.session.id, this.partie ? this.partie.id : 0).subscribe((avalability) => {
      this.partie.isAvalable = avalability;
    }, error => { })
  }
}
