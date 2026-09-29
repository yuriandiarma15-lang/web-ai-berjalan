import React, { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Activity, ArrowUpRight, Bot, ChartCandlestick, Clock3, MessageSquare, Radio, ShieldCheck } from 'lucide-react'

const TEAM = [
  { id: 'm30', name: 'Macro Analyst', tf: 'M30', color: '#68b8ff', task: 'Higher timeframe observation' },
  { id: 'm15', name: 'SMC Analyst', tf: 'M15', color: '#b49aff', task: 'Market structure monitoring' },
  { id: 'm5', name: 'Entry Analyst', tf: 'M5', color: '#f0bd68', task: 'Entry zone observation' },
  { id: 'm1', name: 'Execution Analyst', tf: 'M1', color: '#67d6b0', task: 'Short-term price monitoring' },
]
const CHAT_LINES = [
  ['M30 Analyst', 'Reviewing the higher timeframe view.'],
  ['M15 Analyst', 'Updating market observation.'],
  ['M5 Analyst', 'Monitoring the active price zone.'],
  ['M1 Analyst', 'Refreshing the short-term chart.'],
  ['Team Leader', 'Team, keep the trading floor ready.'],
  ['M30 Analyst', 'Workspace status: all monitors online.'],
]

function useJakartaClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit',
    weekday: 'short', hour12: false
  }).formatToParts(now)
  const get = type => parts.find(p => p.type === type)?.value
  return { now, hour: Number(get('hour')), minute: Number(get('minute')), second: Number(get('second')), weekday: get('weekday'), time: `${get('hour')}:${get('minute')}:${get('second')}` }
}

function ChartScreen({ tf, color }) {
  const points = useMemo(() => {
    let y = 0
    return Array.from({ length: 24 }, (_, i) => {
      y += (Math.sin(i * 1.4 + tf.length) * 0.17) + (Math.cos(i * 0.63) * 0.09) + (i % 5 === 0 ? 0.12 : -0.025)
      return [((i / 23) - .5) * 1.7, y * .42, 0.015]
    })
  }, [tf])
  return (
    <group>
      <mesh><boxGeometry args={[1.16, .73, .08]} /><meshStandardMaterial color="#091523" roughness={0.55} /></mesh>
      <mesh position={[0, 0, .045]}><planeGeometry args={[1.06, .62]} /><meshBasicMaterial color="#0b1928" /></mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={`h${i}`} position={[0, -.25 + i * .125, .052]}><planeGeometry args={[1.02, .003]} /><meshBasicMaterial color="#24384a" /></mesh>)}
      {Array.from({ length: 7 }, (_, i) => <mesh key={`v${i}`} position={[-.48 + i * .16, 0, .052]}><planeGeometry args={[.003, .59]} /><meshBasicMaterial color="#203347" /></mesh>)}
      {points.slice(0, -1).map((p, i) => {
        const q = points[i + 1]
        const geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p[0], p[1], .06), new THREE.Vector3(q[0], q[1], .06)])
        return <line key={i} geometry={geom}><lineBasicMaterial color={color} /></line>
      })}
      {points.filter((_, i) => i % 3 === 0).map((p, i) => <mesh key={i} position={[p[0], p[1], .061]}><sphereGeometry args={[.018, 6, 6]} /><meshBasicMaterial color={i % 2 ? '#e4b65e' : color} /></mesh>)}
      <Html position={[0, .27, .07]} transform distanceFactor={5} center>
        <div className="screen-label"><b>XAUUSD</b><span>{tf}</span></div>
      </Html>
    </group>
  )
}

