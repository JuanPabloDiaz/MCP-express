import express from "express";
import bodyParser from "body-parser";

import setupWebSocketServer from "./server/websocket-server";
import ollamaChatRequest from "./server/ollama-route";
import setupMCPServer from "./server/mcpServer";
import { port } from "./config";

const app = express();
const server = app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
const jsonParser = bodyParser.json();

app.use(express.static("webapp"));
const webSocketServer = setupWebSocketServer(server);
setupMCPServer(webSocketServer, app);
app.post("/api/request", jsonParser, ollamaChatRequest);
