import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Canvas, useFrame } from "@react-three/fiber";

import {
  Html,
  OrbitControls,
  ContactShadows,
} from "@react-three/drei";

import * as THREE from "three";

import {
  ArrowUpRight,
  Bot,
  Clock3,
  MessageSquare,
  Radio,
  ShieldCheck,
  Coffee,
  Monitor,
} from "lucide-react";


/* =========================================================
   XAU AI SMC GOLD
   VISUAL OFFICE SIMULATION

   - Visual landing page
   - Tidak melakukan analisa market sungguhan
   - Tidak mengirim signal sungguhan
   - Karakter dapat diklik untuk melihat identitas
   ========================================================= */


const TELEGRAM_URL = "https://t.me/";


/* =========================================================
   TEAM
   ========================================================= */

const TEAM = [
  {
    id: 0,
    name: "M30 Macro",
    role: "Macro Analyst",
    tf: "M30",
    color: "#58a6ff",
    shirt: "#173d69",
    speech: [
      "Cek struktur besar dulu.",
      "M30 mulai terlihat menarik.",
      "Saya pantau area utama.",
      "Tunggu briefing leader.",
    ],
  },

  {
    id: 1,
    name: "M15 SMC",
    role: "SMC Analyst",
    tf: "M15",
    color: "#b57aff",
    shirt: "#4c2374",
    speech: [
      "Saya cek market structure.",
      "Perhatikan liquidity area.",
      "M15 sedang saya pantau.",
      "Tunggu konfirmasi berikutnya.",
    ],
  },

  {
    id: 2,
    name: "M5 Entry",
    role: "Entry Analyst",
    tf: "M5",
    color: "#f4c95d",
    shirt: "#6c4c12",
    speech: [
      "Saya cek area entry.",
      "Pantau retest dulu.",
      "Entry zone sedang dipantau.",
      "Jangan terburu-buru.",
    ],
  },

  {
    id: 3,
    name: "M1 Execution",
    role: "Execution Analyst",
    tf: "M1",
    color: "#55d98b",
    shirt: "#185b3a",
    speech: [
      "M1 bergerak cepat.",
      "Saya pantau pergerakan terakhir.",
      "Execution siap.",
      "Tunggu instruksi leader.",
    ],
  },

  {
    id: 4,
    name: "Fundamental",
    role: "Fundamental Analyst",
    tf: "FUND",
    color: "#ff9f68",
    shirt: "#71331f",
    speech: [
      "Saya cek agenda fundamental.",
      "Pantau news hari ini.",
      "Saya review faktor ekonomi.",
      "Fundamental siap.",
    ],
  },
];


const CHAT_LINES = [
  "M30: struktur besar masih dipantau.",
  "M15: liquidity area sedang diperhatikan.",
  "M5: entry zone belum final.",
  "M1: price movement masih cepat.",
  "Fundamental: agenda ekonomi sedang dicek.",
  "Leader: semua tetap standby.",
];


/* =========================================================
   GLOBAL CSS
   ========================================================= */

