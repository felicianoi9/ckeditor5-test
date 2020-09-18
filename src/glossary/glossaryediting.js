import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';


import './theme/glossary.css';  

export default class GlossaryEditing extends Plugin {   

    static get requires() {                                                    
        return [ Widget ];
    }

    init() {  

        this._defineSchema();  
        this._defineConverters();
       
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
            allowAttributes: [ 'name' ],
            isInline: true     
            
            
        } );
    }

    _defineConverters() {                                                      
        const conversion = this.editor.conversion;

        conversion.elementToElement( {
            model: 'glossaryTooltip',
            view: {
                name: 'div',
                classes: 'tooltipCk'
            }
        } );

        conversion.elementToElement( {
            model: 'glossaryTooltipTitle',
            view: {
                name: 'span',
                classes: 'tooltiptextCk'
            }
        } );

        // conversion.elementToElement( {
        //     view: {
        //         name: 'div',
        //         classes: [ 'tooltipCk' ]
        //     },
        //     model: 'glossaryTooltip'
            
           
        // } );

        
    }

}