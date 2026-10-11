import express from "express";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const app = express();
const PORT = process.env.PORT || 4173;

// =====================================================
// KONFIGURASI DATABASE
// Railway: atur DATA_DIR=/data dan pasang Volume /data
// Lokal: database disimpan di folder ./data
// =====================================================

const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.RAILWAY_ENVIRONMENT
    ? "/data"
    : path.join(process.cwd(), "data"));

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(
  path.join(DATA_DIR, "xau-ai-clicks.sqlite")
);

db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

// =====================================================
// TABEL JUMLAH KLIK
// Angka awal: 1459
// =====================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS user_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    total INTEGER NOT NULL DEFAULT 1459
  );

  CREATE TABLE IF NOT EXISTS click_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.prepare(`
  INSERT OR IGNORE INTO user_counter (id, total)
  VALUES (1, 1459)
`).run();

// =====================================================
// MIDDLEWARE
// =====================================================

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

// =====================================================
// API: AMBIL TOTAL KLIK
// GET /api/clicks
// =====================================================

app.get("/api/clicks", (req, res) => {
  const row = db.prepare(`
    SELECT total
    FROM user_counter
    WHERE id = 1
  `).get();

  res.set("Cache-Control", "no-store");

  res.json({
    success: true,
    total: row.total,
  });
});

// =====================================================
// API: TAMBAH JUMLAH KLIK
// POST /api/clicks
// Label yang diterima: paid, free, admin
// =====================================================

const allowedLabels = new Set([
  "paid",
  "free",
  "admin",
]);

const recordClick = db.transaction((label) => {
  db.prepare(`
    INSERT INTO click_logs (label)
    VALUES (?)
  `).run(label);

  db.prepare(`
    UPDATE user_counter
    SET total = total + 1
    WHERE id = 1
  `).run();

  return db.prepare(`
    SELECT total
    FROM user_counter
    WHERE id = 1
  `).get().total;
});

app.post("/api/clicks", (req, res) => {
  const { label } = req.body || {};

  if (
    typeof label !== "string" ||
    !allowedLabels.has(label)
  ) {
    return res.status(400).json({
      success: false,
      message: "Label klik tidak valid.",
    });
  }

  try {
    const total = recordClick(label);

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      total,
    });
  } catch (error) {
    console.error("Gagal menyimpan klik:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan jumlah klik.",
    });
  }
});

// =====================================================
// SERVE WEBSITE REACT / VITE
// =====================================================

const DIST_DIR = path.join(process.cwd(), "dist");

app.use(express.static(DIST_DIR));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(
    path.join(DIST_DIR, "index.html"),
    (error) => {
      if (error) next(error);
    }
  );
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log("==================================");
  console.log("XAU AI INTELLIGENCE");
  console.log("CLICK COUNTER API AKTIF");
  console.log(`PORT: ${PORT}`);
  console.log(`DATABASE: ${path.join(DATA_DIR, "xau-ai-clicks.sqlite")}`);
  console.log("TOTAL AWAL: 1459");
  console.log("==================================");
});
