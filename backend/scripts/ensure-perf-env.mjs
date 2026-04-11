import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const perfDir = path.join(root, "performance");
const dest = path.join(perfDir, ".env.performance");
const src = path.join(perfDir, "env.performance.example");

if (!fs.existsSync(dest)) {
  fs.copyFileSync(src, dest);
  console.log(
    "Created performance/.env.performance from env.performance.example — fill in the values before load tests.",
  );
}
