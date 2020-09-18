import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertGlossaryCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            // Insert <glossary>*</glossary> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertContent( createGlossary( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'glossary' );

        this.isEnabled = allowedIn !== null;
    }
}

function createGlossary( writer ) {
    const glossary = writer.createElement( 'glossary' );
    const glossaryDiv = writer.createElement( 'glossaryDiv' );
    const glossarySpan = writer.createElement( 'glossarySpan' );

    writer.append( glossaryDiv, glossary );
    writer.append( glossarySpan, glossary );

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement( 'paragraph', glossarySpan );

    return glossary;
}