import { Directive, ElementRef, Input} from '@angular/core';
import ImgCache from 'imgcache.js';
import { Platform } from 'ionic-angular';
declare var ImgCache: any;

declare var cordova: any;
/**
 * Generated class for the ImageCacheDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[image-cache]' // Attribute selector
})
export class ImageCacheDirective {
  @Input('ngStyle') cacheEl;
  @Input('bg') bg;
  constructor(private el: ElementRef, private platform: Platform) {


  }


  cacheSrc(){
    ImgCache.isCached(this.el.nativeElement.src, (path: string, success: any) => {
      if (success) {
        // already cached
        ImgCache.useCachedFile(this.el.nativeElement);
      } else {
        // not there, need to cache the image
        ImgCache.cacheFile(this.el.nativeElement.src, () => {
          // ImgCache.useCachedFile(el.nativeElement);
        });
      }
    });
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      ImgCache.init(() => {
        console.log('ImgCache init: success!');
        this.el.nativeElement.crossOrigin = "Anonymous"; // CORS enabling
        ImgCache.options.usePersistentCache = true;
        ImgCache.options.cacheClearSize = 100;
        ImgCache.options.skipURIencoding = true;
         this.cacheSrc();
      }, () => {
        console.log('ImgCache init: error! Check the log for errors');
      });
    })
  }
}