function Desk({ position, tf, color, selected, onSelect }) {
  return (
    <group position={position} onClick={onSelect}>
      {/* desk top and legs */}
      <mesh position={[0, .72, 0]} castShadow><boxGeometry args={[1.65, .12, .85]} /><meshStandardMaterial color="#d7c19c" roughness={.75} /></mesh>
      {[[-.68,.34,-.29],[.68,.34,-.29],[-.68,.34,.29],[.68,.34,.29]].map((p,i)=><mesh key={i} position={p}><boxGeometry args={[.09,.68,.09]} /><meshStandardMaterial color="#9b876b" /></mesh>)}
      <group position={[0, .79, -.17]} rotation={[-.12, 0, 0]}>
        <ChartScreen tf={tf} color={color}/>
        <mesh position={[0,-.43,.02]}><boxGeometry args={[.14,.09,.12]} /><meshStandardMaterial color="#a7b5c1" /></mesh>
        <mesh position={[0,-.49,.02]}><boxGeometry args={[.48,.035,.25]} /><meshStandardMaterial color="#8d9ba8" /></mesh>
      </group>
      <mesh position={[.32,.79,.22]}><boxGeometry args={[.48,.025,.17]} /><meshStandardMaterial color="#e9e2d4" /></mesh>
      <mesh position={[-.36,.79,.22]}><boxGeometry args={[.4,.025,.16]} /><meshStandardMaterial color="#b7c6c8" /></mesh>
      {selected && <mesh position={[0,.87,0]}><boxGeometry args={[1.78,.015,.98]} /><meshBasicMaterial color="#e7bd67" wireframe /></mesh>}
    </group>
  )
}

function Person({ position, color = '#d6a17d', leader = false, active = false, name, tf, onClick }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setPhase(p => p + 1), 650)
    return () => clearInterval(id)
  }, [])
  const typing = Math.sin(phase * .8) * .035
  return (
    <group position={position} onClick={onClick}>
      {/* chair */}
      <mesh position={[0,.32,.34]}><boxGeometry args={[.5,.08,.42]} /><meshStandardMaterial color="#273c55" /></mesh>
      <mesh position={[0,.58,.49]}><boxGeometry args={[.48,.48,.08]} /><meshStandardMaterial color="#344d69" /></mesh>
      {/* body */}
      <mesh position={[0,.82,0]} castShadow><boxGeometry args={[.42,.5,.3]} /><meshStandardMaterial color={leader ? '#d5ad59' : '#3d6b91'} /></mesh>
      {/* head */}
      <mesh position={[0,1.2,0]} castShadow><sphereGeometry args={[.19,12,10]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0,1.23,.16]}><boxGeometry args={[.13,.025,.018]} /><meshBasicMaterial color="#202a35" /></mesh>
      {/* arms move while typing */}
      <mesh position={[-.27,.85,-.02]} rotation={[0,0,-.45 + typing]}><boxGeometry args={[.13,.38,.14]} /><meshStandardMaterial color={leader ? '#d5ad59' : '#3d6b91'} /></mesh>
      <mesh position={[.27,.85,-.02]} rotation={[0,0,.45 - typing]}><boxGeometry args={[.13,.38,.14]} /><meshStandardMaterial color={leader ? '#d5ad59' : '#3d6b91'} /></mesh>
      {name && <Html position={[0,1.62,0]} center distanceFactor={8}>
        <div className={`name-tag ${leader ? 'leader-tag' : ''}`}><span>{name}</span>{tf && <b>{tf}</b>}</div>
      </Html>}
      {active && <mesh position={[0,1.48,0]}><sphereGeometry args={[.035,8,8]} /><meshBasicMaterial color="#66e0ad" /></mesh>}
    </group>
  )
}

