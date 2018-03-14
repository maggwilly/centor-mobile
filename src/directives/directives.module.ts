import { NgModule } from '@angular/core';
import { HideHeaderDirective } from './hide-header/hide-header';
import { NotificationDirective } from './notification/notification';
import { UpdaterDirective } from './updater/updater';
import { AvalabilityDirective } from './avalability/avalability';
@NgModule({
	declarations: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective,
    AvalabilityDirective],
	imports: [],
	exports: [HideHeaderDirective,
    NotificationDirective,
    UpdaterDirective,
    AvalabilityDirective]
})
export class DirectivesModule {}
