import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import GlossaryEditing from './glossaryediting';
import GlossaryUI from './glossaryui';

export default class Glossary extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ GlossaryEditing, GlossaryUI ];
	}

}