import ClassicEditor from './ckeditor/ckeditor5';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

ClassicEditor
    .create( document.querySelector( '.editor' ))
    .then( editor => {
        CKEditorInspector.attach( { 'editor': editor } );
        window.editor = editor;
                
    })
    .catch( error => {
        console.error( error.stack );
    });
   
