import { COMPONENTS, DIRECTIVES, PIPES,SHAREDPROVIDERS} from './app.imports';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';


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
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    COMPONENTS,
  ]
})

export class SharedComponentsModule { }

@NgModule({

  providers: [
    SHAREDPROVIDERS,
  ]
})
export class SharedProvidersModule { }
