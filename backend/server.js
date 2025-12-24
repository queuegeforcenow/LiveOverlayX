
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import connectTwitch from "./twitch.js";
import connectYouTube from "./youtube.js";
import { saveComment } from "./store.js";
import { nanoid } from "nanoid";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static("public"));

const rooms = new Map();

wss.on("connection", (ws, req) => {
  const roomId = req.url.split("/").pop();
  ws.roomId = roomId;
  if (!rooms.has(roomId)) rooms.set(roomId, []);
  rooms.get(roomId).push(ws);
});

function broadcast(roomId, data) {
  rooms.get(roomId)?.forEach(ws => {
    if (ws.readyState === 1) ws.send(JSON.stringify(data));
  });
}

app.post("/api/create", (req, res) => {
  const { twitch, youtube } = req.body;
  const roomId = nanoid(8);

  connectTwitch(twitch, msg => {
    saveComment(msg);
    broadcast(roomId, msg);
  });

  connectYouTube(youtube, msg => {
    saveComment(msg);
    broadcast(roomId, msg);
  });

  res.json({
    overlayUrl: `/overlay.html?room=${roomId}`
  });
});

server.listen(process.env.PORT || 3000);
