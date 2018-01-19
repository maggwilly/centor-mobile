import { NgModule } from '@angular/core';
import { HideHeaderDirective } from './hide-header/hide-header';
import { NotificationDirective } from './notification/notification';
import { UpdaterDirective } from './updater/updater';
@NgModule({
	declarations: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective],
	imports: [],
	exports: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective]
})
export class DirectivesModule {}
