import express from "express";
import {matchRouter} from "./routes/matches.js";
import http from "http";
import {attachWebsocket} from "./ws/server.js";

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is up and running!" );
});

app.use('/matches', matchRouter);

const { broadcastMatchCreated } = attachWebsocket(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const baseURL = '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server is running on ${baseURL}`);
    console.log(`Websocket Server is running on: ${baseURL.replace('http', 'ws')}/ws`);
});
