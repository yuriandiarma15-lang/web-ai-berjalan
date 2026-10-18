import React, { useEffect, useRef, useState } from "react";
import { translations } from "./i18n.js";
import Office from "./Office.jsx";

/* ================= KONFIGURASI ================= */
const BOT_LINK = "https://t.me/Intradayxauusd_bot";
const PORTFOLIO_URL =
  "https://dashboardpanelporto-production.up.railway.app/";

/* API penghitung klik menggunakan backend pada domain yang sama */
const CLICK_API = "/api/clicks";

/* ================= PAKET BERBAYAR =================
   Semua tombol menuju @Intradayxauusd_bot.
   Ubah nilai "start" jika kode paket di bot berbeda
   (contoh: 1BLN, 6BLN, 12BLN, 3THN). */
const PACKAGES = [
  {
    id: "1month",
    start: "1month",
    name: "STARTER",
    price: "Rp299.000",
    duration: { id: "1 Bulan", en: "1 Month", zh: "1个月" },
  },
  {
    id: "6month",
    start: "6month",
    name: "PRO",
    price: "Rp500.000",
    duration: { id: "6 Bulan", en: "6 Months", zh: "6个月" },
  },
  {
    id: "12month",
    start: "12month",
    name: "ELITE",
    price: "Rp900.000",
    featured: true,
    duration: { id: "12 Bulan", en: "12 Months", zh: "12个月" },
  },
  {
    id: "3year",
    start: "permanent",
    name: "PREMIUM",
    price: "Rp1.500.000",
    duration: { id: "3 Tahun", en: "3 Years", zh: "3年" },
  },
];

/* ================= TEKS TAMBAHAN (3 BAHASA) =================
   Dipakai langsung di file ini, jadi i18n.js tidak perlu diubah. */
const EXTRA = {
  id: {
    brokerTitle: "BEBAS BROKER TANPA IB",
    brokerText:
      "Gunakan broker apa pun yang menyediakan XAUUSD. Tidak perlu mendaftar lewat link IB tertentu.",
    brokerFeature: "Bebas Broker, Tanpa IB",
    pricingTitle: "Pilih Paket",
    feature1: "Akses AI Trading Assistant",
    feature2: "Signal XAUUSD langsung ke Telegram",
    feature3: "Akses Grup Diskusi & Sharing",
    popular: "TERLARIS",
    buy: "LANGGANAN SEKARANG",
    requirement2:
      "Bebas menggunakan broker apa pun yang menyediakan instrumen XAUUSD, tanpa IB.",
    mainCTA: "MULAI DENGAN AI TRADING",
  },
  en: {
    brokerTitle: "ANY BROKER, NO IB",
    brokerText:
      "Use any broker that offers XAUUSD. No need to register through a specific IB link.",
    brokerFeature: "Any Broker, No IB",
    pricingTitle: "Choose a Plan",
    feature1: "AI Trading Assistant Access",
    feature2: "XAUUSD Signals Delivered to Telegram",
    feature3: "Discussion & Sharing Group Access",
    popular: "BEST SELLER",
    buy: "SUBSCRIBE NOW",
    requirement2:
      "Use any broker that provides the XAUUSD instrument, no IB required.",
    mainCTA: "START WITH AI TRADING",
  },
  zh: {
    brokerTitle: "不限券商，无需 IB",
    brokerText:
      "可使用任何提供 XAUUSD 的券商，无需通过指定 IB 链接注册。",
    brokerFeature: "不限券商，无需 IB",
    pricingTitle: "选择套餐",
    feature1: "AI Trading Assistant 使用权限",
    feature2: "XAUUSD 信号直接发送到 Telegram",
    feature3: "讨论与分享群组权限",
    popular: "最受欢迎",
    buy: "立即订阅",
    requirement2:
      "可使用任何提供 XAUUSD 产品的券商，无需 IB。",
    mainCTA: "开始 AI 交易",
  },
};

/* ================= TRACKING KLIK ================= */
const track = (label) => () => {
  // Hanya satu label karena semua jalur sekarang berbayar
  const validLabels = ["paid"];

  if (!validLabels.includes(label)) {
    return;
  }

  // Google Analytics tetap aktif jika tersedia
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "telegram_cta_click", {
        event_category: "conversion",
        event_label: label,
      });
    }
  } catch (error) {
    console.warn("Google Analytics tidak tersedia:", error);
  }

  // Simpan satu klik ke database melalui backend Railway.
  // keepalive membantu permintaan tetap berjalan saat browser
  // berpindah ke halaman Telegram.
  try {
    fetch(CLICK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label }),
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            "Server gagal mencatat klik:",
            response.status
          );
        }
      })
      .catch((error) => {
        console.error("Gagal mencatat klik:", error);
      });
  } catch (error) {
    console.error("Tidak dapat mengirim data klik:", error);
  }
};

