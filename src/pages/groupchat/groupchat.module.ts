import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupchatPage } from './groupchat';
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji";
import { QuestionViewComponent } from '../../components/question-view/question-view';
import { SharedDirectivesModule } from '../../app/shared.module';
import { SharedProvidersModule} from '../../app/shared.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  declarations: [
    GroupchatPage,
    QuestionViewComponent, 
  ],
  imports: [
    IonicPageModule.forChild(GroupchatPage),
    SharedDirectivesModule,
    SharedProvidersModule,
    EmojiPickerComponentModule,
    LazyLoadImageModule
  ],
  exports: [
    GroupchatPage
  ],
  entryComponents: [QuestionViewComponent],
  
  providers: [
    EmojiProvider
  ]
})
export class GroupchatPageModule {}
