import React, { useEffect, useRef, useState } from "react";
import { translations } from "./i18n.js";
import Office from "./Office.jsx";

/* ================= KONFIGURASI ================= */

const BOT_LINK = "https://t.me/Intradayxauusd_bot";
const ADMIN_LINK = "https://t.me/AdmAIassistantGold";
const PORTFOLIO_URL =
  "https://dashboardpanelporto-production.up.railway.app/";

const CLICK_API = "/api/clicks";

/* =================================================
   PAKET BERBAYAR
================================================= */

const PACKAGES = [
  {
    id: "1month",
    start: "1month",
    name: "STARTER",
    price: "Rp299.000",
    duration: {
      id: "1 Bulan",
      en: "1 Month",
      zh: "1个月",
    },
    features: {
      id: [
        "🤖 Signal otomatis pukul 07.00 – 02.00 WIB (hingga 20 signal)",
        "📊 Detail analisa dari setiap signal yang dikeluarkan",
        "📚 Akses materi trading eksklusif",
        "🌐 Bebas menggunakan broker apa pun, tanpa IB",
      ],
      en: [
        "🤖 Automated signals from 07:00 – 02:00 WIB (up to 20 signals)",
        "📊 Detailed analysis for every released signal",
        "📚 Access to exclusive trading materials",
        "🌐 Freedom to use any broker, no IB required",
      ],
      zh: [
        "🤖 自动信号：07:00 – 次日02:00 WIB（最多20个信号）",
        "📊 每个交易信号均提供详细分析",
        "📚 专属交易学习资料",
        "🌐 可自由选择任何经纪商，无需IB",
      ],
    },
  },

  {
    id: "6month",
    start: "6month",
    name: "PRO",
    price: "Rp500.000",
    duration: {
      id: "6 Bulan",
      en: "6 Months",
      zh: "6个月",
    },
    features: {
      id: [
        "🤖 Signal otomatis pukul 07.00 – 02.00 WIB (hingga 20 signal)",
        "📊 Detail analisa dari setiap signal yang dikeluarkan",
        "📚 Akses materi trading eksklusif",
        "🚨 Special News Signal: NFP, CPI & FOMC",
      ],
      en: [
        "🤖 Automated signals from 07:00 – 02:00 WIB (up to 20 signals)",
        "📊 Detailed analysis for every released signal",
        "📚 Access to exclusive trading materials",
        "🚨 Special News Signals: NFP, CPI & FOMC",
      ],
      zh: [
        "🤖 自动信号：07:00 – 次日02:00 WIB（最多20个信号）",
        "📊 每个交易信号均提供详细分析",
        "📚 专属交易学习资料",
        "🚨 特别新闻信号：NFP、CPI 和 FOMC",
      ],
    },
  },

  {
    id: "12month",
    start: "12month",
    name: "ELITE",
    price: "Rp900.000",
    featured: true,
    duration: {
      id: "12 Bulan",
      en: "12 Months",
      zh: "12个月",
    },
    features: {
      id: [
        "🤖 Signal otomatis pukul 07.00 – 02.00 WIB (hingga 20 signal)",
        "📊 Detail analisa dari setiap signal yang dikeluarkan",
        "📚 Akses materi trading eksklusif",
        "🚨 Special News Signal: NFP, CPI & FOMC",
        "🎯 Akses token untuk meminta signal manual kapan pun",
      ],
      en: [
        "🤖 Automated signals from 07:00 – 02:00 WIB (up to 20 signals)",
        "📊 Detailed analysis for every released signal",
        "📚 Access to exclusive trading materials",
        "🚨 Special News Signals: NFP, CPI & FOMC",
        "🎯 Token access to request manual signals anytime",
      ],
      zh: [
        "🤖 自动信号：07:00 – 次日02:00 WIB（最多20个信号）",
        "📊 每个交易信号均提供详细分析",
        "📚 专属交易学习资料",
        "🚨 特别新闻信号：NFP、CPI 和 FOMC",
        "🎯 可随时使用Token申请人工信号",
      ],
    },
  },

  {
    id: "3year",
    start: "permanent",
    name: "PREMIUM",
    price: "Rp1.500.000",
    duration: {
      id: "3 Tahun",
      en: "3 Years",
      zh: "3年",
    },
    features: {
      id: [
        "🤖 Signal otomatis pukul 07.00 – 02.00 WIB (hingga 20 signal)",
        "📊 Detail analisa dari setiap signal yang dikeluarkan",
        "📚 Akses materi trading eksklusif",
        "🚨 Special News Signal: NFP, CPI & FOMC",
        "🎯 Akses token untuk meminta signal manual kapan pun",
        "👑 Customer Service pribadi aktif 24 jam",
      ],
      en: [
        "🤖 Automated signals from 07:00 – 02:00 WIB (up to 20 signals)",
        "📊 Detailed analysis for every released signal",
        "📚 Access to exclusive trading materials",
        "🚨 Special News Signals: NFP, CPI & FOMC",
        "🎯 Token access to request manual signals anytime",
        "👑 Personal Customer Service available 24/7",
      ],
      zh: [
        "🤖 自动信号：07:00 – 次日02:00 WIB（最多20个信号）",
        "📊 每个交易信号均提供详细分析",
        "📚 专属交易学习资料",
        "🚨 特别新闻信号：NFP、CPI 和 FOMC",
        "🎯 可随时使用Token申请人工信号",
        "👑 24小时专属客户服务",
      ],
    },
  },
];

