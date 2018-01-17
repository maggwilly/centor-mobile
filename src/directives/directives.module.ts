import { NgModule } from '@angular/core';
import { HideHeaderDirective } from './hide-header/hide-header';
import { NotificationDirective } from './notification/notification';
@NgModule({
	declarations: [HideHeaderDirective,
    NotificationDirective],
	imports: [],
	exports: [HideHeaderDirective,
    NotificationDirective]
})
export class DirectivesModule {}
