import { NgModule } from '@angular/core';
import { HideHeaderDirective } from './hide-header/hide-header';
import { NotificationDirective } from './notification/notification';
import { UpdaterDirective } from './updater/updater';
import { AvalabilityDirective } from './avalability/avalability';
import { ImageCacheDirective } from './image-cache/image-cache';
import { KeyboardAttachDirective } from './keyboard-attach/keyboard-attach';
@NgModule({
	declarations: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective,
    AvalabilityDirective,
    ImageCacheDirective,
    KeyboardAttachDirective],
	imports: [],
	exports: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective,
    AvalabilityDirective,
    ImageCacheDirective,
    KeyboardAttachDirective]
})
export class DirectivesModule {}
