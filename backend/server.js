import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import { connectTwitch } from "./twitch.js";
import { connectYouTube } from "./youtube.js";
import { saveComment } from "./store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Static =====
app.use(express.static(path.join(__dirname, "../public")));

// ===== HTTP =====
app.get("/health", (_, res) => res.send("OK"));

// ===== Server =====
const server = app.listen(PORT, () => {
  console.log("LiveOverlayX running on port", PORT);
});

// ===== WebSocket =====
const wss = new WebSocketServer({ server });

const clients = new Map(); 
// key: ws , value: { twitch, youtube }

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const twitch = url.searchParams.get("twitch");
  const youtube = url.searchParams.get("youtube");

  clients.set(ws, { twitch, youtube });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

// ===== Broadcast =====
function broadcast(comment) {
  const payload = JSON.stringify(comment);

  for (const [ws, target] of clients.entries()) {
    if (
      (comment.platform === "Twitch" && target.twitch === comment.channel) ||
      (comment.platform === "YouTube" && target.youtube === comment.videoId)
    ) {
      if (ws.readyState === ws.OPEN) {
        ws.send(payload);
      }
    }
  }
}

// ===== Twitch =====
connectTwitch((data) => {
  saveComment(data);
  broadcast(data);
});

// ===== YouTube =====
connectYouTube((data) => {
  saveComment(data);
  broadcast(data);
});

