import { Pipe, PipeTransform } from '@angular/core';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import frLocal from 'date-fns/locale/fr';
@Pipe({
    name: 'relativeTime',
})
export class RelativeTime implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(value: string, ...args) {
        let addSuffix = args ? true : false;
        return distanceInWordsToNow(new Date(value), { addSuffix: addSuffix, locale: frLocal  });
    }
}