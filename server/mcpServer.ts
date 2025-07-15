import { Request, Response } from 'express';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { z } from "zod";
import { WebSocketServerInterface } from './ws/WebSocketServerInterface';

export default function setupMCPServer(webSocket: WebSocketServerInterface, app) {
    const server = new McpServer({
        name: 'json-response-streamable-http-server',
        version: '1.0.0',
    }, {});

    server.tool(
        "get-button-ids",
        "receive a list with all button ids of the current UI",
        {},
        async ({ }) => {
            const response = await webSocket.sendWebSocketMessage(JSON.stringify({ action: "getButtons" }));
            return {
                content: [{ type: "text", text: response }]
            };
        }
    );

    server.tool(
        "press-button",
        "press a button on the UI with a given button id. The button id can be received using the get-button-ids tool",
        { buttonId: z.string() },
        async ({ buttonId }) => {
            const response = await webSocket.sendWebSocketMessage(JSON.stringify({ action: "pressButton", buttonId: buttonId }));
            return {
                content: [{ type: "text", text: response }]
            };
        }
    );


    const transports: { [sessionId: string]: SSEServerTransport } = {};

    app.get('/mcp/sse', async (req: Request, res: Response) => {
        const transport = new SSEServerTransport('/mcp/messages', res);
        transports[transport.sessionId] = transport;
        res.on("close", () => {
            delete transports[transport.sessionId];
        });
        await server.connect(transport);
    });
    app.post('/mcp/messages', async (req: Request, res: Response) => {
        const sessionId = req.query.sessionId as string;
        const transport = transports[sessionId];
        if (transport) {
            await transport.handlePostMessage(req, res);
        } else {
            res.status(400).send('No transport found for sessionId');
        }
    });
}

