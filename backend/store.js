import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_PATH = path.join(__dirname, "../comments.json");

// 初期化
if (!fs.existsSync(STORE_PATH)) {
  fs.writeFileSync(STORE_PATH, "[]", "utf-8");
}

// ===== Save =====
export function saveComment(comment) {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const data = JSON.parse(raw);

    data.push({
      ...comment,
      timestamp: Date.now()
    });

    // 最大1000件
    if (data.length > 1000) {
      data.splice(0, data.length - 1000);
    }

    fs.writeFileSync(
      STORE_PATH,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (e) {
    console.error("Store error:", e);
  }
}

// ===== Read =====
export function loadComments() {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return [];
  }
}

