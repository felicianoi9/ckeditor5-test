import Command from '@ckeditor/ckeditor5-core/src/command';
import findAttributeRange from '@ckeditor/ckeditor5-typing/src/utils/findattributerange';
import toMap from '@ckeditor/ckeditor5-utils/src/tomap';

export default class InsertTooltip extends Command {

    constructor( editor, attributeKey ) {
		super( editor );
		
        this.attributeKey = attributeKey;
        		
	}
    
    execute( options = {} ) {

        const self = this;

        $('.ckModal').on('shown.bs.modal', function() {
            const selection = self.editor.model.document.selection;
            const range = selection.getFirstRange();

            let t = '';

            
            let countItems = 0;

            for (const item of range.getItems()) {
                t = t + item.data;
                countItems++;
            }

            console.log(countItems);

            if ( countItems > 0 ) {
                $('input[name=ck_term]').val(t);
                $('input[name=ck_desc]').focus();
            } else {
                $('input[name=ck_term]').focus();
            }         
        
            $('.btn-ckeditor-glossary').on('click', function(){                       
                let ck_desc = $('input[name=ck_desc]').val();
                if ( countItems == 0) {
                    t =  $('input[name=ck_term]').val();
                }                

                self.editor.model.change( writer => {
                    const position = selection.getFirstPosition();
                    const linkRange = findAttributeRange( position, 'tooltip', selection.getAttribute( 'tooltip' ), self.editor.model );
                    
                    
                    let ck_term = t;
                    
                    writer.insertText(ck_term, { [ self.attributeKey ]: ck_desc }, selection.getLastPosition())

                    // writer.setSelection( writer.createPositionAfter(linkRange.end.nodeBefore ) );

                    writer.remove(selection.getRanges())
                    
                } );                
                
          
                $('.ckModal').modal('hide');
            });
            
           
            countItems = 0;
           
        }).modal();
    }

    // refresh() {
    //     const model = this.editor.model;
    //     const selection = model.document.selection;
    //     const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'tooltip' );

    //     this.isEnabled = allowedIn !== null;
    // }
}

// function createGlossary( writer , ck_term, title) {
//     const glossaryTooltip = writer.createElement( 'glossaryTooltip' );
//     const textDiv = writer.createText(ck_term);
//     writer.insert( textDiv, glossaryTooltip, 'end' );
//     const glossaryTooltipText = writer.createElement( 'glossaryTooltipText' );
//     const textSpan = writer.createText(ck_desc);
//     writer.insert( textSpan, glossaryTooltipText, 'end' );   

//     writer.append( glossaryTooltipText, glossaryTooltip );
    
//     return glossaryTooltip;
// }
// const attributes = toMap( selection.getAttributes() );

//                     ck_term.set( 'tooltip' , title );

// 					// truthyManualDecorators.forEach( item => {
// 					// 	attributes.set( item, true );
// 					// } );

// 					const node = writer.createText( title, ck_term );

// 					model.insertContent( node, position );

// 					// Put the selection at the end of the inserted link.
// 					writer.setSelection( writer.createPositionAfter( node ) );