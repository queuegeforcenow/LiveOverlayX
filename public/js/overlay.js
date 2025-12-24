// =========================
// LiveOverlayX Overlay Script
// =========================

// URLパラメータ取得
const params = new URLSearchParams(window.location.search);

const twitchId = params.get("twitch");
const youtubeId = params.get("youtube");
const speed = Number(params.get("speed")) || 1;
const font = params.get("font") || "Inter";
const showPlatform = params.get("platform") !== "false";
const showUser = params.get("user") !== "false";

// DOM
const container = document.getElementById("overlay-container");

// WebSocket（Render想定）
const socketProtocol = location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(
  `${socketProtocol}://${location.host}/ws?` +
    `twitch=${twitchId || ""}&youtube=${youtubeId || ""}`
);

// =========================
// Style Apply
// =========================
document.documentElement.style.setProperty("--overlay-font", font);
document.documentElement.style.setProperty("--overlay-speed", speed);

// =========================
// WebSocket Events
// =========================
socket.addEventListener("open", () => {
  console.log("LiveOverlayX connected");
});

socket.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data);
    pushComment(data);
  } catch (e) {
    console.error("Invalid message", e);
  }
});

socket.addEventListener("close", () => {
  console.warn("Connection closed");
});

// =========================
// Comment Renderer
// =========================
function pushComment(data) {
  /*
    data = {
      platform: "Twitch" | "YouTube",
      user: "username",
      message: "text",
      member: true | false
    }
  */

  const comment = document.createElement("div");
  comment.className = "overlay-comment";

  if (data.member) {
    comment.classList.add("member");
  }

  // 表示テキスト
  let header = "";
  if (showPlatform) header += `${data.platform}-`;
  if (showUser) header += `${data.user}:`;

  comment.innerHTML = `
    <span class="comment-header">${escapeHTML(header)}</span>
    <span class="comment-message">${escapeHTML(data.message)}</span>
  `;

  container.appendChild(comment);

  // 初期位置
  comment.style.bottom = "-60px";

  // アニメーション
  requestAnimationFrame(() => {
    comment.style.transform = "translateY(-120px)";
    comment.style.opacity = "1";
  });

  // 削除
  setTimeout(() => {
    comment.style.opacity = "0";
    setTimeout(() => comment.remove(), 1000);
  }, 6000 / speed);
}

// =========================
// Utilities
// =========================
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (m) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}

// =========================
// Demo Mode (no backend)
// =========================
if (!twitchId && !youtubeId) {
  console.warn("Demo mode enabled");

  setInterval(() => {
    pushComment({
      platform: Math.random() > 0.5 ? "Twitch" : "YouTube",
      user: "SampleUser",
      message: "LiveOverlayX デモコメント",
      member: Math.random() > 0.7
    });
  }, 2000);
}
