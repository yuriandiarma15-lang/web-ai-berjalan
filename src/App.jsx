import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Html,
  OrbitControls,
  ContactShadows,
  Float
} from '@react-three/drei'
import * as THREE from 'three'
import {
  ArrowUpRight,
  Bot,
  Clock3,
  Coffee,
  MessageSquare,
  Radio,
  ShieldCheck,
  Activity,
  Users,
  BarChart3
} from 'lucide-react'

const TELEGRAM_URL = 'https://t.me/'

/* =========================================================
   TEAM
========================================================= */

const TEAM = [
  {
    id: 'm30',
    name: 'Macro Analyst',
    tf: 'M30',
    color: '#68b8ff',
    task: 'Higher timeframe observation'
  },
  {
    id: 'm15',
    name: 'SMC Analyst',
    tf: 'M15',
    color: '#b49aff',
    task: 'Market structure monitoring'
  },
  {
    id: 'm5',
    name: 'Entry Analyst',
    tf: 'M5',
    color: '#f0bd68',
    task: 'Entry zone observation'
  },
  {
    id: 'm1',
    name: 'Execution Analyst',
    tf: 'M1',
    color: '#67d6b0',
    task: 'Short-term price monitoring'
  },
  {
    id: 'fundamental',
    name: 'Fundamental Analyst',
    tf: 'NEWS',
    color: '#ff8f8f',
    task: 'Macro & fundamental monitoring'
  }
]

const CHAT_LINES = [
  ['M30 Analyst', 'Reviewing the morning market environment.'],
  ['M15 Analyst', 'Anyone wants coffee?'],
  ['Fundamental Analyst', 'Checking the latest macro calendar.'],
  ['M5 Analyst', 'I will grab a coffee first.'],
  ['M1 Analyst', 'Charts are looking quiet right now.'],
  ['Team Leader', 'Keep the trading floor ready.'],
  ['M30 Analyst', 'Workspace status: all monitors online.'],
  ['Fundamental Analyst', 'Fundamental desk is monitoring news.'],
  ['M15 Analyst', 'We will start analysis at minute 30.'],
  ['M5 Analyst', 'Coffee acquired. Back to the desk.']
]

/* =========================================================
   JAKARTA CLOCK
========================================================= */

function useJakartaClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(id)
  }, [])

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hour12: false
  }).formatToParts(now)

  const get = type => parts.find(p => p.type === type)?.value

  return {
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    second: Number(get('second')),
    weekday: get('weekday'),
    time: `${get('hour')}:${get('minute')}:${get('second')}`
  }
}

/* =========================================================
   OFFICE MODE
========================================================= */

function getOfficeMode(clock) {
  if (clock.minute === 0) return 'briefing'
  if (clock.minute >= 30) return 'analysis'
  return 'discussion'
}

/* =========================================================
   ANIMATED CHART
========================================================= */

function AnimatedChart({ tf, color, active = true }) {
  const group = useRef()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      if (active) {
        setTick(v => v + 1)
      }
    }, 650)

    return () => clearInterval(id)
  }, [active])

  const candles = useMemo(() => {
    let price = 0

    return Array.from({ length: 20 }, (_, i) => {
      const movement =
        Math.sin((i + tick * 0.04) * 1.2 + tf.length) * 0.08 +
        Math.cos(i * 0.71 + tick * 0.02) * 0.045

      const open = price
      const close = price + movement + (i % 4 === 0 ? 0.035 : -0.008)

      const high = Math.max(open, close) + 0.045
      const low = Math.min(open, close) - 0.045

      price = close

      return {
        open,
        close,
        high,
        low
      }
    })
  }, [tf, tick])

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1.3, 0.82, 0.08]} />
        <meshStandardMaterial
          color="#07121e"
          roughness={0.48}
          metalness={0.18}
        />
      </mesh>

      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.18, 0.69]} />
        <meshBasicMaterial color="#081624" />
      </mesh>

      {/* Grid */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={`h-${i}`}
          position={[0, -0.27 + i * 0.135, 0.053]}
        >
          <planeGeometry args={[1.13, 0.004]} />
          <meshBasicMaterial color="#1b3144" />
        </mesh>
      ))}

      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={`v-${i}`}
          position={[-0.53 + i * 0.176, 0, 0.053]}
        >
          <planeGeometry args={[0.004, 0.67]} />
          <meshBasicMaterial color="#182c3d" />
        </mesh>
      ))}

      {/* Candles */}
      {candles.map((c, i) => {
        const x = -0.51 + i * 0.054

        const scale = 1.25
        const bodyHeight = Math.max(
          Math.abs(c.close - c.open) * scale,
          0.025
        )

        const bodyY =
          ((c.open + c.close) / 2) * scale

        const wickTop = c.high * scale
        const wickBottom = c.low * scale

        const bullish = c.close >= c.open

        return (
          <group key={i}>
            <mesh
              position={[
                x,
                (wickTop + wickBottom) / 2,
                0.062
              ]}
            >
              <boxGeometry
                args={[
                  0.008,
                  Math.max(wickTop - wickBottom, 0.025),
                  0.008
                ]}
              />
              <meshBasicMaterial
                color={bullish ? '#65d6a5' : '#e97878'}
              />
            </mesh>

            <mesh
              position={[x, bodyY, 0.067]}
            >
              <boxGeometry
                args={[
                  0.037,
                  bodyHeight,
                  0.025
                ]}
              >
                <meshBasicMaterial
                  color={bullish ? '#55c99b' : '#e86f72'}
                />
              </boxGeometry>
            </mesh>
          </group>
        )
      })}

      {/* moving price line */}
      <mesh position={[0.38, 0.15, 0.075]}>
        <boxGeometry args={[0.18, 0.012, 0.012]} />
        <meshBasicMaterial color={color} />
      </mesh>

      <Html
        position={[0, 0.31, 0.08]}
        transform
        distanceFactor={5}
        center
      >
        <div className="screen-label">
          <b>XAUUSD</b>
          <span>{tf}</span>
        </div>
      </Html>

      <Html
        position={[0.36, -0.28, 0.08]}
        transform
        distanceFactor={5}
        center
      >
        <div className="screen-price">
          LIVE SIM
        </div>
      </Html>
    </group>
  )
}

