import GlossaryEditing from './glossaryediting';
import GlossaryUI from './glossaryui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Glossary extends Plugin {
    static get requires() {
        return [ GlossaryEditing, GlossaryUI ];
    }
}