function OfficeScene({ leaderMeeting, selected, setSelected }) {
  const leaderX = leaderMeeting ? -0.2 : -3.2
  const leaderZ = leaderMeeting ? -1.05 : -2.25
  return (
    <>
      <color attach="background" args={['#091321']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4,8,5]} intensity={2.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
      <pointLight position={[-4,3,-3]} intensity={12} color="#326bb4" distance={12}/>
      {/* floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.03,0]} receiveShadow><planeGeometry args={[13,9]} /><meshStandardMaterial color="#18283d" roughness={.85} /></mesh>
      <gridHelper args={[13,26,'#294362','#1d3048']} position={[0,.005,0]} />
      {/* back wall + logo */}
      <mesh position={[0,1.8,-3.8]}><boxGeometry args={[12,3.7,.18]} /><meshStandardMaterial color="#e6e9e9" /></mesh>
      <mesh position={[0,2.1,-3.68]}><boxGeometry args={[3.8,1.15,.08]} /><meshStandardMaterial color="#102139" /></mesh>
      <Html position={[0,2.12,-3.61]} center distanceFactor={8}>
        <div className="wall-logo"><small>ARTIFICIAL INTELLIGENCE</small><strong>XAU AI</strong><b>SMC GOLD</b></div>
      </Html>
      {/* decorative windows */}
      {[-4.3,-2.8,2.8,4.3].map((x,i)=><group key={i} position={[x,1.75,-3.67]}><mesh><boxGeometry args={[1.1,1.45,.06]}/><meshStandardMaterial color="#b8d0df" emissive="#233f56" emissiveIntensity={.25}/></mesh><mesh position={[0,0,.04]}><boxGeometry args={[1.18,1.53,.04]}/><meshStandardMaterial color="#c6a76c"/></mesh></group>)}
      {/* analyst desks */}
      {TEAM.map((a,i)=>{
        const x = -2.55 + i*1.7
        const z = .45
        return <group key={a.id}>
          <Desk position={[x,.0,z]} tf={a.tf} color={a.color} selected={selected===a.id} onSelect={()=>setSelected(selected===a.id?null:a.id)}/>
          <Person position={[x,.0,z+1.12]} name={a.name} tf={a.tf} active color={['#d8a27e','#b97c5c','#e0b18c','#c98d6d'][i]} onClick={()=>setSelected(selected===a.id?null:a.id)}/>
        </group>
      })}
      {/* leader podium */}
      <mesh position={[-3.2,.15,-1.8]}><cylinderGeometry args={[.52,.62,.3,8]}/><meshStandardMaterial color="#b99555"/></mesh>
      <Person position={[leaderX,.3,leaderZ]} leader name="TEAM LEADER" active color="#d9a17c"/>
      {leaderMeeting && <Html position={[-.2,2.05,-.8]} center distanceFactor={7}>
        <div className="leader-speech"><b>TEAM, ATTENTION!</b><span>SEND SIGNAL XAUUSD<br/>TO TELEGRAM NOW!</span></div>
      </Html>}
      <ContactShadows position={[0,-.015,0]} opacity={.35} scale={12} blur={2.5} far={4}/>
      <OrbitControls makeDefault target={[0,1,-.3]} minDistance={5} maxDistance={13} maxPolarAngle={Math.PI/2.05} minPolarAngle={.35} />
    </>
  )
}

