/**
 * @module tooltip
 */

import TooltipEditing from './tooltipediting';
import TooltipUI from './tooltipui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Tooltip extends Plugin {
    static get requires() {
        return [ TooltipEditing, TooltipUI ];
    }
}