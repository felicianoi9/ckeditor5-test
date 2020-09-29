// import Command from '@ckeditor/ckeditor5-core/src/command';

// export default class InsertGlossary extends Command {

//     execute() {
//         const self = this;

//         $('.ckModal').on('shown.bs.modal', function() {
//             const selection = self.editor.model.document.selection;
//             const range = selection.getFirstRange();

//             let t = '';


//             let countItems = 0;

//             for (const item of range.getItems()) {
//                 t = t + item.data;
//                 countItems++;
//             }

//             if ( countItems > 0 ) {
//                 $('input[name=ck_term]').val(t);
//                 $('input[name=ck_desc]').focus();
//             } else {
//                 $('input[name=ck_term]').focus();
//             }

//             $('.btn-ckeditor-glossary').on('click', function(){
//                 let ck_desc = $('input[name=ck_desc]').val();
//                 if ( countItems == 0) {
//                     t =  $('input[name=ck_term]').val();
//                 }

//                 self.editor.model.change( writer => {
//                     self.editor.model.insertContent( createGlossary( writer, t, ck_desc ) );
//                 } );
//                 debugger

//                 ck_desc = '';

//                 $('.ckModal').modal('hide');
//             });

//             countItems = 0;

//         }).modal();
//     }

//     refresh() {
//         const model = this.editor.model;
//         const selection = model.document.selection;
//         const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'glossaryTooltip' );

//         this.isEnabled = allowedIn !== null;
//     }
// }

// function createGlossary( writer , ck_term, ck_desc) {
//     const glossaryTooltip = writer.createElement( 'glossaryTooltip' );

//     // Input text
//     const textDiv = writer.createText(ck_term);
//     const textSpan = writer.createText(ck_desc);

//     // Create ToolTip in writer
//     writer.setAttribute( 'tooltipText', textSpan, glossaryTooltip )
//     writer.insertText( textDiv, glossaryTooltip );

//     // Create ToolTip baloon
//     // const glossaryTooltipText = writer.createElement( 'glossaryTooltipText' );
//     // writer.insert( textSpan, glossaryTooltipText, 'end' );
//     // writer.append( glossaryTooltipText, glossaryTooltip );

//     console.log(glossaryTooltip);

//     return glossaryTooltip;
// }




import Command from '@ckeditor/ckeditor5-core/src/command'

const TOOLTIPTEXT = 'tooltipText'

// * ATTRIBUTE COMMANDS

export default class InsertGlossary extends Command {
	constructor( editor, attributeKey ) {
		super( editor );
		this.attributeKey = attributeKey;
	}

	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		//// this.value = this._getValueFromFirstAllowedNode();
		this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, this.attributeKey );
    }

	execute() {
        const self = this;
		const model = self.editor.model;
		const doc = model.document;
		const selection = doc.selection;
        //// const value = ( options.forceValue === undefined ) ? !self.value : options.forceValue;

        // * This will be the exported element
        // let newElement = null

        // model.change( writer => {
        //     newElement = writer.createElement( TOOLTIPTEXT, { [ this.attributeKey ]: '' } )
        // })

        // On modal show
        $('.ckModal').on('shown.bs.modal', function() {

            // Define input focus on modal
            if ( selection.isCollapsed ) { // Is selection null?
                $('input[name=ck_term]').focus();
            } else {
                /**
                 * TODO Replace 'selection' placeholder string for actual selection placeholder
                 */
                $('input[name=ck_term]').val('selection');
                $('input[name=ck_desc]').focus();

                //// newElement._children._nodes.push('selection')
            }

            $('.btn-ckeditor-glossary').on('click', function(){
                let ck_text = $('input[name=ck_term]').val();
                let ck_desc = $('input[name=ck_desc]').val();

                model.change( writer => {
                    // writer.setAttributes({ [ self.attributeKey ]: ck_desc }, newElement)
                    // newElement._children._nodes = [ck_text]

                    // console.log(newElement);
                    writer.insertText(ck_text, { [ self.attributeKey ]: ck_desc }, selection.focus)
                })

                $('.ckModal').modal('hide');
            });

        }).modal();
	}

	_getValueFromFirstAllowedNode() {
		const model = this.editor.model;
		const schema = model.schema;
		const selection = model.document.selection;

		if ( selection.isCollapsed ) {
			return selection.hasAttribute( this.attributeKey );
		}

		for ( const range of selection.getRanges() ) {
			for ( const item of range.getItems() ) {
				if ( schema.checkAttribute( item, this.attributeKey ) ) {
					return item.hasAttribute( this.attributeKey );
				}
			}
		}

		return false;
	}
}