export default function App() {
  const clock = useJakartaClock()
  const [leaderMeeting, setLeaderMeeting] = useState(false)
  const [selected, setSelected] = useState(null)
  const [chatIndex, setChatIndex] = useState(0)
  const [lastTrigger, setLastTrigger] = useState('')
  const [toast, setToast] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setChatIndex(i => (i + 1) % CHAT_LINES.length), 4800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const weekday = ['Mon','Tue','Wed','Thu','Fri'].includes(clock.weekday)
    const inHours = clock.hour >= 7 || clock.hour < 2
    const key = `${clock.weekday}-${clock.hour}-${clock.minute}`
    if (weekday && inHours && clock.minute === 0 && clock.second < 2 && key !== lastTrigger) {
      setLastTrigger(key)
      setLeaderMeeting(true)
      setToast(true)
      const id = setTimeout(() => { setLeaderMeeting(false); setToast(false) }, 18000)
      return () => clearTimeout(id)
    }
  }, [clock.weekday, clock.hour, clock.minute, clock.second, lastTrigger])

  const current = TEAM.find(t => t.id === selected)
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">Au</span><span><b>XAU AI</b><small>SMC GOLD · INTELLIGENCE OFFICE</small></span></a>
        <div className="top-status"><span className="live-dot"/> SYSTEM ONLINE <i/> <Clock3 size={15}/> {clock.time} WIB</div>
        <a className="join-button" href="https://t.me/" target="_blank" rel="noreferrer">Join Telegram <ArrowUpRight size={16}/></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span/> AI-POWERED TRADING ENVIRONMENT</div>
          <h1>Meet the intelligence<br/><em>behind every signal.</em></h1>
          <p>A virtual trading floor where specialized AI analysts monitor XAUUSD across multiple timeframes. Built for clarity, discipline, and a smarter trading experience.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="https://t.me/" target="_blank" rel="noreferrer">Explore Telegram <ArrowUpRight size={17}/></a>
            <span className="secondary-note"><ShieldCheck size={16}/> Visual office simulation</span>
          </div>
          <div className="mini-stats">
            <div><b>04</b><span>AI ANALYSTS</span></div><div><b>04</b><span>TIMEFRAMES</span></div><div><b>24/5</b><span>OFFICE CYCLE*</span></div>
          </div>
        </div>
        <div className="scene-wrap">
          <div className="scene-topline"><span><Radio size={14}/> LIVE OFFICE VIEW</span><span>ASIA/JAKARTA · WIB</span></div>
          <Canvas shadows camera={{ position: [7,6.2,8.5], fov: 38 }} onCreated={()=>setSceneReady(true)} dpr={[1,1.7]}>
            <OfficeScene leaderMeeting={leaderMeeting} selected={selected} setSelected={setSelected}/>
          </Canvas>
          {!sceneReady && <div className="scene-loading">Preparing virtual office…</div>}
          <div className="scene-hint">DRAG TO ROTATE · SCROLL TO ZOOM · SELECT AN ANALYST</div>
          {current && <div className="analyst-card"><button onClick={()=>setSelected(null)} aria-label="Close">×</button><b>{current.name}</b><span>XAUUSD · {current.tf}</span><small>{current.task}</small><label><i/> SIMULATED ACTIVITY</label></div>}
          {toast && <div className="dispatch-toast"><span className="live-dot"/> LEADER MEETING · VISUAL EVENT</div>}
        </div>
      </section>

      <section className="workspace">
        <div className="section-heading"><div><span className="eyebrow">THE TRADING FLOOR</span><h2>One team. Multiple perspectives.</h2></div><p>Each workstation represents a dedicated timeframe role. Activity and dialogue are simulated for the website experience.</p></div>
        <div className="team-grid">
          {TEAM.map((a,i)=><article className="team-card" key={a.id} onClick={()=>setSelected(a.id)}>
            <div className="team-card-top"><span className="avatar"><Bot size={22}/></span><span className="tf-pill">{a.tf}</span></div>
            <h3>{a.name}</h3><p>{a.task}</p><div className="card-status"><i/> At workstation <span>·</span> XAUUSD</div>
          </article>)}
        </div>
      </section>

      <section className="activity-section">
        <div className="activity-head"><div><span className="eyebrow">TEAM COMMS</span><h2>Inside the office</h2></div><span className="live-label"><i/> SIMULATED LIVE FEED</span></div>
        <div className="chat-panel">
          <div className="chat-avatar"><MessageSquare size={19}/></div>
          <div className="chat-body"><div><b>{CHAT_LINES[chatIndex][0]}</b><time>{clock.time} WIB</time></div><p key={chatIndex}>{CHAT_LINES[chatIndex][1]}</p></div>
          <span className="typing"><i/><i/><i/></span>
        </div>
        <div className="schedule-note"><Clock3 size={17}/><div><b>Hourly visual briefing</b><span>Weekdays · 07:00–02:00 WIB · At minute 00</span></div><span className="schedule-tag">AUTOMATED</span></div>
      </section>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark">Au</span><span><b>XAU AI SMC GOLD</b><small>TRADING INTELLIGENCE OFFICE</small></span></a><p>© {new Date().getFullYear()} XAU AI. Virtual office experience.</p><span className="footer-disclaimer">Website visuals are simulated. Trading analysis and signals are provided separately.</span></footer>
    </main>
  )
}
