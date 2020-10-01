import Command from '@ckeditor/ckeditor5-core/src/command';


export default class InsertTooltip extends Command {

    constructor( editor, attributeKey ) {
        super( editor );
        this.attributeKey = attributeKey;
    }    

    execute() {
        const self = this;
        $('.ckModal').on('shown.bs.modal', function() {
            const selection = self.editor.model.document.selection;

            // Handle the selected text.
            self._handleSelectedText();
            $('.btn-ckeditor-glossary').on('click', function() {                
                let ck_term = $('input[name=ck_term]').val();
                let ck_desc = $('input[name=ck_desc]').val();

                self.editor.model.change(writer => {
                    const node = writer.createText( ck_term, { [ self.attributeKey ]: ck_desc } );
                 
                    self.editor.model.insertContent( node, selection.focus );

                    for (const range of selection.getRanges()) {
                        writer.remove(range);
                    }

                    // Put the selection at the end of the inserted link.
                    if (node.parent) {
                        writer.setSelection( writer.createPositionAfter(node) );
                        self.editor.editing.view.focus();
                    }
                    
                    ['tooltip'].forEach(item => {
                        writer.removeSelectionAttribute( item );
                    });
                    console.log(node);
                    
                    $('input[name=ck_term]').val('');
                    $('input[name=ck_desc]').val('');
                });
                $('.ckModal').modal('hide');
            });
        }).modal();
    }

    _handleSelectedText() {
        const editor = this.editor;
        const model = editor.model;
        const selection = model.document.selection;

        $('input[name=ck_term]').val('');
        $('input[name=ck_desc]').val('');

        if (selection.hasAttribute(this.attributeKey)) {
            // Selected expression.
            if (!selection.isCollapsed) {
                const tooltipNode = selection.anchor.nodeAfter;

                $('input[name=ck_term]').val(tooltipNode.data);
                $('input[name=ck_desc]').val(tooltipNode._attrs.get('tooltip'));

            } else {
                let textNode = selection.anchor.textNode;

                if (!textNode && selection.anchor.nodeAfter) {
                    textNode = selection.anchor.nodeAfter;
                } else if (!textNode && selection.anchor.nodeBefore) {
                    textNode = selection.anchor.nodeBefore;
                }

                if (textNode.hasAttribute('tooltip')) {
                    const textSelection = model.createSelection(textNode, 'on');
                    model.change(writer => {
                        writer.setSelection(textSelection);
                    });

                    $('input[name=ck_term]').val(selection.anchor.nodeAfter.data);
                    $('input[name=ck_desc]').val(selection.anchor.nodeAfter._attrs.get('tooltip'));

                }
            }
            $('input[name=ck_desc]').focus();
        } else {
            if (!selection.isCollapsed) {
                const range = selection.getFirstRange();
                let selectedText = '';
                let countItems = 0;

                for (const item of range.getItems()) {
                    selectedText = selectedText + item.data;
                    countItems++;
                }

                if ( countItems > 0 ) {
                    $('input[name=ck_term]').val(selectedText);
                    $('input[name=ck_desc]').focus();
                }
            }
            $('input[name=ck_term]').focus();
        }
    }
}

