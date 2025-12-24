
import tmi from "tmi.js";

export default function connectTwitch(channel, cb) {
  const client = new tmi.Client({ channels: [channel] });
  client.connect();
  client.on("message", (_, tags, message) => {
    cb({
      platform: "Twitch",
      user: tags["display-name"],
      text: message,
      member: tags.subscriber
    });
  });
}
