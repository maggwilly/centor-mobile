import { NgModule } from '@angular/core';
import { ShortListComponent } from './short-list/short-list';
import { ResultatListComponent } from './resultat-list/resultat-list';
import { ProgrammeComponent} from './programme/programme';
import { SharedDirectivesModule } from '../app/shared.module';
@NgModule({
	declarations: [,
    ShortListComponent,
    ResultatListComponent,
        ProgrammeComponent
    ],
    imports: [SharedDirectivesModule],
	exports: [,
    ShortListComponent,
    ResultatListComponent,
    ProgrammeComponent
  ]
})
export class ComponentsModule {}
