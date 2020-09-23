
/**
 * @module tooltip/untooltipcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import findAttributeRange from '@ckeditor/ckeditor5-typing/src/utils/findattributerange';
import first from '@ckeditor/ckeditor5-utils/src/first';
import { isImageAllowed } from './utils';

/**
 * The unlink command. It is used by the {@link module:link/link~Link link plugin}.
 *
 * @extends module:core/command~Command
 */
export default class UnTooltipCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		const selectedElement = first( doc.selection.getSelectedBlocks() );

		// A check for the `LinkImage` plugin. If the selection contains an image element, get values from the element.
		// Currently the selection reads attributes from text nodes only. See #7429 and #7465.
		if ( isImageAllowed( selectedElement, model.schema ) ) {
			this.isEnabled = model.schema.checkAttribute( selectedElement, 'linkHref' );
		} else {
			this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, 'linkHref' );
		}
	}

	/**
	 * Executes the command.
	 *
	 * When the selection is collapsed, it removes the `linkHref` attribute from each node with the same `linkHref` attribute value.
	 * When the selection is non-collapsed, it removes the `linkHref` attribute from each node in selected ranges.
	 *
	 * # Decorators
	 *
	 * If {@link module:link/link~LinkConfig#decorators `config.link.decorators`} is specified,
	 * all configured decorators are removed together with the `linkHref` attribute.
	 *
	 * @fires execute
	 */
	execute() {
		const editor = this.editor;
		const model = this.editor.model;
		const selection = model.document.selection;
		const tooltipCommand = editor.commands.get( 'tooltip' );

		model.change( writer => {
			// Get ranges to unlink.
			const rangesToUnTooltip = selection.isCollapsed ?
				[ findAttributeRange(
					selection.getFirstPosition(),
					'linkHref',
					selection.getAttribute( 'linkHref' ),
					model
				) ] :
				selection.getRanges();

			// Remove `linkHref` attribute from specified ranges.
			for ( const range of rangesToUnTooltip ) {
				writer.removeAttribute( 'linkHref', range );
				// If there are registered custom attributes, then remove them during unlink.
				if ( tooltipCommand ) {
					for ( const manualDecorator of tooltipCommand.manualDecorators ) {
						writer.removeAttribute( manualDecorator.id, range );
					}
				}
			}
		} );
	}
}