/* =================================================
   TEKS TAMBAHAN 3 BAHASA
================================================= */

const EXTRA = {
  id: {
    brokerTitle: "BEBAS BROKER TANPA IB",
    brokerText:
      "Gunakan broker apa pun yang menyediakan XAUUSD. Tidak perlu mendaftar melalui link IB tertentu.",
    brokerFeature: "Bebas Broker, Tanpa IB",
    pricingTitle: "Pilih Paket",
    popular: "TERLARIS",
    buy: "LANGGANAN SEKARANG",
    requirement2:
      "Bebas menggunakan broker apa pun yang menyediakan instrumen XAUUSD, tanpa IB.",
    mainCTA: "CHAT KE TELEGRAM ADMIN UNTUK KONSULTASI",
    portfolioCTA: "KLIK DI SINI — LIHAT PORTOFOLIO AI SETIAP HARI",
  },

  en: {
    brokerTitle: "ANY BROKER, NO IB",
    brokerText:
      "Use any broker that offers XAUUSD. No need to register through a specific IB link.",
    brokerFeature: "Any Broker, No IB",
    pricingTitle: "Choose a Plan",
    popular: "BEST SELLER",
    buy: "SUBSCRIBE NOW",
    requirement2:
      "Use any broker that provides the XAUUSD instrument, no IB required.",
    mainCTA: "CHAT WITH TELEGRAM ADMIN FOR CONSULTATION",
    portfolioCTA: "CLICK HERE — VIEW THE AI PORTFOLIO EVERY DAY",
  },

  zh: {
    brokerTitle: "不限券商，无需 IB",
    brokerText:
      "可使用任何提供 XAUUSD 的券商，无需通过指定 IB 链接注册。",
    brokerFeature: "不限券商，无需 IB",
    pricingTitle: "选择套餐",
    popular: "最受欢迎",
    buy: "立即订阅",
    requirement2:
      "可使用任何提供 XAUUSD 产品的券商，无需 IB。",
    mainCTA: "联系 Telegram 管理员咨询",
    portfolioCTA: "点击这里 — 每天查看 AI 投资组合",
  },
};

/* =================================================
   TRACKING KLIK
================================================= */

