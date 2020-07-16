import { NgModule } from '@angular/core';
import { ShortListComponent } from './short-list/short-list';
import { ResultatListComponent } from './resultat-list/resultat-list';
import { ProgrammeComponent} from './programme/programme';
import { SharedDirectivesModule } from '../app/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionViewComponent } from './question-view/question-view';
import { PopupMenuComponent } from './popup-menu/popup-menu';
import {CommonModule} from "@angular/common";
@NgModule({
	declarations: [,
    ShortListComponent,
    ResultatListComponent,
    ProgrammeComponent,
    QuestionViewComponent,
    PopupMenuComponent
    ],
    imports: [SharedDirectivesModule, BrowserAnimationsModule, CommonModule],
	exports: [,
    ShortListComponent,
    ResultatListComponent,
    ProgrammeComponent,
    QuestionViewComponent,
    PopupMenuComponent
  ]
})
export class ComponentsModule {}
