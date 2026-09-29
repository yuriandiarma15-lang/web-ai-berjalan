import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, ContactShadows } from "@react-three/drei";
import { ArrowUpRight, Bot, Radio } from "lucide-react";

/* ================= KONFIGURASI ================= */
const BOT = "https://t.me/Intradayxauusd_bot";
const BOT_START = `${BOT}?start=start`;
const PORTFOLIO_URL = "https://dashboardpanelporto-production.up.railway.app/";
// Promo berakhir 30 September 2026 pukul 23:59:59 WIB
const PROMO_END = new Date("2026-09-30T23:59:59+07:00").getTime();

// "code" dikirim ke bot sebagai perintah /start <code>. Sesuaikan dengan bot Anda.
const PLANS = [
  { code: "1bulan", label: "1 Bulan", price: "Rp 299.000" },
  { code: "6bulan", label: "6 Bulan", price: "Rp 500.000", group: true },
  { code: "12bulan", label: "12 Bulan", price: "Rp 850.000", group: true },
  { code: "3tahun", label: "3 Tahun", price: "Rp 999.000", promo: true, group: true },
];

const TEAM = [
  { id: 0, name: "M30 Macro", role: "Analis Makro", tf: "M30", color: "#58a6ff", shirt: "#173d69",
    speech: ["Cek struktur besar dulu.", "Tren utama di M30 masih terjaga.", "Area supply dan demand sudah saya tandai.", "Bias makro hari ini sedang saya validasi.", "Level kunci H4 menjadi acuan tim.", "Belum ada perubahan struktur yang signifikan.", "Saya pantau area utama.", "Laporan makro siap untuk briefing leader."] },
  { id: 1, name: "M15 SMC", role: "Analis SMC", tf: "M15", color: "#b57aff", shirt: "#4c2374",
    speech: ["Saya cek market structure.", "Perhatikan area liquidity di atas dan bawah.", "Menunggu konfirmasi BOS atau CHoCH.", "Order block M15 sudah saya petakan.", "Ada potensi liquidity sweep di area ini.", "Fair value gap masih terbuka, saya pantau.", "Struktur M15 selaras dengan bias makro.", "Tunggu konfirmasi berikutnya."] },
  { id: 2, name: "M5 Entry", role: "Analis Entry", tf: "M5", color: "#f4c95d", shirt: "#6c4c12",
    speech: ["Saya cek area entry.", "Menunggu retest sebelum masuk.", "Zona entry sedang dipantau dengan ketat.", "Risk dan reward harus tetap terukur.", "Konfirmasi candle belum lengkap.", "Level stop loss sudah saya hitung.", "Kesabaran adalah kunci entry yang presisi.", "Jangan terburu-buru."] },
  { id: 3, name: "M1 Execution", role: "Analis Eksekusi", tf: "M1", color: "#55d98b", shirt: "#185b3a",
    speech: ["M1 bergerak cepat.", "Momentum jangka pendek sedang saya baca.", "Spread dan likuiditas dalam kondisi normal.", "Eksekusi siap, menunggu aba-aba.", "Saya pantau pergerakan harga terakhir.", "Volatilitas meningkat, tetap waspada.", "Konfirmasi presisi di M1 sudah saya siapkan.", "Tunggu instruksi leader."] },
  { id: 4, name: "Fundamental", role: "Analis Fundamental", tf: "FUND", color: "#ff9f68", shirt: "#71331f",
    speech: ["Saya cek agenda fundamental.", "Kalender ekonomi hari ini sedang direview.", "Data USD dan yield obligasi ikut saya pantau.", "Sentimen dolar berpengaruh pada arah emas.", "Rilis berita berdampak tinggi perlu diwaspadai.", "Kebijakan bank sentral menjadi fokus utama.", "Saya review faktor ekonomi global.", "Fundamental siap dilaporkan ke leader."] },
];

const LEADER_BRIEFING = [
  "KIRIM SIGNAL KE TELEGRAM SEKARANG!",
  "Semua analis, laporkan hasil analisa Anda.",
  "Pastikan signal akurat dan terkonfirmasi.",
];
const LEADER_SOCIAL = [
  "Semua tetap standby.",
  "Disiplin dan manajemen risiko adalah prioritas.",
  "Pantau terus setiap perkembangan market.",
  "Jangan ada signal tanpa konfirmasi.",
  "Koordinasi antar timeframe harus selaras.",
  "Kualitas signal lebih penting daripada kuantitas.",
  "Tetap fokus, briefing berikutnya segera dimulai.",
  "Kerja bagus, tim. Pertahankan ketelitian.",
];

const LEADER = { id: "leader", name: "AI LEADER", role: "Koordinator Signal", tf: "MASTER", color: "#e7c26a" };

