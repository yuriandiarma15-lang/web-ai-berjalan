import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, ContactShadows } from "@react-three/drei";

/* ================= DATA TIM ================= */
const TEAM = [
  {
    id: 0,
    name: "M30 Macro",
    role: "Analis Makro",
    tf: "M30",
    color: "#58a6ff",
    shirt: "#173d69",
    speech: [
      "Cek struktur besar dulu.",
      "Tren utama di M30 masih terjaga.",
      "Area supply dan demand sudah saya tandai.",
      "Bias makro hari ini sedang saya validasi.",
      "Level kunci H4 menjadi acuan tim.",
      "Belum ada perubahan struktur yang signifikan.",
      "Saya pantau area utama.",
      "Laporan makro siap untuk briefing leader.",
    ],
  },
  {
    id: 1,
    name: "M15 SMC",
    role: "Analis SMC",
    tf: "M15",
    color: "#b57aff",
    shirt: "#4c2374",
    speech: [
      "Saya cek market structure.",
      "Perhatikan area liquidity di atas dan bawah.",
      "Menunggu konfirmasi BOS atau CHoCH.",
      "Order block M15 sudah saya petakan.",
      "Ada potensi liquidity sweep di area ini.",
      "Fair value gap masih terbuka, saya pantau.",
      "Struktur M15 selaras dengan bias makro.",
      "Tunggu konfirmasi berikutnya.",
    ],
  },
  {
    id: 2,
    name: "M5 Entry",
    role: "Analis Entry",
    tf: "M5",
    color: "#f4c95d",
    shirt: "#6c4c12",
    speech: [
      "Saya cek area entry.",
      "Menunggu retest sebelum masuk.",
      "Zona entry sedang dipantau dengan ketat.",
      "Risk dan reward harus tetap terukur.",
      "Konfirmasi candle belum lengkap.",
      "Level stop loss sudah saya hitung.",
      "Kesabaran adalah kunci entry yang presisi.",
      "Jangan terburu-buru.",
    ],
  },
  {
    id: 3,
    name: "M1 Execution",
    role: "Analis Eksekusi",
    tf: "M1",
    color: "#55d98b",
    shirt: "#185b3a",
    speech: [
      "M1 bergerak cepat.",
      "Momentum jangka pendek sedang saya baca.",
      "Spread dan likuiditas dalam kondisi normal.",
      "Eksekusi siap, menunggu aba-aba.",
      "Saya pantau pergerakan harga terakhir.",
      "Volatilitas meningkat, tetap waspada.",
      "Konfirmasi presisi di M1 sudah saya siapkan.",
      "Tunggu instruksi leader.",
    ],
  },
  {
    id: 4,
    name: "Fundamental",
    role: "Analis Fundamental",
    tf: "FUND",
    color: "#ff9f68",
    shirt: "#71331f",
    speech: [
      "Saya cek agenda fundamental.",
      "Kalender ekonomi hari ini sedang direview.",
      "Data USD dan yield obligasi ikut saya pantau.",
      "Sentimen dolar berpengaruh pada arah emas.",
      "Rilis berita berdampak tinggi perlu diwaspadai.",
      "Kebijakan bank sentral menjadi fokus utama.",
      "Saya review faktor ekonomi global.",
      "Fundamental siap dilaporkan ke leader.",
    ],
  },
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

const LEADER = {
  id: "leader",
  name: "AI LEADER",
  role: "Koordinator Signal",
  tf: "MASTER",
  color: "#e7c26a",
};

/* ================= JAM WIB ================= */
function useJakartaClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      year: "numeric",
    }).formatToParts(now);

    const get = (type) =>
      parts.find((part) => part.type === type)?.value || "";

    const dayName = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
    }).format(now);

    const dayIdx = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    }[
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        weekday: "short",
      }).format(now)
    ];

    const hour = Number(get("hour"));

    const open =
      (dayIdx >= 1 && dayIdx <= 5 && hour >= 7) ||
      (dayIdx >= 2 && dayIdx <= 6 && hour < 2);

    return {
      hour,
      minute: Number(get("minute")),
      second: Number(get("second")),
      year: get("year"),
      dayName,
      open,
    };
  }, [now]);
}

