export interface WebSocketServerInterface {
    sendWebSocketMessage: (message: string) => Promise<string>;
}
