import tmi from "tmi.js";

let client = null;
const joinedChannels = new Set();

// =========================
// Connect Twitch
// =========================
export function connectTwitch(onMessage) {
  if (client) return;

  client = new tmi.Client({
    options: {
      debug: false
    },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
      // 匿名接続（読み取り専用）
      username: "justinfan12345",
      password: "oauth:anonymous"
    },
    channels: []
  });

  client.connect();

  client.on("message", (channel, tags, message, self) => {
    if (self) return;

    const data = {
      platform: "Twitch",
      channel: channel.replace("#", ""),
      user: tags["display-name"] || tags.username || "Unknown",
      message,
      member: !!tags.subscriber
    };

    onMessage(data);
  });

  client.on("connected", () => {
    console.log("Twitch connected");
  });
}

// =========================
// Join Channel (Dynamic)
// =========================
export function joinTwitchChannel(channel) {
  if (!client) return;
  if (joinedChannels.has(channel)) return;

  client.join(channel);
  joinedChannels.add(channel);

  console.log("Joined Twitch channel:", channel);
}
