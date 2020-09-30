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
    

    
}
