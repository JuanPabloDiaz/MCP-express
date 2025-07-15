import { Request, Response } from 'express';
import { ChatManager } from './ChatManager';

const chat = new ChatManager();
chat.initialize();

const ollamaChatRequest = async (req: Request, res: Response) => {
    try {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        const response = chat.handleMessageStreaming(req.body.query);
        for await (const part of response) {
            res.write(part);
        }
        res.end();
    } catch (error) {
        console.error('Error in ollamaChatRequest:', error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}

export default ollamaChatRequest;