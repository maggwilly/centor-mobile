import { Directive, Input } from '@angular/core';
import { DataService } from '../../providers/data-service';
/**
 * Generated class for the UpdaterDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[updater]' // Attribute selector
})
export class UpdaterDirective {
@Input('session')
  session:any
  @Input('matiere')
  matiere: any
  @Input('partie')
  partie: any
  @Input('user')
  user: any
  constructor(public dataService: DataService,) {
  }

  ngOnInit() {
  this.ngOnChanges();
  }

  ngOnChanges() {
    this.dataService.getAnalyseObservable(this.user.uid, this.session.id, this.matiere ? this.matiere.id : 0, this.partie ? this.partie.id : 0).subscribe((analyse) => {
      if (this.partie)
        this.partie.analyse = analyse;
      else
        this.matiere.analyse = analyse;
    }, error => {

    })
}}
