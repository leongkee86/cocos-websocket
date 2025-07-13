import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WebSocketClient')
export class WebSocketClient extends Component
{
    private socket: WebSocket | null = null;

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
            // this.sendMessage('Hello Server!');
        };

        this.socket.onmessage = ( event ) =>
        {
            console.log( "Message from server:", event.data);
        };

        this.socket.onclose = () =>
        {
            console.log( "WebSocket connection closed" );
        };

        this.socket.onerror = ( error ) =>
        {
            console.error( "WebSocket error:", error);
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