/* =========================================================
   COMPUTER
========================================================= */

function Computer({ tf, color, working }) {
  return (
    <group>
      {/* monitor */}
      <group position={[0, 1.48, -0.17]}>
        <AnimatedChart
          tf={tf}
          color={color}
          active={working}
        />

        <mesh position={[0, -0.51, 0]}>
          <boxGeometry args={[0.13, 0.10, 0.13]} />
          <meshStandardMaterial color="#aebbc5" />
        </mesh>

        <mesh position={[0, -0.57, 0]}>
          <boxGeometry args={[0.5, 0.035, 0.27]} />
          <meshStandardMaterial color="#7e8d99" />
        </mesh>
      </group>

      {/* keyboard */}
      <mesh position={[0.34, 0.94, 0.24]}>
        <boxGeometry args={[0.42, 0.025, 0.18]} />
        <meshStandardMaterial color="#d8dedf" />
      </mesh>

      {/* mouse */}
      <mesh position={[0.62, 0.95, 0.23]}>
        <boxGeometry args={[0.12, 0.025, 0.09]} />
        <meshStandardMaterial color="#aeb7bb" />
      </mesh>

      {/* small desk light */}
      <mesh position={[-0.38, 1.0, 0.22]}>
        <cylinderGeometry args={[0.055, 0.055, 0.16, 10]} />
        <meshStandardMaterial color="#b6c1c5" />
      </mesh>
    </group>
  )
}

/* =========================================================
   DESK
========================================================= */

function Desk({
  position,
  tf,
  color,
  selected,
  onSelect,
  working
}) {
  return (
    <group
      position={position}
      onClick={onSelect}
    >
      {/* tabletop */}
      <mesh
        position={[0, 0.72, 0]}
        castShadow
      >
        <boxGeometry args={[1.62, 0.12, 0.86]} />
        <meshStandardMaterial
          color="#bca477"
          roughness={0.72}
        />
      </mesh>

      {/* legs */}
      {[
        [-0.68, 0.34, -0.29],
        [0.68, 0.34, -0.29],
        [-0.68, 0.34, 0.29],
        [0.68, 0.34, 0.29]
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.08, 0.68, 0.08]} />
          <meshStandardMaterial color="#776958" />
        </mesh>
      ))}

      {/* PC tower */}
      <mesh position={[0.61, 0.96, -0.14]}>
        <boxGeometry args={[0.16, 0.38, 0.34]} />
        <meshStandardMaterial
          color="#111b26"
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* PC light */}
      <mesh position={[0.61, 1.02, 0.035]}>
        <boxGeometry args={[0.025, 0.025, 0.01]} />
        <meshBasicMaterial
          color={working ? '#59d6a2' : '#66707a'}
        />
      </mesh>

      <Computer
        tf={tf}
        color={color}
        working={working}
      />

      {/* paperwork */}
      <mesh position={[-0.40, 0.79, 0.22]}>
        <boxGeometry args={[0.34, 0.025, 0.22]} />
        <meshStandardMaterial color="#e6e0d2" />
      </mesh>

      {/* coffee cup */}
      <mesh position={[0.62, 0.82, 0.27]}>
        <cylinderGeometry args={[0.055, 0.045, 0.10, 12]} />
        <meshStandardMaterial color="#f0ece2" />
      </mesh>

      {/* selection */}
      {selected && (
        <mesh position={[0, 0.86, 0]}>
          <boxGeometry args={[1.76, 0.015, 0.98]} />
          <meshBasicMaterial
            color="#e6bd67"
            wireframe
          />
        </mesh>
      )}

      {/* working indicator */}
      <Html
        position={[0, 1.88, 0]}
        center
        distanceFactor={8}
      >
        <div
          className={`desk-status ${
            working ? 'working' : 'idle'
          }`}
        >
          <i />
          {working ? 'ANALYZING' : 'OFFLINE'}
        </div>
      </Html>
    </group>
  )
}

