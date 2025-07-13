import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WebSocketClient')
export class WebSocketClient extends Component
{
    public onOpen?: () => void;
    public onMessage?: ( data: string ) => void;
    public onClose?: () => void;
    public onError?: ( error: Event ) => void;

    private socket : WebSocket | null = null;

    start()
    {
        this.connectToWebSocket( "ws://localhost:3000" );
    }

    connectToWebSocket( url: string )
    {
        this.socket = new WebSocket( url );

        this.socket.onopen = () =>
        {
            console.log( "WebSocket connection opened" );

            if (this.onOpen)
            {
                this.onOpen();
            }
        };

        this.socket.onmessage = ( event ) =>
        {
            let _message : string = event.data;
            
            console.log( "Message from server:", _message );

            if (this.onMessage)
            {
                this.onMessage( _message );
            }
        };

        this.socket.onclose = () =>
        {
            console.log( "WebSocket connection closed" );

            if (this.onClose)
            {
                this.onClose();
            }
        };

        this.socket.onerror = ( error ) =>
        {
            console.error( "WebSocket error:", error );

            if (this.onError)
            {
                this.onError( error );
            }
        };
    }

    sendMessage( message: string )
    {
        if (this.socket && this.socket.readyState === WebSocket.OPEN)
        {
            this.socket.send( message );
            console.log( "Message sent:", message );
        }
        else
        {
            console.error( "WebSocket is not open. Cannot send message." );
        }
    }

    closeConnection()
    {
        if (this.socket)
        {
            this.socket.close();
            console.log( "WebSocket connection closed" );
        }
    }
}
