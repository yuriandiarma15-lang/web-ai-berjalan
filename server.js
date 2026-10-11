
import express from "express";
import pg from "pg";
import path from "node:path";

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 4173;

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

// ==========================================
// DATABASE POSTGRESQL RAILWAY
// ==========================================

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL belum dikonfigurasi.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined,
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error);
});

// ==========================================
// INISIALISASI TABEL
// ==========================================

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_counter (
      id INTEGER PRIMARY KEY,
      total BIGINT NOT NULL DEFAULT 1459
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS click_logs (
      id BIGSERIAL PRIMARY KEY,
      label VARCHAR(20) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Angka awal hanya digunakan ketika baris belum ada.
  // Restart/deploy tidak mengembalikan angka yang sudah tersimpan.
  await pool.query(`
    INSERT INTO user_counter (id, total)
    VALUES (1, 1459)
    ON CONFLICT (id) DO NOTHING
  `);

  console.log("PostgreSQL siap.");
}

// ==========================================
// AMBIL TOTAL KLIK
// GET /api/clicks
// ==========================================

app.get("/api/clicks", async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    const result = await pool.query(`
      SELECT total
      FROM user_counter
      WHERE id = 1
    `);

    if (result.rowCount === 0) {
      return res.status(500).json({
        success: false,
        message: "Penghitung belum diinisialisasi.",
      });
    }

    return res.json({
      success: true,
      total: Number(result.rows[0].total),
    });
  } catch (error) {
    console.error("Gagal mengambil total klik:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil total klik.",
    });
  }
});

// ==========================================
// TAMBAH KLIK SECARA ATOMIK
// POST /api/clicks
// ==========================================

const allowedLabels = new Set(["paid", "free", "admin"]);

app.post("/api/clicks", async (req, res) => {
  res.set("Cache-Control", "no-store");

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

  let client;

  try {
    client = await pool.connect();

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO click_logs (label) VALUES ($1)`,
      [label]
    );

    const result = await client.query(`
      UPDATE user_counter
      SET total = total + 1
      WHERE id = 1
      RETURNING total
    `);

    if (result.rowCount === 0) {
      throw new Error("Baris penghitung tidak ditemukan.");
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      total: Number(result.rows[0].total),
    });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Koneksi mungkin sudah terputus.
      }
    }

    console.error("Gagal menyimpan klik:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan jumlah klik.",
    });
  } finally {
    client?.release();
  }
});

// ==========================================
// SERVE WEBSITE VITE
// ==========================================

const DIST_DIR = path.join(process.cwd(), "dist");

app.use(express.static(DIST_DIR));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API tidak ditemukan.",
    });
  }

  res.sendFile(path.join(DIST_DIR, "index.html"), (error) => {
    if (error) next(error);
  });
});

// ==========================================
// START SERVER
// ==========================================

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("==================================");
      console.log("XAU AI INTELLIGENCE");
      console.log("CLICK COUNTER API AKTIF");
      console.log(`PORT: ${PORT}`);
      console.log("DATABASE: PostgreSQL");
      console.log("TOTAL AWAL: 1459");
      console.log("==================================");
    });
  } catch (error) {
    console.error("Gagal memulai server:", error);
    process.exit(1);
  }
}

startServer();