/* ================= CSS ================= */
const CSS = `
*{box-sizing:border-box}
html,body,#root{margin:0;width:100%;min-height:100%;background:#071018;color:#f4f1e8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
body{overflow-x:hidden}
button,a{font:inherit}
.xau-app{min-height:100vh;background:radial-gradient(circle at 50% -10%,rgba(199,153,54,.14),transparent 35%),linear-gradient(180deg,#071018,#0b151e 55%,#071018)}
.topbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 28px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(7,16,24,.84);backdrop-filter:blur(18px)}
.brand{display:flex;align-items:center;gap:12px}
.brand-mark{width:40px;height:40px;border:1px solid rgba(238,190,78,.42);border-radius:12px;display:grid;place-items:center;color:#e9c46a;background:rgba(218,169,55,.1)}
.brand-title{font-size:14px;font-weight:800;letter-spacing:.16em}
.brand-sub{margin-top:2px;font-size:10px;color:#818b94;letter-spacing:.12em}
.online{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.12em}
.online-dot{width:7px;height:7px;border-radius:50%}
.hero{width:min(1220px,calc(100% - 40px));margin:0 auto;padding:64px 0 38px;display:grid;grid-template-columns:1.2fr .8fr;gap:48px;align-items:start}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 11px;border:1px solid rgba(231,190,93,.24);border-radius:999px;color:#d6b76b;background:rgba(216,170,62,.07);font-size:10px;font-weight:800;letter-spacing:.14em}
.hero h1{margin:18px 0 14px;max-width:800px;font-size:clamp(40px,6vw,76px);line-height:.96;letter-spacing:-.05em;font-weight:900}
.gold-text{color:#e6bd62;text-shadow:0 0 32px rgba(230,189,98,.18)}
.hero-copy{max-width:650px;color:#9ba5ae;font-size:15px;line-height:1.8}
.pricing{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:26px;max-width:650px}
.plan{padding:14px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(255,255,255,.035)}
.plan.promo{border-color:rgba(230,189,98,.6);background:rgba(230,189,98,.09)}
.plan-label{color:#9ba5ae;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.plan-price{margin:6px 0 4px;font-size:22px;font-weight:900}
.plan-desc{margin-bottom:10px;color:#7e8992;font-size:10px;line-height:1.5}
.plan-badge{display:inline-block;margin-bottom:8px;padding:3px 8px;border-radius:6px;background:#e6bd62;color:#1b1405;font-size:9px;font-weight:900;letter-spacing:.08em}
.plan-perk{margin-bottom:10px;color:#79e0a1;font-size:11px;font-weight:700}
.plan-timer{margin-bottom:8px;color:#f0d184;font-size:11px;font-weight:700}
.cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:0 17px;border:1px solid rgba(230,189,98,.3);border-radius:12px;color:#f8efd9;text-decoration:none;background:rgba(230,189,98,.1);transition:.2s}
.cta:hover{transform:translateY(-2px);background:rgba(230,189,98,.18);border-color:rgba(230,189,98,.5)}
.cta.secondary{color:#c9cfd6;border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.04)}
.plan .cta{width:100%;min-height:38px;font-size:12px;font-weight:800}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.hero-panel{border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:22px;background:linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.018));box-shadow:0 30px 90px rgba(0,0,0,.2)}
.clock-label{color:#7f8992;font-size:10px;text-transform:uppercase;letter-spacing:.14em}
.clock-value{margin-top:6px;font-size:34px;font-weight:800;letter-spacing:-.03em}
.day-name{margin-top:6px;color:#d1af5c;font-size:14px;font-weight:700;letter-spacing:.04em}
.clock-zone{margin-top:2px;color:#818b94;font-size:11px;font-weight:700}
.scene-wrap{width:min(1320px,calc(100% - 28px));margin:0 auto;position:relative;height:min(720px,70vw);min-height:560px;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:24px;background:linear-gradient(180deg,#182731,#111e27 50%,#0c161e);box-shadow:0 40px 120px rgba(0,0,0,.28)}
.scene-wrap canvas{display:block;width:100%!important;height:100%!important}
.scene-label{position:absolute;left:18px;top:18px;z-index:10;padding:9px 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(7,17,25,.76);backdrop-filter:blur(12px);color:#9aa4ad;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;pointer-events:none}
.scene-label strong{color:#e7c269}
.briefing-alert{position:absolute;top:18px;left:50%;transform:translateX(-50%);z-index:12;padding:10px 17px;border:1px solid rgba(231,190,93,.46);border-radius:999px;color:#f0d184;background:rgba(44,31,7,.86);font-size:10px;font-weight:900;letter-spacing:.12em;white-space:nowrap;pointer-events:none}
.closed-banner{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:12;padding:16px 24px;border:1px solid rgba(231,190,93,.5);border-radius:16px;background:rgba(20,16,6,.88);color:#f0d184;text-align:center;font-weight:800;font-size:13px;letter-spacing:.08em;pointer-events:none}
.closed-banner small{display:block;margin-top:6px;color:#9ba5ae;font-size:10px;font-weight:600;letter-spacing:.04em}
.speech-bubble{position:relative;min-width:150px;max-width:230px;padding:10px 13px;border-radius:12px;background:rgba(14,27,39,.96);border:1px solid rgba(226,190,103,.55);color:#edf4f8;font-size:11px;line-height:1.4;text-align:center}
.speech-bubble::after{content:"";position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid rgba(226,190,103,.55)}
.leader-bubble{min-width:260px;max-width:360px;border-color:rgba(218,177,82,.85);color:#f6d883;font-size:12px;font-weight:900;letter-spacing:.06em}
.person-identity{min-width:190px;padding:12px 14px;border:1px solid rgba(226,190,103,.55);border-radius:13px;background:linear-gradient(145deg,rgba(17,31,43,.98),rgba(8,18,27,.98));color:#fff;text-align:left;pointer-events:none}
.pi-header{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.pi-dot{width:9px;height:9px;flex-shrink:0;border-radius:50%}
.pi-status{color:#65dfa0;font-size:7px;font-weight:800;letter-spacing:.12em}
.pi-role{font-size:13px;font-weight:900}
.pi-name{margin-top:3px;color:#d7b762;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
.pi-line{height:1px;margin:9px 0;background:rgba(255,255,255,.08)}
.pi-meta{display:flex;justify-content:space-between;gap:18px}
.pi-meta span{display:block;color:#74818b;font-size:8px;text-transform:uppercase;letter-spacing:.08em}
.pi-meta strong{color:#dce4e8;font-size:9px}
.wall-logo{width:310px;padding:16px 25px;border:1px solid rgba(232,188,88,.22);background:rgba(13,26,36,.86);color:#e5bd61;font-size:21px;font-weight:900;letter-spacing:.18em;text-align:center}
.wall-logo small{display:block;margin-top:6px;color:#87929a;font-size:7px;letter-spacing:.27em}
.schedule-board{width:200px;padding:14px 16px;border:1px solid rgba(232,188,88,.35);border-radius:12px;background:rgba(13,26,36,.92);color:#e5bd61;text-align:center}
.schedule-board h4{margin:0 0 8px;font-size:11px;letter-spacing:.16em}
.schedule-board p{margin:4px 0;color:#dce4e8;font-size:10px;line-height:1.5}
.footer{width:min(1220px,calc(100% - 40px));margin:50px auto 0;padding:24px 0 35px;border-top:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;gap:20px;color:#65717a;font-size:10px}
@media(max-width:1050px){.hero{grid-template-columns:1fr;padding-top:45px}}
@media(max-width:700px){
.topbar{padding:12px 15px}.brand-sub{display:none}
.hero,.footer{width:calc(100% - 26px)}
.hero h1{font-size:44px}
.pricing{grid-template-columns:1fr}
.scene-wrap{width:calc(100% - 16px);height:560px;border-radius:18px}
.footer{flex-direction:column}
.wall-logo{width:250px;font-size:15px}
.briefing-alert{font-size:8px}}
`;