/* =========================================================
   CHAIR
========================================================= */

function Chair({ position, occupied }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.43, 0]}>
        <boxGeometry args={[0.50, 0.10, 0.44]} />
        <meshStandardMaterial color="#263a4e" />
      </mesh>

      <mesh position={[0, 0.76, -0.18]}>
        <boxGeometry args={[0.50, 0.55, 0.08]} />
        <meshStandardMaterial color="#263a4e" />
      </mesh>

      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
        <meshStandardMaterial color="#6e7d89" />
      </mesh>

      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.035, 12]} />
        <meshStandardMaterial color="#596873" />
      </mesh>
    </group>
  )
}

/* =========================================================
   PERSON
========================================================= */

function Person({
  position,
  color = '#d6a17d',
  leader = false,
  active = false,
  name,
  tf,
  state = 'walking',
  onClick
}) {
  const group = useRef()
  const [phase, setPhase] = useState(Math.random() * 10)

  useEffect(() => {
    const id = setInterval(() => {
      setPhase(v => v + 1)
    }, 500)

    return () => clearInterval(id)
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return

    const bob =
      state === 'walking'
        ? Math.sin(phase * 0.55) * 0.035
        : Math.sin(phase * 0.3) * 0.008

    group.current.position.y +=
      (bob - (group.current.userData.bob || 0)) * delta * 8

    group.current.userData.bob = bob
  })

  const walking = state === 'walking'
  const coffee = state === 'coffee'

  const armMove = walking
    ? Math.sin(phase * 0.75) * 0.18
    : state === 'working'
      ? Math.sin(phase * 0.9) * 0.055
      : 0

  const seated = state === 'working'

  return (
    <group
      ref={group}
      position={position}
      onClick={onClick}
    >
      {/* chair-like shadow/body base */}
      {seated && (
        <mesh position={[0, 0.22, 0.25]}>
          <boxGeometry args={[0.46, 0.08, 0.38]} />
          <meshStandardMaterial color="#25384b" />
        </mesh>
      )}

      {/* torso */}
      <mesh
        position={[
          0,
          seated ? 0.70 : 0.83,
          0
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.40,
            seated ? 0.40 : 0.50,
            0.30
          ]}
        />
        <meshStandardMaterial
          color={
            leader
              ? '#caa04e'
              : '#3b668c'
          }
        />
      </mesh>

      {/* head */}
      <mesh
        position={[
          0,
          seated ? 1.08 : 1.20,
          0
        ]}
        castShadow
      >
        <sphereGeometry args={[0.18, 14, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* hair */}
      <mesh
        position={[
          0,
          seated ? 1.19 : 1.31,
          0
        ]}
      >
        <sphereGeometry args={[0.17, 12, 8]} />
        <meshStandardMaterial color="#25282c" />
      </mesh>

      {/* eyes */}
      <mesh
        position={[
          -0.055,
          seated ? 1.08 : 1.21,
          0.166
        ]}
      >
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#1c2227" />
      </mesh>

      <mesh
        position={[
          0.055,
          seated ? 1.08 : 1.21,
          0.166
        ]}
      >
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#1c2227" />
      </mesh>

      {/* left arm */}
      <mesh
        position={[
          -0.27,
          seated ? 0.72 : 0.83,
          0.02
        ]}
        rotation={[
          0,
          0,
          -0.45 + armMove
        ]}
      >
        <boxGeometry args={[0.12, 0.36, 0.13]} />
        <meshStandardMaterial
          color={
            leader
              ? '#caa04e'
              : '#3b668c'
          }
        />
      </mesh>

      {/* right arm */}
      <mesh
        position={[
          0.27,
          seated ? 0.72 : 0.83,
          0.02
        ]}
        rotation={[
          0,
          0,
          0.45 - armMove
        ]}
      >
        <boxGeometry args={[0.12, 0.36, 0.13]} />
        <meshStandardMaterial
          color={
            leader
              ? '#caa04e'
              : '#3b668c'
          }
        />
      </mesh>

      {/* legs */}
      <mesh
        position={[
          -0.10,
          seated ? 0.39 : 0.38,
          0
        ]}
        rotation={[
          walking
            ? Math.sin(phase) * 0.35
            : 0,
          0,
          0
        ]}
      >
        <boxGeometry args={[0.12, 0.40, 0.13]} />
        <meshStandardMaterial color="#26313c" />
      </mesh>

      <mesh
        position={[
          0.10,
          seated ? 0.39 : 0.38,
          0
        ]}
        rotation={[
          walking
            ? Math.sin(phase + Math.PI) * 0.35
            : 0,
          0,
          0
        ]}
      >
        <boxGeometry args={[0.12, 0.40, 0.13]} />
        <meshStandardMaterial color="#26313c" />
      </mesh>

      {/* coffee cup */}
      {coffee && (
        <mesh position={[0.30, 0.93, 0.20]}>
          <cylinderGeometry args={[0.055, 0.045, 0.11, 12]} />
          <meshStandardMaterial color="#eee7d8" />
        </mesh>
      )}

      {name && (
        <Html
          position={[
            0,
            seated ? 1.48 : 1.63,
            0
          ]}
          center
          distanceFactor={8}
        >
          <div
            className={`name-tag ${
              leader ? 'leader-tag' : ''
            }`}
          >
            <span>{name}</span>
            {tf && <b>{tf}</b>}
          </div>
        </Html>
      )}

      {active && (
        <mesh
          position={[
            0,
            seated ? 1.38 : 1.48,
            0
          ]}
        >
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshBasicMaterial color="#65ddb0" />
        </mesh>
      )}
    </group>
  )
}

/* =========================================================
   COFFEE MACHINE
========================================================= */

function CoffeeMachine({ position }) {
  const [steam, setSteam] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setSteam(v => !v)
    }, 900)

    return () => clearInterval(id)
  }, [])

  return (
    <group position={position}>
      {/* cabinet */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.15, 1.1, 0.55]} />
        <meshStandardMaterial
          color="#252e37"
          roughness={0.38}
          metalness={0.4}
        />
      </mesh>

      {/* machine top */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.85, 0.16, 0.44]} />
        <meshStandardMaterial color="#111820" />
      </mesh>

      {/* display */}
      <mesh position={[0, 0.92, 0.285]}>
        <boxGeometry args={[0.30, 0.13, 0.018]} />
        <meshBasicMaterial color="#172e36" />
      </mesh>

      <Html
        position={[0, 0.92, 0.30]}
        transform
        distanceFactor={5}
        center
      >
        <div className="coffee-display">
          COFFEE
        </div>
      </Html>

      {/* buttons */}
      {[-0.18, 0, 0.18].map((x, i) => (
        <mesh
          key={i}
          position={[x, 0.69, 0.29]}
        >
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial
            color={
              i === 1
                ? '#d9b65f'
                : '#64717b'
            }
          />
        </mesh>
      ))}

      {/* cup tray */}
      <mesh position={[0, 0.46, 0.30]}>
        <boxGeometry args={[0.58, 0.035, 0.30]} />
        <meshStandardMaterial color="#11161b" />
      </mesh>

      {/* coffee cup */}
      <mesh position={[0, 0.56, 0.30]}>
        <cylinderGeometry args={[0.075, 0.06, 0.12, 12]} />
        <meshStandardMaterial color="#eee9df" />
      </mesh>

      {/* steam */}
      {steam && (
        <>
          <mesh position={[-0.025, 0.76, 0.30]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color="#d5dadd" transparent opacity={0.45} />
          </mesh>

          <mesh position={[0.025, 0.81, 0.30]}>
            <sphereGeometry args={[0.014, 6, 6]} />
            <meshBasicMaterial color="#d5dadd" transparent opacity={0.35} />
          </mesh>
        </>
      )}

      <Html
        position={[0, 1.48, 0]}
        center
        distanceFactor={8}
      >
        <div className="machine-label">
          <Coffee size={13} />
          COFFEE STATION
        </div>
      </Html>
    </group>
  )
}

