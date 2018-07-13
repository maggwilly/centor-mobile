import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';;
//import { Platform } from 'ionic-angular';

//import ImgCache from '@chrisben/imgcache.js';

//import { ReplaySubject } from 'rxjs/ReplaySubject';
//import { map, take, flatMap, switchMapTo, tap} from 'rxjs/operators';
//import { Observable } from 'rxjs/Observable';
//import { bindCallback } from 'rxjs/observable/bindCallback';
/*
  Generated class for the ImageCacheProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageCacheProvider {
 /*private initNotifier$: ReplaySubject<string> = new ReplaySubject();

  constructor(private platform: Platform, private file: File) {
    // change on production mode
    ImgCache.options.debug = true;
  }

  public get notifier$(): Observable<string> {
    return this.initNotifier$.asObservable();
  }


  public initImgCache(): Observable<string> {

    const init$ = bindCallback<string>(ImgCache.init)();

    return init$.pipe(
      take(1),
      tap(() => this.initNotifier$.next('init'))
    );
  }


  public cache(src: string): Observable<string> {
    return this.notifier$.pipe(
      switchMapTo(
        this.isCached(src)
          .pipe(
          flatMap(([path, success]: [string, boolean]) => {
            return success ? this.getCachedFileURL(path) : this.cacheFile(path);

          }),
          map((url: string) => {
            if (this.platform.is('ios')) {
              return this.normalizeURlWKWview(url);
            }
            return url;
          })
          )
      )
    );
  }
  private normalizeURlWKWview(url: string) {
    const urlIos = `${this.normalizeUrlIos(this.file.applicationStorageDirectory)}Library/files/${this.normalizeUrlIos(url)}`;
    return urlIos.replace('/localhost/persistent', '');
  }

  private cacheFile(src: string): Observable<string> {
    return bindCallback<string, string>(ImgCache.cacheFile)(src);
  }


  private isCached(src: string): Observable<[string, boolean]> {
    return bindCallback<string, [string, boolean]>(ImgCache.isCached)(src);
  }

  private getCachedFileURL(src: string): Observable<string> {
    return bindCallback<string, string[]>(ImgCache.getCachedFileURL)(src)
      .pipe(
      map((urls: string[]) => urls[1])
      );
  }              
  normalizeUrlIos(url: string): string {
    return (url).replace(/(cdvfile|file):\/\//g, '');
  }*/
}