/* ================= HOOKS ================= */
function useJakartaClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit",
      hourCycle: "h23", year: "numeric",
    }).formatToParts(now);
    const get = (type) => parts.find((p) => p.type === type)?.value || "";

    const dayName = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", weekday: "long" }).format(now);
    const dayIdx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[
      new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", weekday: "short" }).format(now)
    ];

    const hour = Number(get("hour"));
    // Buka Senin 07.00 s/d Sabtu 02.00 WIB (jadwal Senin-Jumat, sesi berakhir 02.00 dini hari)
    const open = (dayIdx >= 1 && dayIdx <= 5 && hour >= 7) || (dayIdx >= 2 && dayIdx <= 6 && hour < 2);

    return { hour, minute: Number(get("minute")), second: Number(get("second")), year: get("year"), dayName, open };
  }, [now]);
}

function usePromoCountdown() {
  const [left, setLeft] = useState(() => Math.max(0, PROMO_END - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, PROMO_END - Date.now())), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor(left / 1000);
  const p = (n) => String(n).padStart(2, "0");
  return { text: `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`, ended: left === 0 };
}

/* ================= 3D ================= */
function MovingChart({ color = "#e6bd62", seed = 1 }) {
  const lineRef = useRef(null);
  const POINTS = 46;
  const positions = useMemo(() => new Float32Array(POINTS * 3), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < POINTS; i++) {
      const wave =
        Math.sin(t * 1.25 + i * 0.36 + seed) * 0.08 +
        Math.sin(t * 0.55 + i * 0.16 + seed * 2) * 0.055 +
        Math.sin(i * 0.7 + seed) * 0.045;
      positions[i * 3] = -0.82 + (i / (POINTS - 1)) * 1.64;
      positions[i * 3 + 1] = wave + (i / POINTS) * 0.18;
      positions[i * 3 + 2] = 0.045;
    }
    if (lineRef.current) lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={POINTS} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.95} />
    </line>
  );
}

