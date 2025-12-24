import fetch from "node-fetch";

const API_KEY = process.env.YOUTUBE_API_KEY;

let liveChatMap = new Map();
// videoId -> { liveChatId, nextPageToken }

let polling = false;

// =========================
// Connect YouTube
// =========================
export function connectYouTube(onMessage) {
  if (!API_KEY) {
    console.warn("YouTube API key not set");
    return;
  }

  if (polling) return;
  polling = true;

  setInterval(async () => {
    for (const [videoId, state] of liveChatMap.entries()) {
      await fetchChat(videoId, state, onMessage);
    }
  }, 5000); // 5秒ごと
}

// =========================
// Join YouTube Live
// =========================
export async function joinYouTube(videoId) {
  if (liveChatMap.has(videoId)) return;

  const liveChatId = await getLiveChatId(videoId);
  if (!liveChatId) {
    console.warn("LiveChatId not found:", videoId);
    return;
  }

  liveChatMap.set(videoId, {
    liveChatId,
    nextPageToken: null
  });

  console.log("Joined YouTube live:", videoId);
}

// =========================
// Fetch Chat
// =========================
async function fetchChat(videoId, state, onMessage) {
  const url = new URL(
    "https://www.googleapis.com/youtube/v3/liveChat/messages"
  );

  url.searchParams.set("part", "snippet,authorDetails");
  url.searchParams.set("liveChatId", state.liveChatId);
  url.searchParams.set("key", API_KEY);
  if (state.nextPageToken) {
    url.searchParams.set("pageToken", state.nextPageToken);
  }

  try {
    const res = await fetch(url.toString());
    const json = await res.json();

    if (!json.items) return;

    state.nextPageToken = json.nextPageToken;

    for (const item of json.items) {
      const data = {
        platform: "YouTube",
        videoId,
        user: item.authorDetails.displayName,
        message: item.snippet.displayMessage,
        member:
          item.authorDetails.isChatSponsor ||
          item.authorDetails.isChatModerator
      };

      onMessage(data);
    }
  } catch (e) {
    console.error("YouTube fetch error:", e.message);
  }
}

// =========================
// Get LiveChatId
// =========================
async function getLiveChatId(videoId) {
  const url = new URL(
    "https://www.googleapis.com/youtube/v3/videos"
  );

  url.searchParams.set("part", "liveStreamingDetails");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", API_KEY);

  try {
    const res = await fetch(url.toString());
    const json = await res.json();

    return json.items?.[0]?.liveStreamingDetails?.activeLiveChatId || null;
  } catch {
    return null;
  }
}
