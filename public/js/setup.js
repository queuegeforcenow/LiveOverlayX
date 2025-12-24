// =========================
// LiveOverlayX Setup Script
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // URLパラメータ（homeから渡される）
  const params = new URLSearchParams(window.location.search);
  const twitchId = params.get("twitch") || "";
  const youtubeId = params.get("youtube") || "";

  // Inputs
  const twitchInput = document.getElementById("twitchId");
  const youtubeInput = document.getElementById("youtubeId");
  const speedInput = document.getElementById("speed");
  const fontSelect = document.getElementById("font");
  const showPlatformToggle = document.getElementById("showPlatform");
  const showUserToggle = document.getElementById("showUser");
  const generateBtn = document.getElementById("generateBtn");
  const urlBox = document.getElementById("generatedUrl");
  const previewBox = document.getElementById("fontPreview");

  // 初期値セット
  twitchInput.value = twitchId;
  youtubeInput.value = youtubeId;

  speedInput.value = localStorage.getItem("lox_speed") || 1;
  fontSelect.value = localStorage.getItem("lox_font") || "Inter";
  showPlatformToggle.checked =
    localStorage.getItem("lox_showPlatform") !== "false";
  showUserToggle.checked =
    localStorage.getItem("lox_showUser") !== "false";

  applyFontPreview();

  // =========================
  // Events
  // =========================

  fontSelect.addEventListener("change", applyFontPreview);

  generateBtn.addEventListener("click", () => {
    const twitch = twitchInput.value.trim();
    const youtube = youtubeInput.value.trim();
    const speed = speedInput.value;
    const font = fontSelect.value;
    const showPlatform = showPlatformToggle.checked;
    const showUser = showUserToggle.checked;

    if (!twitch && !youtube) {
      alert("Twitch ID または YouTube 動画IDを入力してください");
      return;
    }

    // 保存
    localStorage.setItem("lox_speed", speed);
    localStorage.setItem("lox_font", font);
    localStorage.setItem("lox_showPlatform", showPlatform);
    localStorage.setItem("lox_showUser", showUser);

    // URL生成
    const overlayParams = new URLSearchParams();
    if (twitch) overlayParams.set("twitch", twitch);
    if (youtube) overlayParams.set("youtube", youtube);
    overlayParams.set("speed", speed);
    overlayParams.set("font", font);
    overlayParams.set("platform", showPlatform);
    overlayParams.set("user", showUser);

    const overlayUrl =
      `${location.origin}/overlay.html?` + overlayParams.toString();

    urlBox.textContent = overlayUrl;
    urlBox.classList.add("active");
  });
});

// =========================
// Font Preview
// =========================
function applyFontPreview() {
  const fontSelect = document.getElementById("font");
  const previewBox = document.getElementById("fontPreview");

  const font = fontSelect.value;
  previewBox.style.fontFamily = font;
  previewBox.textContent = `LiveOverlayX プレビュー（${font}）`;
}
