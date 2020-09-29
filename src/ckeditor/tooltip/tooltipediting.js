import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import InsertTooltip from './inserttooltipcommand';

import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import findAttributeRange from '@ckeditor/ckeditor5-typing/src/utils/findattributerange';

const TOOLTIPTEXT = 'tooltip';

export default class TooltipEditing extends Plugin {

	static get requires() {
        return [ Widget ];
	}
	
    init() {

		this._defineSchema();
        this._defineConverters();
        this.editor.commands.add( 'insertTooltip', new InsertTooltip( this.editor, TOOLTIPTEXT ) );
        
        // Handle removing the content after the link element.
		// this._handleDeleteContentAfterTooltip();     
	}
	
	_defineSchema() {
		const schema = this.editor.model.schema;        
		
		schema.extend( '$text', {
            allowAttributes: [ TOOLTIPTEXT ],
		})        
		
		schema.setAttributeProperties( TOOLTIPTEXT, {
			isFormatting: true,
			copyOnEnter: true,
        })
	}    
	
	_defineConverters() {
		const conversion = this.editor.conversion;        
		
		conversion.for( 'upcast' ).elementToAttribute ({
            view: {
                name: 'span',
                attributes: {
					title: true,
					'data-toggle': 'tooltip'
                },
            },
            model: {
                key: TOOLTIPTEXT,
                value: viewElement => viewElement.getAttribute('title'),
            },
		})   
		conversion.for( 'downcast' ).attributeToElement({
			view: createTooltipElement,
            model: TOOLTIPTEXT
            
		})     
		
		conversion.for( 'dataDowncast' ).attributeToElement( {
            model: TOOLTIPTEXT,
            view: createTooltipElement
		})        
		
		conversion.for( 'editingDowncast' ).attributeToElement( {
            model: TOOLTIPTEXT,
            view: ( title, conversionApi ) => {
                return createTooltipElement(title, conversionApi)
            }
		})        
		
		function createTooltipElement ( title, { writer } ) {
            const tooltipElement = writer.createAttributeElement( 'span', { title } );
            writer.setCustomProperty( TOOLTIPTEXT, true, tooltipElement );
			writer.setAttribute( 'data-toogle', 'tooltip', tooltipElement ) ;          
			return tooltipElement;
        }
    }
    _handleDeleteContentAfterTooltip() {
		const editor = this.editor;
		const model = editor.model;
		const selection = model.document.selection;
		const view = editor.editing.view;
		

		// A flag whether attributes `linkHref` attribute should be preserved.
		let shouldPreserveAttributes = false;

		// A flag whether the `Backspace` key was pressed.
		let hasBackspacePressed = false;

		// Detect pressing `Backspace`.
		this.listenTo( view.document, 'delete', ( evt, data ) => {
			hasBackspacePressed = data.domEvent.keyCode === keyCodes.backspace;
		}, { priority: 'high' } );

		// Before removing the content, check whether the selection is inside a link or at the end of link but with 2-SCM enabled.
		// If so, we want to preserve link attributes.
		this.listenTo( model, 'deleteContent', () => {
			// Reset the state.
			shouldPreserveAttributes = false;

			const position = selection.getFirstPosition();
			const tooltip = selection.getAttribute( 'tooltip' );

			if ( !tooltip ) {
				return;
			}

			const tooltipRange = findAttributeRange( position, 'tooltip', tooltip, model );

			// Preserve `linkHref` attribute if the selection is in the middle of the link or
			// the selection is at the end of the link and 2-SCM is activated.
			shouldPreserveAttributes = tooltipRange.containsPosition( position ) || tooltipRange.end.isEqual( position );
		}, { priority: 'high' } );

		// After removing the content, check whether the current selection should preserve the `linkHref` attribute.
		this.listenTo( model, 'deleteContent', () => {
			// If didn't press `Backspace`.
			if ( !hasBackspacePressed ) {
				return;
			}

			hasBackspacePressed = false;

			// Disable the mechanism if inside a link (`<$text url="foo">F[]oo</$text>` or <$text url="foo">Foo[]</$text>`).
			if ( shouldPreserveAttributes ) {
				return;
			}

			// Use `model.enqueueChange()` in order to execute the callback at the end of the changes process.
			editor.model.enqueueChange( writer => {
				removeLinkAttributesFromSelection( writer );
			} );
		}, { priority: 'low' } );
    }
    
    // function removeLinkAttributesFromSelection( writer, manualDecorators ) {
    //     writer.removeSelectionAttribute( 'linkHref' );
    
    //     for ( const decorator of manualDecorators ) {
    //         writer.removeSelectionAttribute( decorator.id );
    //     }
    // }

    
}