function ChartScreen({ tf, color, seed }) {
  return (
    <group position={[0, 1.45, 0]}>
      <mesh><boxGeometry args={[1.42, 0.82, 0.08]} /><meshStandardMaterial color="#252d34" metalness={0.55} roughness={0.35} /></mesh>
      <mesh position={[0, 0, 0.045]}><planeGeometry args={[1.27, 0.67]} /><meshBasicMaterial color="#07151d" /></mesh>
      <group position={[0, 0, 0.09]} scale={[0.7, 0.65, 1]}><MovingChart color={color} seed={seed} /></group>
      <mesh position={[0, -0.41, 0]}><boxGeometry args={[0.13, 0.25, 0.12]} /><meshStandardMaterial color="#343a40" /></mesh>
      <mesh position={[0, -0.54, 0]}><boxGeometry args={[0.55, 0.05, 0.28]} /><meshStandardMaterial color="#30363c" /></mesh>
      <Html position={[-0.58, 0.27, 0.1]} center distanceFactor={7}
        style={{ color, fontSize: "7px", fontWeight: 800, letterSpacing: "0.1em", pointerEvents: "none" }}>
        {tf}
      </Html>
    </group>
  );
}

function Chair({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.48, 0]}><boxGeometry args={[0.55, 0.08, 0.55]} /><meshStandardMaterial color="#252c32" roughness={0.8} /></mesh>
      <mesh position={[0, 0.9, -0.23]}><boxGeometry args={[0.55, 0.8, 0.08]} /><meshStandardMaterial color="#22292f" roughness={0.8} /></mesh>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.035, 0.035, 0.45, 8]} /><meshStandardMaterial color="#41484f" /></mesh>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.22, 0.28, 0.05, 10]} /><meshStandardMaterial color="#343a40" /></mesh>
    </group>
  );
}

const LEGS = [[-0.68, 0.46, -0.29], [0.68, 0.46, -0.29], [-0.68, 0.46, 0.29], [0.68, 0.46, 0.29]];

function Desk({ position, color, tf, index }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.02, 0]}><boxGeometry args={[1.65, 0.12, 0.85]} /><meshStandardMaterial color="#252c32" metalness={0.35} roughness={0.62} /></mesh>
      <mesh position={[0, 0.94, 0.41]}><boxGeometry args={[1.67, 0.04, 0.04]} /><meshStandardMaterial color={color} /></mesh>
      {LEGS.map((p, i) => (
        <mesh key={i} position={p}><boxGeometry args={[0.06, 0.92, 0.06]} /><meshStandardMaterial color="#3a4147" /></mesh>
      ))}
      <ChartScreen tf={tf} color={color} seed={index + 1} />
      <mesh position={[0, 1.09, 0.25]}><boxGeometry args={[0.58, 0.025, 0.22]} /><meshStandardMaterial color="#333940" /></mesh>
      <mesh position={[0.47, 1.1, 0.22]}><boxGeometry args={[0.12, 0.035, 0.17]} /><meshStandardMaterial color="#3d444a" /></mesh>
      <Chair position={[0, 0, 0.88]} rotation={Math.PI} />
    </group>
  );
}

