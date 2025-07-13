import { _decorator, Component, Node, EditBox, Label, UITransform, ScrollView, Button, RichText } from 'cc';
import { WebSocketClient } from './WebSocketClient';
const { ccclass, property } = _decorator;

@ccclass('WebSocketDemo')
export class WebSocketDemo extends Component
{
    @property(WebSocketClient) private ws : WebSocketClient = null;
    @property(EditBox) private messageInputBox : EditBox = null;
    @property(Label) private messagePanelLabel : Label = null;
    @property(Node) private contentNode : Node = null!;
    @property(ScrollView) private scrollView : ScrollView = null;
    @property(RichText) private usernameLabel : Label = null;
    @property(Button) private sendButton : Button = null;

    private isLoading : boolean = true;
    private username : string = "";

    start()
    {
        this.ws.onMessage = ( data : string ) => this.onMessageReceived( data );
    }

    public onEditingReturn()
    {
        if (this.sendButton.interactable)
        {
            this.clickToSendMessage();
        }
    }

    public clickToSendMessage()
    {
        let _message = this.messageInputBox.string;
        if (_message)
        {
            this.ws.sendMessage( `[ ${ this.username } ]: ${ _message }` );
            this.messageInputBox.string = "";

            this.scheduleOnce( () =>
            {
                this.messageInputBox.focus();
            },
            0.1 );
        }
    }

    private onMessageReceived( data : string )
    {
        let _data = JSON.parse( data );

        if (_data.type === "message")
        {
            if (this.isLoading)
            {
                this.isLoading = false;
                this.messagePanelLabel.string = "";
            }

            this.messagePanelLabel.string += "\n" + _data.data;

            const _messagePanelLabelTransform = this.messagePanelLabel.node.getComponent( UITransform )!;
            const _contentTransform = this.contentNode.getComponent( UITransform )!;

            this.scheduleOnce( () =>
            {
                _contentTransform.setContentSize( _contentTransform.width, _messagePanelLabelTransform.height );
                this.scrollView.scrollToBottom( 0.2, true );
            },
            0 );
        }
        else if (_data.type === "id")
        {
            this.username = _data.data;
            this.usernameLabel.string = `<color=FFC800>Username:</color> <color=FFFFFF>${ this.username }</color>`;
        }
    }

    public onTextChanged()
    {
        this.sendButton.interactable = ( this.messageInputBox.string !== "" );
    }
}