const GLOBAL_CSS = `

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  width: 100%;
  min-height: 100%;

  background: #071018;

  color: #f4f1e8;

  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

body {
  overflow-x: hidden;
}

button,
a {
  font: inherit;
}


/* =========================================================
   APP
   ========================================================= */

.xau-app {
  min-height: 100vh;

  background:
    radial-gradient(
      circle at 50% -10%,
      rgba(199, 153, 54, .14),
      transparent 35%
    ),
    radial-gradient(
      circle at 10% 30%,
      rgba(67, 129, 170, .06),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 50%,
      rgba(67, 129, 170, .05),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #071018 0%,
      #0b151e 55%,
      #071018 100%
    );
}


/* =========================================================
   TOP BAR
   ========================================================= */

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 16px 28px;

  border-bottom:
    1px solid rgba(255,255,255,.08);

  background:
    rgba(7,16,24,.84);

  backdrop-filter: blur(18px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 40px;
  height: 40px;

  border:
    1px solid rgba(238,190,78,.42);

  border-radius: 12px;

  display: grid;
  place-items: center;

  color: #e9c46a;

  background:
    rgba(218,169,55,.10);

  box-shadow:
    0 0 30px rgba(218,169,55,.10);
}

.brand-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: .16em;
}

.brand-sub {
  margin-top: 2px;

  font-size: 10px;

  color: #818b94;

  letter-spacing: .12em;
}

.online {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #79e0a1;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: .12em;
}

.online-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #65e49a;

  box-shadow:
    0 0 14px #65e49a;
}


/* =========================================================
   HERO
   ========================================================= */

.hero {
  width: min(1220px, calc(100% - 40px));

  margin: 0 auto;

  padding: 72px 0 38px;

  display: grid;

  grid-template-columns:
    1.2fr
    .8fr;

  gap: 48px;

  align-items: end;
}

.eyebrow {
  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 7px 11px;

  border:
    1px solid rgba(231,190,93,.24);

  border-radius: 999px;

  color: #d6b76b;

  background:
    rgba(216,170,62,.07);

  font-size: 10px;

  font-weight: 800;

  letter-spacing: .14em;
}

.hero h1 {
  margin: 18px 0 14px;

  max-width: 800px;

  font-size:
    clamp(42px, 6vw, 82px);

  line-height: .94;

  letter-spacing: -.055em;

  font-weight: 900;
}

.gold-text {
  color: #e6bd62;

  text-shadow:
    0 0 32px rgba(230,189,98,.18);
}

.hero-copy {
  max-width: 650px;

  color: #9ba5ae;

  font-size: 15px;

  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;

  gap: 12px;

  margin-top: 28px;
}

.cta {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  min-height: 44px;

  padding: 0 17px;

  border:
    1px solid rgba(230,189,98,.30);

  border-radius: 12px;

  color: #f8efd9;

  text-decoration: none;

  background:
    rgba(230,189,98,.10);

  transition:
    .2s ease;
}

.cta:hover {
  transform: translateY(-2px);

  background:
    rgba(230,189,98,.18);

  border-color:
    rgba(230,189,98,.50);
}

.cta.secondary {
  color: #a9afb8;

  border-color:
    rgba(255,255,255,.09);

  background:
    rgba(255,255,255,.03);
}


/* =========================================================
   HERO PANEL
   ========================================================= */

.hero-panel {
  border:
    1px solid rgba(255,255,255,.09);

  border-radius: 20px;

  padding: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.065),
      rgba(255,255,255,.018)
    );

  box-shadow:
    0 30px 90px rgba(0,0,0,.20);
}

.clock-card {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding-bottom: 18px;

  margin-bottom: 18px;

  border-bottom:
    1px solid rgba(255,255,255,.07);
}

.clock-label {
  color: #7f8992;

  font-size: 10px;

  text-transform: uppercase;

  letter-spacing: .14em;
}

.clock-value {
  margin-top: 4px;

  font-size: 28px;

  font-weight: 800;

  letter-spacing: -.03em;
}

.clock-zone {
  color: #d1af5c;

  font-size: 11px;

  font-weight: 700;
}

.system-row {
  display: grid;

  grid-template-columns:
    repeat(3,1fr);

  gap: 9px;
}

.system-stat {
  padding: 13px;

  border:
    1px solid rgba(255,255,255,.07);

  border-radius: 13px;

  background:
    rgba(0,0,0,.12);
}

.system-stat strong {
  display: block;

  font-size: 18px;
}

.system-stat span {
  color: #707b85;

  font-size: 9px;

  text-transform: uppercase;

  letter-spacing: .1em;
}


/* =========================================================
   3D SCENE
   ========================================================= */

.scene-wrap {
  width: min(1320px, calc(100% - 28px));

  margin: 0 auto;

  position: relative;

  height: min(720px, 70vw);

  min-height: 560px;

  overflow: hidden;

  border:
    1px solid rgba(255,255,255,.10);

  border-radius: 24px;

  background:
    radial-gradient(
      circle at 50% 30%,
      rgba(236,202,126,.09),
      transparent 38%
    ),
    linear-gradient(
      180deg,
      #182731 0%,
      #111e27 50%,
      #0c161e 100%
    );

  box-shadow:
    0 40px 120px rgba(0,0,0,.28),
    inset 0 0 100px rgba(255,255,255,.025);
}

.scene-wrap canvas {
  display: block;

  width: 100% !important;
  height: 100% !important;
}


/* =========================================================
   SCENE LABEL
   ========================================================= */

.scene-label {
  position: absolute;

  left: 18px;
  top: 18px;

  z-index: 10;

  padding: 9px 12px;

  border:
    1px solid rgba(255,255,255,.10);

  border-radius: 10px;

  background:
    rgba(7,17,25,.76);

  backdrop-filter: blur(12px);

  color: #9aa4ad;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: .14em;

  text-transform: uppercase;

  pointer-events: none;
}

.scene-label strong {
  color: #e7c269;
}


/* =========================================================
   BRIEFING
   ========================================================= */

.briefing-alert {
  position: absolute;

  top: 18px;

  left: 50%;

  transform:
    translateX(-50%);

  z-index: 12;

  padding: 10px 17px;

  border:
    1px solid rgba(231,190,93,.46);

  border-radius: 999px;

  color: #f0d184;

  background:
    rgba(44,31,7,.86);

  box-shadow:
    0 0 40px rgba(224,171,57,.12);

  font-size: 10px;

  font-weight: 900;

  letter-spacing: .12em;

  white-space: nowrap;

  pointer-events: none;
}


/* =========================================================
   SPEECH BUBBLE
   ========================================================= */

.speech-bubble {
  position: relative;

  min-width: 150px;

  max-width: 230px;

  padding: 10px 13px;

  border-radius: 12px;

  background:
    rgba(14,27,39,.96);

  border:
    1px solid rgba(226,190,103,.55);

  color: #edf4f8;

  font-size: 11px;

  line-height: 1.4;

  box-shadow:
    0 10px 30px rgba(0,0,0,.28),
    0 0 20px rgba(226,190,103,.05);

  backdrop-filter: blur(10px);

  text-align: center;
}

.speech-bubble::after {
  content: "";

  position: absolute;

  left: 50%;

  bottom: -7px;

  transform:
    translateX(-50%);

  border-left:
    7px solid transparent;

  border-right:
    7px solid transparent;

  border-top:
    7px solid rgba(226,190,103,.55);
}

.leader-bubble {
  min-width: 260px;

  max-width: 360px;

  border-color:
    rgba(218,177,82,.85);

  color: #f6d883;

  background:
    linear-gradient(
      145deg,
      rgba(38,31,18,.97),
      rgba(17,25,31,.97)
    );

  font-size: 12px;

  font-weight: 900;

  letter-spacing: .06em;
}


/* =========================================================
   PERSON IDENTITY CARD
   ========================================================= */

.person-identity {
  min-width: 190px;

  padding: 12px 14px;

  border:
    1px solid rgba(226,190,103,.55);

  border-radius: 13px;

  background:
    linear-gradient(
      145deg,
      rgba(17,31,43,.98),
      rgba(8,18,27,.98)
    );

  color: #ffffff;

  box-shadow:
    0 15px 40px rgba(0,0,0,.38),
    0 0 30px rgba(226,190,103,.10);

  backdrop-filter: blur(14px);

  text-align: left;

  pointer-events: none;
}

.person-identity-header {
  display: flex;

  align-items: center;

  gap: 9px;

  margin-bottom: 8px;
}

.person-identity-dot {
  width: 9px;

  height: 9px;

  flex-shrink: 0;

  border-radius: 50%;

  box-shadow:
    0 0 14px currentColor;
}

.person-identity-status {
  color: #65dfa0;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: .12em;
}

.person-identity-role {
  color: #f1f4f5;

  font-size: 13px;

  font-weight: 900;

  letter-spacing: .03em;
}

.person-identity-name {
  margin-top: 3px;

  color: #d7b762;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: .12em;

  text-transform: uppercase;
}

.person-identity-line {
  height: 1px;

  margin: 9px 0;

  background:
    rgba(255,255,255,.08);
}

.person-identity-meta {
  display: flex;

  justify-content: space-between;

  gap: 18px;
}

.person-identity-meta span {
  color: #74818b;

  font-size: 8px;

  text-transform: uppercase;

  letter-spacing: .08em;
}

.person-identity-meta strong {
  color: #dce4e8;

  font-size: 9px;
}


/* =========================================================
   WALL LOGO
   ========================================================= */

.wall-logo {
  width: 310px;

  padding: 16px 25px;

  border:
    1px solid rgba(232,188,88,.22);

  background:
    rgba(13,26,36,.86);

  color: #e5bd61;

  font-size: 21px;

  font-weight: 900;

  letter-spacing: .18em;

  text-align: center;

  text-shadow:
    0 0 22px rgba(228,185,81,.25);

  box-shadow:
    0 0 30px rgba(214,165,56,.08);
}

.wall-logo small {
  display: block;

  margin-top: 6px;

  color: #87929a;

  font-size: 7px;

  letter-spacing: .27em;
}


/* =========================================================
   BELOW SCENE
   ========================================================= */

.below-scene {
  width: min(1220px, calc(100% - 40px));

  margin: 0 auto;

  padding: 46px 0 20px;
}

.section-head {
  display: flex;

  align-items: end;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 20px;
}

.section-kicker {
  color: #d0aa58;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: .18em;

  text-transform: uppercase;
}

.section-title {
  margin: 7px 0 0;

  font-size: 28px;

  letter-spacing: -.03em;
}

.section-copy {
  max-width: 490px;

  color: #7e8992;

  font-size: 12px;

  line-height: 1.7;
}


/* =========================================================
   TEAM
   ========================================================= */

.team-grid {
  display: grid;

  grid-template-columns:
    repeat(5,1fr);

  gap: 10px;
}

.team-card {
  min-height: 145px;

  padding: 16px;

  border:
    1px solid rgba(255,255,255,.07);

  border-radius: 16px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.055),
      rgba(255,255,255,.012)
    );
}

.team-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;
}

.role-dot {
  width: 9px;

  height: 9px;

  border-radius: 50%;

  box-shadow:
    0 0 15px currentColor;
}

.team-tf {
  padding: 4px 7px;

  border-radius: 6px;

  background:
    rgba(255,255,255,.05);

  color: #858f98;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: .08em;
}

.team-card h3 {
  margin: 18px 0 5px;

  font-size: 13px;
}

.team-card p {
  margin: 0;

  color: #737e87;

  font-size: 10px;

  line-height: 1.5;
}


/* =========================================================
   ACTIVITY
   ========================================================= */

.activity {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 14px;

  margin-top: 14px;
}

.activity-card {
  padding: 20px;

  border:
    1px solid rgba(255,255,255,.07);

  border-radius: 17px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.045),
      rgba(255,255,255,.012)
    );
}

.activity-icon {
  width: 35px;

  height: 35px;

  display: grid;

  place-items: center;

  border-radius: 10px;

  color: #e4bd65;

  background:
    rgba(225,184,87,.08);
}

.activity-card h3 {
  margin: 15px 0 7px;

  font-size: 14px;
}

.activity-card p {
  margin: 0;

  color: #7b858e;

  font-size: 11px;

  line-height: 1.7;
}

.activity-card strong {
  color: #e4bd65;
}


/* =========================================================
   FOOTER
   ========================================================= */

.footer {
  width: min(1220px, calc(100% - 40px));

  margin: 50px auto 0;

  padding: 24px 0 35px;

  border-top:
    1px solid rgba(255,255,255,.07);

  display: flex;

  justify-content: space-between;

  gap: 20px;

  color: #65717a;

  font-size: 10px;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1050px) {

  .hero {
    grid-template-columns: 1fr;

    padding-top: 45px;
  }

  .team-grid {
    grid-template-columns:
      repeat(2,1fr);
  }
}

@media (max-width: 850px) {

  .activity {
    grid-template-columns: 1fr;
  }

  .section-head {
    align-items: flex-start;

    flex-direction: column;
  }
}

@media (max-width: 700px) {

  .topbar {
    padding: 12px 15px;
  }

  .brand-sub {
    display: none;
  }

  .hero,
  .below-scene,
  .footer {
    width: calc(100% - 26px);
  }

  .hero h1 {
    font-size: 48px;
  }

  .scene-wrap {
    width: calc(100% - 16px);

    height: 560px;

    min-height: 560px;

    border-radius: 18px;
  }

  .system-row {
    grid-template-columns: 1fr;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .footer {
    flex-direction: column;
  }

  .wall-logo {
    width: 250px;

    font-size: 15px;
  }

  .briefing-alert {
    font-size: 8px;
  }
}

`;


