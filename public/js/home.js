// =========================
// LiveOverlayX Home Script
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const twitchInput = document.getElementById("twitchId");
  const youtubeInput = document.getElementById("youtubeId");

  // 保存済みがあれば復元
  twitchInput.value = localStorage.getItem("lox_twitchId") || "";
  youtubeInput.value = localStorage.getItem("lox_youtubeId") || "";

  startBtn.addEventListener("click", () => {
    const twitchId = twitchInput.value.trim();
    const youtubeId = youtubeInput.value.trim();

    if (!twitchId && !youtubeId) {
      alert("Twitch ID または YouTube 動画IDを入力してください");
      return;
    }

    // 保存
    localStorage.setItem("lox_twitchId", twitchId);
    localStorage.setItem("lox_youtubeId", youtubeId);

    // setup画面へ
    const params = new URLSearchParams();
    if (twitchId) params.set("twitch", twitchId);
    if (youtubeId) params.set("youtube", youtubeId);

    window.location.href = `/setup.html?${params.toString()}`;
  });

  // エンターで開始
  [twitchInput, youtubeInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        startBtn.click();
      }
    });
  });
});

// =========================
// UI Effects (optional)
// =========================
const glowElements = document.querySelectorAll(".glow");

glowElements.forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  });
});

