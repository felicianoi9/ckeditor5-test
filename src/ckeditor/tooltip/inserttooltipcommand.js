import Command from '@ckeditor/ckeditor5-core/src/command';

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

                    console.log(node);
                    
                    self.editor.model.insertContent( node, selection.focus );

                    for ( const range of selection.getRanges() ) {

                        writer.remove(range);

                    }
                   

                    if (node.parent) {
                        writer.setSelection( writer.createPositionAfter(node) );
                        self.editor.editing.view.focus();
                    }

                    ['tooltip'].forEach( item => {
                        writer.removeSelectionAttribute( item );
                    } );  
                    
                    

                    $('input[name=ck_term]').val('');

                    $('input[name=ck_desc]').val('');

                });

                $('.ckModal').modal('hide');

            });

        }).modal();
    }
  
}