/* =========================================================
   JAKARTA CLOCK
   ========================================================= */

function useJakartaClock() {

  const [now, setNow] = useState(
    new Date()
  );

  useEffect(() => {

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  return useMemo(() => {

    const parts =
      new Intl.DateTimeFormat(
        "en-GB",
        {
          timeZone: "Asia/Jakarta",

          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",

          hourCycle: "h23",

          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ).formatToParts(now);

    const get = (type) =>
      parts.find(
        (item) =>
          item.type === type
      )?.value || "";

    return {
      hour: Number(get("hour")),
      minute: Number(get("minute")),
      second: Number(get("second")),

      weekday: get("weekday"),
      day: get("day"),
      month: get("month"),
      year: get("year"),
    };

  }, [now]);
}


/* =========================================================
   MOVING CHART
   ========================================================= */

function MovingChart({
  color = "#e6bd62",
  seed = 1,
}) {

  const lineRef = useRef(null);

  const POINTS = 46;

  const positions = useMemo(
    () =>
      new Float32Array(
        POINTS * 3
      ),
    []
  );

  useFrame(({ clock }) => {

    const t =
      clock.elapsedTime;

    for (
      let i = 0;
      i < POINTS;
      i++
    ) {

      const x =
        -0.82 +
        (i / (POINTS - 1)) *
          1.64;

      const wave =
        Math.sin(
          t * 1.25 +
          i * 0.36 +
          seed
        ) * 0.08 +

        Math.sin(
          t * 0.55 +
          i * 0.16 +
          seed * 2
        ) * 0.055 +

        Math.sin(
          i * 0.7 +
          seed
        ) * 0.045;

      const trend =
        (i / POINTS) * 0.18;

      positions[i * 3] = x;

      positions[i * 3 + 1] =
        wave + trend;

      positions[i * 3 + 2] =
        0.045;
    }

    if (lineRef.current) {

      lineRef.current
        .geometry
        .attributes
        .position
        .needsUpdate = true;

    }

  });

  return (
    <line ref={lineRef}>

      <bufferGeometry>

        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={POINTS}
          itemSize={3}
        />

      </bufferGeometry>

      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.95}
      />

    </line>
  );
}


/* =========================================================
   COMPUTER SCREEN
   ========================================================= */

function ChartScreen({
  tf,
  color,
  seed,
}) {

  return (

    <group
      position={[
        0,
        1.45,
        0,
      ]}
    >

      <mesh>

        <boxGeometry
          args={[
            1.42,
            0.82,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#252d34"
          metalness={0.55}
          roughness={0.35}
        />

      </mesh>


      <mesh
        position={[
          0,
          0,
          0.045,
        ]}
      >

        <planeGeometry
          args={[
            1.27,
            0.67,
          ]}
        />

        <meshBasicMaterial
          color="#07151d"
        />

      </mesh>


      <group
        position={[
          0,
          0,
          0.09,
        ]}
        scale={[
          0.7,
          0.65,
          1,
        ]}
      >

        <MovingChart
          color={color}
          seed={seed}
        />

      </group>


      <mesh
        position={[
          0,
          -0.41,
          0,
        ]}
      >

        <boxGeometry
          args={[
            0.13,
            0.25,
            0.12,
          ]}
        />

        <meshStandardMaterial
          color="#343a40"
        />

      </mesh>


      <mesh
        position={[
          0,
          -0.54,
          0,
        ]}
      >

        <boxGeometry
          args={[
            0.55,
            0.05,
            0.28,
          ]}
        />

        <meshStandardMaterial
          color="#30363c"
        />

      </mesh>


      <Html
        position={[
          -0.58,
          0.27,
          0.1,
        ]}
        center
        distanceFactor={7}
        style={{
          color,
          fontSize: "7px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          pointerEvents: "none",
          textTransform: "uppercase",
        }}
      >

        {tf}

      </Html>

    </group>
  );
}


/* =========================================================
   CHAIR
   ========================================================= */

function Chair({
  position,
  rotation = 0,
}) {

  return (

    <group
      position={position}
      rotation={[
        0,
        rotation,
        0,
      ]}
    >

      <mesh
        position={[
          0,
          0.48,
          0,
        ]}
      >

        <boxGeometry
          args={[
            0.55,
            0.08,
            0.55,
          ]}
        />

        <meshStandardMaterial
          color="#252c32"
          roughness={0.8}
        />

      </mesh>


      <mesh
        position={[
          0,
          0.9,
          -0.23,
        ]}
      >

        <boxGeometry
          args={[
            0.55,
            0.8,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#22292f"
          roughness={0.8}
        />

      </mesh>


      <mesh
        position={[
          0,
          0.25,
          0,
        ]}
      >

        <cylinderGeometry
          args={[
            0.035,
            0.035,
            0.45,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#41484f"
        />

      </mesh>


      <mesh
        position={[
          0,
          0.03,
          0,
        ]}
      >

        <cylinderGeometry
          args={[
            0.22,
            0.28,
            0.05,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#343a40"
        />

      </mesh>

    </group>
  );
}


/* =========================================================
   DESK
   ========================================================= */

function Desk({
  position,
  color,
  tf,
  index,
}) {

  return (

    <group position={position}>

      <mesh
        position={[
          0,
          1.02,
          0,
        ]}
      >

        <boxGeometry
          args={[
            1.65,
            0.12,
            0.85,
          ]}
        />

        <meshStandardMaterial
          color="#252c32"
          metalness={0.35}
          roughness={0.62}
        />

      </mesh>


      <mesh
        position={[
          0,
          0.94,
          0.41,
        ]}
      >

        <boxGeometry
          args={[
            1.67,
            0.04,
            0.04,
          ]}
        />

        <meshStandardMaterial
          color={color}
        />

      </mesh>


      {[
        [-0.68, 0.46, -0.29],
        [0.68, 0.46, -0.29],
        [-0.68, 0.46, 0.29],
        [0.68, 0.46, 0.29],
      ].map((p, i) => (

        <mesh
          key={i}
          position={p}
        >

          <boxGeometry
            args={[
              0.06,
              0.92,
              0.06,
            ]}
          />

          <meshStandardMaterial
            color="#3a4147"
          />

        </mesh>

      ))}


      <ChartScreen
        tf={tf}
        color={color}
        seed={index + 1}
      />


      <mesh
        position={[
          0,
          1.09,
          0.25,
        ]}
      >

        <boxGeometry
          args={[
            0.58,
            0.025,
            0.22,
          ]}
        />

        <meshStandardMaterial
          color="#333940"
        />

      </mesh>


      <mesh
        position={[
          0.47,
          1.1,
          0.22,
        ]}
      >

        <boxGeometry
          args={[
            0.12,
            0.035,
            0.17,
          ]}
        />

        <meshStandardMaterial
          color="#3d444a"
        />

      </mesh>


      <Chair
        position={[
          0,
          0,
          0.88,
        ]}
        rotation={Math.PI}
      />

    </group>
  );
}


/* =========================================================
   COFFEE STATION
   ========================================================= */

function CoffeeStation() {

  return (

    <group
      position={[
        4.5,
        0,
        -2.15,
      ]}
    >

      <mesh
        position={[
          0,
          0.62,
          0,
        ]}
      >

        <boxGeometry
          args={[
            1.35,
            1.15,
            0.78,
          ]}
        />

        <meshStandardMaterial
          color="#242a2f"
          metalness={0.25}
          roughness={0.7}
        />

      </mesh>


      <mesh
        position={[
          0,
          1.22,
          0,
        ]}
      >

        <boxGeometry
          args={[
            1.48,
            0.08,
            0.86,
          ]}
        />

        <meshStandardMaterial
          color="#3a4045"
        />

      </mesh>


      <mesh
        position={[
          0,
          1.65,
          -0.02,
        ]}
      >

        <boxGeometry
          args={[
            0.65,
            0.75,
            0.55,
          ]}
        />

        <meshStandardMaterial
          color="#353b40"
          metalness={0.7}
          roughness={0.3}
        />

      </mesh>


      <mesh
        position={[
          0,
          1.72,
          0.285,
        ]}
      >

        <boxGeometry
          args={[
            0.38,
            0.25,
            0.025,
          ]}
        />

        <meshBasicMaterial
          color="#132029"
        />

      </mesh>


      <mesh
        position={[
          0,
          1.56,
          0.32,
        ]}
      >

        <cylinderGeometry
          args={[
            0.035,
            0.035,
            0.18,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#d0a84d"
          emissive="#8a641d"
          emissiveIntensity={0.35}
        />

      </mesh>


      <mesh
        position={[
          0.38,
          1.3,
          0.15,
        ]}
      >

        <cylinderGeometry
          args={[
            0.09,
            0.07,
            0.14,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#eee9dc"
        />

      </mesh>


      <mesh
        position={[
          -0.37,
          1.3,
          0.14,
        ]}
      >

        <cylinderGeometry
          args={[
            0.09,
            0.07,
            0.14,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#eee9dc"
        />

      </mesh>


      <Html
        position={[
          0,
          2.18,
          0,
        ]}
        center
        distanceFactor={7}
        style={{
          color: "#d1ad58",
          fontSize: "8px",
          fontWeight: 800,
          letterSpacing: "0.12em",
          pointerEvents: "none",
        }}
      >

        COFFEE

      </Html>

    </group>
  );
}


/* =========================================================
   PLANT
   ========================================================= */

function Plant({
  position,
}) {

  return (

    <group position={position}>

      <mesh
        position={[
          0,
          0.22,
          0,
        ]}
      >

        <cylinderGeometry
          args={[
            0.25,
            0.19,
            0.44,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#4a3d34"
          roughness={0.9}
        />

      </mesh>


      {[
        [0, 0.78, 0],
        [0.18, 0.66, 0.04],
        [-0.2, 0.66, 0.02],
        [0.08, 0.7, -0.16],
      ].map((p, i) => (

        <mesh
          key={i}
          position={p}
          rotation={[
            0.2 * i,
            i * 0.7,
            0,
          ]}
        >

          <sphereGeometry
            args={[
              0.18,
              8,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#376847"
            roughness={0.9}
          />

        </mesh>

      ))}

    </group>
  );
}


/* =========================================================
   PERSON
   ========================================================= */

function Person({
  index,
  position,
  target,
  color,
  shirt,
  talking,
  speech,
  sitting,
  coffee,
  leader = false,

  selected,
  onSelect,
  personData,
}) {

  const group =
    useRef(null);

  const walkOffset =
    useMemo(
      () =>
        Math.random() *
        Math.PI *
        2,
      []
    );

  const basePosition =
    useMemo(
      () => [...position],
      [position]
    );


  useFrame(
    ({ clock }, delta) => {

      if (!group.current) {
        return;
      }

      const current =
        group.current.position;

      const tx =
        target?.[0] ??
        current.x;

      const tz =
        target?.[2] ??
        current.z;

      const dx =
        tx - current.x;

      const dz =
        tz - current.z;

      const distance =
        Math.sqrt(
          dx * dx +
          dz * dz
        );

      let walking = false;


      if (distance > 0.06) {

        walking = true;

        const speed =
          leader
            ? 1.75
            : 1.45;

        const step =
          Math.min(
            distance,
            speed * delta
          );

        current.x +=
          (dx / distance) *
          step;

        current.z +=
          (dz / distance) *
          step;


        const desiredRotation =
          Math.atan2(dx, dz);

        let rotationDelta =
          desiredRotation -
          group.current.rotation.y;


        while (
          rotationDelta >
          Math.PI
        ) {
          rotationDelta -=
            Math.PI * 2;
        }


        while (
          rotationDelta <
          -Math.PI
        ) {
          rotationDelta +=
            Math.PI * 2;
        }


        group.current.rotation.y +=
          rotationDelta * 0.12;
      }


      const bob =
        walking
          ? Math.abs(
              Math.sin(
                clock.elapsedTime *
                  9 +
                  walkOffset
              )
            ) * 0.035
          : 0;


      group.current.position.y =
        basePosition[1] +
        bob +
        (sitting
          ? -0.16
          : 0);


      const armsSwing =
        walking
          ? Math.sin(
              clock.elapsedTime *
                9 +
                walkOffset
            ) * 0.28

          : sitting
          ? 0.08

          : Math.sin(
              clock.elapsedTime *
                2.5 +
                walkOffset
            ) * 0.03;


      const leftArm =
        group.current.userData
          .leftArm;

      const rightArm =
        group.current.userData
          .rightArm;


      if (
        leftArm &&
        rightArm
      ) {

        leftArm.rotation.z =
          0.08 +
          armsSwing;

        rightArm.rotation.z =
          -0.08 -
          armsSwing;
      }

    }
  );


  const bodyY =
    sitting
      ? 0.65
      : 0.82;

  const headY =
    sitting
      ? 1.02
      : 1.25;


  /* =====================================================
     CLICK
     ===================================================== */

  const handleClick = (
    event
  ) => {

    event.stopPropagation();

    if (leader) {
      onSelect?.({
        id: "leader",
        name: "AI LEADER",
        role: "Signal Coordinator",
        tf: "MASTER",
        color: "#e7c26a",
      });

      return;
    }

    onSelect?.(personData);
  };


  return (

    <group
      ref={group}
      position={position}

      onClick={handleClick}

      onPointerOver={(event) => {
        event.stopPropagation();

        document.body.style.cursor =
          "pointer";
      }}

      onPointerOut={() => {
        document.body.style.cursor =
          "default";
      }}
    >

      {/* =================================================
          IDENTITY
          ================================================= */}

      {selected && (

        <Html
          position={[
            0,
            leader
              ? 2.72
              : 2.22,
            0,
          ]}
          center
          distanceFactor={6}
          style={{
            pointerEvents:
              "none",
          }}
        >

          <div
            className="person-identity"
            style={{
              borderColor:
                `${color}88`,
            }}
          >

            <div
              className=
                "person-identity-header"
            >

              <span
                className=
                  "person-identity-dot"

                style={{
                  background:
                    color,

                  color:
                    color,
                }}
              />

              <span
                className=
                  "person-identity-status"
              >
                ● ACTIVE ANALYST
              </span>

            </div>


            <div
              className=
                "person-identity-role"
            >
              {leader
                ? "SIGNAL COORDINATOR"
                : personData?.role}
            </div>


            <div
              className=
                "person-identity-name"
            >
              {leader
                ? "AI LEADER"
                : personData?.name}
            </div>


            <div
              className=
                "person-identity-line"
            />


            <div
              className=
                "person-identity-meta"
            >

              <div>
                <span>
                  TIMEFRAME
                </span>

                <strong>
                  {leader
                    ? "MASTER"
                    : personData?.tf}
                </strong>
              </div>


              <div>
                <span>
                  STATUS
                </span>

                <strong>
                  MONITORING
                </strong>
              </div>

            </div>

          </div>

        </Html>

      )}


      {/* =================================================
          SPEECH
          ================================================= */}

      {talking &&
        speech &&
        !selected && (

        <Html
          position={[
            0,
            leader
              ? 2.35
              : 2.0,
            0,
          ]}
          center
          distanceFactor={6}
          style={{
            pointerEvents:
              "none",
          }}
        >

          <div
            className={
              leader
                ? "speech-bubble leader-bubble"
                : "speech-bubble"
            }
          >
            {speech}
          </div>

        </Html>

      )}


      {/* =================================================
          HEAD
          ================================================= */}

      <mesh
        position={[
          0,
          headY,
          0,
        ]}
      >

        <sphereGeometry
          args={[
            leader
              ? 0.22
              : 0.19,
            16,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#b87956"
          roughness={0.8}
        />

      </mesh>


      {/* =================================================
          HAIR
          ================================================= */}

      <mesh
        position={[
          0,
          headY + 0.09,
          -0.015,
        ]}
      >

        <sphereGeometry
          args={[
            0.195,
            12,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#1b1715"
          roughness={1}
        />

      </mesh>


      {/* =================================================
          BODY
          ================================================= */}

      <mesh
        position={[
          0,
          bodyY,
          0,
        ]}
      >

        <boxGeometry
          args={[
            leader
              ? 0.46
              : 0.39,

            leader
              ? 0.75
              : 0.68,

            0.28,
          ]}
        />

        <meshStandardMaterial
          color={
            leader
              ? "#b68a31"
              : shirt
          }
          roughness={0.72}
        />

      </mesh>


      {/* =================================================
          LEFT ARM
          ================================================= */}

      <mesh
        ref={(node) => {

          if (group.current) {

            group.current.userData.leftArm =
              node;

          }

        }}

        position={[
          leader
            ? -0.29
            : -0.25,

          bodyY + 0.02,

          0,
        ]}
      >

        <capsuleGeometry
          args={[
            0.07,
            0.34,
            5,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#b87956"
          roughness={0.8}
        />

      </mesh>


      {/* =================================================
          RIGHT ARM
          ================================================= */}

      <mesh
        ref={(node) => {

          if (group.current) {

            group.current.userData.rightArm =
              node;

          }

        }}

        position={[
          leader
            ? 0.29
            : 0.25,

          bodyY + 0.02,

          0,
        ]}
      >

        <capsuleGeometry
          args={[
            0.07,
            0.34,
            5,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#b87956"
          roughness={0.8}
        />

      </mesh>


      {/* =================================================
          LEGS
          ================================================= */}

      <mesh
        position={[
          -0.11,
          0.28,
          0,
        ]}
      >

        <capsuleGeometry
          args={[
            0.075,
            0.42,
            5,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#30363d"
        />

      </mesh>


      <mesh
        position={[
          0.11,
          0.28,
          0,
        ]}
      >

        <capsuleGeometry
          args={[
            0.075,
            0.42,
            5,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#30363d"
        />

      </mesh>


      {/* =================================================
          SHOES
          ================================================= */}

      <mesh
        position={[
          -0.11,
          0.05,
          0.05,
        ]}
      >

        <boxGeometry
          args={[
            0.17,
            0.08,
            0.28,
          ]}
        />

        <meshStandardMaterial
          color="#171b1f"
        />

      </mesh>


      <mesh
        position={[
          0.11,
          0.05,
          0.05,
        ]}
      >

        <boxGeometry
          args={[
            0.17,
            0.08,
            0.28,
          ]}
        />

        <meshStandardMaterial
          color="#171b1f"
        />

      </mesh>


      {/* =================================================
          COFFEE CUP
          ================================================= */}

      {coffee && (

        <group
          position={[
            0.39,
            bodyY - 0.02,
            0.12,
          ]}
        >

          <mesh>

            <cylinderGeometry
              args={[
                0.06,
                0.045,
                0.11,
                12,
              ]}
            />

            <meshStandardMaterial
              color="#e7e2d5"
            />

          </mesh>

          <mesh
            position={[
              0,
              0.075,
              0,
            ]}
          >

            <sphereGeometry
              args={[
                0.035,
                8,
                8,
              ]}
            />

            <meshBasicMaterial
              color="#b37a38"
              transparent
              opacity={0.55}
            />

          </mesh>

        </group>

      )}


      {/* =================================================
          ACTIVE DOT
          ================================================= */}

      <mesh
        position={[
          0.28,
          headY + 0.18,
          0,
        ]}
      >

        <sphereGeometry
          args={[
            selected
              ? 0.045
              : 0.028,
            8,
            8,
          ]}
        />

        <meshBasicMaterial
          color={color}
        />

      </mesh>

    </group>
  );
}


/* =========================================================
   MEETING TABLE
   ========================================================= */

function MeetingTable() {

  return (

    <group
      position={[
        0,
        0,
        -1.7,
      ]}
    >

      <mesh
        position={[
          0,
          0.78,
          0,
        ]}
      >

        <cylinderGeometry
          args={[
            1.1,
            1.1,
            0.12,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#272d32"
          metalness={0.3}
          roughness={0.65}
        />

      </mesh>


      <mesh
        position={[
          0,
          0.39,
          0,
        ]}
      >

        <cylinderGeometry
          args={[
            0.1,
            0.22,
            0.75,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#363d43"
        />

      </mesh>


      <mesh
        position={[
          0,
          0.02,
          0,
        ]}
      >

        <cylinderGeometry
          args={[
            0.55,
            0.6,
            0.06,
            24,
          ]}
        />

        <meshStandardMaterial
          color="#2c3237"
        />

      </mesh>

    </group>
  );
}


/* =========================================================
   CEILING LIGHT
   ========================================================= */

function CeilingLight({
  position,
}) {

  return (

    <group position={position}>

      <mesh>

        <boxGeometry
          args={[
            1.2,
            0.04,
            0.35,
          ]}
        />

        <meshStandardMaterial
          color="#e6d59e"

          emissive="#d9b95d"

          emissiveIntensity={1.15}
        />

      </mesh>


      <pointLight
        intensity={1.8}
        distance={6}
        color="#fff1c7"
      />

    </group>
  );
}


/* =========================================================
   OFFICE SCENE
   ========================================================= */

function OfficeScene({
  clock,
  selectedPerson,
  setSelectedPerson,
}) {

  const secondsOfDay =
    clock.hour * 3600 +
    clock.minute * 60 +
    clock.second;


  /* =====================================================
     OFFICE STATE
     ===================================================== */

  const briefing =
    clock.minute === 0 &&
    clock.second < 18;

  const working =
    clock.minute >= 30;

  const mode =
    briefing
      ? "briefing"
      : working
      ? "working"
      : "social";


  /* =====================================================
     DESKS
     ===================================================== */

  const deskPositions = [
    [-3.35, 0, 0.25],
    [-1.68, 0, 0.25],
    [0, 0, 0.25],
    [1.68, 0, 0.25],
    [3.35, 0, 0.25],
  ];


  /* =====================================================
     SOCIAL PATHS
     ===================================================== */

  const socialPaths = [

    [
      [-3.4, 0, 1.85],
      [-2.0, 0, -1.1],
      [-0.3, 0, -2.0],
      [-1.0, 0, 1.9],
    ],

    [
      [-2.0, 0, -1.5],
      [-0.4, 0, -2.0],
      [1.0, 0, -1.25],
      [0.4, 0, 1.85],
    ],

    [
      [-0.5, 0, 1.85],
      [1.0, 0, -1.9],
      [2.2, 0, -1.1],
      [1.3, 0, 1.85],
    ],

    [
      [1.1, 0, 1.9],
      [2.5, 0, -1.8],
      [3.9, 0, -0.5],
      [2.6, 0, 1.75],
    ],

    [
      [3.4, 0, 1.8],
      [4.0, 0, -0.5],
      [2.7, 0, -1.9],
      [1.9, 0, 1.75],
    ],

  ];


  /* =====================================================
     COFFEE
     ===================================================== */

  const coffeeCycle =
    Math.floor(
      secondsOfDay / 50
    ) % TEAM.length;

  const coffeeWindow =
    secondsOfDay % 50 >= 31 &&
    secondsOfDay % 50 <= 42;

  const coffeePerson =
    coffeeWindow
      ? coffeeCycle
      : -1;


  /* =====================================================
     PEOPLE
     ===================================================== */

  const people =
    TEAM.map(
      (
        person,
        index
      ) => {

        const desk =
          deskPositions[index];

        const path =
          socialPaths[index];

        const waypointIndex =
          Math.floor(
            secondsOfDay / 10 +
              index * 1.7
          ) %
          path.length;

        const coffee =
          mode === "social" &&
          coffeePerson === index;


        let target;


        if (mode === "working") {

          target = [
            desk[0],
            0,
            desk[2] + 1.03,
          ];

        } else if (mode === "briefing") {

          const meetingOffsets = [

            [-2.0, 0.7],

            [-1.0, -0.2],

            [0, 0.65],

            [1.0, -0.2],

            [2.0, 0.65],

          ];

          target = [

            meetingOffsets[index][0],

            0,

            -1.1 +
              meetingOffsets[index][1],

          ];

        } else if (coffee) {

          target = [
            4.5,
            0,
            -1.0,
          ];

        } else {

          target =
            path[waypointIndex];

        }


        const talkingIndex =
          Math.floor(
            secondsOfDay / 6
          ) % TEAM.length;


        const talking =
          mode === "social" &&
          !coffee &&
          talkingIndex === index &&
          secondsOfDay % 6 < 5;


        const speechIndex =
          Math.floor(
            secondsOfDay / 18
          ) %
          person.speech.length;


        return {
          ...person,

          target,

          talking,

          speech:
            person.speech[
              speechIndex
            ],

          sitting:
            mode === "working",

          coffee,
        };

      }
    );


  /* =====================================================
     LEADER
     ===================================================== */

  const leaderPath = [

    [-4.5, 0, -1.0],

    [4.2, 0, -1.0],

    [4.3, 0, 1.9],

    [-4.2, 0, 1.9],

    [0, 0, -0.6],

  ];


  const leaderWaypoint =
    Math.floor(
      secondsOfDay / 14
    ) %
    leaderPath.length;


  let leaderTarget;


  if (briefing) {

    leaderTarget =
      [0, 0, 0.65];

  } else {

    leaderTarget =
      leaderPath[
        leaderWaypoint
      ];

  }


  const leaderTalking =
    briefing ||
    (
      mode === "social" &&
      secondsOfDay % 20 >= 4 &&
      secondsOfDay % 20 <= 9
    );


  /* =====================================================
     DESELECT WHEN CLICKING EMPTY SPACE
     ===================================================== */

  const handleSceneClick =
    (event) => {

      event.stopPropagation();

      setSelectedPerson(null);
    };


  return (

    <group
      onPointerMissed={() => {
        setSelectedPerson(null);
      }}
    >

      {/* =================================================
          FLOOR
          ================================================= */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}

        position={[
          0,
          -0.03,
          0,
        ]}

        receiveShadow

        onClick={
          handleSceneClick
        }
      >

        <planeGeometry
          args={[
            14,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#182129"
          roughness={0.88}
        />

      </mesh>


      {/* =================================================
          FLOOR GRID
          ================================================= */}

      <gridHelper
        args={[
          14,
          28,
          "#39434a",
          "#20282f",
        ]}

        position={[
          0,
          0,
          0,
        ]}
      />


      {/* =================================================
          BACK WALL
          ================================================= */}

      <mesh
        position={[
          0,
          2.2,
          -3.65,
        ]}
      >

        <boxGeometry
          args={[
            14,
            4.5,
            0.15,
          ]}
        />

        <meshStandardMaterial
          color="#202c35"
          roughness={0.88}
        />

      </mesh>


      {/* =================================================
          SIDE WALLS
          ================================================= */}

      <mesh
        position={[
          -6.9,
          2.2,
          0,
        ]}
      >

        <boxGeometry
          args={[
            0.15,
            4.5,
            7.4,
          ]}
        />

        <meshStandardMaterial
          color="#18242d"
          roughness={0.88}
        />

      </mesh>


      <mesh
        position={[
          6.9,
          2.2,
          0,
        ]}
      >

        <boxGeometry
          args={[
            0.15,
            4.5,
            7.4,
          ]}
        />

        <meshStandardMaterial
          color="#18242d"
          roughness={0.88}
        />

      </mesh>


      {/* =================================================
          WALL LOGO
          ================================================= */}

      <Html
        position={[
          0,
          2.75,
          -3.54,
        ]}

        center

        distanceFactor={7}

        style={{
          pointerEvents:
            "none",
        }}
      >

        <div className="wall-logo">

          XAU AI SMC GOLD

          <small>
            AI TRADING INTELLIGENCE
          </small>

        </div>

      </Html>


      {/* =================================================
          WINDOWS
          ================================================= */}

      {[
        -4.9,
        0,
        4.9,
      ].map(
        (
          x,
          i
        ) => (

          <group
            key={i}
            position={[
              x,
              2.15,
              -3.48,
            ]}
          >

            <mesh>

              <boxGeometry
                args={[
                  2.35,
                  1.6,
                  0.035,
                ]}
              />

              <meshStandardMaterial
                color="#273b47"
                metalness={0.2}
                roughness={0.5}
              />

            </mesh>


            <mesh
              position={[
                0,
                0,
                0.025,
              ]}
            >

              <planeGeometry
                args={[
                  2.15,
                  1.4,
                ]}
              />

              <meshBasicMaterial
                color="#244052"
              />

            </mesh>


            <mesh
              position={[
                0,
                0,
                0.05,
              ]}
            >

              <planeGeometry
                args={[
                  1.8,
                  0.01,
                ]}
              />

              <meshBasicMaterial
                color="#7396a5"
              />

            </mesh>

          </group>

        )
      )}


      {/* =================================================
          CEILING LIGHTS
          ================================================= */}

      <CeilingLight
        position={[
          -3.5,
          3.2,
          -0.7,
        ]}
      />

      <CeilingLight
        position={[
          0,
          3.2,
          -0.7,
        ]}
      />

      <CeilingLight
        position={[
          3.5,
          3.2,
          -0.7,
        ]}
      />


      {/* =================================================
          DESKS
          ================================================= */}

      {deskPositions.map(
        (
          position,
          index
        ) => (

          <Desk
            key={index}
            position={position}
            color={
              TEAM[index].color
            }
            tf={
              TEAM[index].tf
            }
            index={index}
          />

        )
      )}


      {/* =================================================
          COFFEE
          ================================================= */}

      <CoffeeStation />


      {/* =================================================
          MEETING TABLE
          ================================================= */}

      <MeetingTable />


      {/* =================================================
          PLANTS
          ================================================= */}

      <Plant
        position={[
          -5.4,
          0,
          -2.4,
        ]}
      />

      <Plant
        position={[
          5.4,
          0,
          -2.4,
        ]}
      />

      <Plant
        position={[
          -5.5,
          0,
          1.8,
        ]}
      />


      {/* =================================================
          PEOPLE
          ================================================= */}

      {people.map(
        (
          person,
          index
        ) => (

          <Person
            key={person.id}

            index={index}

            position={[
              deskPositions[index][0],
              0,
              deskPositions[index][2] + 1.3,
            ]}

            target={
              person.target
            }

            color={
              person.color
            }

            shirt={
              person.shirt
            }

            talking={
              person.talking
            }

            speech={
              person.speech
            }

            sitting={
              person.sitting
            }

            coffee={
              person.coffee
            }

            selected={
              selectedPerson?.id ===
              person.id
            }

            onSelect={
              setSelectedPerson
            }

            personData={
              person
            }
          />

        )
      )}


      {/* =================================================
          LEADER
          ================================================= */}

      <Person

        index={99}

        leader

        position={[
          0,
          0,
          -0.55,
        ]}

        target={
          leaderTarget
        }

        color="#e7c26a"

        shirt="#8b6928"

        talking={
          leaderTalking
        }

        speech={
          briefing
            ? "SEND SIGNAL TO TELEGRAM NOW!"
            : "Semua tetap standby."
        }

        sitting={false}

        coffee={false}

        selected={
          selectedPerson?.id ===
          "leader"
        }

        onSelect={
          setSelectedPerson
        }

        personData={{
          id: "leader",
          name: "AI LEADER",
          role: "Signal Coordinator",
          tf: "MASTER",
          color: "#e7c26a",
        }}

      />


      {/* =================================================
          BRIGHT OFFICE LIGHTING
          ================================================= */}

      <ambientLight
        intensity={1.8}
        color="#eaf3f7"
      />


      <directionalLight
        position={[
          0,
          8,
          5,
        ]}

        intensity={4.5}

        color="#fff6dc"

        castShadow

        shadow-mapSize-width={2048}

        shadow-mapSize-height={2048}

        shadow-camera-near={0.1}

        shadow-camera-far={30}
      />


      <directionalLight
        position={[
          -6,
          5,
          2,
        ]}

        intensity={2.5}

        color="#dceeff"
      />


      <directionalLight
        position={[
          6,
          5,
          2,
        ]}

        intensity={2.5}

        color="#fff0cf"
      />


      <pointLight
        position={[
          0,
          4,
          0,
        ]}

        intensity={5}

        distance={14}

        color="#ffe9b0"
      />


      <pointLight
        position={[
          -5,
          3,
          0,
        ]}

        intensity={3.5}

        distance={10}

        color="#dceeff"
      />


      <pointLight
        position={[
          5,
          3,
          0,
        ]}

        intensity={3.5}

        distance={10}

        color="#fff0cf"
      />


      <pointLight
        position={[
          0,
          2.5,
          -3,
        ]}

        intensity={4}

        distance={9}

        color="#e7c56d"
      />


      {/* =================================================
          CONTACT SHADOW
          ================================================= */}

      <ContactShadows
        position={[
          0,
          0.01,
          0,
        ]}

        opacity={0.22}

        scale={13}

        blur={2.4}

        far={5}
      />


      {/* =================================================
          CAMERA
          ================================================= */}

      <OrbitControls
        enablePan={false}

        minDistance={7}

        maxDistance={15}

        minPolarAngle={0.65}

        maxPolarAngle={1.4}

        target={[
          0,
          0.7,
          0,
        ]}
      />

    </group>
  );
}


/* =========================================================
   MAIN APP
   ========================================================= */

export default function App() {

  const clock =
    useJakartaClock();


  const [
    chatIndex,
    setChatIndex,
  ] = useState(0);


  const [
    selectedPerson,
    setSelectedPerson,
  ] = useState(null);


  useEffect(() => {

    const timer =
      setInterval(() => {

        setChatIndex(
          (prev) =>
            (
              prev + 1
            ) %
            CHAT_LINES.length
        );

      }, 4200);


    return () =>
      clearInterval(timer);

  }, []);


  const briefing =
    clock.minute === 0 &&
    clock.second < 18;


  const working =
    clock.minute >= 30;


  let currentStatus =
    "SOCIAL & WALKING";


  if (briefing) {

    currentStatus =
      "HOURLY BRIEFING";

  } else if (working) {

    currentStatus =
      "AT DESK";

  }


  return (

    <div className="xau-app">

      <style>
        {GLOBAL_CSS}
      </style>


      {/* =================================================
          TOPBAR
          ================================================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">

            <Bot size={19} />

          </div>


          <div>

            <div className="brand-title">
              XAU AI SMC GOLD
            </div>

            <div className="brand-sub">
              VISUAL AI OFFICE
            </div>

          </div>

        </div>


        <div className="online">

          <span className="online-dot" />

          SYSTEM ONLINE

        </div>

      </header>


      {/* =================================================
          HERO
          ================================================= */}

      <section className="hero">

        <div>

          <div className="eyebrow">

            <Radio size={12} />

            LIVE OFFICE SIMULATION

          </div>


          <h1>

            Inside the

            <br />

            <span className="gold-text">
              XAU AI SMC
            </span>{" "}

            Desk.

          </h1>


          <p className="hero-copy">

            Sebuah visualisasi kantor AI yang hidup.
            Tim berjalan, berdiskusi, memantau chart,
            mengambil kopi, kemudian kembali ke meja
            pada jadwal briefing setiap jam.

          </p>


          <div className="hero-actions">

            <a
              className="cta"

              href={TELEGRAM_URL}

              target="_blank"

              rel="noreferrer"
            >

              Open Telegram

              <ArrowUpRight
                size={15}
              />

            </a>


            <a
              className="cta secondary"

              href="#team"
            >

              View Team

            </a>

          </div>

        </div>


        <div className="hero-panel">

          <div className="clock-card">

            <div>

              <div className="clock-label">
                Jakarta Office Time
              </div>

              <div className="clock-value">

                {String(
                  clock.hour
                ).padStart(2, "0")}:

                {String(
                  clock.minute
                ).padStart(2, "0")}:

                {String(
                  clock.second
                ).padStart(2, "0")}

              </div>

            </div>


            <div className="clock-zone">
              WIB
            </div>

          </div>


          <div className="system-row">

            <div className="system-stat">

              <strong>
                05
              </strong>

              <span>
                AI Roles
              </span>

            </div>


            <div className="system-stat">

              <strong>
                04
              </strong>

              <span>
                Timeframes
              </span>

            </div>


            <div className="system-stat">

              <strong>
                24/5
              </strong>

              <span>
                Office Cycle
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          3D OFFICE
          ================================================= */}

      <section className="scene-wrap">

        <div className="scene-label">

          OFFICE STATUS ·{" "}

          <strong>
            {currentStatus}
          </strong>

        </div>


        {briefing && (

          <div className="briefing-alert">

            HOURLY BRIEFING · LEADER INSTRUCTING TEAM

          </div>

        )}


        <Canvas

          shadows

          camera={{
            position: [
              9,
              7.4,
              10,
            ],

            fov: 43,
          }}

          dpr={[
            1,
            1.6,
          ]}

          onPointerMissed={() => {
            setSelectedPerson(null);
          }}

        >

          <color
            attach="background"
            args={[
              "#14212a",
            ]}
          />


          <OfficeScene

            clock={clock}

            selectedPerson={
              selectedPerson
            }

            setSelectedPerson={
              setSelectedPerson
            }

          />

        </Canvas>

      </section>


      {/* =================================================
          TEAM
          ================================================= */}

      <section
        className="below-scene"
        id="team"
      >

        <div className="section-head">

          <div>

            <div className="section-kicker">
              AI TEAM
            </div>

            <h2 className="section-title">
              Five specialized roles.
            </h2>

          </div>


          <p className="section-copy">

            Setiap karakter memiliki peran visual
            berbeda dalam simulasi kantor XAU AI SMC.

          </p>

        </div>


        <div className="team-grid">

          {TEAM.map(
            (member) => (

              <div
                className="team-card"
                key={member.id}
              >

                <div className="team-top">

                  <span
                    className="role-dot"

                    style={{
                      background:
                        member.color,

                      color:
                        member.color,
                    }}
                  />

                  <span className="team-tf">

                    {member.tf}

                  </span>

                </div>


                <h3>
                  {member.name}
                </h3>


                <p>
                  {member.role}
                </p>

              </div>

            )
          )}

        </div>


        {/* =================================================
            ACTIVITY
            ================================================= */}

        <div className="activity">


          <div className="activity-card">

            <div className="activity-icon">

              <Clock3 size={17} />

            </div>


            <h3>
              Hourly Briefing
            </h3>


            <p>

              Tepat pada menit 00, seluruh anggota
              kembali ke posisi masing-masing dan
              leader memberikan instruksi:

              <strong>
                {" "}
                SEND SIGNAL TO TELEGRAM NOW!
              </strong>

            </p>

          </div>


          <div className="activity-card">

            <div className="activity-icon">

              <Coffee size={17} />

            </div>


            <h3>
              Office Activity
            </h3>


            <p>

              Di antara briefing, karakter bergerak
              di dalam kantor, berbicara, memantau
              chart, dan sesekali pergi mengambil kopi.

            </p>

          </div>


          <div className="activity-card">

            <div className="activity-icon">

              <Monitor size={17} />

            </div>


            <h3>
              Moving Charts
            </h3>


            <p>

              Monitor setiap meja memiliki chart
              bergerak secara visual agar suasana
              kantor terasa lebih hidup.

            </p>

          </div>


          <div className="activity-card">

            <div className="activity-icon">

              <ShieldCheck size={17} />

            </div>


            <h3>
              Visual Only
            </h3>


            <p>

              Website ini adalah landing page dan
              visual simulation. Analisa market dan
              signal sebenarnya tetap dilakukan oleh
              sistem Telegram terpisah.

            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          LIVE CHAT
          ================================================= */}

      <section className="below-scene">

        <div className="activity-card">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >

            <MessageSquare
              size={17}
              color="#dcb65e"
            />

            <span
              style={{
                color: "#dcb65e",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".13em",
              }}
            >
              LIVE OFFICE CHAT
            </span>

          </div>


          <div
            style={{
              color: "#e7e7e1",
              fontSize: 13,
            }}
          >

            {CHAT_LINES[chatIndex]}

          </div>

        </div>

      </section>


      {/* =================================================
          FOOTER
          ================================================= */}

      <footer className="footer">

        <div>

          © {clock.year} XAU AI SMC GOLD

        </div>


        <div>

          VISUAL OFFICE SIMULATION · ASIA/JAKARTA

        </div>

      </footer>

    </div>
  );
}
