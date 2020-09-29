import Command from '@ckeditor/ckeditor5-core/src/command';
import findAttributeRange from '@ckeditor/ckeditor5-typing/src/utils/findattributerange';
export default class InsertTooltip extends Command {

    constructor( editor, attributeKey ) {
		super( editor );
		
        this.attributeKey = attributeKey;

        		
	}
    
    execute(tooltip, options = {} ) {
        
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

            if ( countItems > 0 ) {

                $('input[name=ck_term]').val(t);

                $('input[name=ck_desc]').focus();

            } else {

                $('input[name=ck_term]').focus();

            }

            $('.btn-ckeditor-glossary').on('click', function() {

                let ck_term = $('input[name=ck_term]').val();

                let ck_desc = $('input[name=ck_desc]').val();

                self.editor.model.change(writer => {

                    // writer.insertText(ck_term, { [ self.attributeKey ]: ck_desc }, selection.focus);

                    const node = writer.createText( ck_term, { [ self.attributeKey ]: ck_desc } );

                    self.editor.model.insertContent( node, selection.focus );

                    for ( const range of selection.getRanges() ) {

                        writer.remove(range);

                    }

                    // Put the selection at the end of the inserted link.

                    writer.setSelection( writer.createPositionAfter( node ) );

                    ['tooltip'].forEach( item => {
                        writer.removeSelectionAttribute( item );
                    } );

                    // const rangesToUnlink = selection.focus.nodeAfter;
                    // console.log(rangesToUnlink);

                    // // const rangesToUnlink = selection.isCollapsed ?
                    // //     [ findAttributeRange(
                    // //         selection.getFirstPosition(),
                    // //         self.attributeKey,
                    // //         selection.getAttribute( self.attributeKey ),
                    // //         self.editor.model
                    // //     ) ] :
                    // //     selection.getRanges();

                    // // Remove `linkHref` attribute from specified ranges.
                    // for ( const range of rangesToUnlink ) {
                    //     writer.removeAttribute( self.attributeKey , range );
                    //     // If there are registered custom attributes, then remove them during unlink.
                       
                    // }

                    // console.log(node.getPath());

                    $('input[name=ck_term]').val('');

                    $('input[name=ck_desc]').val('');

                });

                $('.ckModal').modal('hide');

            });

        }).modal();
    }

    // refresh() {
    //     const model = this.editor.model;
    //     const selection = model.document.selection;
    //     const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), this.attributeKey );

    //     this.isEnabled = allowedIn !== null;
    // }    
}
