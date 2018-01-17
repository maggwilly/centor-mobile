import { Directive ,Input,ElementRef,Renderer} from '@angular/core';

/**
 * Generated class for the HideHeaderDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[hide-header]', // Attribute selector,
  host:{'(ionScroll)':'onContentScroll($event)'}
})
export class HideHeaderDirective {
@Input("header") header:HTMLElement;
headerHeight;
scrollContent;
  constructor(private elementRef:ElementRef, private renderer:Renderer) {
    console.log('Hello HideHeaderDirective Directive');
  }

  ngOnInit(){
  this.headerHeight=this.header.clientHeight;
  this.renderer.setElementStyle(this.header,'webkitTransition','top 700ms');
  this.scrollContent=this.elementRef.nativeElement.getElementsByClassName('scroll-content')[0];
  this.renderer.setElementStyle(this.scrollContent,'webkitTransition','margin-top 700ms');
  }
  onContentScroll(event){
    if(event.scrollTop>this.headerHeight){
      console.log('-'+this.headerHeight+'px');
      console.log(event.scrollTop);
      this.renderer.setElementStyle(this.header,'top',(this.headerHeight>56)?'-'+(this.headerHeight+25)+'px':'-'+this.headerHeight+'px');
      this.renderer.setElementStyle(this.scrollContent,'margin-top','-25px');
    }else {
      this.renderer.setElementStyle(this.header,'top','0px');
      this.renderer.setElementStyle(this.scrollContent,'margin-top',(this.headerHeight>56)?(this.headerHeight+25)+'px':this.headerHeight+'px');
    }
  
  }
}
