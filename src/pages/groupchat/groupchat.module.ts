import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupchatPage } from './groupchat';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji";
import { QuestionViewComponent } from '../../components/question-view/question-view';
import { SharedDirectivesModule } from '../../app/shared.module';
import { SharedProvidersModule} from '../../app/shared.module';
import { KeyboardAttachDirective } from '../../directives/keyboard-attach/keyboard-attach';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {AutosizeModule} from 'ngx-autosize';
import {Keyboard} from "@ionic-native/keyboard";
@NgModule({
  declarations: [
    GroupchatPage,
    QuestionViewComponent,
    KeyboardAttachDirective
  ],
  imports: [
    IonicPageModule.forChild(GroupchatPage),
    SharedDirectivesModule,
    SharedProvidersModule,
    EmojiPickerComponentModule,
    LazyLoadImageModule,
    AutosizeModule
  ],
  exports: [
    GroupchatPage
  ],
  entryComponents: [QuestionViewComponent],

  providers: [
    EmojiProvider,
    Keyboard,
  ]
})
export class GroupchatPageModule {}