/* ================= CHART 3D ================= */
function MovingChart({ color = "#e6bd62", seed = 1 }) {
  const lineRef = useRef(null);
  const POINTS = 46;

  const positions = useMemo(
    () => new Float32Array(POINTS * 3),
    []
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    for (let i = 0; i < POINTS; i++) {
      const wave =
        Math.sin(time * 1.25 + i * 0.36 + seed) * 0.08 +
        Math.sin(time * 0.55 + i * 0.16 + seed * 2) * 0.055 +
        Math.sin(i * 0.7 + seed) * 0.045;

      positions[i * 3] =
        -0.82 + (i / (POINTS - 1)) * 1.64;

      positions[i * 3 + 1] =
        wave + (i / POINTS) * 0.18;

      positions[i * 3 + 2] = 0.045;
    }

    if (lineRef.current) {
      lineRef.current.geometry.attributes.position.needsUpdate = true;
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

function ChartScreen({ tf, color, seed }) {
  return (
    <group position={[0, 1.45, 0]}>
      <mesh>
        <boxGeometry args={[1.42, 0.82, 0.08]} />
        <meshStandardMaterial
          color="#252d34"
          metalness={0.55}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.27, 0.67]} />
        <meshBasicMaterial color="#07151d" />
      </mesh>

      <group position={[0, 0, 0.09]} scale={[0.7, 0.65, 1]}>
        <MovingChart color={color} seed={seed} />
      </group>

      <mesh position={[0, -0.41, 0]}>
        <boxGeometry args={[0.13, 0.25, 0.12]} />
        <meshStandardMaterial color="#343a40" />
      </mesh>

      <mesh position={[0, -0.54, 0]}>
        <boxGeometry args={[0.55, 0.05, 0.28]} />
        <meshStandardMaterial color="#30363c" />
      </mesh>

      <Html
        position={[-0.58, 0.27, 0.1]}
        center
        distanceFactor={7}
        style={{
          color,
          fontSize: "7px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          pointerEvents: "none",
        }}
      >
        {tf}
      </Html>
    </group>
  );
}

/* ================= KURSI ================= */
function Chair({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.55]} />
        <meshStandardMaterial color="#252c32" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.9, -0.23]}>
        <boxGeometry args={[0.55, 0.8, 0.08]} />
        <meshStandardMaterial color="#22292f" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
        <meshStandardMaterial color="#41484f" />
      </mesh>

      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.05, 10]} />
        <meshStandardMaterial color="#343a40" />
      </mesh>
    </group>
  );
}

/* ================= MEJA ================= */
const LEGS = [
  [-0.68, 0.46, -0.29],
  [0.68, 0.46, -0.29],
  [-0.68, 0.46, 0.29],
  [0.68, 0.46, 0.29],
];

function Desk({ position, color, tf, index }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[1.65, 0.12, 0.85]} />
        <meshStandardMaterial
          color="#252c32"
          metalness={0.35}
          roughness={0.62}
        />
      </mesh>

      <mesh position={[0, 0.94, 0.41]}>
        <boxGeometry args={[1.67, 0.04, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {LEGS.map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.06, 0.92, 0.06]} />
          <meshStandardMaterial color="#3a4147" />
        </mesh>
      ))}

      <ChartScreen
        tf={tf}
        color={color}
        seed={index + 1}
      />

      <mesh position={[0, 1.09, 0.25]}>
        <boxGeometry args={[0.58, 0.025, 0.22]} />
        <meshStandardMaterial color="#333940" />
      </mesh>

      <mesh position={[0.47, 1.1, 0.22]}>
        <boxGeometry args={[0.12, 0.035, 0.17]} />
        <meshStandardMaterial color="#3d444a" />
      </mesh>

      <Chair position={[0, 0, 0.88]} rotation={Math.PI} />
    </group>
  );
}