function CoffeeStation() {
  return (
    <group position={[4.5, 0, -2.15]}>
      <mesh position={[0, 0.62, 0]}><boxGeometry args={[1.35, 1.15, 0.78]} /><meshStandardMaterial color="#242a2f" metalness={0.25} roughness={0.7} /></mesh>
      <mesh position={[0, 1.22, 0]}><boxGeometry args={[1.48, 0.08, 0.86]} /><meshStandardMaterial color="#3a4045" /></mesh>
      <mesh position={[0, 1.65, -0.02]}><boxGeometry args={[0.65, 0.75, 0.55]} /><meshStandardMaterial color="#353b40" metalness={0.7} roughness={0.3} /></mesh>
      <mesh position={[0, 1.72, 0.285]}><boxGeometry args={[0.38, 0.25, 0.025]} /><meshBasicMaterial color="#132029" /></mesh>
      <mesh position={[0, 1.56, 0.32]}><cylinderGeometry args={[0.035, 0.035, 0.18, 10]} /><meshStandardMaterial color="#d0a84d" emissive="#8a641d" emissiveIntensity={0.35} /></mesh>
      {[0.38, -0.37].map((x, i) => (
        <mesh key={i} position={[x, 1.3, 0.15]}><cylinderGeometry args={[0.09, 0.07, 0.14, 16]} /><meshStandardMaterial color="#eee9dc" /></mesh>
      ))}
      <Html position={[0, 2.18, 0]} center distanceFactor={7}
        style={{ color: "#d1ad58", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", pointerEvents: "none" }}>
        KOPI
      </Html>
    </group>
  );
}

function Plant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.25, 0.19, 0.44, 16]} /><meshStandardMaterial color="#4a3d34" roughness={0.9} /></mesh>
      {[[0, 0.78, 0], [0.18, 0.66, 0.04], [-0.2, 0.66, 0.02], [0.08, 0.7, -0.16]].map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.18, 8, 8]} /><meshStandardMaterial color="#376847" roughness={0.9} /></mesh>
      ))}
    </group>
  );
}

function MeetingTable() {
  return (
    <group position={[0, 0, -1.7]}>
      <mesh position={[0, 0.78, 0]}><cylinderGeometry args={[1.1, 1.1, 0.12, 32]} /><meshStandardMaterial color="#272d32" metalness={0.3} roughness={0.65} /></mesh>
      <mesh position={[0, 0.39, 0]}><cylinderGeometry args={[0.1, 0.22, 0.75, 16]} /><meshStandardMaterial color="#363d43" /></mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.55, 0.6, 0.06, 24]} /><meshStandardMaterial color="#2c3237" /></mesh>
    </group>
  );
}

function CeilingLight({ position }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[1.2, 0.04, 0.35]} /><meshStandardMaterial color="#e6d59e" emissive="#d9b95d" emissiveIntensity={1.15} /></mesh>
      <pointLight intensity={1.8} distance={6} color="#fff1c7" />
    </group>
  );
}

