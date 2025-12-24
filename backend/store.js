
import fs from "fs";
const FILE = "./comments.json";
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
export function saveComment(c) {
  const arr = JSON.parse(fs.readFileSync(FILE));
  arr.push({ ...c, time: Date.now() });
  fs.writeFileSync(FILE, JSON.stringify(arr));
}