/* ================= STASIUN KOPI ================= */
function CoffeeStation() {
  return (
    <group position={[4.5, 0, -2.15]}>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.35, 1.15, 0.78]} />
        <meshStandardMaterial
          color="#242a2f"
          metalness={0.25}
          roughness={0.7}
        />
      </mesh>

      <mesh position={[0, 1.22, 0]}>
        <boxGeometry args={[1.48, 0.08, 0.86]} />
        <meshStandardMaterial color="#3a4045" />
      </mesh>

      <mesh position={[0, 1.65, -0.02]}>
        <boxGeometry args={[0.65, 0.75, 0.55]} />
        <meshStandardMaterial
          color="#353b40"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 1.72, 0.285]}>
        <boxGeometry args={[0.38, 0.25, 0.025]} />
        <meshBasicMaterial color="#132029" />
      </mesh>

      <mesh position={[0, 1.56, 0.32]}>
        <cylinderGeometry args={[0.035, 0.035, 0.18, 10]} />
        <meshStandardMaterial
          color="#d0a84d"
          emissive="#8a641d"
          emissiveIntensity={0.35}
        />
      </mesh>

      {[0.38, -0.37].map((x, index) => (
        <mesh key={index} position={[x, 1.3, 0.15]}>
          <cylinderGeometry args={[0.09, 0.07, 0.14, 16]} />
          <meshStandardMaterial color="#eee9dc" />
        </mesh>
      ))}

      <Html
        position={[0, 2.18, 0]}
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
        KOPI
      </Html>
    </group>
  );
}

/* ================= TANAMAN ================= */
function Plant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.25, 0.19, 0.44, 16]} />
        <meshStandardMaterial color="#4a3d34" roughness={0.9} />
      </mesh>

      {[
        [0, 0.78, 0],
        [0.18, 0.66, 0.04],
        [-0.2, 0.66, 0.02],
        [0.08, 0.7, -0.16],
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#376847" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ================= MEJA RAPAT ================= */
function MeetingTable() {
  return (
    <group position={[0, 0, -1.7]}>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.12, 32]} />
        <meshStandardMaterial
          color="#272d32"
          metalness={0.3}
          roughness={0.65}
        />
      </mesh>

      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.1, 0.22, 0.75, 16]} />
        <meshStandardMaterial color="#363d43" />
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.06, 24]} />
        <meshStandardMaterial color="#2c3237" />
      </mesh>
    </group>
  );
}

/* ================= LAMPU ================= */
function CeilingLight({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.2, 0.04, 0.35]} />
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