function Person({ position, target, color, shirt, talking, speech, sitting, coffee, leader = false, selected, onSelect, personData }) {
  const group = useRef(null);
  const leftArm = useRef(null);
  const rightArm = useRef(null);
  const walkOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const cur = g.position;
    const dx = (target?.[0] ?? cur.x) - cur.x;
    const dz = (target?.[2] ?? cur.z) - cur.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    let walking = false;

    if (dist > 0.06) {
      walking = true;
      const step = Math.min(dist, (leader ? 1.75 : 1.45) * delta);
      cur.x += (dx / dist) * step;
      cur.z += (dz / dist) * step;
      let d = Math.atan2(dx, dz) - g.rotation.y;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      g.rotation.y += d * 0.12;
    }

    const t = clock.elapsedTime;
    const bob = walking ? Math.abs(Math.sin(t * 9 + walkOffset)) * 0.035 : 0;
    g.position.y = bob + (sitting ? -0.16 : 0);

    const swing = walking ? Math.sin(t * 9 + walkOffset) * 0.28 : sitting ? 0.08 : Math.sin(t * 2.5 + walkOffset) * 0.03;
    if (leftArm.current) leftArm.current.rotation.z = 0.08 + swing;
    if (rightArm.current) rightArm.current.rotation.z = -0.08 - swing;
  });

  const bodyY = sitting ? 0.65 : 0.82;
  const headY = sitting ? 1.02 : 1.25;
  const skin = <meshStandardMaterial color="#b87956" roughness={0.8} />;

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect?.(personData); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      {selected && (
        <Html position={[0, leader ? 2.72 : 2.22, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="person-identity" style={{ borderColor: `${color}88` }}>
            <div className="pi-header">
              <span className="pi-dot" style={{ background: color, boxShadow: `0 0 14px ${color}` }} />
              <span className="pi-status">● ANALIS AKTIF</span>
            </div>
            <div className="pi-role">{personData?.role}</div>
            <div className="pi-name">{personData?.name}</div>
            <div className="pi-line" />
            <div className="pi-meta">
              <div><span>TIMEFRAME</span><strong>{personData?.tf}</strong></div>
              <div><span>STATUS</span><strong>MEMANTAU</strong></div>
            </div>
          </div>
        </Html>
      )}

      {talking && speech && !selected && (
        <Html position={[0, leader ? 2.35 : 2.0, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className={leader ? "speech-bubble leader-bubble" : "speech-bubble"}>{speech}</div>
        </Html>
      )}

      <mesh position={[0, headY, 0]}><sphereGeometry args={[leader ? 0.22 : 0.19, 16, 16]} />{skin}</mesh>
      <mesh position={[0, headY + 0.09, -0.015]}><sphereGeometry args={[0.195, 12, 12]} /><meshStandardMaterial color="#1b1715" roughness={1} /></mesh>
      <mesh position={[0, bodyY, 0]}>
        <boxGeometry args={[leader ? 0.46 : 0.39, leader ? 0.75 : 0.68, 0.28]} />
        <meshStandardMaterial color={leader ? "#b68a31" : shirt} roughness={0.72} />
      </mesh>
      <mesh ref={leftArm} position={[leader ? -0.29 : -0.25, bodyY + 0.02, 0]}><capsuleGeometry args={[0.07, 0.34, 5, 8]} />{skin}</mesh>
      <mesh ref={rightArm} position={[leader ? 0.29 : 0.25, bodyY + 0.02, 0]}><capsuleGeometry args={[0.07, 0.34, 5, 8]} />{skin}</mesh>
      {[-0.11, 0.11].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.28, 0]}><capsuleGeometry args={[0.075, 0.42, 5, 8]} /><meshStandardMaterial color="#30363d" /></mesh>
          <mesh position={[x, 0.05, 0.05]}><boxGeometry args={[0.17, 0.08, 0.28]} /><meshStandardMaterial color="#171b1f" /></mesh>
        </group>
      ))}

      {coffee && (
        <group position={[0.39, bodyY - 0.02, 0.12]}>
          <mesh><cylinderGeometry args={[0.06, 0.045, 0.11, 12]} /><meshStandardMaterial color="#e7e2d5" /></mesh>
          <mesh position={[0, 0.075, 0]}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color="#b37a38" transparent opacity={0.55} /></mesh>
        </group>
      )}

      <mesh position={[0.28, headY + 0.18, 0]}>
        <sphereGeometry args={[selected ? 0.045 : 0.028, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ================= OFFICE SCENE ================= */
const DESKS = [[-3.35, 0, 0.25], [-1.68, 0, 0.25], [0, 0, 0.25], [1.68, 0, 0.25], [3.35, 0, 0.25]];

const SOCIAL_PATHS = [
  [[-3.4, 0, 1.85], [-2.0, 0, -1.1], [-0.3, 0, -2.0], [-1.0, 0, 1.9]],
  [[-2.0, 0, -1.5], [-0.4, 0, -2.0], [1.0, 0, -1.25], [0.4, 0, 1.85]],
  [[-0.5, 0, 1.85], [1.0, 0, -1.9], [2.2, 0, -1.1], [1.3, 0, 1.85]],
  [[1.1, 0, 1.9], [2.5, 0, -1.8], [3.9, 0, -0.5], [2.6, 0, 1.75]],
  [[3.4, 0, 1.8], [4.0, 0, -0.5], [2.7, 0, -1.9], [1.9, 0, 1.75]],
];

const MEETING_OFFSETS = [[-2.0, 0.7], [-1.0, -0.2], [0, 0.65], [1.0, -0.2], [2.0, 0.65]];
const LEADER_PATH = [[-4.5, 0, -1.0], [4.2, 0, -1.0], [4.3, 0, 1.9], [-4.2, 0, 1.9], [0, 0, -0.6]];

function OfficeScene({ clock, selectedPerson, setSelectedPerson }) {
  const closed = !clock.open;
  const sec = clock.hour * 3600 + clock.minute * 60 + clock.second;
  const briefing = clock.minute === 0 && clock.second < 18;
  const mode = briefing ? "briefing" : clock.minute >= 30 ? "working" : "social";

  const coffeeCycle = Math.floor(sec / 50) % TEAM.length;
  const coffeeWindow = sec % 50 >= 31 && sec % 50 <= 42;
  const coffeePerson = coffeeWindow ? coffeeCycle : -1;
  const talkingIndex = Math.floor(sec / 6) % TEAM.length;

  const people = TEAM.map((person, index) => {
    const desk = DESKS[index];
    const path = SOCIAL_PATHS[index];
    const wp = Math.floor(sec / 10 + index * 1.7) % path.length;
    const coffee = mode === "social" && coffeePerson === index;

    let target;
    if (mode === "working") target = [desk[0], 0, desk[2] + 1.03];
    else if (mode === "briefing") target = [MEETING_OFFSETS[index][0], 0, -1.1 + MEETING_OFFSETS[index][1]];
    else if (coffee) target = [4.5, 0, -1.0];
    else target = path[wp];

    return {
      ...person,
      target,
      coffee,
      sitting: mode === "working",
      talking: mode === "social" && !coffee && talkingIndex === index && sec % 6 < 5,
      speechText: person.speech[Math.floor(sec / 18) % person.speech.length],
    };
  });

  const leaderTarget = briefing ? [0, 0, 0.65] : LEADER_PATH[Math.floor(sec / 14) % LEADER_PATH.length];
  const leaderTalking = briefing || (mode === "social" && sec % 20 >= 4 && sec % 20 <= 9);

  return (
    <group>
      {/* Lantai */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow
        onClick={(e) => { e.stopPropagation(); setSelectedPerson(null); }}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#182129" roughness={0.88} />
      </mesh>
      <gridHelper args={[14, 28, "#39434a", "#20282f"]} />

      {/* Tembok */}
      <mesh position={[0, 2.2, -3.65]}><boxGeometry args={[14, 4.5, 0.15]} /><meshStandardMaterial color="#202c35" roughness={0.88} /></mesh>
      {[-6.9, 6.9].map((x) => (
        <mesh key={x} position={[x, 2.2, 0]}><boxGeometry args={[0.15, 4.5, 7.4]} /><meshStandardMaterial color="#18242d" roughness={0.88} /></mesh>
      ))}

      {/* Logo tembok */}
      <Html position={[0, 2.75, -3.54]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="wall-logo">XAU AI SMC GOLD<small>ASISTEN TRADING AI</small></div>
      </Html>

      {/* Jadwal signal di tembok kanan */}
      <Html position={[6.75, 2.2, 0.2]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="schedule-board">
          <h4>JADWAL SIGNAL</h4>
          <p>Senin – Jumat</p>
          <p><strong>07.00 – 02.00 WIB</strong></p>
          <p>Sabtu &amp; Minggu libur (market tutup)</p>
        </div>
      </Html>

      {/* Jendela */}
      {[-4.9, 0, 4.9].map((x, i) => (
        <group key={i} position={[x, 2.15, -3.48]}>
          <mesh><boxGeometry args={[2.35, 1.6, 0.035]} /><meshStandardMaterial color="#273b47" metalness={0.2} roughness={0.5} /></mesh>
          <mesh position={[0, 0, 0.025]}><planeGeometry args={[2.15, 1.4]} /><meshBasicMaterial color="#244052" /></mesh>
          <mesh position={[0, 0, 0.05]}><planeGeometry args={[1.8, 0.01]} /><meshBasicMaterial color="#7396a5" /></mesh>
        </group>
      ))}

      {[-3.5, 0, 3.5].map((x) => <CeilingLight key={x} position={[x, 3.2, -0.7]} />)}

      {DESKS.map((p, i) => <Desk key={i} position={p} color={TEAM[i].color} tf={TEAM[i].tf} index={i} />)}
      <CoffeeStation />
      <MeetingTable />
      <Plant position={[-5.4, 0, -2.4]} />
      <Plant position={[5.4, 0, -2.4]} />
      <Plant position={[-5.5, 0, 1.8]} />

      {/* Orang hanya ada saat kantor buka */}
      {!closed && people.map((p, i) => (
        <Person
          key={p.id}
          position={[DESKS[i][0], 0, DESKS[i][2] + 1.3]}
          target={p.target}
          color={p.color}
          shirt={p.shirt}
          talking={p.talking}
          speech={p.speechText}
          sitting={p.sitting}
          coffee={p.coffee}
          selected={selectedPerson?.id === p.id}
          onSelect={setSelectedPerson}
          personData={p}
        />
      ))}

      {!closed && (
        <Person
          leader
          position={[0, 0, -0.55]}
          target={leaderTarget}
          color="#e7c26a"
          shirt="#8b6928"
          talking={leaderTalking}
          speech={briefing ? LEADER_BRIEFING[Math.floor(clock.second / 6) % LEADER_BRIEFING.length] : LEADER_SOCIAL[Math.floor(sec / 20) % LEADER_SOCIAL.length]}
          sitting={false}
          coffee={false}
          selected={selectedPerson?.id === "leader"}
          onSelect={setSelectedPerson}
          personData={LEADER}
        />
      )}

      {/* Cahaya */}
      <ambientLight intensity={1.8} color="#eaf3f7" />
      <directionalLight position={[0, 8, 5]} intensity={4.5} color="#fff6dc" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-near={0.1} shadow-camera-far={30} />
      <directionalLight position={[-6, 5, 2]} intensity={2.5} color="#dceeff" />
      <directionalLight position={[6, 5, 2]} intensity={2.5} color="#fff0cf" />
      <pointLight position={[0, 4, 0]} intensity={5} distance={14} color="#ffe9b0" />
      <pointLight position={[-5, 3, 0]} intensity={3.5} distance={10} color="#dceeff" />
      <pointLight position={[5, 3, 0]} intensity={3.5} distance={10} color="#fff0cf" />
      <pointLight position={[0, 2.5, -3]} intensity={4} distance={9} color="#e7c56d" />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.22} scale={13} blur={2.4} far={5} />
      <OrbitControls enablePan={false} minDistance={7} maxDistance={15} minPolarAngle={0.65} maxPolarAngle={1.4} target={[0, 0.7, 0]} />
    </group>
  );
}

/* ================= APP ================= */
export default function App() {
  const clock = useJakartaClock();
  const promo = usePromoCountdown();
  const [selectedPerson, setSelectedPerson] = useState(null);

  const pad = (n) => String(n).padStart(2, "0");
  const briefing = clock.open && clock.minute === 0 && clock.second < 18;

  let status = "SANTAI & BERJALAN";
  if (!clock.open) status = "KANTOR LIBUR";
  else if (briefing) status = "BRIEFING PER JAM";
  else if (clock.minute >= 30) status = "DI MEJA KERJA";

  useEffect(() => {
    if (!clock.open) setSelectedPerson(null);
  }, [clock.open]);

  return (
    <div className="xau-app">
      <style>{CSS}</style>

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Bot size={19} /></div>
          <div>
            <div className="brand-title">XAU AI SMC GOLD</div>
            <div className="brand-sub">KANTOR AI VISUAL</div>
          </div>
        </div>
        <div className="online" style={{ color: clock.open ? "#79e0a1" : "#d1af5c" }}>
          <span className="online-dot" style={{ background: clock.open ? "#65e49a" : "#d1af5c", boxShadow: `0 0 14px ${clock.open ? "#65e49a" : "#d1af5c"}` }} />
          {clock.open ? "SISTEM ONLINE" : "KANTOR LIBUR"}
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow"><Radio size={12} />LIVE OFFICE AI ASSISTANT GOLD</div>

          <h1>
            TEAM ANALYST   <span className="gold-text">XAU AI SMC</span>
          </h1>

          <p className="hero-copy">
            Visual di bawah adalah kantor AI Assistant beserta tim yang menganalisa XAUUSD dari
            berbagai sisi teknikal dan fundamental. Signal yang dihasilkan akan dikirim ke kamu
            jika sudah kamu aktifkan.
          </p>

          <div className="pricing">
            {PLANS.map((plan) => (
              <div key={plan.code} className={plan.promo ? "plan promo" : "plan"}>
                {plan.promo && <div className="plan-badge">PROMO</div>}
                <div className="plan-label">{plan.label}</div>
                <div className="plan-price">{plan.price}</div>
                <div className="plan-desc">Akses AI Trading Assistant Signal XAUUSD &amp; Fundamental</div>
                {plan.group && <div className="plan-perk">✓ Undangan ke grup DISKUSI</div>}
                {plan.promo && (
                  <div className="plan-timer">
                    {promo.ended ? "Promo telah berakhir" : `Sisa waktu promo: ${promo.text}`}
                  </div>
                )}
                <a className="cta" href={`${BOT}?start=${plan.code}`} target="_blank" rel="noreferrer">
                  Aktifkan Klik Disini
                </a>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <a className="cta" href={BOT_START} target="_blank" rel="noreferrer">
              Buka Telegram <ArrowUpRight size={15} />
            </a>
            <a className="cta secondary" href={PORTFOLIO_URL} target="_blank" rel="noreferrer">
              Hasil Portofolio Signal Yang Dihasilkan AI Setiap Hari <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="clock-label">AI Assistant Gold Office Time</div>
          <div className="clock-value">{pad(clock.hour)}:{pad(clock.minute)}:{pad(clock.second)}</div>
          <div className="day-name">{clock.dayName}</div>
          <div className="clock-zone">WIB</div>
        </div>
      </section>

      <section className="scene-wrap">
        <div className="scene-label">STATUS KANTOR · <strong>{status}</strong></div>

        {briefing && <div className="briefing-alert">BRIEFING PER JAM · LEADER MEMBERI INSTRUKSI KE TIM</div>}

        {!clock.open && (
          <div className="closed-banner">
            KANTOR SEDANG LIBUR
            <small>Market tutup · Signal kembali aktif Senin 07.00 WIB</small>
          </div>
        )}

        <Canvas
          shadows
          camera={{ position: [9, 7.4, 10], fov: 43 }}
          dpr={[1, 1.6]}
          onPointerMissed={() => setSelectedPerson(null)}
        >
          <color attach="background" args={["#14212a"]} />
          <OfficeScene clock={clock} selectedPerson={selectedPerson} setSelectedPerson={setSelectedPerson} />
        </Canvas>
      </section>

      <footer className="footer">
        <div>© {clock.year} XAU AI SMC GOLD</div>
        <div>SIMULASI VISUAL KANTOR · ASIA/JAKARTA</div>
      </footer>
    </div>
  );
}