/* =========================================================
   BOOKSHELF
========================================================= */

function Bookshelf({ position }) {
  const books = [
    '#496c82',
    '#9a7459',
    '#627c63',
    '#a98d55',
    '#735d7b',
    '#4f6774'
  ]

  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.25, 2.2, 0.34]} />
        <meshStandardMaterial color="#4d3d31" />
      </mesh>

      {[0.25, 0.8, 1.35].map((y, row) => (
        <group key={row}>
          {books.map((c, i) => (
            <mesh
              key={i}
              position={[
                -0.44 + i * 0.17,
                y,
                0.20
              ]}
            >
              <boxGeometry
                args={[
                  0.12,
                  0.34 + (i % 2) * 0.04,
                  0.09
                ]}
              />
              <meshStandardMaterial color={c} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/* =========================================================
   WALL CLOCK
========================================================= */

function WallClock({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry
          args={[0.42, 0.42, 0.07, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <meshStandardMaterial
          color="#d4d5d2"
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 0, 0.045]}>
        <cylinderGeometry
          args={[0.34, 0.34, 0.015, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <meshBasicMaterial color="#102033" />
      </mesh>

      <mesh
        position={[0, 0.09, 0.06]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[0.018, 0.18, 0.012]} />
        <meshBasicMaterial color="#e5c36e" />
      </mesh>

      <mesh
        position={[0.08, 0, 0.065]}
        rotation={[0, 0, -0.8]}
      >
        <boxGeometry args={[0.018, 0.16, 0.012]} />
        <meshBasicMaterial color="#e5c36e" />
      </mesh>
    </group>
  )
}

/* =========================================================
   PLANT
========================================================= */

function Plant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.17, 0.38, 12]} />
        <meshStandardMaterial color="#a66e4d" />
      </mesh>

      {[
        [-0.16, 0.58, 0],
        [0.16, 0.65, 0],
        [0, 0.78, 0],
        [-0.05, 0.95, 0],
        [0.18, 0.86, 0]
      ].map((p, i) => (
        <mesh
          key={i}
          position={p}
          rotation={[
            0,
            0,
            (i - 2) * 0.28
          ]}
        >
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshStandardMaterial color="#477153" />
        </mesh>
      ))}
    </group>
  )
}

/* =========================================================
   OFFICE SCENE
========================================================= */

function OfficeScene({
  mode,
  selected,
  setSelected
}) {
  const [coffeePerson, setCoffeePerson] = useState(null)

  /*
    Simple simulated walking positions.
    They change according to office mode.
  */

  const deskPositions = [
    [-3.15, 0, 0.50],
    [-1.55, 0, 0.50],
    [0.05, 0, 0.50],
    [1.65, 0, 0.50],
    [3.25, 0, 0.50]
  ]

  const walkingPositions = [
    [-2.85, 0, -0.65],
    [-1.15, 0, -0.95],
    [0.55, 0, -0.70],
    [2.35, 0, -0.90],
    [3.25, 0, -1.55]
  ]

  const coffeePositions = [
    [2.75, 0, -2.05],
    [2.35, 0, -1.90],
    [2.10, 0, -2.10],
    [2.75, 0, -1.70],
    [2.35, 0, -1.65]
  ]

  useEffect(() => {
    if (mode !== 'discussion') {
      setCoffeePerson(null)
      return
    }

    const id = setInterval(() => {
      const random =
        Math.floor(Math.random() * TEAM.length)

      setCoffeePerson(random)

      setTimeout(() => {
        setCoffeePerson(null)
      }, 6500)
    }, 16000)

    return () => clearInterval(id)
  }, [mode])

  const leaderPosition =
    mode === 'briefing'
      ? [0, 0.25, -1.45]
      : mode === 'analysis'
        ? [1.65, 0.15, -0.85]
        : [-1.3, 0.15, -1.45]

  return (
    <>
      {/* =================================================
          ENVIRONMENT
      ================================================= */}

      <color
        attach="background"
        args={['#07111e']}
      />

      <ambientLight intensity={1.45} />

      <directionalLight
        position={[4, 8, 5]}
        intensity={2.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight
        position={[-4, 3, -3]}
        intensity={11}
        color="#376fb4"
        distance={13}
      />

      <pointLight
        position={[4, 3, -1]}
        intensity={8}
        color="#c28a45"
        distance={10}
      />

      {/* floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.03, 0]}
        receiveShadow
      >
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          color="#172637"
          roughness={0.82}
        />
      </mesh>

      {/* floor grid */}
      <gridHelper
        args={[
          14,
          28,
          '#2b435e',
          '#1b2e44'
        ]}
        position={[0, 0.005, 0]}
      />

      {/* back wall */}
      <mesh position={[0, 2.0, -4.0]}>
        <boxGeometry args={[13, 4, 0.18]} />
        <meshStandardMaterial color="#dfe3e2" />
      </mesh>

      {/* side walls */}
      <mesh position={[-6.5, 2, 0]}>
        <boxGeometry args={[0.18, 4, 8]} />
        <meshStandardMaterial color="#d8dcdb" />
      </mesh>

      <mesh position={[6.5, 2, 0]}>
        <boxGeometry args={[0.18, 4, 8]} />
        <meshStandardMaterial color="#d8dcdb" />
      </mesh>

      {/* wall panel */}
      <mesh position={[0, 3.18, -3.86]}>
        <boxGeometry args={[11.5, 0.07, 0.08]} />
        <meshStandardMaterial color="#bca66e" />
      </mesh>

      {/* =================================================
          BRAND
      ================================================= */}

      <mesh position={[0, 2.45, -3.82]}>
        <boxGeometry args={[4.2, 1.05, 0.08]} />
        <meshStandardMaterial color="#0c1b2c" />
      </mesh>

      <Html
        position={[0, 2.45, -3.73]}
        center
        distanceFactor={8}
      >
        <div className="wall-logo">
          <small>ARTIFICIAL INTELLIGENCE</small>
          <strong>XAU AI</strong>
          <b>SMC GOLD</b>
          <span>TRADING INTELLIGENCE OFFICE</span>
        </div>
      </Html>

      {/* windows */}
      {[-4.7, -3.25, 3.25, 4.7].map(
        (x, i) => (
          <group
            key={i}
            position={[x, 1.75, -3.67]}
          >
            <mesh>
              <boxGeometry
                args={[1.05, 1.45, 0.06]}
              />
              <meshStandardMaterial
                color="#9ebed2"
                emissive="#25415a"
                emissiveIntensity={0.35}
              />
            </mesh>

            <mesh
              position={[0, 0, 0.04]}
            >
              <boxGeometry
                args={[1.13, 1.53, 0.04]}
              />
              <meshStandardMaterial
                color="#b79c64"
              />
            </mesh>
          </group>
        )
      )}

      {/* =================================================
          WALL CLOCK
      ================================================= */}

      <WallClock
        position={[-5.65, 2.55, -3.68]}
      />

      {/* =================================================
          BOOKSHELF
      ================================================= */}

      <Bookshelf
        position={[5.35, 0, -3.52]}
      />

      {/* =================================================
          PLANTS
      ================================================= */}

      <Plant position={[-5.2, 0, -2.7]} />
      <Plant position={[5.25, 0, 1.5]} />

      {/* =================================================
          COFFEE MACHINE
      ================================================= */}

      <CoffeeMachine
        position={[3.95, 0, -2.55]}
      />

      {/* coffee cabinet */}
      <mesh
        position={[3.95, 0.15, -2.05]}
      >
        <boxGeometry args={[1.65, 0.30, 0.55]} />
        <meshStandardMaterial color="#6d5848" />
      </mesh>

      {/* =================================================
          DESKS
      ================================================= */}

      {TEAM.map((a, i) => {
        const desk = deskPositions[i]

        const isWorking =
          mode === 'analysis'

        return (
          <group key={a.id}>
            <Desk
              position={desk}
              tf={a.tf}
              color={a.color}
              selected={
                selected === a.id
              }
              working={isWorking}
              onSelect={() =>
                setSelected(
                  selected === a.id
                    ? null
                    : a.id
                )
              }
            />

            <Chair
              position={[
                desk[0],
                0,
                desk[2] + 0.72
              ]}
              occupied={isWorking}
            />

            {/* =================================================
                PEOPLE
            ================================================= */}

            {mode === 'analysis' ? (
              <Person
                position={[
                  desk[0],
                  0,
                  desk[2] + 0.48
                ]}
                name={a.name}
                tf={a.tf}
                active
                state="working"
                color={
                  [
                    '#d8a27e',
                    '#b97c5c',
                    '#e0b18c',
                    '#c98d6d',
                    '#d29b82'
                  ][i]
                }
                onClick={() =>
                  setSelected(
                    selected === a.id
                      ? null
                      : a.id
                  )
                }
              />
            ) : (
              <Person
                position={
                  coffeePerson === i
                    ? coffeePositions[i]
                    : walkingPositions[i]
                }
                name={a.name}
                tf={a.tf}
                active
                state={
                  coffeePerson === i
                    ? 'coffee'
                    : 'walking'
                }
                color={
                  [
                    '#d8a27e',
                    '#b97c5c',
                    '#e0b18c',
                    '#c98d6d',
                    '#d29b82'
                  ][i]
                }
                onClick={() =>
                  setSelected(
                    selected === a.id
                      ? null
                      : a.id
                  )
                }
              />
            )}
          </group>
        )
      })}

      {/* =================================================
          LEADER
      ================================================= */}

      <mesh
        position={[0, 0.15, -1.50]}
      >
        <cylinderGeometry
          args={[0.55, 0.65, 0.30, 8]}
        />
        <meshStandardMaterial
          color="#b89555"
        />
      </mesh>

      <Person
        position={leaderPosition}
        leader
        name="TEAM LEADER"
        active
        state={
          mode === 'briefing'
            ? 'working'
            : 'walking'
        }
        color="#d9a17c"
      />

      {/* leader briefing */}
      {mode === 'briefing' && (
        <Html
          position={[0, 2.12, -1.20]}
          center
          distanceFactor={7}
        >
          <div className="leader-speech">
            <b>TEAM BRIEFING</b>
            <span>
              PREPARE FOR XAUUSD
              <br />
              ANALYSIS SESSION
            </span>
          </div>
        </Html>
      )}

      {/* =================================================
          MODE SIGN
      ================================================= */}

      <Html
        position={[0, 3.42, -3.65]}
        center
        distanceFactor={8}
      >
        <div
          className={`office-mode mode-${mode}`}
        >
          <span />
          {mode === 'briefing' &&
            'TEAM BRIEFING'}
          {mode === 'analysis' &&
            'ANALYSIS MODE'}
          {mode === 'discussion' &&
            'DISCUSSION MODE'}
        </div>
      </Html>

      <ContactShadows
        position={[0, -0.015, 0]}
        opacity={0.38}
        scale={13}
        blur={2.7}
        far={5}
      />

      {/* =================================================
          CAMERA
      ================================================= */}

      <OrbitControls
        makeDefault
        target={[0, 1, -0.5]}
        minDistance={5.2}
        maxDistance={13.5}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={0.32}
      />
    </>
  )
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const clock = useJakartaClock()

  const [selected, setSelected] =
    useState(null)

  const [chatIndex, setChatIndex] =
    useState(0)

  const [sceneReady, setSceneReady] =
    useState(false)

  const [toast, setToast] =
    useState(false)

  const [lastMinute, setLastMinute] =
    useState('')

  const mode = getOfficeMode(clock)

  /* =======================================================
     CHAT ROTATION
  ======================================================= */

  useEffect(() => {
    const id = setInterval(() => {
      setChatIndex(
        i => (i + 1) % CHAT_LINES.length
      )
    }, 4300)

    return () => clearInterval(id)
  }, [])

  /* =======================================================
     BRIEFING EVENT
  ======================================================= */

  useEffect(() => {
    const key =
      `${clock.weekday}-${clock.hour}-${clock.minute}`

    if (
      clock.minute === 0 &&
      clock.second < 2 &&
      key !== lastMinute
    ) {
      setLastMinute(key)
      setToast(true)

      const timeout = setTimeout(() => {
        setToast(false)
      }, 15000)

      return () => clearTimeout(timeout)
    }
  }, [
    clock.weekday,
    clock.hour,
    clock.minute,
    clock.second,
    lastMinute
  ])

  const current =
    TEAM.find(
      t => t.id === selected
    )

  return (
    <main className="app-shell">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="topbar">

        <a
          className="brand"
          href="#"
        >
          <span className="brand-mark">
            Au
          </span>

          <span>
            <b>XAU AI</b>
            <small>
              SMC GOLD · INTELLIGENCE OFFICE
            </small>
          </span>
        </a>

        <div className="top-status">
          <span className="live-dot" />

          SYSTEM ONLINE

          <i />

          <Clock3 size={15} />

          {clock.time} WIB
        </div>

        <a
          className="join-button"
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
        >
          Join Telegram
          <ArrowUpRight size={16} />
        </a>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-copy">

          <div className="eyebrow">
            <span />
            AI-POWERED TRADING ENVIRONMENT
          </div>

          <h1>
            Meet the intelligence
            <br />
            <em>
              behind every signal.
            </em>
          </h1>

          <p>
            A virtual trading floor where
            specialized AI analysts monitor
            XAUUSD across multiple timeframes.
            Watch the team move, communicate,
            take coffee breaks and prepare for
            each analysis session.
          </p>

          <div className="hero-actions">

            <a
              className="primary-btn"
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
            >
              Explore Telegram
              <ArrowUpRight size={17} />
            </a>

            <span className="secondary-note">
              <ShieldCheck size={16} />
              Visual office simulation
            </span>

          </div>

          <div className="mini-stats">

            <div>
              <b>05</b>
              <span>AI ANALYSTS</span>
            </div>

            <div>
              <b>04</b>
              <span>TIMEFRAMES</span>
            </div>

            <div>
              <b>24/5</b>
              <span>OFFICE CYCLE*</span>
            </div>

          </div>

        </div>

        {/* =================================================
            3D SCENE
        ================================================= */}

        <div className="scene-wrap">

          <div className="scene-topline">

            <span>
              <Radio size={14} />
              LIVE OFFICE VIEW
            </span>

            <span>
              ASIA/JAKARTA · WIB
            </span>

          </div>

          <Canvas
            shadows
            camera={{
              position: [
                7.4,
                6.4,
                8.7
              ],
              fov: 38
            }}
            onCreated={() =>
              setSceneReady(true)
            }
            dpr={[1, 1.7]}
          >

            <OfficeScene
              mode={mode}
              selected={selected}
              setSelected={setSelected}
            />

          </Canvas>

          {!sceneReady && (
            <div className="scene-loading">
              Preparing virtual office…
            </div>
          )}

          {/* mode badge */}

          <div className="scene-mode-ui">

            <span
              className={
                mode === 'analysis'
                  ? 'green'
                  : mode === 'briefing'
                    ? 'gold'
                    : ''
              }
            />

            {mode === 'analysis' &&
              'ANALYSIS SESSION'}

            {mode === 'discussion' &&
              'TEAM DISCUSSION'}

            {mode === 'briefing' &&
              'HOURLY BRIEFING'}

          </div>

          <div className="scene-hint">
            DRAG TO ROTATE · SCROLL TO ZOOM ·
            SELECT AN ANALYST
          </div>

          {/* selected analyst */}

          {current && (
            <div className="analyst-card">

              <button
                onClick={() =>
                  setSelected(null)
                }
                aria-label="Close"
              >
                ×
              </button>

              <div className="analyst-card-icon">
                <Bot size={22} />
              </div>

              <b>{current.name}</b>

              <span>
                XAUUSD · {current.tf}
              </span>

              <small>
                {current.task}
              </small>

              <label>
                <i />
                SIMULATED ACTIVITY
              </label>

            </div>
          )}

          {/* briefing toast */}

          {toast && (
            <div className="dispatch-toast">

              <span className="live-dot" />

              LEADER MEETING · VISUAL EVENT

            </div>
          )}

        </div>

      </section>

      {/* =================================================
          WORKSPACE
      ================================================= */}

      <section className="workspace">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              THE TRADING FLOOR
            </span>

            <h2>
              One team. Multiple perspectives.
            </h2>

          </div>

          <p>
            Each workstation represents a
            dedicated intelligence role.
            Office movement and dialogue are
            simulated for the website experience.
          </p>

        </div>

        <div className="team-grid">

          {TEAM.map(a => (

            <article
              className="team-card"
              key={a.id}
              onClick={() =>
                setSelected(a.id)
              }
            >

              <div className="team-card-top">

                <span className="avatar">
                  {a.id === 'fundamental'
                    ? <BarChart3 size={22} />
                    : <Bot size={22} />
                  }
                </span>

                <span className="tf-pill">
                  {a.tf}
                </span>

              </div>

              <h3>
                {a.name}
              </h3>

              <p>
                {a.task}
              </p>

              <div className="card-status">
                <i />
                At workstation
                <span>·</span>
                XAUUSD
              </div>

            </article>

          ))}

        </div>

      </section>

      {/* =================================================
          OFFICE STATUS
      ================================================= */}

      <section className="status-section">

        <div className="status-card">

          <Activity size={18} />

          <div>
            <b>
              Current office activity
            </b>

            <span>
              {mode === 'analysis' &&
                'Analysts are seated and monitoring their workstations.'}

              {mode === 'discussion' &&
                'Team members are moving around and discussing the market.'}

              {mode === 'briefing' &&
                'The team leader is conducting the hourly briefing.'}
            </span>
          </div>

        </div>

        <div className="status-card">

          <Users size={18} />

          <div>
            <b>
              Team status
            </b>

            <span>
              5 analysts · 1 team leader
            </span>
          </div>

        </div>

        <div className="status-card">

          <Coffee size={18} />

          <div>
            <b>
              Coffee station
            </b>

            <span>
              Always available for the team
            </span>
          </div>

        </div>

      </section>

      {/* =================================================
          TEAM COMMS
      ================================================= */}

      <section className="activity-section">

        <div className="activity-head">

          <div>

            <span className="eyebrow">
              TEAM COMMS
            </span>

            <h2>
              Inside the office
            </h2>

          </div>

          <span className="live-label">
            <i />
            SIMULATED LIVE FEED
          </span>

        </div>

        <div className="chat-panel">

          <div className="chat-avatar">
            <MessageSquare size={19} />
          </div>

          <div className="chat-body">

            <div>

              <b>
                {CHAT_LINES[chatIndex][0]}
              </b>

              <time>
                {clock.time} WIB
              </time>

            </div>

            <p key={chatIndex}>
              {CHAT_LINES[chatIndex][1]}
            </p>

          </div>

          <span className="typing">

            <i />
            <i />
            <i />

          </span>

        </div>

        {/* =================================================
            SCHEDULE
        ================================================= */}

        <div className="schedule-note">

          <Clock3 size={17} />

          <div>

            <b>
              Automated office cycle
            </b>

            <span>
              00:00 briefing ·
              00:01–00:29 discussion ·
              00:30 analysis session
            </span>

          </div>

          <span className="schedule-tag">
            WIB
          </span>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>

        <a
          className="brand footer-brand"
          href="#"
        >

          <span className="brand-mark">
            Au
          </span>

          <span>

            <b>
              XAU AI SMC GOLD
            </b>

            <small>
              TRADING INTELLIGENCE OFFICE
            </small>

          </span>

        </a>

        <p>
          © {new Date().getFullYear()}
          {' '}
          XAU AI. Virtual office experience.
        </p>

        <span className="footer-disclaimer">
          Website visuals are simulated.
          Trading analysis and signals are
          provided separately.
        </span>

      </footer>

    </main>
  )
}