/* ================= KARAKTER AI ================= */
function Person({
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
  const group = useRef(null);
  const leftArm = useRef(null);
  const rightArm = useRef(null);

  const walkOffset = useMemo(
    () => Math.random() * Math.PI * 2,
    []
  );

  useFrame(({ clock }, delta) => {
    const currentGroup = group.current;
    if (!currentGroup) return;

    const current = currentGroup.position;

    const dx = (target?.[0] ?? current.x) - current.x;
    const dz = (target?.[2] ?? current.z) - current.z;

    const distance = Math.sqrt(dx * dx + dz * dz);
    let walking = false;

    if (distance > 0.06) {
      walking = true;

      const step = Math.min(
        distance,
        (leader ? 1.75 : 1.45) * delta
      );

      current.x += (dx / distance) * step;
      current.z += (dz / distance) * step;

      let angle = Math.atan2(dx, dz) - currentGroup.rotation.y;

      while (angle > Math.PI) angle -= Math.PI * 2;
      while (angle < -Math.PI) angle += Math.PI * 2;

      currentGroup.rotation.y += angle * 0.12;
    }

    const time = clock.elapsedTime;

    const bob = walking
      ? Math.abs(Math.sin(time * 9 + walkOffset)) * 0.035
      : 0;

    currentGroup.position.y = bob + (sitting ? -0.16 : 0);

    const swing = walking
      ? Math.sin(time * 9 + walkOffset) * 0.28
      : sitting
        ? 0.08
        : Math.sin(time * 2.5 + walkOffset) * 0.03;

    if (leftArm.current) {
      leftArm.current.rotation.z = 0.08 + swing;
    }

    if (rightArm.current) {
      rightArm.current.rotation.z = -0.08 - swing;
    }
  });

  const bodyY = sitting ? 0.65 : 0.82;
  const headY = sitting ? 1.02 : 1.25;

  const skin = (
    <meshStandardMaterial color="#b87956" roughness={0.8} />
  );

  return (
    <group
      ref={group}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(personData);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {selected && (
        <Html
          position={[0, leader ? 2.72 : 2.22, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="person-identity"
            style={{ borderColor: `${color}88` }}
          >
            <div className="pi-header">
              <span
                className="pi-dot"
                style={{
                  background: color,
                  boxShadow: `0 0 14px ${color}`,
                }}
              />
              <span className="pi-status">● ANALIS AKTIF</span>
            </div>

            <div className="pi-role">{personData?.role}</div>
            <div className="pi-name">{personData?.name}</div>
            <div className="pi-line" />

            <div className="pi-meta">
              <div>
                <span>TIMEFRAME</span>
                <strong>{personData?.tf}</strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>MEMANTAU</strong>
              </div>
            </div>
          </div>
        </Html>
      )}

      {talking && speech && !selected && (
        <Html
          position={[0, leader ? 2.35 : 2.0, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: "none" }}
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

      {/* Kepala */}
      <mesh position={[0, headY, 0]}>
        <sphereGeometry
          args={[leader ? 0.22 : 0.19, 16, 16]}
        />
        {skin}
      </mesh>

      {/* Rambut */}
      <mesh position={[0, headY + 0.09, -0.015]}>
        <sphereGeometry args={[0.195, 12, 12]} />
        <meshStandardMaterial color="#1b1715" roughness={1} />
      </mesh>

      {/* Badan */}
      <mesh position={[0, bodyY, 0]}>
        <boxGeometry
          args={[
            leader ? 0.46 : 0.39,
            leader ? 0.75 : 0.68,
            0.28,
          ]}
        />
        <meshStandardMaterial
          color={leader ? "#b68a31" : shirt}
          roughness={0.72}
        />
      </mesh>

      {/* Tangan kiri */}
      <mesh
        ref={leftArm}
        position={[
          leader ? -0.29 : -0.25,
          bodyY + 0.02,
          0,
        ]}
      >
        <capsuleGeometry args={[0.07, 0.34, 5, 8]} />
        {skin}
      </mesh>

      {/* Tangan kanan */}
      <mesh
        ref={rightArm}
        position={[
          leader ? 0.29 : 0.25,
          bodyY + 0.02,
          0,
        ]}
      >
        <capsuleGeometry args={[0.07, 0.34, 5, 8]} />
        {skin}
      </mesh>

      {/* Kaki */}
      {[-0.11, 0.11].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.28, 0]}>
            <capsuleGeometry args={[0.075, 0.42, 5, 8]} />
            <meshStandardMaterial color="#30363d" />
          </mesh>

          <mesh position={[x, 0.05, 0.05]}>
            <boxGeometry args={[0.17, 0.08, 0.28]} />
            <meshStandardMaterial color="#171b1f" />
          </mesh>
        </group>
      ))}

      {/* Kopi */}
      {coffee && (
        <group position={[0.39, bodyY - 0.02, 0.12]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.045, 0.11, 12]} />
            <meshStandardMaterial color="#e7e2d5" />
          </mesh>

          <mesh position={[0, 0.075, 0]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial
              color="#b37a38"
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>
      )}

      {/* Indikator karakter */}
      <mesh position={[0.28, headY + 0.18, 0]}>
        <sphereGeometry
          args={[selected ? 0.045 : 0.028, 8, 8]}
        />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ================= OFFICE SCENE ================= */
const DESKS = [
  [-3.35, 0, 0.25],
  [-1.68, 0, 0.25],
  [0, 0, 0.25],
  [1.68, 0, 0.25],
  [3.35, 0, 0.25],
];

const SOCIAL_PATHS = [
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

const MEETING_OFFSETS = [
  [-2.0, 0.7],
  [-1.0, -0.2],
  [0, 0.65],
  [1.0, -0.2],
  [2.0, 0.65],
];

const LEADER_PATH = [
  [-4.5, 0, -1.0],
  [4.2, 0, -1.0],
  [4.3, 0, 1.9],
  [-4.2, 0, 1.9],
  [0, 0, -0.6],
];

function OfficeScene({
  clock,
  selectedPerson,
  setSelectedPerson,
}) {
  const closed = !clock.open;

  const sec =
    clock.hour * 3600 +
    clock.minute * 60 +
    clock.second;

  const briefing =
    clock.minute === 0 && clock.second < 18;

  const mode = briefing
    ? "briefing"
    : clock.minute >= 30
      ? "working"
      : "social";

  const coffeeCycle =
    Math.floor(sec / 50) % TEAM.length;

  const coffeeWindow =
    sec % 50 >= 31 && sec % 50 <= 42;

  const coffeePerson = coffeeWindow
    ? coffeeCycle
    : -1;

  const talkingIndex =
    Math.floor(sec / 6) % TEAM.length;

  const people = TEAM.map((person, index) => {
    const desk = DESKS[index];
    const path = SOCIAL_PATHS[index];

    const wp =
      Math.floor(sec / 10 + index * 1.7) %
      path.length;

    const coffee =
      mode === "social" && coffeePerson === index;

    let target;

    if (mode === "working") {
      target = [desk[0], 0, desk[2] + 1.03];
    } else if (mode === "briefing") {
      target = [
        MEETING_OFFSETS[index][0],
        0,
        -1.1 + MEETING_OFFSETS[index][1],
      ];
    } else if (coffee) {
      target = [4.5, 0, -1.0];
    } else {
      target = path[wp];
    }

    return {
      ...person,
      target,
      coffee,
      sitting: mode === "working",
      talking:
        mode === "social" &&
        !coffee &&
        talkingIndex === index &&
        sec % 6 < 5,
      speechText:
        person.speech[
          Math.floor(sec / 18) % person.speech.length
        ],
    };
  });

  const leaderTarget = briefing
    ? [0, 0, 0.65]
    : LEADER_PATH[Math.floor(sec / 14) % LEADER_PATH.length];

  const leaderTalking =
    briefing ||
    (mode === "social" && sec % 20 >= 4 && sec % 20 <= 9);

  return (
    <group>
      {/* LANTAI */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.03, 0]}
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          setSelectedPerson(null);
        }}
      >
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial
          color="#182129"
          roughness={0.88}
        />
      </mesh>

      <gridHelper args={[14, 28, "#39434a", "#20282f"]} />

      {/* TEMBOK BELAKANG */}
      <mesh position={[0, 2.2, -3.65]}>
        <boxGeometry args={[14, 4.5, 0.15]} />
        <meshStandardMaterial
          color="#202c35"
          roughness={0.88}
        />
      </mesh>

      {/* TEMBOK KIRI DAN KANAN */}
      {[-6.9, 6.9].map((x) => (
        <mesh key={x} position={[x, 2.2, 0]}>
          <boxGeometry args={[0.15, 4.5, 7.4]} />
          <meshStandardMaterial
            color="#18242d"
            roughness={0.88}
          />
        </mesh>
      ))}

      {/* LOGO TEMBOK BELAKANG */}
      <Html
        position={[0, 2.75, -3.54]}
        center
        distanceFactor={7}
        style={{ pointerEvents: "none" }}
      >
        <div className="wall-logo">
          XAU AI SMC GOLD
          <small>ASISTEN TRADING AI</small>
        </div>
      </Html>

      {/* ==========================================
          PAPAN JUMLAH PENGGUNA AI ASSISTANT
          TEMBOK SEBELAH KIRI
          ========================================== */}
      <Html
        position={[-6.72, 2.15, 0.2]}
        center
        distanceFactor={7}
        style={{ pointerEvents: "none" }}
      >
        <div className="user-counter-board">
          <div className="user-counter-icon">✦</div>

          <div className="user-counter-label">
            AI ASSISTANT
          </div>

          <div className="user-counter-subtitle">
            TOTAL PENGGUNA
          </div>

          <div className="user-counter-number">
            1.526
          </div>

          <div className="user-counter-status">
            <span className="user-counter-dot" />
            AKTIVASI PENGGUNA
          </div>

          <div className="user-counter-footer">
            XAU AI · SMC GOLD
          </div>
        </div>
      </Html>

      {/* JADWAL SIGNAL TEMBOK KANAN */}
      <Html
        position={[6.75, 2.2, 0.2]}
        center
        distanceFactor={7}
        style={{ pointerEvents: "none" }}
      >
        <div className="schedule-board">
          <h4>JADWAL SIGNAL</h4>
          <p>Senin – Jumat</p>
          <p>
            <strong>07.00 – 02.00 WIB</strong>
          </p>
          <p>Sabtu &amp; Minggu libur (market tutup)</p>
        </div>
      </Html>

      {/* JENDELA */}
      {[-4.9, 0, 4.9].map((x, index) => (
        <group key={index} position={[x, 2.15, -3.48]}>
          <mesh>
            <boxGeometry args={[2.35, 1.6, 0.035]} />
            <meshStandardMaterial
              color="#273b47"
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>

          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[2.15, 1.4]} />
            <meshBasicMaterial color="#244052" />
          </mesh>

          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[1.8, 0.01]} />
            <meshBasicMaterial color="#7396a5" />
          </mesh>
        </group>
      ))}

      {/* LAMPU LANGIT-LANGIT */}
      {[-3.5, 0, 3.5].map((x) => (
        <CeilingLight
          key={x}
          position={[x, 3.2, -0.7]}
        />
      ))}

      {/* MEJA ANALIS */}
      {DESKS.map((position, index) => (
        <Desk
          key={index}
          position={position}
          color={TEAM[index].color}
          tf={TEAM[index].tf}
          index={index}
        />
      ))}

      <CoffeeStation />
      <MeetingTable />

      <Plant position={[-5.4, 0, -2.4]} />
      <Plant position={[5.4, 0, -2.4]} />
      <Plant position={[-5.5, 0, 1.8]} />

      {/* ANALIS BERGERAK SAAT KANTOR BUKA */}
      {!closed &&
        people.map((person, index) => (
          <Person
            key={person.id}
            position={[
              DESKS[index][0],
              0,
              DESKS[index][2] + 1.3,
            ]}
            target={person.target}
            color={person.color}
            shirt={person.shirt}
            talking={person.talking}
            speech={person.speechText}
            sitting={person.sitting}
            coffee={person.coffee}
            selected={selectedPerson?.id === person.id}
            onSelect={setSelectedPerson}
            personData={person}
          />
        ))}

      {/* AI LEADER */}
      {!closed && (
        <Person
          leader
          position={[0, 0, -0.55]}
          target={leaderTarget}
          color="#e7c26a"
          shirt="#8b6928"
          talking={leaderTalking}
          speech={
            briefing
              ? LEADER_BRIEFING[
                  Math.floor(clock.second / 6) %
                    LEADER_BRIEFING.length
                ]
              : LEADER_SOCIAL[
                  Math.floor(sec / 20) %
                    LEADER_SOCIAL.length
                ]
          }
          sitting={false}
          coffee={false}
          selected={selectedPerson?.id === "leader"}
          onSelect={setSelectedPerson}
          personData={LEADER}
        />
      )}

      {/* PENCAHAYAAN */}
      <ambientLight
        intensity={1.8}
        color="#eaf3f7"
      />

      <directionalLight
        position={[0, 8, 5]}
        intensity={4.5}
        color="#fff6dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
      />

      <directionalLight
        position={[-6, 5, 2]}
        intensity={2.5}
        color="#dceeff"
      />

      <directionalLight
        position={[6, 5, 2]}
        intensity={2.5}
        color="#fff0cf"
      />

      <pointLight
        position={[0, 4, 0]}
        intensity={5}
        distance={14}
        color="#ffe9b0"
      />

      <pointLight
        position={[-5, 3, 0]}
        intensity={3.5}
        distance={10}
        color="#dceeff"
      />

      <pointLight
        position={[5, 3, 0]}
        intensity={3.5}
        distance={10}
        color="#fff0cf"
      />

      <pointLight
        position={[0, 2.5, -3]}
        intensity={4}
        distance={9}
        color="#e7c56d"
      />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.22}
        scale={13}
        blur={2.4}
        far={5}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={7}
        maxDistance={15}
        minPolarAngle={0.65}
        maxPolarAngle={1.4}
        target={[0, 0.7, 0]}
      />
    </group>
  );
}

