import { NgModule } from '@angular/core';
import { HideHeaderDirective } from './hide-header/hide-header';
import { NotificationDirective } from './notification/notification';
import { UpdaterDirective } from './updater/updater';
import { AvalabilityDirective } from './avalability/avalability';
import { ImageCacheDirective } from './image-cache/image-cache';
@NgModule({
	declarations: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective,
    AvalabilityDirective,
    ImageCacheDirective],
	imports: [],
	exports: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective,
    AvalabilityDirective,
    ImageCacheDirective]
})
export class DirectivesModule {}