const track = (label) => () => {
  const validLabels = ["paid"];

  if (!validLabels.includes(label)) {
    return;
  }

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

/* =================================================
   BACKGROUND NETWORK
================================================= */

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

    const COUNT =
      window.innerWidth < 600 ? 28 : 48;

    const create = () => {
      particles = Array.from(
        { length: COUNT },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          radius: Math.random() * 1.3 + 0.4,
          alpha: Math.random() * 0.35 + 0.08,
        })
      );
    };

    const resize = () => {
      if (disposed) return;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5
      );

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
        ctx.arc(
          p.x,
          p.y,
          p.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(201,162,39,${p.alpha})`;

        ctx.fill();
      });

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
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

            ctx.strokeStyle =
              `rgba(201,162,39,${
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

/* =================================================
   SECTION HEADER
================================================= */

const SectionHeader = ({ n, title }) => (
  <div className="section-header">
    <div className="section-number">
      {n}
    </div>

    <div className="section-title">
      {title}
    </div>
  </div>
);

/* =================================================
   APP
================================================= */

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "xau_ai_language"
      );

      return translations[saved] ? saved : "id";
    } catch (error) {
      return "id";
    }
  });

  const t = translations[lang] || translations.id;
  const x = EXTRA[lang] || EXTRA.id;

  useEffect(() => {
    document.documentElement.lang =
      lang === "zh" ? "zh-CN" : lang;

    try {
      localStorage.setItem(
        "xau_ai_language",
        lang
      );
    } catch (error) {
      // Website tetap berjalan jika storage diblokir.
    }
  }, [lang]);

  return (
    <>
      <style>{`
        /* PREMIUM GOLD CTA */

        .premium-cta {
          width: 100%;
          max-width: 540px;
          margin: 35px auto 55px;
          padding: 0 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-sizing: border-box;
        }

        .premium-cta-primary,
        .premium-cta-secondary {
          width: 100%;
          min-height: 76px;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-sizing: border-box;
          border-radius: 15px;
          text-decoration: none !important;
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease,
            background .25s ease;
        }

        .premium-cta-primary {
          color: #17130a !important;
          background: linear-gradient(
            135deg,
            #f8df9b 0%,
            #d9ad50 48%,
            #b98732 100%
          );
          border: 1px solid rgba(255,224,155,.8);
          box-shadow:
            0 8px 25px rgba(205,157,62,.20),
            inset 0 1px 0 rgba(255,255,255,.45);
        }

        .premium-cta-secondary {
          color: #e7c477 !important;
          background: linear-gradient(
            135deg,
            rgba(218,174,83,.09),
            rgba(218,174,83,.025)
          );
          border: 1px solid rgba(218,174,83,.55);
          box-shadow:
            0 6px 20px rgba(0,0,0,.12),
            inset 0 1px 0 rgba(255,255,255,.04);
        }

        .premium-cta-icon {
          width: 43px;
          height: 43px;
          min-width: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .premium-cta-icon svg {
          width: 23px;
          height: 23px;
        }

        .premium-cta-primary .premium-cta-icon {
          color: #17130a;
          background: rgba(255,255,255,.25);
        }

        .premium-cta-secondary .premium-cta-icon {
          color: #e7c477;
          background: rgba(218,174,83,.12);
        }

        .premium-cta-label {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align: left;
        }

        .premium-cta-label strong {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .8px;
          line-height: 1.4;
        }

        .premium-cta-label small {
          font-size: 11px;
          font-weight: 500;
          line-height: 1.5;
          opacity: .75;
        }

        .premium-cta-arrow {
          font-size: 23px;
          font-weight: 500;
          margin-left: 5px;
        }

        @media (hover: hover) {
          .premium-cta-primary:hover {
            transform: translateY(-3px);
            box-shadow:
              0 13px 32px rgba(205,157,62,.32),
              inset 0 1px 0 rgba(255,255,255,.5);
          }

          .premium-cta-secondary:hover {
            transform: translateY(-3px);
            border-color: #e7c477;
            background: rgba(218,174,83,.13);
            box-shadow:
              0 12px 28px rgba(205,157,62,.12);
          }
        }

        .premium-cta-primary:active,
        .premium-cta-secondary:active {
          transform: scale(.98);
        }

        @media (max-width: 600px) {
          .premium-cta {
            max-width: 100%;
            margin: 25px auto 40px;
            padding: 0 15px;
            gap: 12px;
          }

          .premium-cta-primary,
          .premium-cta-secondary {
            min-height: 70px;
            padding: 13px 15px;
            border-radius: 13px;
            gap: 12px;
          }

          .premium-cta-icon {
            width: 39px;
            height: 39px;
            min-width: 39px;
          }

          .premium-cta-icon svg {
            width: 21px;
            height: 21px;
          }

          .premium-cta-label strong {
            font-size: 11px;
            letter-spacing: .5px;
          }

          .premium-cta-label small {
            font-size: 10px;
          }

          .premium-cta-arrow {
            font-size: 20px;
          }
        }
      `}</style>

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

        {/* HERO */}

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
              <div
                className="status-chip"
                key={item}
              >
                <span className="dot" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* AI BRAND */}

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

        {/* BEBAS BROKER TANPA IB */}

        <section className="broker-banner reveal delay-1">
          <div className="broker-icon">
            ✓
          </div>

          <div>
            <div className="broker-title">
              {x.brokerTitle}
            </div>

            <div className="broker-text">
              {x.brokerText}
            </div>
          </div>
        </section>

        {/* 01 SYARAT PENGGUNAAN */}

        <section className="section">
          <SectionHeader
            n="01"
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

        {/* CTA UTAMA - PREMIUM GOLD DESIGN */}

        <section className="premium-cta">

          {/* TOMBOL TELEGRAM ADMIN */}

          <a
            href={ADMIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-cta-primary"
          >
            <span className="premium-cta-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </span>

            <span className="premium-cta-label">
              <strong>{x.mainCTA}</strong>
              <small>
                {lang === "en"
                  ? "Consultation and activation information"
                  : lang === "zh"
                  ? "咨询与激活信息"
                  : "Konsultasi dan informasi aktivasi"}
              </small>
            </span>

            <span
              className="premium-cta-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>

          {/* TOMBOL PORTOFOLIO */}

          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-cta-secondary"
          >
            <span className="premium-cta-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 3V21H21" />
                <path d="M7 14L11 10L14 13L21 6" />
                <path d="M16 6H21V11" />
              </svg>
            </span>

            <span className="premium-cta-label">
              <strong>{x.portfolioCTA}</strong>
              <small>
                {lang === "en"
                  ? "View AI performance updates every day"
                  : lang === "zh"
                  ? "每天查看 AI 表现更新"
                  : "Lihat perkembangan performa AI setiap hari"}
              </small>
            </span>

            <span
              className="premium-cta-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>

        </section>

        {/* 02 VIRTUAL OFFICE */}

        <section className="section">
          <SectionHeader
            n="02"
            title={t.officeSectionTitle}
          />

          <Office intro={t.officeIntro} />
        </section>

        {/* 03 PILIHAN PAKET */}

        <section className="section">
          <SectionHeader
            n="03"
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

                <div className="price">
                  {pkg.price}
                </div>

                <div className="package-features">
                  {(pkg.features[lang] || pkg.features.id).map(
                    (feature, index) => (
                      <div
                        className="price-feature"
                        key={`${pkg.id}-feature-${index}`}
                      >
                        {feature}
                      </div>
                    )
                  )}
                </div>

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

        {/* DISCLAIMER */}

        <div className="disclaimer">
          <p>{t.disclaimer}</p>
        </div>

        {/* FOOTER */}

        <footer>
          <strong>
            XAU AI INTELLIGENCE
          </strong>

          <br />

          <span>
            {t.footer}
          </span>

          <br />
          <br />

          © {new Date().getFullYear()} XAU AI Intelligence
        </footer>

      </main>
    </>
  );
}
