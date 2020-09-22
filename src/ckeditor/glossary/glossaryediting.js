import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import './theme/glossary.css';

import InsertGlossary from './insertglossarycommand';

export default class GlossaryEditing extends Plugin {
    static get requires() {                                                   
        return [ Widget ];
    }
    
    init() {
        this._defineSchema(); 
        this._defineConverters(); 
        this.editor.commands.add( 'insertGlossary', new InsertGlossary( this.editor ) );
    }

    _defineSchema() {                                                          
        const schema = this.editor.model.schema;

        schema.register( 'glossaryTooltip', {
            allowIn: [ '$root','paragraph' ],
            allowWhere: '$block',
            allowContentOf: '$block',
            isInline: true     
            
            
        } );

        schema.register( 'glossaryTooltipTitle', {
            allowIn: ['glossaryTooltip'],
            allowWhere: '$block',
            allowContentOf: '$block',            
            isInline: true     
            
            
        } );
    }

    _defineConverters() {                                                      
        const conversion = this.editor.conversion;

        // <glossaryTooltip> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'glossaryTooltip',
            view: {
                name: 'div',
                classes: 'tooltipCk'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'glossaryTooltip',
            view: {
                name: 'div',
                classes: 'tooltipCk'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'glossaryTooltip',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div', { class: 'tooltipCk' } );

                return toWidgetEditable( div, viewWriter );
            }
        } );

        // conversion.elementToElement( {
        //     model: 'glossaryTooltip',
        //     view: {
        //         name: 'div',
        //         classes: 'tooltipCk'
        //     }
        // } );


        // <glossaryTooltiptext> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'glossaryTooltipText',
            view: {
                name: 'span',
                classes: 'tooltiptextCk'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'glossaryTooltipText',
            view: {
                name: 'span',
                classes: 'tooltiptextCk'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'glossaryTooltipText',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const span= viewWriter.createEditableElement( 'span', { class: 'tooltiptextCk' } );

                return toWidgetEditable( span, viewWriter );
            }
        } );

        // conversion.elementToElement( {
        //     model: 'glossaryTooltipTitle',
        //     view: {
        //         name: 'span',
        //         classes: 'tooltiptextCk'
        //     }
        // } );

                
    }


    
}
