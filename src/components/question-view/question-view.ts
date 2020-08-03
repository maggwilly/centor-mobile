import { Component,Input  } from '@angular/core';

/**
 * Generated class for the QuestionViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'question-view',
  templateUrl: 'question-view.html'
})
export class QuestionViewComponent {

  @Input()
  question: any;
  constructor() {
 

   }
  ngOnChanges() {
    //this.el.nativeElement.innerHTML = question;
    // eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.el.nativeElement])');
  // eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.el.nativeElement])'); 
    //eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub])');
  }

  ngOnInit() {
    //console.log('Hello QuestionViewComponent Component');
   //  eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub])');
  }
}
