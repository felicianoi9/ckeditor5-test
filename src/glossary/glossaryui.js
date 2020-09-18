
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class GlossaryUI extends Plugin {
    init() {

        const editor = this.editor;
        const t = editor.t;

       
        editor.ui.componentFactory.add( 'glossary', locale => {
            // The state of the button will be bound to the widget command.
            // const command = editor.commands.get( 'insertSimpleBox' );

            // The button will be an instance of ButtonView.
            const buttonView = new ButtonView( locale );

            buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Glossary' ),
                withText: true,
                tooltip: true
            } );

            buttonView.on( 'execute', locale => {
                
                const selection = editor.model.document.selection;
                const range = selection.getFirstRange();

                let t = '';

                for (const item of range.getItems()) {
                    t = t + item.data;
                    
                }  
                console.log(t);

                let ck_term;

                let ck_desc = prompt("Digite seu nome:");

                console.log(ck_desc);
            });

            // Bind the state of the button to the command.
            // buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // Execute the command when the button is clicked (executed).
            // this.listenTo( buttonView, 'execute', () => editor.execute( 'insertSimpleBox' ) );

            return buttonView;
        } );
    }
}