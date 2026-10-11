
import express from "express";
import path from "node:path";
import fs from "node:fs/promises";

const app = express();
const PORT = process.env.PORT || 4173;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "clicks.json");
const DIST_DIR = path.join(process.cwd(), "dist");

const INITIAL_TOTAL = 1459;
const allowedLabels = new Set(["paid", "free", "admin"]);

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

let totalClicks = INITIAL_TOTAL;
let writeQueue = Promise.resolve();

async function saveCounter() {
  const tempFile = `${DATA_FILE}.tmp`;

  await fs.writeFile(
    tempFile,
    JSON.stringify(
      {
        total: totalClicks,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );

  await fs.rename(tempFile, DATA_FILE);
}

async function initializeCounter() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    const content = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(content);

    if (
      Number.isSafeInteger(data.total) &&
      data.total >= INITIAL_TOTAL
    ) {
      totalClicks = data.total;
    } else {
      totalClicks = INITIAL_TOTAL;
      await saveCounter();
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Gagal membaca counter:", error.message);
    }

    totalClicks = INITIAL_TOTAL;
    await saveCounter();
  }

  console.log(`Counter siap: ${totalClicks.toLocaleString("id-ID")}`);
}

app.get("/api/clicks", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");

  res.json({
    success: true,
    total: totalClicks,
  });
});

app.post("/api/clicks", async (req, res) => {
  res.set("Cache-Control", "no-store");

  const { label } = req.body || {};

  if (typeof label !== "string" || !allowedLabels.has(label)) {
    return res.status(400).json({
      success: false,
      message: "Label klik tidak valid.",
    });
  }

  let newTotal;

  const operation = writeQueue.then(async () => {
    totalClicks += 1;
    newTotal = totalClicks;
    await saveCounter();
  });

  writeQueue = operation.catch(() => {});

  try {
    await operation;

    return res.json({
      success: true,
      total: newTotal,
    });
  } catch (error) {
    totalClicks -= 1;

    console.error("Gagal menyimpan klik:", error.message);

    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan jumlah klik.",
    });
  }
});

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

async function startServer() {
  try {
    await initializeCounter();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("==================================");
      console.log("XAU AI INTELLIGENCE");
      console.log("CLICK COUNTER API AKTIF");
      console.log(`PORT: ${PORT}`);
      console.log("STORAGE: JSON FILE");
      console.log("DATABASE: TIDAK DIGUNAKAN");
      console.log("==================================");
    });
  } catch (error) {
    console.error("Gagal memulai server:", error);
    process.exit(1);
  }
}

startServer();
