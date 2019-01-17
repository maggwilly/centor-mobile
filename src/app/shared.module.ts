import { COMPONENTS, DIRECTIVES, PIPES,SHAREDPROVIDERS} from './app.imports';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { IonTextAvatar } from 'ionic-text-avatar';

@NgModule({
  declarations: [
    PIPES,
    DIRECTIVES,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    PIPES,
    DIRECTIVES,
  ]
})

export class SharedDirectivesModule { }

@NgModule({
  declarations: [
    COMPONENTS,
    IonTextAvatar
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    COMPONENTS,
    IonTextAvatar
  ]
})

export class SharedComponentsModule { }

@NgModule({

  providers: [
    SHAREDPROVIDERS,
  ]
})
export class SharedProvidersModule { }
