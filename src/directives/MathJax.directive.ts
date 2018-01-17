import {Directive, ElementRef, Input} from '@angular/core';
import {Events} from 'ionic-angular';
@Directive({
    selector: '[MathJax]'
})
export class MathJaxDirective {
    @Input('MathJax') MathJaxInput: string;
    promisedData: Promise<any>;
    constructor(private el: ElementRef,public events: Events) {

    }
    ngOnChanges() {
     // console.log('>> ngOnChanges');
    // this.el.nativeElement.innerHTML = this.MathJaxInput;
     //eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub])');
      // this.events.publish('questions:loaded')    
     // eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.el.nativeElement])');
 }

    ngOnInit() {
     console.log('>>  ngOnInit');
      this.el.nativeElement.innerHTML = this.MathJaxInput;
     // eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.el.nativeElement])');
   // eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.el.nativeElement])');; 
 }
}