/* ================= SECTION JAM DAN SCENE ================= */
export default function Office({ intro }) {
  const clock = useJakartaClock();

  const [selectedPerson, setSelectedPerson] = useState(null);

  const pad = (number) =>
    String(number).padStart(2, "0");

  const briefing =
    clock.open &&
    clock.minute === 0 &&
    clock.second < 18;

  let status = "SANTAI & BERJALAN";

  if (!clock.open) {
    status = "KANTOR LIBUR";
  } else if (briefing) {
    status = "BRIEFING PER JAM";
  } else if (clock.minute >= 30) {
    status = "DI MEJA KERJA";
  }

  useEffect(() => {
    if (!clock.open) {
      setSelectedPerson(null);
    }
  }, [clock.open]);

  return (
    <>
      <p className="office-intro">{intro}</p>

      {/* JAM KANTOR */}
      <div className="office-clock">
        <div>
          <div className="clock-label">
            AI Assistant Gold Office Time
          </div>

          <div className="clock-value">
            {pad(clock.hour)}:{pad(clock.minute)}:
            {pad(clock.second)}
          </div>
        </div>

        <div className="clock-day">
          {clock.dayName}

          <small>
            WIB · {clock.open ? "SISTEM ONLINE" : "KANTOR LIBUR"}
          </small>
        </div>
      </div>

      {/* AREA KANTOR 3D */}
      <div className="office-breakout">
        <div className="scene-wrap">
          <div className="scene-label">
            STATUS KANTOR · <strong>{status}</strong>
          </div>

          {briefing && (
            <div className="briefing-alert">
              BRIEFING PER JAM · LEADER MEMBERI INSTRUKSI KE TIM
            </div>
          )}

          {!clock.open && (
            <div className="closed-banner">
              KANTOR SEDANG LIBUR

              <small>
                Market tutup · Signal kembali aktif Senin 07.00 WIB
              </small>
            </div>
          )}

          <Canvas
            shadows
            camera={{
              position: [9, 7.4, 10],
              fov: 43,
            }}
            dpr={[1, 1.6]}
            onPointerMissed={() => setSelectedPerson(null)}
          >
            <color
              attach="background"
              args={["#14212a"]}
            />

            <OfficeScene
              clock={clock}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
            />
          </Canvas>
        </div>
      </div>
    </>
  );
}
