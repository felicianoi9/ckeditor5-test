
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

// import Placeholder from './placeholder/placeholder';

// import SimpleBox from './simplebox/simplebox';  

import Glossary from './glossary/glossary';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

ClassicEditor
    .create( document.querySelector( '.editor' ), {
        plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic, Glossary ],
        toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList', '|', 'glossary'],
        placeholderConfig: {
            types: [ 'date', 'color', 'first name', 'surname' ]                             
        }
    } )
    .then( editor => {        
       
        CKEditorInspector.attach( 'editor', editor );    

        window.editor = editor;

    } )
    .catch( error => {
        console.error( error.stack );
    } );