import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertGlossary extends Command {
    
    execute() {
        const self = this;

        $('.ckModal').on('shown.bs.modal', function() {
            const selection = self.editor.model.document.selection;
            const range = selection.getFirstRange();

            let t = '';

            for (const item of range.getItems()) {
                t = t + item.data;
            }
                
            $('input[name=ck_term]').val(t);
            $('input[name=ck_desc]').focus();

            $('.btn-ckeditor-glossary').on('click', function(){                       
                let ck_desc = $('input[name=ck_desc]').val();

                self.editor.model.change( writer => {
                    self.editor.model.insertContent( createGlossary( writer, t, ck_desc ) );
                    
                    // Insert <glossaryTooltip>*</glossaryTooltip> at the current selection position
                    // in a way that will result in creating a valid model structure.
                    // this.editor.model.insertContent( createGlossary( writer, ck_term, ck_desc ) );
                } );
                
          
                $('.ckModal').modal('hide');
            })
           
        }).modal();
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'glossaryTooltip' );

        this.isEnabled = allowedIn !== null;
    }
}

function createGlossary( writer , ck_term, ck_desc) {
    const glossaryTooltip = writer.createElement( 'glossaryTooltip' );
    const textDiv = writer.createText(ck_term);
    writer.insert( textDiv, glossaryTooltip, 'end' );
    const glossaryTooltipText = writer.createElement( 'glossaryTooltipText' );
    const textSpan = writer.createText(ck_desc);
    writer.insert( textSpan, glossaryTooltipText, 'end' );   

    writer.append( glossaryTooltipText, glossaryTooltip );
    
    return glossaryTooltip;
}