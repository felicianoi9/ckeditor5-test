import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertGlossary extends Command {
    
    execute() {
        this.editor.model.change( writer => {

            const selection = editor.model.document.selection;
            const range = selection.getFirstRange();

            let t = '';

            for (const item of range.getItems()) {
                t = t + item.data;
                
            }  
            console.log(t);

            let ck_term = t;

            let ck_desc = '';

            ck_desc  = prompt("Descrição:");  

            // Insert <glossaryTooltip>*</glossaryTooltip> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertContent( createGlossary( writer, ck_term, ck_desc ) );
        } );
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