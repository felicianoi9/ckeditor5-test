import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import './theme/glossary.css';

import InsertGlossary from './insertglossarycommand';

const TOOLTIPTEXT = 'tooltipText'

export default class GlossaryEditing extends Plugin {

    static get requires() {
        return [ Widget ];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add( 'insertGlossary', new InsertGlossary( this.editor, TOOLTIPTEXT ) );
        console.log(this.editor);
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

        // schema.register( 'glossaryTooltipTitle', {
        //     allowIn: ['glossaryTooltip'],
        //     allowWhere: '$block',
        //     allowContentOf: '$block',
        //     // isInline: true,
        //     isLimit: false,
        //     editable: false,
        //     contenteditable: false,
        // } );

    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for( 'upcast' ).elementToAttribute ({
            view: {
                name: 'span',
                attributes: {
                    [ TOOLTIPTEXT ]: true,
                },
            },
            model: {
                key: TOOLTIPTEXT,
                value: viewElement => viewElement.getAttribute( TOOLTIPTEXT ),
            },
        })

        // conversion.for( 'upcast' ).elementToAttribute( {
        //     view: {
        //         name: 'p',
        //         classes: 'tooltipCk',
        //         attributes: {
        //             tooltipText: true,
        //         },
        //     },
        //     model: {
        //         key: 'glossaryTooltip',
        //         value: (viewElement) => {
        //             return viewElement.getAttribute(TOOLTIPTEXT)
        //         },
        //     }
        // } );

        conversion.for( 'dataDowncast' ).attributeToElement( {
            model: TOOLTIPTEXT,
            view: createGlossaryElement,
        })

        conversion.for( 'editingDowncast' ).attributeToElement( {
            model: TOOLTIPTEXT,
            view: ( tooltipText, conversionApi ) => {
                return createGlossaryElement(tooltipText, conversionApi)
            }
        })

        function createGlossaryElement ( tooltipText, { writer } ) {
            const glossaryEl = writer.createAttributeElement( 'span', { tooltipText } )
            writer.setCustomProperty( TOOLTIPTEXT, true, glossaryEl )
            writer.setAttribute( 'class', 'tooltipCk popover-element', glossaryEl )

            return glossaryEl
        }
    }
}
