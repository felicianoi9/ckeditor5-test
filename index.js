
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

import Placeholder from './placeholder/placeholder';

import SimpleBox from './simplebox/simplebox';  

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic, Placeholder, SimpleBox  ],
        toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList', '|', 'placeholder', 'simpleBox' ],
        placeholderConfig: {
            types: [ 'date', 'color', 'first name', 'surname' ]                             
        }
    } )
    .then( editor => {
        // console.log( 'Editor was initialized', editor );

        CKEditorInspector.attach( 'editor', editor );

        // editor.execute( 'insertSimpleBox' );
        // console.log( editor.commands.get( 'insertSimpleBox' ).isEnabled );

        // editor.execute( 'placeholder', { value: 'time' } );

        // Expose for playing in the console.
        window.editor = editor;

        console.log(editor.getData());
    } )
    .catch( error => {
        console.error( error.stack );
    } );