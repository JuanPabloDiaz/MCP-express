import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketServerInterface } from './ws/WebSocketServerInterface';

function setupWebSocketServer(server: Server): WebSocketServerInterface {
    const wss = new WebSocketServer({ server });
    let currentWsInstance;
    const correlationIdMap = new Map<string, { resolve: (value: string) => void, reject: (reason?: any) => void }>();

    async function sendWebSocketMessage(message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const correlationId = crypto.randomUUID();
            correlationIdMap.set(correlationId, { resolve, reject });

            const messageWithCorrelationId = JSON.stringify({ correlationId, data: message });
            currentWsInstance.send(messageWithCorrelationId);
        });
    }

    wss.on('connection', (ws) => {
        if (currentWsInstance) {
            currentWsInstance.close();
            console.log('Previous WebSocket connection closed');
        }
        currentWsInstance = ws;
        console.log('New WebSocket connection');

        ws.on('message', (message) => {
            try {
                console.log(`Received WebSocket Message: ${message}`);
                const parsedMessage = JSON.parse(message.toString());
                if (parsedMessage.correlationId && correlationIdMap.has(parsedMessage.correlationId)) {
                    const { resolve } = correlationIdMap.get(parsedMessage.correlationId)!;
                    resolve(parsedMessage.data);
                    correlationIdMap.delete(parsedMessage.correlationId);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });

    return { sendWebSocketMessage };
}

export default setupWebSocketServer;