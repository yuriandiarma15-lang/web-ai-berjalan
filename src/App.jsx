import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { Canvas, useFrame } from '@react-three/fiber'

import {
  Html,
  OrbitControls,
  ContactShadows
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


/* =========================================================
   CONFIG
========================================================= */

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


/* =========================================================
   CHAT
========================================================= */

const CHAT_LINES = [
  {
    person: 'm30',
    text: 'Market looks quiet right now.'
  },

  {
    person: 'm15',
    text: 'Anyone wants coffee?'
  },

  {
    person: 'fundamental',
    text: 'I am checking the macro calendar.'
  },

  {
    person: 'm5',
    text: 'I will grab a coffee first.'
  },

  {
    person: 'm1',
    text: 'Charts are moving slowly.'
  },

  {
    person: 'leader',
    text: 'Team, keep the floor ready.'
  },

  {
    person: 'm30',
    text: 'Everything is ready here.'
  },

  {
    person: 'fundamental',
    text: 'Nothing major on the calendar yet.'
  },

  {
    person: 'm15',
    text: 'We start analysis at minute 30.'
  },

  {
    person: 'm5',
    text: 'Coffee acquired.'
  },

  {
    person: 'm1',
    text: 'I am heading back to my desk.'
  }
]


/* =========================================================
   CLOCK
========================================================= */

function useJakartaClock() {

  const [now, setNow] = useState(
    new Date()
  )

  useEffect(() => {

    const id = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(id)

  }, [])


  const parts =
    new Intl.DateTimeFormat(
      'en-GB',
      {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
        hour12: false
      }
    ).formatToParts(now)


  const get = type =>
    parts.find(
      p => p.type === type
    )?.value


  return {

    hour: Number(get('hour')),

    minute: Number(get('minute')),

    second: Number(get('second')),

    weekday: get('weekday'),

    time:
      `${get('hour')}:${get('minute')}:${get('second')}`
  }
}


/* =========================================================
   OFFICE MODE
========================================================= */

function getOfficeMode(clock) {

  if (clock.minute === 0) {
    return 'briefing'
  }

  if (clock.minute >= 30) {
    return 'analysis'
  }

  return 'discussion'
}


/* =========================================================
   CHART
========================================================= */

function AnimatedChart({
  tf,
  color,
  working
}) {

  const [tick, setTick] =
    useState(0)


  useEffect(() => {

    const id = setInterval(() => {

      setTick(v => v + 1)

    }, 550)

    return () => clearInterval(id)

  }, [])


  const candles = useMemo(() => {

    let price = 0

    return Array.from(
      { length: 22 },
      (_, i) => {

        const move =
          Math.sin(
            i * 1.4 +
            tick * 0.07 +
            tf.length
          ) * 0.065 +

          Math.cos(
            i * 0.61 +
            tick * 0.03
          ) * 0.045


        const open = price

        const close =
          price +
          move +
          (i % 4 === 0
            ? 0.035
            : -0.012)


        const high =
          Math.max(open, close) +
          0.045


        const low =
          Math.min(open, close) -
          0.045


        price = close


        return {
          open,
          close,
          high,
          low
        }
      }
    )

  }, [tick, tf])


  return (

    <group>

      <mesh>

        <boxGeometry
          args={[
            1.28,
            0.80,
            0.08
          ]}
        />

        <meshStandardMaterial
          color="#07131f"
          roughness={0.45}
        />

      </mesh>


      <mesh
        position={[
          0,
          0,
          0.045
        ]}
      >

        <planeGeometry
          args={[
            1.17,
            0.68
          ]}
        />

        <meshBasicMaterial
          color="#091725"
        />

      </mesh>


      {/* GRID */}

      {Array.from(
        { length: 5 },
        (_, i) => (

          <mesh
            key={`h${i}`}
            position={[
              0,
              -0.27 +
              i * 0.135,
              0.052
            ]}
          >

            <planeGeometry
              args={[
                1.12,
                0.003
              ]}
            />

            <meshBasicMaterial
              color="#203649"
            />

          </mesh>

        )
      )}


      {Array.from(
        { length: 7 },
        (_, i) => (

          <mesh
            key={`v${i}`}
            position={[
              -0.51 +
              i * 0.17,
              0,
              0.052
            ]}
          >

            <planeGeometry
              args={[
                0.003,
                0.66
              ]}
            />

            <meshBasicMaterial
              color="#1c3042"
            />

          </mesh>

        )
      )}


      {/* CANDLES */}

      {candles.map(
        (c, i) => {

          const x =
            -0.49 +
            i * 0.046


          const scale = 1.3

          const open =
            c.open * scale

          const close =
            c.close * scale

          const high =
            c.high * scale

          const low =
            c.low * scale


          const bullish =
            c.close >= c.open


          const body =
            Math.max(
              Math.abs(
                close - open
              ),
              0.024
            )


          return (

            <group key={i}>

              <mesh
                position={[
                  x,
                  (high + low) / 2,
                  0.062
                ]}
              >

                <boxGeometry
                  args={[
                    0.007,
                    Math.max(
                      high - low,
                      0.025
                    ),
                    0.008
                  ]}
                />

                <meshBasicMaterial
                  color={
                    bullish
                      ? '#59d39f'
                      : '#e86f73'
                  }
                />

              </mesh>


              <mesh
                position={[
                  x,
                  (open + close) / 2,
                  0.067
                ]}
              >

                <boxGeometry
                  args={[
                    0.034,
                    body,
                    0.025
                  ]}
                />

                <meshBasicMaterial
                  color={
                    bullish
                      ? '#59d39f'
                      : '#e86f73'
                  }
                />

              </mesh>

            </group>
          )
        }
      )}


      {/* PRICE LINE */}

      <mesh
        position={[
          0.38,
          0.18,
          0.075
        ]}
      >

        <boxGeometry
          args={[
            0.18,
            0.012,
            0.012
          ]}
        />

        <meshBasicMaterial
          color={color}
        />

      </mesh>


      <Html
        position={[
          0,
          0.30,
          0.08
        ]}
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
        position={[
          0.38,
          -0.29,
          0.08
        ]}
        transform
        distanceFactor={5}
        center
      >

        <div className="screen-price">
          {working
            ? 'LIVE SIM'
            : 'STANDBY'}
        </div>

      </Html>

    </group>
  )
}


/* =========================================================
   COMPUTER
========================================================= */

function Computer({
  tf,
  color,
  working
}) {

  return (

    <group>

      <group
        position={[
          0,
          1.48,
          -0.17
        ]}
      >

        <AnimatedChart
          tf={tf}
          color={color}
          working={working}
        />


        <mesh
          position={[
            0,
            -0.50,
            0
          ]}
        >

          <boxGeometry
            args={[
              0.13,
              0.10,
              0.13
            ]}
          />

          <meshStandardMaterial
            color="#aab7c0"
          />

        </mesh>


        <mesh
          position={[
            0,
            -0.56,
            0
          ]}
        >

          <boxGeometry
            args={[
              0.48,
              0.035,
              0.25
            ]}
          />

          <meshStandardMaterial
            color="#7d8a94"
          />

        </mesh>

      </group>


      {/* keyboard */}

      <mesh
        position={[
          0.34,
          0.94,
          0.24
        ]}
      >

        <boxGeometry
          args={[
            0.42,
            0.025,
            0.18
          ]}
        />

        <meshStandardMaterial
          color="#d9dedf"
        />

      </mesh>


      {/* mouse */}

      <mesh
        position={[
          0.61,
          0.95,
          0.23
        ]}
      >

        <boxGeometry
          args={[
            0.12,
            0.025,
            0.09
          ]}
        />

        <meshStandardMaterial
          color="#9da8ad"
        />

      </mesh>


      {/* lamp */}

      <mesh
        position={[
          -0.39,
          0.99,
          0.21
        ]}
      >

        <cylinderGeometry
          args={[
            0.045,
            0.055,
            0.16,
            10
          ]}
        />

        <meshStandardMaterial
          color="#b9c2c4"
        />

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
  working,
  onSelect
}) {

  return (

    <group
      position={position}
      onClick={onSelect}
    >

      {/* TABLE */}

      <mesh
        position={[
          0,
          0.72,
          0
        ]}
        castShadow
      >

        <boxGeometry
          args={[
            1.60,
            0.12,
            0.85
          ]}
        />

        <meshStandardMaterial
          color="#c3aa7d"
          roughness={0.72}
        />

      </mesh>


      {/* LEGS */}

      {[
        [-0.68, 0.34, -0.29],
        [0.68, 0.34, -0.29],
        [-0.68, 0.34, 0.29],
        [0.68, 0.34, 0.29]
      ].map(
        (p, i) => (

          <mesh
            key={i}
            position={p}
          >

            <boxGeometry
              args={[
                0.08,
                0.68,
                0.08
              ]}
            />

            <meshStandardMaterial
              color="#756653"
            />

          </mesh>

        )
      )}


      {/* COMPUTER */}

      <Computer
        tf={tf}
        color={color}
        working={working}
      />


      {/* PC TOWER */}

      <mesh
        position={[
          0.60,
          0.95,
          -0.13
        ]}
      >

        <boxGeometry
          args={[
            0.17,
            0.38,
            0.34
          ]}
        />

        <meshStandardMaterial
          color="#101922"
          metalness={0.25}
          roughness={0.35}
        />

      </mesh>


      {/* PAPERS */}

      <mesh
        position={[
          -0.39,
          0.79,
          0.22
        ]}
      >

        <boxGeometry
          args={[
            0.34,
            0.025,
            0.22
          ]}
        />

        <meshStandardMaterial
          color="#e8e1d3"
        />

      </mesh>


      {/* COFFEE */}

      <mesh
        position={[
          0.53,
          0.82,
          0.26
        ]}
      >

        <cylinderGeometry
          args={[
            0.055,
            0.045,
            0.10,
            12
          ]}
        />

        <meshStandardMaterial
          color="#f1ece1"
        />

      </mesh>


      {/* SELECTION */}

      {selected && (

        <mesh
          position={[
            0,
            0.87,
            0
          ]}
        >

          <boxGeometry
            args={[
              1.76,
              0.015,
              0.98
            ]}
          />

          <meshBasicMaterial
            color="#e4ba63"
            wireframe
          />

        </mesh>

      )}

    </group>
  )
}


/* =========================================================
   CHAIR
========================================================= */

function Chair({
  position
}) {

  return (

    <group
      position={position}
    >

      <mesh
        position={[
          0,
          0.43,
          0
        ]}
      >

        <boxGeometry
          args={[
            0.50,
            0.10,
            0.44
          ]}
        />

        <meshStandardMaterial
          color="#26394c"
        />

      </mesh>


      <mesh
        position={[
          0,
          0.76,
          -0.18
        ]}
      >

        <boxGeometry
          args={[
            0.50,
            0.55,
            0.08
          ]}
        />

        <meshStandardMaterial
          color="#26394c"
        />

      </mesh>


      <mesh
        position={[
          0,
          0.18,
          0
        ]}
      >

        <cylinderGeometry
          args={[
            0.035,
            0.035,
            0.45,
            8
          ]}
        />

        <meshStandardMaterial
          color="#677680"
        />

      </mesh>

    </group>
  )
}


/* =========================================================
   WALKING PERSON
========================================================= */

function WalkingPerson({
  start,
  target,
  color,
  state,
  speech,
  onClick
}) {

  const group =
    useRef()

  const [progress, setProgress] =
    useState(0)

  const [phase] =
    useState(
      Math.random() * 10
    )


  useEffect(() => {

    setProgress(0)

  }, [
    target[0],
    target[2],
    state
  ])


  useFrame((_, delta) => {

    if (!group.current)
      return


    const distance =
      Math.sqrt(
        Math.pow(
          target[0] - start[0],
          2
        ) +
        Math.pow(
          target[2] - start[2],
          2
        )
      )


    const speed =
      state === 'walking'
        ? 0.25
        : 0.50


    const next =
      Math.min(
        progress +
        delta *
        speed /
        Math.max(distance, 0.1),
        1
      )


    if (
      next !== progress
    ) {

      setProgress(next)

    }


    const ease =
      next < 0.5
        ? 2 * next * next
        : 1 -
          Math.pow(
            -2 * next + 2,
            2
          ) / 2


    const x =
      start[0] +
      (target[0] - start[0]) *
      ease


    const z =
      start[2] +
      (target[2] - start[2]) *
      ease


    group.current.position.x =
      x

    group.current.position.z =
      z


    /* WALKING BOB */

    const walking =
      state === 'walking'


    const bob =
      walking
        ? Math.abs(
            Math.sin(
              phase +
              performance.now() *
              0.008
            )
          ) * 0.045
        : 0


    group.current.position.y =
      bob


    /* FACE DIRECTION */

    const dx =
      target[0] - start[0]

    const dz =
      target[2] - start[2]


    if (
      Math.abs(dx) +
      Math.abs(dz) >
      0.05
    ) {

      group.current.rotation.y =
        Math.atan2(
          dx,
          dz
        )

    }

  })


  const walking =
    state === 'walking'


  const working =
    state === 'working'


  const coffee =
    state === 'coffee'


  const arm =
    walking
      ? Math.sin(
          performance.now() *
          0.008
        ) * 0.28
      : working
        ? Math.sin(
            performance.now() *
            0.006
          ) * 0.08
        : 0


  return (

    <group
      ref={group}
      onClick={onClick}
    >

      {/* BODY */}

      <mesh
        position={[
          0,
          working ? 0.66 : 0.82,
          0
        ]}
        castShadow
      >

        <boxGeometry
          args={[
            0.40,
            working ? 0.40 : 0.50,
            0.30
          ]}
        />

        <meshStandardMaterial
          color="#3c6689"
        />

      </mesh>


      {/* HEAD */}

      <mesh
        position={[
          0,
          working ? 1.05 : 1.20,
          0
        ]}
        castShadow
      >

        <sphereGeometry
          args={[
            0.18,
            14,
            12
          ]}
        />

        <meshStandardMaterial
          color={color}
        />

      </mesh>


      {/* HAIR */}

      <mesh
        position={[
          0,
          working ? 1.15 : 1.31,
          0
        ]}
      >

        <sphereGeometry
          args={[
            0.17,
            12,
            8
          ]}
        />

        <meshStandardMaterial
          color="#25282c"
        />

      </mesh>


      {/* LEFT ARM */}

      <mesh
        position={[
          -0.26,
          working ? 0.70 : 0.83,
          0.02
        ]}
        rotation={[
          0,
          0,
          -0.45 + arm
        ]}
      >

        <boxGeometry
          args={[
            0.12,
            0.36,
            0.13
          ]}
        />

        <meshStandardMaterial
          color="#3c6689"
        />

      </mesh>


      {/* RIGHT ARM */}

      <mesh
        position={[
          0.26,
          working ? 0.70 : 0.83,
          0.02
        ]}
        rotation={[
          0,
          0,
          0.45 - arm
        ]}
      >

        <boxGeometry
          args={[
            0.12,
            0.36,
            0.13
          ]}
        />

        <meshStandardMaterial
          color="#3c6689"
        />

      </mesh>


      {/* LEGS */}

      <mesh
        position={[
          -0.10,
          0.38,
          0
        ]}
        rotation={[
          walking
            ? Math.sin(
                performance.now() *
                0.008
              ) * 0.35
            : 0,
          0,
          0
        ]}
      >

        <boxGeometry
          args={[
            0.12,
            0.40,
            0.13
          ]}
        />

        <meshStandardMaterial
          color="#26313d"
        />

      </mesh>


      <mesh
        position={[
          0.10,
          0.38,
          0
        ]}
        rotation={[
          walking
            ? Math.sin(
                performance.now() *
                0.008 +
                Math.PI
              ) * 0.35
            : 0,
          0,
          0
        ]}
      >

        <boxGeometry
          args={[
            0.12,
            0.40,
            0.13
          ]}
        />

        <meshStandardMaterial
          color="#26313d"
        />

      </mesh>


      {/* COFFEE CUP */}

      {coffee && (

        <mesh
          position={[
            0.30,
            0.95,
            0.20
          ]}
        >

          <cylinderGeometry
            args={[
              0.055,
              0.045,
              0.11,
              12
            ]}
          />

          <meshStandardMaterial
            color="#eee8db"
          />

        </mesh>

      )}


      {/* SPEECH */}

      {speech && (

        <Html
          position={[
            0,
            working ? 1.55 : 1.62,
            0
          ]}
          center
          distanceFactor={7}
        >

          <div className="speech-bubble">

            <span>
              {speech}
            </span>

          </div>

        </Html>

      )}

    </group>
  )
}


/* =========================================================
   LEADER
========================================================= */

function Leader({
  mode
}) {

  const group =
    useRef()

  const [point, setPoint] =
    useState(0)


  const patrol = [

    [-3.8, 0, -1.55],

    [-2.0, 0, -1.15],

    [0.0, 0, -1.55],

    [2.0, 0, -1.15],

    [3.8, 0, -1.55],

    [1.8, 0, -2.25],

    [-1.8, 0, -2.25]

  ]


  useEffect(() => {

    if (
      mode !== 'discussion'
    ) return


    const id =
      setInterval(() => {

        setPoint(
          p =>
            (p + 1) %
            patrol.length
        )

      }, 4800)


    return () =>
      clearInterval(id)

  }, [mode])


  const target =
    mode === 'briefing'
      ? [0, 0, -1.45]
      : patrol[point]


  useFrame((_, delta) => {

    if (!group.current)
      return


    const current =
      group.current.position


    const dx =
      target[0] -
      current.x


    const dz =
      target[2] -
      current.z


    const distance =
      Math.sqrt(
        dx * dx +
        dz * dz
      )


    if (
      distance > 0.04
    ) {

      const speed =
        mode === 'briefing'
          ? 1.8
          : 0.7


      current.x +=
        (dx / distance) *
        speed *
        delta


      current.z +=
        (dz / distance) *
        speed *
        delta


      group.current.rotation.y =
        Math.atan2(
          dx,
          dz
        )

    }

  })


  return (

    <group ref={group}>

      {/* body */}

      <mesh
        position={[
          0,
          0.84,
          0
        ]}
        castShadow
      >

        <boxGeometry
          args={[
            0.42,
            0.52,
            0.31
          ]}
        />

        <meshStandardMaterial
          color="#c9a04f"
        />

      </mesh>


      {/* head */}

      <mesh
        position={[
          0,
          1.22,
          0
        ]}
        castShadow
      >

        <sphereGeometry
          args={[
            0.19,
            14,
            12
          ]}
        />

        <meshStandardMaterial
          color="#d9a17c"
        />

      </mesh>


      {/* hair */}

      <mesh
        position={[
          0,
          1.33,
          0
        ]}
      >

        <sphereGeometry
          args={[
            0.18,
            12,
            8
          ]}
        />

        <meshStandardMaterial
          color="#20252a"
        />

      </mesh>


      {/* arms */}

      <mesh
        position={[
          -0.28,
          0.85,
          0
        ]}
        rotation={[
          0,
          0,
          -0.45
        ]}
      >

        <boxGeometry
          args={[
            0.13,
            0.38,
            0.14
          ]}
        />

        <meshStandardMaterial
          color="#c9a04f"
        />

      </mesh>


      <mesh
        position={[
          0.28,
          0.85,
          0
        ]}
        rotation={[
          0,
          0,
          0.45
        ]}
      >

        <boxGeometry
          args={[
            0.13,
            0.38,
            0.14
          ]}
        />

        <meshStandardMaterial
          color="#c9a04f"
        />

      </mesh>


      {/* leader speech */}

      {mode === 'briefing' && (

        <Html
          position={[
            0,
            1.75,
            0
          ]}
          center
          distanceFactor={7}
        >

          <div className="speech-bubble leader-bubble">

            <span>
              Team, let's prepare for the
              next XAUUSD session.
            </span>

          </div>

        </Html>

      )}

    </group>
  )
}


/* =========================================================
   COFFEE MACHINE
========================================================= */

function CoffeeMachine({
  position
}) {

  const [steam, setSteam] =
    useState(false)


  useEffect(() => {

    const id =
      setInterval(() => {

        setSteam(v => !v)

      }, 900)


    return () =>
      clearInterval(id)

  }, [])


  return (

    <group
      position={position}
    >

      {/* cabinet */}

      <mesh
        position={[
          0,
          0.55,
          0
        ]}
      >

        <boxGeometry
          args={[
            1.15,
            1.10,
            0.55
          ]}
        />

        <meshStandardMaterial
          color="#252e36"
          roughness={0.35}
          metalness={0.35}
        />

      </mesh>


      {/* top */}

      <mesh
        position={[
          0,
          1.14,
          0
        ]}
      >

        <boxGeometry
          args={[
            0.86,
            0.16,
            0.44
          ]}
        />

        <meshStandardMaterial
          color="#111820"
        />

      </mesh>


      {/* screen */}

      <mesh
        position={[
          0,
          0.92,
          0.285
        ]}
      >

        <boxGeometry
          args={[
            0.30,
            0.13,
            0.018
          ]}
        />

        <meshBasicMaterial
          color="#17343a"
        />

      </mesh>


      <Html
        position={[
          0,
          0.92,
          0.30
        ]}
        transform
        distanceFactor={5}
        center
      >

        <div className="coffee-display">
          COFFEE
        </div>

      </Html>


      {/* buttons */}

      {[-0.18, 0, 0.18].map(
        (x, i) => (

          <mesh
            key={i}
            position={[
              x,
              0.69,
              0.29
            ]}
          >

            <sphereGeometry
              args={[
                0.035,
                8,
                8
              ]}
            />

            <meshBasicMaterial
              color={
                i === 1
                  ? '#d8b45d'
                  : '#65727a'
              }
            />

          </mesh>

        )
      )}


      {/* tray */}

      <mesh
        position={[
          0,
          0.46,
          0.30
        ]}
      >

        <boxGeometry
          args={[
            0.58,
            0.035,
            0.30
          ]}
        />

        <meshStandardMaterial
          color="#11161b"
        />

      </mesh>


      {/* cup */}

      <mesh
        position={[
          0,
          0.56,
          0.30
        ]}
      >

        <cylinderGeometry
          args={[
            0.075,
            0.06,
            0.12,
            12
          ]}
        />

        <meshStandardMaterial
          color="#eee9df"
        />

      </mesh>


      {/* steam */}

      {steam && (

        <>

          <mesh
            position={[
              -0.025,
              0.76,
              0.30
            ]}
          >

            <sphereGeometry
              args={[
                0.018,
                6,
                6
              ]}
            />

            <meshBasicMaterial
              color="#d5dadd"
              transparent
              opacity={0.45}
            />

          </mesh>


          <mesh
            position={[
              0.025,
              0.81,
              0.30
            ]}
          >

            <sphereGeometry
              args={[
                0.014,
                6,
                6
              ]}
            />

            <meshBasicMaterial
              color="#d5dadd"
              transparent
              opacity={0.35}
            />

          </mesh>

        </>

      )}

    </group>
  )
}


/* =========================================================
   PLANT
========================================================= */

function Plant({
  position
}) {

  return (

    <group
      position={position}
    >

      <mesh
        position={[
          0,
          0.25,
          0
        ]}
      >

        <cylinderGeometry
          args={[
            0.22,
            0.17,
            0.38,
            12
          ]}
        />

        <meshStandardMaterial
          color="#9b674b"
        />

      </mesh>


      {[
        [-0.16, 0.58, 0],
        [0.16, 0.65, 0],
        [0, 0.78, 0],
        [-0.05, 0.95, 0],
        [0.18, 0.86, 0]
      ].map(
        (p, i) => (

          <mesh
            key={i}
            position={p}
          >

            <sphereGeometry
              args={[
                0.12,
                8,
                6
              ]}
            />

            <meshStandardMaterial
              color="#477153"
            />

          </mesh>

        )
      )}

    </group>
  )
}


/* =========================================================
   OFFICE SCENE
========================================================= */

function OfficeScene({
  mode,
  selected,
  setSelected,
  speechPerson,
  speechText
}) {

  const deskPositions = [
    [-3.15, 0, 0.50],
    [-1.55, 0, 0.50],
    [0.05, 0, 0.50],
    [1.65, 0, 0.50],
    [3.25, 0, 0.50]
  ]


  /*
    WALKING ROUTES
  */

  const routes = [

    [
      [-3.15, 0, 1.20],
      [-3.8, 0, -0.65],
      [-2.7, 0, -1.30]
    ],

    [
      [-1.55, 0, 1.20],
      [-0.8, 0, -0.75],
      [-1.9, 0, -1.55]
    ],

    [
      [0.05, 0, 1.20],
      [0.9, 0, -0.75],
      [0.3, 0, -1.70]
    ],

    [
      [1.65, 0, 1.20],
      [2.8, 0, -0.70],
      [2.0, 0, -1.60]
    ],

    [
      [3.25, 0, 1.20],
      [4.1, 0, -0.80],
      [3.4, 0, -1.80]
    ]

  ]


  const [routeIndex, setRouteIndex] =
    useState(
      [0, 1, 2, 3, 4]
    )


  useEffect(() => {

    if (
      mode !== 'discussion'
    ) return


    const id =
      setInterval(() => {

        setRouteIndex(
          arr =>
            arr.map(
              value =>
                (value + 1) % 3
            )
        )

      }, 5000)


    return () =>
      clearInterval(id)

  }, [mode])


  return (

    <>

      {/* =================================================
          LIGHTING
      ================================================= */}

      <color
        attach="background"
        args={[
          '#07111e'
        ]}
      />


      <ambientLight
        intensity={1.5}
      />


      <directionalLight
        position={[
          4,
          8,
          5
        ]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />


      <pointLight
        position={[
          -4,
          3,
          -3
        ]}
        intensity={10}
        color="#376fb4"
        distance={13}
      />


      <pointLight
        position={[
          4,
          3,
          -1
        ]}
        intensity={8}
        color="#c58c48"
        distance={11}
      />


      {/* =================================================
          FLOOR
      ================================================= */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0
        ]}
        position={[
          0,
          -0.03,
          0
        ]}
        receiveShadow
      >

        <planeGeometry
          args={[
            14,
            10
          ]}
        />

        <meshStandardMaterial
          color="#172637"
          roughness={0.80}
        />

      </mesh>


      <gridHelper
        args={[
          14,
          28,
          '#29435f',
          '#1b3047'
        ]}
        position={[
          0,
          0.005,
          0
        ]}
      />


      {/* =================================================
          WALL
      ================================================= */}

      <mesh
        position={[
          0,
          2,
          -4
        ]}
      >

        <boxGeometry
          args={[
            13,
            4,
            0.18
          ]}
        />

        <meshStandardMaterial
          color="#dfe3e2"
        />

      </mesh>


      <mesh
        position={[
          -6.5,
          2,
          0
        ]}
      >

        <boxGeometry
          args={[
            0.18,
            4,
            8
          ]}
        />

        <meshStandardMaterial
          color="#d9dddc"
        />

      </mesh>


      <mesh
        position={[
          6.5,
          2,
          0
        ]}
      >

        <boxGeometry
          args={[
            0.18,
            4,
            8
          ]}
        />

        <meshStandardMaterial
          color="#d9dddc"
        />

      </mesh>


      {/* =================================================
          WALL LOGO
      ================================================= */}

      <Html
        position={[
          0,
          2.45,
          -3.87
        ]}
        center
        distanceFactor={8}
      >

        <div className="wall-logo-simple">

          <small>
            ARTIFICIAL INTELLIGENCE
          </small>

          <strong>
            XAU AI
          </strong>

          <b>
            SMC GOLD
          </b>

          <span>
            TRADING INTELLIGENCE OFFICE
          </span>

        </div>

      </Html>


      {/* =================================================
          WINDOWS
      ================================================= */}

      {[
        -4.7,
        -3.25,
        3.25,
        4.7
      ].map(
        (x, i) => (

          <group
            key={i}
            position={[
              x,
              1.75,
              -3.67
            ]}
          >

            <mesh>

              <boxGeometry
                args={[
                  1.05,
                  1.45,
                  0.06
                ]}
              />

              <meshStandardMaterial
                color="#9fbfd1"
                emissive="#27445c"
                emissiveIntensity={0.3}
              />

            </mesh>


            <mesh
              position={[
                0,
                0,
                0.04
              ]}
            >

              <boxGeometry
                args={[
                  1.13,
                  1.53,
                  0.04
                ]}
              />

              <meshStandardMaterial
                color="#b89e68"
              />

            </mesh>

          </group>

        )
      )}


      {/* =================================================
          COFFEE
      ================================================= */}

      <CoffeeMachine
        position={[
          4.0,
          0,
          -2.45
        ]}
      />


      {/* =================================================
          PLANTS
      ================================================= */}

      <Plant
        position={[
          -5.2,
          0,
          -2.65
        ]}
      />

      <Plant
        position={[
          5.25,
          0,
          1.5
        ]}
      />


      {/* =================================================
          DESKS + PEOPLE
      ================================================= */}

      {TEAM.map(
        (a, i) => {

          const desk =
            deskPositions[i]


          const working =
            mode === 'analysis'


          const route =
            routes[i]


          const walkingTarget =
            route[
              routeIndex[i]
            ]


          const start =
            route[
              (routeIndex[i] + 2) % 3
            ]


          return (

            <group key={a.id}>

              <Desk
                position={desk}
                tf={a.tf}
                color={a.color}
                selected={
                  selected === a.id
                }
                working={working}
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
              />


              {working ? (

                <WalkingPerson
                  start={[
                    desk[0],
                    0,
                    desk[2] + 0.48
                  ]}
                  target={[
                    desk[0],
                    0,
                    desk[2] + 0.48
                  ]}
                  color={[
                    '#d8a27e',
                    '#b97c5c',
                    '#e0b18c',
                    '#c98d6d',
                    '#d29b82'
                  ][i]}
                  state="working"
                  speech={
                    speechPerson === a.id
                      ? speechText
                      : null
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

                <WalkingPerson
                  start={start}
                  target={walkingTarget}
                  color={[
                    '#d8a27e',
                    '#b97c5c',
                    '#e0b18c',
                    '#c98d6d',
                    '#d29b82'
                  ][i]}
                  state={
                    speechPerson === a.id
                      ? 'coffee'
                      : 'walking'
                  }
                  speech={
                    speechPerson === a.id
                      ? speechText
                      : null
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
        }
      )}


      {/* =================================================
          LEADER
      ================================================= */}

      <Leader
        mode={mode}
      />


      {/* =================================================
          SHADOWS
      ================================================= */}

      <ContactShadows
        position={[
          0,
          -0.015,
          0
        ]}
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
        target={[
          0,
          1,
          -0.5
        ]}
        minDistance={5}
        maxDistance={13}
        maxPolarAngle={
          Math.PI / 2.05
        }
        minPolarAngle={0.32}
      />

    </>
  )
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  const clock =
    useJakartaClock()


  const mode =
    getOfficeMode(clock)


  const [
    selected,
    setSelected
  ] = useState(null)


  const [
    chatIndex,
    setChatIndex
  ] = useState(0)


  const [
    sceneReady,
    setSceneReady
  ] = useState(false)


  const [
    toast,
    setToast
  ] = useState(false)


  /* =======================================================
     CHAT PERSON
  ======================================================= */

  const currentChat =
    CHAT_LINES[chatIndex]


  const speechPerson =
    currentChat.person


  const speechText =
    currentChat.text


  /* =======================================================
     CHAT ROTATION
  ======================================================= */

  useEffect(() => {

    const id =
      setInterval(() => {

        setChatIndex(
          i =>
            (i + 1) %
            CHAT_LINES.length
        )

      }, 4200)


    return () =>
      clearInterval(id)

  }, [])


  /* =======================================================
     BRIEFING
  ======================================================= */

  const [
    lastMinute,
    setLastMinute
  ] = useState('')


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


      const id =
        setTimeout(() => {

          setToast(false)

        }, 15000)


      return () =>
        clearTimeout(id)

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
      t =>
        t.id === selected
    )


  return (

    <main className="app-shell">


      {/* =================================================
          HEADER
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

            <b>
              XAU AI
            </b>

            <small>
              SMC GOLD ·
              INTELLIGENCE OFFICE
            </small>

          </span>

        </a>


        <div className="top-status">

          <span className="live-dot" />

          SYSTEM ONLINE

          <i />

          <Clock3 size={15} />

          {clock.time}
          {' '}
          WIB

        </div>


        <a
          className="join-button"
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
        >

          Join Telegram

          <ArrowUpRight
            size={16}
          />

        </a>

      </header>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">


        <div className="hero-copy">

          <div className="eyebrow">

            <span />

            AI-POWERED
            TRADING ENVIRONMENT

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
            XAUUSD across multiple
            timeframes.

            <br /><br />

            Watch the team move around the
            office, communicate, take coffee
            breaks and return to their
            workstations.

          </p>


          <div className="hero-actions">

            <a
              className="primary-btn"
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
            >

              Explore Telegram

              <ArrowUpRight
                size={17}
              />

            </a>


            <span className="secondary-note">

              <ShieldCheck
                size={16}
              />

              Visual office simulation

            </span>

          </div>


          <div className="mini-stats">

            <div>

              <b>
                05
              </b>

              <span>
                AI ANALYSTS
              </span>

            </div>


            <div>

              <b>
                04
              </b>

              <span>
                TIMEFRAMES
              </span>

            </div>


            <div>

              <b>
                24/5
              </b>

              <span>
                OFFICE CYCLE
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            SCENE
        ================================================= */}

        <div className="scene-wrap">


          <div className="scene-topline">

            <span>

              <Radio
                size={14}
              />

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
                7.5,
                6.3,
                8.6
              ],
              fov: 38
            }}
            onCreated={() =>
              setSceneReady(true)
            }
            dpr={[
              1,
              1.7
            ]}
          >

            <OfficeScene
              mode={mode}
              selected={selected}
              setSelected={setSelected}
              speechPerson={
                speechPerson
              }
              speechText={
                speechText
              }
            />

          </Canvas>


          {!sceneReady && (

            <div className="scene-loading">

              Preparing virtual office…

            </div>

          )}


          <div className="scene-hint">

            DRAG TO ROTATE ·
            SCROLL TO ZOOM ·
            SELECT AN ANALYST

          </div>


          {/* SELECTED CARD */}

          {current && (

            <div className="analyst-card">

              <button
                onClick={() =>
                  setSelected(null)
                }
              >
                ×
              </button>


              <div className="analyst-card-icon">

                <Bot
                  size={22}
                />

              </div>


              <b>
                {current.name}
              </b>


              <span>
                XAUUSD ·
                {' '}
                {current.tf}
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


          {toast && (

            <div className="dispatch-toast">

              <span className="live-dot" />

              HOURLY TEAM BRIEFING

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

              One team.
              Multiple perspectives.

            </h2>

          </div>


          <p>

            Each workstation represents
            a dedicated intelligence role.
            Office movement and dialogue
            are simulated for the website.

          </p>

        </div>


        <div className="team-grid">

          {TEAM.map(
            a => (

              <article
                className="team-card"
                key={a.id}
                onClick={() =>
                  setSelected(a.id)
                }
              >

                <div className="team-card-top">

                  <span className="avatar">

                    {a.id ===
                    'fundamental'

                      ? (
                        <BarChart3
                          size={22}
                        />
                      )

                      : (
                        <Bot
                          size={22}
                        />
                      )}

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

                  <span>
                    ·
                  </span>

                  XAUUSD

                </div>

              </article>

            )
          )}

        </div>

      </section>


      {/* =================================================
          STATUS
      ================================================= */}

      <section className="status-section">


        <div className="status-card">

          <Activity
            size={18}
          />

          <div>

            <b>
              Current activity
            </b>

            <span>

              {mode ===
                'discussion' &&
                'Team members are walking around and discussing the market.'}

              {mode ===
                'analysis' &&
                'Analysts are seated at their workstations.'}

              {mode ===
                'briefing' &&
                'The team leader is conducting the hourly briefing.'}

            </span>

          </div>

        </div>


        <div className="status-card">

          <Users
            size={18}
          />

          <div>

            <b>
              Team
            </b>

            <span>
              5 analysts ·
              1 team leader
            </span>

          </div>

        </div>


        <div className="status-card">

          <Coffee
            size={18}
          />

          <div>

            <b>
              Coffee station
            </b>

            <span>
              Always available
              for the team
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          COMMUNICATION
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

            <MessageSquare
              size={19}
            />

          </div>


          <div className="chat-body">

            <div>

              <b>
                {
                  CHAT_LINES[
                    chatIndex
                  ].person
                }
              </b>


              <time>
                {clock.time}
                {' '}
                WIB
              </time>

            </div>


            <p>

              {
                CHAT_LINES[
                  chatIndex
                ].text
              }

            </p>

          </div>


          <span className="typing">

            <i />
            <i />
            <i />

          </span>

        </div>


        <div className="schedule-note">

          <Clock3
            size={17}
          />


          <div>

            <b>
              Office activity cycle
            </b>

            <span>

              00–29 discussion &
              movement ·
              30–59 analysis

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
          XAU AI.
          Virtual office experience.

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