/* ================= BACKGROUND NETWORK ================= */
function NetworkBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let disposed = false;

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
      if (disposed) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      create();
    };

    const draw = () => {
      if (disposed) return;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20 || p.x > width + 20) {
          p.vx *= -1;
        }

        if (p.y < -20 || p.y > height + 20) {
          p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,162,39,${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          const distance = Math.hypot(
            a.x - b.x,
            a.y - b.y
          );

          if (distance < 115) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle = `rgba(201,162,39,${
              (1 - distance / 115) * 0.07
            })`;

            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      raf = window.requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);

    resize();
    draw();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
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
    } catch (error) {
      return "id";
    }
  });

  const t = translations[lang] || translations.id;
  const x = EXTRA[lang] || EXTRA.id;

  /* ================= BAHASA ================= */
  useEffect(() => {
    document.documentElement.lang =
      lang === "zh" ? "zh-CN" : lang;

    try {
      localStorage.setItem("xau_ai_language", lang);
    } catch (error) {
      // Website tetap berjalan jika penyimpanan browser diblokir.
    }
  }, [lang]);

  return (
    <>
      {/* BACKGROUND */}
      <NetworkBackground />
      <div className="background-glow" />

      {/* PILIHAN BAHASA */}
      <div className="language-switcher">
        {["id", "en", "zh"].map((language) => (
          <button
            key={language}
            type="button"
            className={
              "language-btn" +
              (lang === language ? " active" : "")
            }
            onClick={() => setLang(language)}
            aria-pressed={lang === language}
          >
            {language === "zh"
              ? "中文"
              : language.toUpperCase()}
          </button>
        ))}
      </div>

      <main className="container">
        {/* ================= HERO ================= */}
        <section className="hero reveal">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.heroTitle}</h1>

          <p className="hero-subtitle">
            {t.heroSubtitle}
          </p>

          <div className="status-bar">
            {[
              "XAUUSD",
              "SMC",
              "FUNDAMENTAL",
              "TELEGRAM",
            ].map((item) => (
              <div className="status-chip" key={item}>
                <span className="dot" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* ================= AI BRAND ================= */}
        <section className="ai-badge reveal delay-1">
          <div className="ai-badge-top">
            <div className="ai-brand">
              XAU AI INTELLIGENCE
            </div>

            <div className="ai-live">
              <span className="ai-live-dot" />
              SYSTEM ONLINE
            </div>
          </div>

          <div className="ai-main-title">
            AI Trading Assistant <span>XAUUSD</span>
          </div>

          <p className="ai-description">
            {t.aiDescription}
          </p>
        </section>

        {/* ================= BEBAS BROKER TANPA IB ================= */}
        <section className="broker-banner reveal delay-1">
          <div className="broker-icon">✓</div>

          <div>
            <div className="broker-title">
              {x.brokerTitle}
            </div>

            <div className="broker-text">
              {x.brokerText}
            </div>
          </div>
        </section>

        {/* ================= 01 OFFICE AGENT AI ================= */}
        <section className="section">
          <SectionHeader
            n="01"
            title={t.officeSectionTitle}
          />

          <Office intro={t.officeIntro} />
        </section>

        {/* ================= 02 PAKET BERBAYAR ================= */}
        <section className="section">
          <SectionHeader
            n="02"
            title={x.pricingTitle}
          />

          <div className="reg-list">
            {PACKAGES.map((pkg) => (
              <div
                className={
                  "reg-card" +
                  (pkg.featured ? " featured" : "")
                }
                key={pkg.id}
              >
                {pkg.featured && (
                  <div className="price-badge">
                    {x.popular}
                  </div>
                )}

                <div className="price-name">
                  {pkg.name}
                </div>

                <div className="price-duration">
                  {pkg.duration[lang] || pkg.duration.id}
                </div>

                <div className="price">{pkg.price}</div>

                <div className="price-feature">
                  {x.feature1}
                </div>

                <div className="price-feature">
                  {x.feature2}
                </div>

                <div className="price-feature">
                  {x.brokerFeature}
                </div>

                {pkg.id !== "1month" && (
                  <div className="price-feature">
                    {x.feature3}
                  </div>
                )}

                <a
                  className="reg-button"
                  href={`${BOT_LINK}?start=${pkg.start}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={track("paid")}
                >
                  {x.buy}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 03 SYARAT ================= */}
        <section className="section">
          <SectionHeader
            n="03"
            title={t.requirementTitle}
          />

          <div className="requirements">
            {[1, 2, 3, 4].map((number) => (
              <div
                className="requirement"
                key={number}
              >
                <div className="requirement-icon">
                  {"0" + number}
                </div>

                <div className="requirement-text">
                  {number === 2
                    ? x.requirement2
                    : t[`requirement${number}`]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA UTAMA ================= */}
        <section className="main-cta">
          <a
            className="cta-button"
            href={BOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={track("paid")}
          >
            {x.mainCTA}
          </a>

          <a
            className="secondary-cta"
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.portfolioCTA}
          </a>
        </section>

        {/* ================= DISCLAIMER ================= */}
        <div className="disclaimer">
          <p>{t.disclaimer}</p>
        </div>

        {/* ================= FOOTER ================= */}
        <footer>
          <strong>XAU AI INTELLIGENCE</strong>

          <br />

          <span>{t.footer}</span>

          <br />
          <br />

          © {new Date().getFullYear()} XAU AI Intelligence
        </footer>
      </main>
    </>
  );
}
