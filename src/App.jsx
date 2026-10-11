import React, { useEffect, useRef, useState } from "react";
import { translations } from "./i18n.js";
import Office from "./Office.jsx";

/* ================= KONFIGURASI ================= */
const BOT_LINK = "https://t.me/Intradayxauusd_bot";
const ADMIN_LINK = "https://t.me/AdmAIassistantGold";
const PORTFOLIO_URL = "https://dashboardpanelporto-production.up.railway.app/";

const BROKERS = [
  { name: "Valetax", logo: "/logos/valetax.png" },
  { name: "HFM", logo: "/logos/hfm.png" },
  { name: "Exness", logo: "/logos/exness.png" },
];

const FEATURE_ICONS = ["◈", "◇", "◎", "↗"];

const track = (label) => () => {
  try {
    window.gtag("event", "telegram_cta_click", { event_category: "conversion", event_label: label });
  } catch (e) {
    /* Google Analytics tidak boleh mengganggu fungsi website. */
  }
};

/* ================= BACKGROUND NETWORK ================= */
function NetworkBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0, particles = [], raf = 0;
    const COUNT = window.innerWidth < 600 ? 28 : 48;

    const create = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.3 + 0.4,
        alpha: Math.random() * 0.35 + 0.08,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = window.innerWidth;
      height = window.innerHeight;
      create();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20 || p.x > width + 20) p.vx *= -1;
        if (p.y < -20 || p.y > height + 20) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,162,39,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201,162,39,${(1 - d / 115) * 0.07})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas id="bgCanvas" ref={ref} />;
}

/* ================= SECTION HEADER ================= */
const SectionHeader = ({ n, title }) => (
  <div className="section-header">
    <div className="section-number">{n}</div>
    <div className="section-title">{title}</div>
  </div>
);

/* ================= APP ================= */
export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("xau_ai_language");
      return translations[saved] ? saved : "id";
    } catch (e) {
      return "id";
    }
  });
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    try { localStorage.setItem("xau_ai_language", lang); } catch (e) {}
  }, [lang]);

  return (
    <>
      <NetworkBackground />
      <div className="background-glow" />

      <div className="language-switcher">
        {["id", "en", "zh"].map((l) => (
          <button key={l} className={"language-btn" + (lang === l ? " active" : "")} onClick={() => setLang(l)}>
            {l === "zh" ? "中文" : l.toUpperCase()}
          </button>
        ))}
      </div>

      <main className="container">

        {/* HERO */}
        <section className="hero reveal">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>{t.eyebrow}</span>
          </div>
          <h1>{t.heroTitle}</h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <div className="status-bar">
            {["XAUUSD", "SMC", "FUNDAMENTAL", "TELEGRAM"].map((s) => (
              <div className="status-chip" key={s}><span className="dot" />{s}</div>
            ))}
          </div>
        </section>

        {/* AI BRAND */}
        <section className="ai-badge reveal delay-1">
          <div className="ai-badge-top">
            <div className="ai-brand">XAU AI INTELLIGENCE</div>
            <div className="ai-live"><span className="ai-live-dot" />SYSTEM ONLINE</div>
          </div>
          <div className="ai-main-title">AI Trading Assistant <span>XAUUSD</span></div>
          <p className="ai-description">{t.aiDescription}</p>
        </section>

        {/* 01 FITUR */}
        <section className="section reveal delay-2">
          <SectionHeader n="01" title={t.featureSectionTitle} />
          <div className="feature-grid">
            {[1, 2, 3, 4].map((n) => (
              <div className="feature-card" key={n}>
                <div className="feature-icon">{FEATURE_ICONS[n - 1]}</div>
                <h3>{t[`feature${n}Title`]}</h3>
                <p>{t[`feature${n}Text`]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 02 CARA KERJA */}
        <section className="section reveal delay-3">
          <SectionHeader n="02" title={t.howSectionTitle} />
          <div className="steps">
            {[1, 2, 3, 4].map((n) => (
              <div className="step" key={n}>
                <div className="step-number">{"0" + n}</div>
                <div className="step-content">
                  <div className="step-title">{t[`step${n}Title`]}</div>
                  <div className="step-description">{t[`step${n}Text`]}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="signal-box">
            <div className="signal-header">
              <span className="signal-label">SIGNAL PREVIEW</span>
              <span className="signal-status">AI SYSTEM</span>
            </div>
            <div className="signal-content">
              <div className="signal-item"><span>SYMBOL</span><strong className="signal-gold">XAUUSD</strong></div>
              <div className="signal-item"><span>DIRECTION</span><strong className="signal-buy">BUY</strong></div>
              <div className="signal-item"><span>DELIVERY</span><strong>TELEGRAM</strong></div>
            </div>
          </div>
        </section>

        {/* 03 OFFICE AGENT AI */}
        <section className="section">
          <SectionHeader n="03" title={t.officeSectionTitle} />
          <Office intro={t.officeIntro} />
        </section>

        {/* 04 REGISTRASI */}
        <section className="section">
          <SectionHeader n="04" title={t.regTitle} />

          <div className="reg-list">
            {/* OPSI 1 : BERBAYAR */}
            <div className="reg-card">
              <div className="price-name">{t.regPaidName}</div>
              <div className="price-duration">{t.regPaidDuration}</div>
              <div className="price">Rp5.000.000</div>
              <div className="price-feature">{t.regPaidF1}</div>
              <div className="price-feature">{t.regPaidF2}</div>
              <div className="price-feature">{t.regPaidF3}</div>
              <a className="reg-button" href={BOT_LINK} target="_blank" rel="noopener noreferrer" onClick={track("paid")}>
                {t.regPaidBtn}
              </a>
            </div>

            {/* OPSI 2 : AFILIASI BROKER */}
            <div className="reg-card featured">
              <div className="price-badge">{t.regFreeBadge}</div>
              <div className="price-name">{t.regFreeName}</div>
              <div className="price-duration">{t.regFreeDuration}</div>
              <div className="price-feature" style={{ marginTop: 8 }}>{t.regFreeF1}</div>

              <div className="broker-row">
                {BROKERS.map((b) => (
                  <span className="broker-chip" key={b.name}>
                    <img src={b.logo} alt={b.name} width="22" height="22" />
                    {b.name}
                  </span>
                ))}
              </div>

              <div className="reg-note" dangerouslySetInnerHTML={{ __html: t.regFreeNote }} />

              <a className="reg-button outline" href={ADMIN_LINK} target="_blank" rel="noopener noreferrer" onClick={track("free")}>
                {t.regFreeBtn}
              </a>
            </div>
          </div>
        </section>

        {/* 05 SYARAT */}
        <section className="section">
          <SectionHeader n="05" title={t.requirementTitle} />
          <div className="requirements">
            {[1, 2, 3, 4].map((n) => (
              <div className="requirement" key={n}>
                <div className="requirement-icon">{"0" + n}</div>
                <div className="requirement-text">{t[`requirement${n}`]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="main-cta">
          <a className="cta-button" href={ADMIN_LINK} target="_blank" rel="noopener noreferrer" onClick={track("admin")}>
            {t.mainCTA}
          </a>
          <a className="secondary-cta" href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
            {t.portfolioCTA}
          </a>
        </section>

        <div className="disclaimer"><p>{t.disclaimer}</p></div>

        <footer>
          <strong>XAU AI INTELLIGENCE</strong>
          <br />
          <span>{t.footer}</span>
          <br /><br />
          © {new Date().getFullYear()} XAU AI Intelligence
        </footer>

      </main>
    </>
  );
}
