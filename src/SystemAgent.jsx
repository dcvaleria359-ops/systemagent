import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════
// FONTS
// ═══════════════════════════════════════════════════
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:ital,wght@0,400;0,700&family=Syne:wght@400;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ═══════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════
async function ai(system, user, maxTokens = 1000) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Error en la respuesta de IA.";
  } catch (e) {
    return "⚠ Error de conexión: " + e.message;
  }
}

async function scrapeUrl(url) {
  try {
    const clean = url.startsWith("http") ? url : "https://" + url;
    const encoded = encodeURIComponent(clean);
    const res = await fetch(`https://api.allorigins.win/get?url=${encoded}`);
    const data = await res.json();
    return data.contents ? data.contents.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 4000) : null;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════
const C = {
  bg: "#030d03",
  surface: "#071007",
  card: "#0a160a",
  cardHover: "#0d1e0d",
  border: "#142414",
  borderGlow: "#00ff8830",
  neon: "#00ff88",
  neonBright: "#39ffad",
  neonDim: "#00ff8812",
  neonMid: "#00ff8825",
  text: "#b8f5b8",
  textMuted: "#3d6b3d",
  textDim: "#1a3a1a",
  danger: "#ff4466",
  warning: "#ffaa00",
  info: "#00aaff",
  white: "#f0fff0",
};
const H = "'Orbitron', monospace";
const M = "'Space Mono', monospace";
const B = "'Syne', sans-serif";

const glow = `0 0 20px #00ff8830, 0 0 40px #00ff8810`;
const glowStrong = `0 0 30px #00ff8860`;

// ═══════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════
function Card({ children, style = {}, onClick, glow: useGlow = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.cardHover : C.card,
        border: `1px solid ${hov || useGlow ? C.borderGlow : C.border}`,
        borderRadius: 12,
        padding: 20,
        transition: "all 0.2s",
        boxShadow: hov || useGlow ? glow : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, loading, disabled, outline = false, style = {}, full = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: outline ? (hov ? C.neonMid : "transparent") : hov ? C.neonBright : C.neon,
        color: outline ? C.neon : "#000",
        border: `1px solid ${C.neon}`,
        borderRadius: 8,
        padding: "10px 22px",
        fontFamily: M,
        fontSize: 12,
        fontWeight: 700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.4 : 1,
        transition: "all 0.18s",
        boxShadow: !outline && hov ? glowStrong : "none",
        width: full ? "100%" : "auto",
        letterSpacing: 1,
        ...style,
      }}
    >
      {loading ? "⟳  PROCESANDO..." : children}
    </button>
  );
}

function Tag({ children, color = C.neon }) {
  return (
    <span style={{
      background: color + "18",
      color,
      border: `1px solid ${color}35`,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 10,
      fontFamily: M,
      fontWeight: 700,
      letterSpacing: 0.5,
    }}>
      {children}
    </span>
  );
}

function Hdr({ title, sub, icon }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ color: C.neon, fontSize: 22 }}>{icon}</span>
        <h1 style={{ fontFamily: H, fontSize: 20, color: C.neon, margin: 0, letterSpacing: 3 }}>{title}</h1>
      </div>
      {sub && <p style={{ color: C.textMuted, fontFamily: M, fontSize: 10, margin: 0, letterSpacing: 2 }}>{sub}</p>}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${C.neon}50, transparent)`, marginTop: 14 }} />
    </div>
  );
}

function AIBox({ text, loading }) {
  if (!text && !loading) return null;
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.neonDim}`,
      borderLeft: `3px solid ${C.neon}`,
      borderRadius: 8,
      padding: 18,
      marginTop: 14,
      fontFamily: M,
      fontSize: 11,
      color: C.text,
      lineHeight: 1.85,
      whiteSpace: "pre-wrap",
      maxHeight: 420,
      overflowY: "auto",
    }}>
      {loading
        ? <span style={{ color: C.neon }}>⟳  La IA está generando...</span>
        : <>
            <div style={{ color: C.textMuted, fontSize: 9, letterSpacing: 2, marginBottom: 10 }}>// SYSTEMAGENT OUTPUT ▸</div>
            {text}
          </>
      }
    </div>
  );
}

function Inp({ value, onChange, placeholder, style = {} }) {
  const [foc, setFoc] = useState(false);
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFoc(true)}
      onBlur={() => setFoc(false)}
      style={{
        background: C.surface,
        border: `1px solid ${foc ? C.neon + "60" : C.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        color: C.text,
        fontFamily: M,
        fontSize: 12,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
        ...style,
      }}
    />
  );
}

function Sel({ value, onChange, options, style = {} }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        color: C.text,
        fontFamily: M,
        fontSize: 12,
        outline: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Label({ children }) {
  return <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted, letterSpacing: 2, marginBottom: 7 }}>{children}</div>;
}

function Tabs({ tabs, active, setActive }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
      {tabs.map(t => (
        <div key={t.id} onClick={() => setActive(t.id)} style={{
          padding: "8px 18px",
          borderRadius: 8,
          border: `1px solid ${active === t.id ? C.neon : C.border}`,
          background: active === t.id ? C.neonDim : "transparent",
          cursor: "pointer",
          fontFamily: M,
          fontSize: 11,
          color: active === t.id ? C.neon : C.textMuted,
          transition: "all 0.15s",
        }}>{t.label}</div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════
const NAV = [
  { id: "dashboard", icon: "⬡", label: "DASHBOARD" },
  { sep: "CONSTRUCCIÓN" },
  { id: "roadmap", icon: "◈", label: "MAPA DE RUTA" },
  { id: "demo", icon: "⚡", label: "DEMO CREATOR" },
  { id: "web", icon: "◉", label: "GENERADOR WEB" },
  { sep: "PRODUCCIÓN" },
  { id: "prospeccion", icon: "◎", label: "PROSPECCIÓN" },
  { id: "roi", icon: "◇", label: "SIMULADOR ROI" },
  { id: "contenido", icon: "▣", label: "CONTENIDO RRSS" },
  { id: "campanas", icon: "◆", label: "CAMPAÑAS" },
  { sep: "SISTEMA" },
  { id: "crm", icon: "▦", label: "CRM CLIENTES" },
  { id: "ajustes", icon: "⚙", label: "AJUSTES" },
];

function Sidebar({ page, setPage }) {
  return (
    <div style={{
      width: 215, minWidth: 215,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 18px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: H, fontSize: 17, color: C.neon, letterSpacing: 4, fontWeight: 900, lineHeight: 1 }}>SYSTEM</div>
        <div style={{ fontFamily: H, fontSize: 17, color: C.white, letterSpacing: 4, fontWeight: 900, lineHeight: 1.2 }}>AGENT</div>
        <div style={{ fontFamily: M, fontSize: 8, color: C.textMuted, letterSpacing: 3, marginTop: 5 }}>AGENCY OS v1.0</div>
        <div style={{
          marginTop: 14,
          background: C.neonDim,
          border: `1px solid ${C.neon}25`,
          borderRadius: 7,
          padding: "6px 10px",
          display: "flex", alignItems: "center", gap: 7,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.neon, boxShadow: `0 0 10px ${C.neon}` }} />
          <span style={{ fontFamily: M, fontSize: 9, color: C.neon, letterSpacing: 2 }}>IA ACTIVA</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
        {NAV.map((item, i) => {
          if (item.sep) return (
            <div key={i} style={{ padding: "14px 18px 5px", fontFamily: M, fontSize: 8, color: C.textDim, letterSpacing: 3 }}>
              {item.sep}
            </div>
          );
          const active = page === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 18px",
                cursor: "pointer",
                background: active ? C.neonDim : "transparent",
                borderLeft: `2px solid ${active ? C.neon : "transparent"}`,
                color: active ? C.neon : C.textMuted,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 13 }}>{item.icon}</span>
              <span style={{ fontFamily: M, fontSize: 10, letterSpacing: 1, fontWeight: active ? 700 : 400 }}>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}`, fontFamily: M, fontSize: 9, color: C.textDim }}>
        systemagent.com
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════
function Dashboard({ setPage, clients }) {
  const closed = clients.filter(c => c.status === "cerrado").length;
  const revenue = clients.filter(c => c.status === "cerrado").reduce((s, c) => s + Number(c.value || 0), 0);
  const pipeline = clients.filter(c => !["cerrado", "perdido"].includes(c.status)).reduce((s, c) => s + Number(c.value || 0), 0);

  const stats = [
    { label: "CLIENTES TOTALES", value: clients.length, icon: "▦" },
    { label: "CERRADOS", value: closed, icon: "✓" },
    { label: "FACTURADO (€)", value: revenue, icon: "◇" },
    { label: "PIPELINE (€)", value: pipeline, icon: "◎" },
  ];

  const actions = [
    { label: "Mapa de Ruta", icon: "◈", page: "roadmap", desc: "Construye tu agencia paso a paso" },
    { label: "Demo Creator", icon: "⚡", page: "demo", desc: "URL → Agente en 2 minutos" },
    { label: "Generar Web", icon: "◉", page: "web", desc: "Landing page completa" },
    { label: "Simulador ROI", icon: "◇", page: "roi", desc: "Convence al cliente con datos" },
    { label: "Prospección", icon: "◎", page: "prospeccion", desc: "Encuentra clientes nuevos" },
    { label: "Contenido RRSS", icon: "▣", page: "contenido", desc: "Posts y anuncios virales" },
  ];

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="DASHBOARD" sub="PANEL DE CONTROL CENTRAL" icon="⬡" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 30 }}>
        {stats.map(s => (
          <Card key={s.label}>
            <div style={{ fontFamily: M, fontSize: 9, color: C.textMuted, letterSpacing: 2, marginBottom: 8 }}>{s.icon} {s.label}</div>
            <div style={{ fontFamily: H, fontSize: 34, color: C.neon, fontWeight: 900 }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted, letterSpacing: 2, marginBottom: 14 }}>// ACCIONES RÁPIDAS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 30 }}>
        {actions.map(a => (
          <Card key={a.label} onClick={() => setPage(a.page)} style={{ textAlign: "center", padding: 22 }}>
            <div style={{ fontSize: 26, marginBottom: 10, color: C.neon }}>{a.icon}</div>
            <div style={{ fontFamily: M, fontSize: 12, color: C.neon, fontWeight: 700, marginBottom: 5 }}>{a.label}</div>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>{a.desc}</div>
          </Card>
        ))}
      </div>

      <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted, letterSpacing: 2, marginBottom: 14 }}>// ÚLTIMOS CLIENTES</div>
      {clients.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>▦</div>
          <div style={{ fontFamily: M, fontSize: 13, color: C.textMuted }}>Sin clientes aún — ve a CRM para añadir</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {clients.slice(-5).reverse().map((c, i) => {
            const sc = { prospecto: C.info, demo: C.warning, negociacion: "#ff8800", cerrado: C.neon, perdido: C.danger };
            return (
              <Card key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: 14 }}>
                <div style={{ flex: 1, fontFamily: M, fontSize: 12, color: C.text }}>{c.name}</div>
                <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>{c.sector}</div>
                <div style={{ fontFamily: H, fontSize: 15, color: C.neon, fontWeight: 700 }}>{c.value}€</div>
                <Tag color={sc[c.status]}>{c.status}</Tag>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ROADMAP WIZARD
// ═══════════════════════════════════════════════════
const PROBS = [
  { id: "landing", label: "Landing Pages", desc: "Tu web es tu local digital" },
  { id: "leads", label: "Captación de Leads", desc: "Sin leads nuevos, el negocio muere" },
  { id: "atencion", label: "Atención a Leads", desc: "Lead frío = venta perdida" },
  { id: "seguimiento", label: "Seguimientos y Recordatorios", desc: "El dinero está en el seguimiento" },
  { id: "ltv", label: "Lifetime Value (LTV)", desc: "Maximizar valor por cliente" },
  { id: "fidelizacion", label: "Fidelización", desc: "Cliente feliz = cliente que vuelve" },
  { id: "ofertas", label: "Ofertas y Comunicación", desc: "Tu base de datos es oro" },
  { id: "upsells", label: "Upsells / Cross-sells", desc: "Más valor = más rentabilidad" },
];

function RoadmapWizard() {
  const [step, setStep] = useState(1);
  const [problems, setProblems] = useState([]);
  const [nicho, setNicho] = useState("");
  const [agencia, setAgencia] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const toggle = (id) => {
    if (problems.includes(id)) setProblems(problems.filter(p => p !== id));
    else if (problems.length < 4) setProblems([...problems, id]);
  };

  const run = async (key, system, user) => {
    setLoading(true);
    const res = await ai(system, user);
    setResults(r => ({ ...r, [key]: res }));
    setLoading(false);
  };

  const selProbs = PROBS.filter(p => problems.includes(p.id)).map(p => p.label).join(", ");

  const steps = [
    { n: 1, label: "PROBLEMAS" }, { n: 2, label: "NICHO" },
    { n: 3, label: "OFERTAS" }, { n: 4, label: "LANDING" },
    { n: 5, label: "AGENTE" }, { n: 6, label: "PRESENTACIÓN" },
  ];

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="MAPA DE RUTA" sub="CONSTRUYE TU AGENCIA DE IA PASO A PASO" icon="◈" />

      {/* Steps */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div onClick={() => setStep(s.n)} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 8, cursor: "pointer",
              background: step === s.n ? C.neonDim : "transparent",
              border: `1px solid ${step === s.n ? C.neon : step > s.n ? C.neon + "40" : C.border}`,
              transition: "all 0.15s",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: step > s.n ? C.neon : step === s.n ? C.neonMid : "transparent",
                border: `2px solid ${step >= s.n ? C.neon : C.textMuted}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: M, fontSize: 9, fontWeight: 700,
                color: step > s.n ? "#000" : step === s.n ? C.neon : C.textMuted,
              }}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span style={{ fontFamily: M, fontSize: 9, color: step === s.n ? C.neon : C.textMuted, letterSpacing: 1 }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 6, height: 1, background: step > s.n ? C.neon + "50" : C.border, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: H, fontSize: 13, color: C.neon, marginBottom: 4 }}>PASO 1 — IDENTIFICAR PROBLEMAS</div>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>Selecciona los problemas del embudo que vas a resolver. Máximo 4.</div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {PROBS.map(p => {
              const sel = problems.includes(p.id);
              return (
                <div key={p.id} onClick={() => toggle(p.id)} style={{
                  padding: 15, borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${sel ? C.neon : C.border}`,
                  background: sel ? C.neonDim : C.card,
                  display: "flex", alignItems: "center", gap: 12,
                  transition: "all 0.15s",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: sel ? C.neon : "transparent",
                    border: `2px solid ${sel ? C.neon : C.textMuted}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {sel && <span style={{ color: "#000", fontSize: 11, fontWeight: 900 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontFamily: M, fontSize: 11, color: sel ? C.neon : C.text, fontWeight: 700 }}>{p.label}</div>
                    <div style={{ fontFamily: M, fontSize: 9, color: C.textMuted }}>{p.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tag color={problems.length === 4 ? C.neon : C.warning}>{problems.length}/4 seleccionados</Tag>
            <Btn onClick={() => setStep(2)} disabled={!problems.length}>Siguiente →</Btn>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: H, fontSize: 13, color: C.neon, marginBottom: 4 }}>PASO 2 — SELECCIONAR NICHO</div>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>La IA analiza el nicho en profundidad: mercado, avatares, hooks y más.</div>
          </Card>
          <Inp value={nicho} onChange={setNicho} placeholder="Ej: Clínicas dentales, Inmobiliarias, Gimnasios..." style={{ marginBottom: 12 }} />
          <Btn loading={loading} disabled={!nicho} onClick={() => run("nicho",
            "Eres experto en análisis de nichos para agencias de IA de automatización.",
            `Analiza el nicho "${nicho}" para crear una agencia de IA. Incluye:
1. TAMAÑO DEL MERCADO en España (nº de empresas aprox)
2. PRINCIPALES DOLORES del sector (top 5)
3. CAPACIDAD DE PAGO: rango mensual realista
4. AVATAR IDEAL: nombre ficticio, edad, cargo, empresa
5. HOOKS PUBLICITARIOS: 3 frases potentes para anuncios
6. NIVEL DE COMPETENCIA y por qué
7. VEREDICTO FINAL: ¿es rentable este nicho?

Sé muy específico. Usa datos reales.`
          )} style={{ marginBottom: 14 }}>⚡ ANALIZAR NICHO CON IA</Btn>
          <AIBox text={results.nicho} loading={loading} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Btn outline onClick={() => setStep(1)}>← Anterior</Btn>
            {results.nicho && <Btn onClick={() => setStep(3)}>Siguiente →</Btn>}
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: H, fontSize: 13, color: C.neon, marginBottom: 4 }}>PASO 3 — PRICING Y OFERTAS</div>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>Paquetes de servicios y precios optimizados para tu nicho.</div>
          </Card>
          <Btn loading={loading} onClick={() => run("ofertas",
            "Eres experto en pricing y creación de ofertas para agencias de IA.",
            `Crea paquetes de servicios para una agencia de IA. Nicho: "${nicho}". Problemas que resuelve: ${selProbs}.

GENERA:
1. PAQUETE STARTER: nombre + precio + qué incluye + recurrencia mensual
2. PAQUETE PROFESSIONAL: nombre + precio + qué incluye + recurrencia mensual
3. PAQUETE ENTERPRISE: nombre + precio + qué incluye + recurrencia mensual
4. ESTRATEGIA DE ENTRADA: cómo conseguir primeros clientes (modelo regalo/freemium)
5. CALCULADORA ROI RÁPIDA: si el cliente tiene 100 leads/mes, cuánto gana extra con el agente

Precios en euros, realistas para España/Latinoamérica. Formato claro y vendible.`
          )} style={{ marginBottom: 14 }}>⚡ GENERAR PAQUETES Y PRECIOS</Btn>
          <AIBox text={results.ofertas} loading={loading} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Btn outline onClick={() => setStep(2)}>← Anterior</Btn>
            {results.ofertas && <Btn onClick={() => setStep(4)}>Siguiente →</Btn>}
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: H, fontSize: 13, color: C.neon, marginBottom: 4 }}>PASO 4 — LANDING PAGE</div>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>Prompt listo para pegar en Lovable.dev. Web lista en 2 minutos.</div>
          </Card>
          <div style={{ marginBottom: 12 }}>
            <Label>NOMBRE DE TU AGENCIA</Label>
            <Inp value={agencia} onChange={setAgencia} placeholder="Ej: DentalAI Agency, InmoBot Pro..." />
          </div>
          <Btn loading={loading} disabled={!agencia} onClick={() => run("landing",
            "Eres experto en crear prompts para Lovable.dev para landing pages de alta conversión.",
            `Crea un prompt ULTRA-DETALLADO para Lovable.dev.
Agencia: "${agencia}". Nicho: "${nicho}".

El prompt debe incluir:
- Paleta de colores exacta (hex codes)
- Tipografías exactas  
- Secciones con copy completo: hero, problemas, solución, servicios+precios, testimonios, FAQ, CTA final
- Formulario de captura con campos específicos
- Botón "Quiero una Demo" prominente
- SEO básico con keywords del nicho
- Animaciones sugeridas
- Mobile-first design

El resultado debe ser una landing page lista para publicar SIN modificar.`
          )} style={{ marginBottom: 14 }}>⚡ GENERAR PROMPT PARA LOVABLE</Btn>
          <AIBox text={results.landing} loading={loading} />
          {results.landing && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
              <Btn outline onClick={() => navigator.clipboard.writeText(results.landing)}>📋 Copiar Prompt</Btn>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn outline onClick={() => setStep(3)}>← Anterior</Btn>
                <Btn onClick={() => setStep(5)}>Siguiente →</Btn>
              </div>
            </div>
          )}
          {!results.landing && <Btn outline onClick={() => setStep(3)}>← Anterior</Btn>}
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: H, fontSize: 13, color: C.neon, marginBottom: 4 }}>PASO 5 — CONSTRUCTOR DE AGENTE</div>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>Prompt completo para tu agente de WhatsApp / Voz / Web. Copia y pega.</div>
          </Card>
          <Btn loading={loading} onClick={() => run("agente",
            "Eres experto en crear agentes de IA para atención al cliente 24/7.",
            `Crea un prompt de sistema COMPLETO para un agente de IA de WhatsApp para el nicho "${nicho}".

DEBE INCLUIR:
- Nombre y personalidad del agente
- Bienvenida y flujo de presentación
- Conocimiento de los servicios y precios del sector
- Respuestas a las 8 preguntas más frecuentes
- Flujo para captar leads: nombre, email, teléfono
- Flujo para agendar citas
- Manejo de 5 objeciones comunes
- Cuándo escalar a humano
- Cierre de conversación

TAMBIÉN INCLUYE:
- INSTRUCCIONES DE INSTALACIÓN (paso a paso)
- EJEMPLO DE CONVERSACIÓN REAL (8 turnos)
- MÉTRICAS A MONITOREAR

Listo para copiar y pegar.`
          )} style={{ marginBottom: 14 }}>⚡ GENERAR PROMPT DEL AGENTE</Btn>
          <AIBox text={results.agente} loading={loading} />
          {results.agente && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
              <Btn outline onClick={() => navigator.clipboard.writeText(results.agente)}>📋 Copiar Prompt</Btn>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn outline onClick={() => setStep(4)}>← Anterior</Btn>
                <Btn onClick={() => setStep(6)}>Siguiente →</Btn>
              </div>
            </div>
          )}
          {!results.agente && <Btn outline onClick={() => setStep(4)}>← Anterior</Btn>}
        </div>
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <div>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: H, fontSize: 13, color: C.neon, marginBottom: 4 }}>PASO 6 — PRESENTACIÓN DE VENTAS</div>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>Contenido completo para Gamma o Canva. Cierra la venta en la primera llamada.</div>
          </Card>
          <Btn loading={loading} onClick={() => run("presentacion",
            "Eres experto en presentaciones de ventas de alto impacto para agencias de IA.",
            `Crea contenido completo para una presentación de ventas (10 diapositivas) para vender agentes de IA.
Agencia: "${agencia || "Mi Agencia IA"}". Nicho: "${nicho}".

DIAPOSITIVAS:
1. PORTADA - Título impactante + subtítulo
2. EL PROBLEMA - 3 dolores específicos del sector con estadísticas
3. EL COSTE DEL PROBLEMA - cuánto pierde el negocio sin solución
4. LA SOLUCIÓN - qué es un agente de IA (simple, sin tecnicismos)
5. CÓMO FUNCIONA - 3 pasos simples
6. RESULTADOS ESPERADOS - métricas reales y beneficios concretos
7. CASO DE ÉXITO - historia ficticia pero realista con números
8. NUESTROS PAQUETES - servicios y precios
9. POR QUÉ NOSOTROS - 3 diferenciadores únicos
10. PRÓXIMOS PASOS - CTA para agendar demo gratuita ahora

Para cada diapositiva: TÍTULO + PUNTOS DE CONTENIDO + NOTA PARA EL PRESENTADOR.`
          )} style={{ marginBottom: 14 }}>⚡ GENERAR PRESENTACIÓN COMPLETA</Btn>
          <AIBox text={results.presentacion} loading={loading} />
          {results.presentacion && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
              <Btn outline onClick={() => navigator.clipboard.writeText(results.presentacion)}>📋 Copiar Contenido</Btn>
              <Btn outline onClick={() => setStep(5)}>← Anterior</Btn>
            </div>
          )}
          {!results.presentacion && <Btn outline onClick={() => setStep(5)}>← Anterior</Btn>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// DEMO CREATOR
// ═══════════════════════════════════════════════════
function DemoCreator() {
  const [url, setUrl] = useState("");
  const [adn, setAdn] = useState("");
  const [demo, setDemo] = useState("");
  const [tipo, setTipo] = useState("whatsapp");
  const [loadingAdn, setLoadingAdn] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [step, setStep] = useState(1);

  const extractAdn = async () => {
    if (!url) return;
    setLoadingAdn(true);
    setStep(1);
    const content = await scrapeUrl(url);
    if (content) {
      const res = await ai(
        "Eres experto en analizar páginas web para extraer el ADN de un negocio y crear agentes de IA.",
        `Analiza esta web y extrae el ADN del negocio:

${content}

EXTRAE:
1. NOMBRE DEL NEGOCIO
2. SECTOR / TIPO
3. SERVICIOS PRINCIPALES con precios si los hay
4. UBICACIÓN y zona de servicio
5. CONTACTO (email, tel, horarios)
6. PROPUESTA DE VALOR / DIFERENCIAL
7. TONO DE MARCA (formal/cercano/técnico...)
8. LAS 8 PREGUNTAS FRECUENTES que harían sus clientes
9. OBJECIONES COMUNES del sector
10. OPORTUNIDAD DE MEJORA: qué problema de atención al cliente tiene este negocio HOY`
      );
      setAdn(res);
      setStep(2);
    } else {
      setAdn("⚠ No se pudo acceder a la URL. Verifica que sea correcta y esté activa.");
      setStep(2);
    }
    setLoadingAdn(false);
  };

  const generateDemo = async () => {
    setLoadingDemo(true);
    const tipoLabel = tipo === "whatsapp" ? "WhatsApp" : tipo === "voz" ? "voz telefónica" : "web chat";
    const res = await ai(
      `Eres experto en crear agentes de IA de ${tipoLabel} que parecen humanos y convierten.`,
      `Con este ADN del negocio, crea un prompt de sistema COMPLETO para un agente de ${tipoLabel}:

${adn}

REQUISITOS:
- Usa el nombre real del negocio
- Conoce todos sus servicios y precios
- Responde las preguntas frecuentes detectadas
- Usa el tono de marca correcto
- Flujo para captar datos del lead
- Flujo para agendar cita si aplica
- Maneja las objeciones del sector
- Escala a humano cuando sea necesario

AL FINAL incluye:
- EJEMPLO DE CONVERSACIÓN REAL (10 turnos, mostrando el agente en acción)
- INSTRUCCIONES: cómo conectar este agente a ${tipoLabel === "WhatsApp" ? "WhatsApp Business" : tipoLabel === "voz telefónica" ? "un número de teléfono" : "la web del cliente"}`,
      1000
    );
    setDemo(res);
    setStep(3);
    setLoadingDemo(false);
  };

  const reset = () => { setUrl(""); setAdn(""); setDemo(""); setStep(1); };

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="DEMO CREATOR" sub="URL DEL CLIENTE → AGENTE FUNCIONANDO EN 2 MINUTOS" icon="⚡" />

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 26 }}>
        {["1. Extraer ADN", "2. Analizar", "3. Demo Lista"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              flex: 1, padding: "8px 14px", borderRadius: 8, textAlign: "center",
              background: step > i + 1 ? C.neon : step === i + 1 ? C.neonDim : C.surface,
              border: `1px solid ${step >= i + 1 ? C.neon : C.border}`,
              fontFamily: M, fontSize: 10,
              color: step > i + 1 ? "#000" : step === i + 1 ? C.neon : C.textMuted,
              fontWeight: step >= i + 1 ? 700 : 400,
            }}>{step > i + 1 ? "✓ " : ""}{s}</div>
            {i < 2 && <div style={{ width: 12, height: 1, background: step > i + 1 ? C.neon : C.border, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* URL */}
      <Card style={{ marginBottom: 18 }}>
        <Label>URL DEL CLIENTE (cualquier negocio)</Label>
        <div style={{ display: "flex", gap: 10 }}>
          <Inp value={url} onChange={setUrl} placeholder="https://www.negocio-cliente.com" />
          <Btn onClick={extractAdn} loading={loadingAdn} disabled={!url} style={{ whiteSpace: "nowrap" }}>⚡ EXTRAER ADN</Btn>
        </div>
      </Card>

      {/* ADN */}
      {adn && (
        <Card style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: M, fontSize: 10, color: C.neon, marginBottom: 10, letterSpacing: 2 }}>✓ ADN EXTRAÍDO</div>
          <div style={{ fontFamily: M, fontSize: 10, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 240, overflowY: "auto" }}>{adn}</div>
        </Card>
      )}

      {/* Type selector + generate */}
      {step >= 2 && adn && (
        <Card style={{ marginBottom: 18 }}>
          <Label>TIPO DE AGENTE</Label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { id: "whatsapp", label: "💬 WhatsApp" },
              { id: "voz", label: "🎤 Voz" },
              { id: "web", label: "🌐 Web Chat" },
            ].map(t => (
              <div key={t.id} onClick={() => setTipo(t.id)} style={{
                padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${tipo === t.id ? C.neon : C.border}`,
                background: tipo === t.id ? C.neonDim : "transparent",
                fontFamily: M, fontSize: 11,
                color: tipo === t.id ? C.neon : C.textMuted,
                transition: "all 0.15s",
              }}>{t.label}</div>
            ))}
          </div>
          <Btn onClick={generateDemo} loading={loadingDemo}>⚡ GENERAR DEMO PARA EL CLIENTE</Btn>
        </Card>
      )}

      <AIBox text={demo} loading={loadingDemo} />
      {demo && (
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Btn outline onClick={() => navigator.clipboard.writeText(demo)}>📋 Copiar Prompt</Btn>
          <Btn outline onClick={reset}>↺ Nueva Demo</Btn>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// WEB GENERATOR
// ═══════════════════════════════════════════════════
function WebGenerator() {
  const [nicho, setNicho] = useState("");
  const [agencia, setAgencia] = useState("");
  const [estilo, setEstilo] = useState("moderno");
  const [tab, setTab] = useState("lovable");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    if (tab === "lovable") {
      const res = await ai(
        "Eres experto en crear prompts para Lovable.dev para generar landing pages de alta conversión.",
        `Crea un prompt EXTREMADAMENTE DETALLADO para Lovable.dev.
Agencia: "${agencia}". Nicho: "${nicho}". Estilo: ${estilo}.

INCLUYE ESTOS BLOQUES:
DISEÑO: colores exactos (hex), tipografías, espaciado, efectos
SECCIÓN HERO: headline + subheadline + copy completo + CTA
SECCIÓN PROBLEMAS: 3 dolores específicos del nicho
SECCIÓN SOLUCIÓN: cómo funciona en 3 pasos
SECCIÓN SERVICIOS: 3 paquetes con nombres y precios
SECCIÓN TESTIMONIOS: 3 testimonios ficticios pero realistas
SECCIÓN FAQ: 6 preguntas y respuestas
FORMULARIO: campos exactos para captar demo
FOOTER: links, contacto, aviso legal básico
SEO: meta title, description, keywords
MOBILE: instrucciones específicas de responsive

El prompt debe generar una landing lista para publicar SIN tocar nada.`,
        1000
      );
      setResult(res);
    } else {
      const res = await ai(
        "Eres desarrollador frontend experto. Creas HTML/CSS profesional de alto impacto.",
        `Crea el HTML COMPLETO para una landing page de alta conversión.
Agencia: "${agencia}". Nicho: "${nicho}". Estilo: ${estilo}.

REQUISITOS TÉCNICOS:
- HTML5 semántico con CSS embebido en <style>
- Google Fonts incluido
- Responsive mobile-first con media queries
- Animaciones CSS suaves en scroll y hover
- Colores: dark theme con acentos de color según estilo
- Secciones: hero, problemas, solución, servicios, testimonios, FAQ, contacto, footer
- Formulario funcional con validación básica JS
- Botón CTA flotante en mobile

Devuelve SOLO el código HTML completo. Sin explicaciones.`,
        1000
      );
      setResult(res);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="GENERADOR WEB" sub="CREA LANDING PAGES COMPLETAS EN MINUTOS" icon="◉" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div>
          <Label>NOMBRE DE TU AGENCIA</Label>
          <Inp value={agencia} onChange={setAgencia} placeholder="Ej: DentalAI Agency" />
        </div>
        <div>
          <Label>NICHO OBJETIVO</Label>
          <Inp value={nicho} onChange={setNicho} placeholder="Ej: Clínicas dentales" />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <Label>ESTILO VISUAL</Label>
        <div style={{ display: "flex", gap: 8 }}>
          {["moderno", "minimalista", "corporativo", "futurista", "premium"].map(s => (
            <div key={s} onClick={() => setEstilo(s)} style={{
              padding: "7px 14px", borderRadius: 8, cursor: "pointer",
              border: `1px solid ${estilo === s ? C.neon : C.border}`,
              background: estilo === s ? C.neonDim : "transparent",
              fontFamily: M, fontSize: 10, color: estilo === s ? C.neon : C.textMuted,
              textTransform: "capitalize", transition: "all 0.15s",
            }}>{s}</div>
          ))}
        </div>
      </div>

      <Tabs
        tabs={[{ id: "lovable", label: "📝 Prompt para Lovable" }, { id: "html", label: "💻 Código HTML Directo" }]}
        active={tab} setActive={setTab}
      />

      <Btn onClick={generate} loading={loading} disabled={!nicho || !agencia} style={{ marginBottom: 14 }}>
        ⚡ GENERAR {tab === "lovable" ? "PROMPT" : "CÓDIGO HTML"}
      </Btn>

      <AIBox text={result} loading={loading} />
      {result && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Btn outline onClick={() => navigator.clipboard.writeText(result)}>📋 Copiar {tab === "lovable" ? "Prompt" : "HTML"}</Btn>
          <Btn outline onClick={() => setResult("")}>↺ Regenerar</Btn>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ROI SIMULATOR
// ═══════════════════════════════════════════════════
function ROISimulator() {
  const [leads, setLeads] = useState(100);
  const [conv, setConv] = useState(20);
  const [ticket, setTicket] = useState(500);
  const [mejora, setMejora] = useState(30);
  const [nicho, setNicho] = useState("");
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(false);

  const actual = Math.round(leads * (conv / 100) * ticket);
  const newLeads = Math.round(leads * (1 + mejora / 100));
  const newConv = Math.min(100, Math.round(conv * 1.15));
  const nuevo = Math.round(newLeads * (newConv / 100) * ticket);
  const extra = nuevo - actual;
  const roi = Math.round((extra / 300) * 100);

  const SRange = ({ label, val, setVal, min, max, unit }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: M, fontSize: 10, color: C.textMuted }}>{label}</span>
        <span style={{ fontFamily: H, fontSize: 14, color: C.neon, fontWeight: 700 }}>{val}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={val}
        onChange={e => setVal(Number(e.target.value))}
        style={{ width: "100%", accentColor: C.neon, cursor: "pointer" }} />
    </div>
  );

  const generatePitch = async () => {
    setLoading(true);
    const res = await ai(
      "Eres experto en ventas de alto valor y cierres de agentes de IA. Creas pitches irresistibles basados en ROI.",
      `Crea un pitch de ventas basado en estos datos para el nicho "${nicho || "negocios locales"}":

SITUACIÓN ACTUAL DEL CLIENTE:
- Leads/mes: ${leads}, Conversión: ${conv}%, Ticket: ${ticket}€
- Ingresos actuales: ${actual}€/mes

CON NUESTRO AGENTE DE IA:
- Leads aumentan +${mejora}%, Conversión sube +15%
- Nuevos ingresos: ${nuevo}€/mes (+${extra}€ extra)
- ROI sobre cuota de 300€/mes: ${roi}%

GENERA:
1. FRASE DE APERTURA hook irresistible para la llamada
2. PRESENTACIÓN DEL ROI explicación simple (máximo 3 frases)
3. MANEJO DE OBJECIONES top 3 con respuestas exactas
4. TÉCNICA DE CIERRE cómo cerrar en la misma llamada
5. OFERTA DE ENTRADA si pone pegas (modelo regalo + mantenimiento)

Tono: directo, confiado, orientado a resultados numéricos.`
    );
    setPitch(res);
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="SIMULADOR ROI" sub="CONVENCE AL CLIENTE CON NÚMEROS REALES" icon="◇" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: M, fontSize: 10, color: C.neon, marginBottom: 16, letterSpacing: 2 }}>DATOS DEL CLIENTE</div>
            <SRange label="Leads mensuales" val={leads} setVal={setLeads} min={10} max={1000} unit="" />
            <SRange label="Tasa de conversión actual" val={conv} setVal={setConv} min={1} max={80} unit="%" />
            <SRange label="Ticket promedio (€)" val={ticket} setVal={setTicket} min={50} max={5000} unit="€" />
            <SRange label="Mejora estimada con IA" val={mejora} setVal={setMejora} min={10} max={100} unit="%" />
          </Card>
          <div style={{ marginBottom: 12 }}>
            <Label>NICHO (para el pitch)</Label>
            <Inp value={nicho} onChange={setNicho} placeholder="Ej: Clínica dental..." />
          </div>
          <Btn onClick={generatePitch} loading={loading} full>⚡ GENERAR PITCH DE VENTAS</Btn>
        </div>

        <div>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted, marginBottom: 14, letterSpacing: 1 }}>SIN IA — SITUACIÓN ACTUAL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["Leads/mes", leads], ["Conversión", conv + "%"],
                ["Ventas/mes", Math.round(leads * conv / 100)], ["Ingresos", actual + "€"],
              ].map(([l, v]) => (
                <div key={l} style={{ background: C.surface, borderRadius: 8, padding: 12 }}>
                  <div style={{ fontFamily: M, fontSize: 9, color: C.textMuted }}>{l}</div>
                  <div style={{ fontFamily: H, fontSize: 18, color: C.text, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ marginBottom: 14, border: `1px solid ${C.neon}30`, boxShadow: glow }}>
            <div style={{ fontFamily: M, fontSize: 10, color: C.neon, marginBottom: 14, letterSpacing: 1 }}>✓ CON AGENTE DE IA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["Leads/mes", newLeads, "+" + mejora + "%"],
                ["Conversión", newConv + "%", "+15%"],
                ["Ventas/mes", Math.round(newLeads * newConv / 100), "↑"],
                ["Ingresos", nuevo + "€", "+" + extra + "€"],
              ].map(([l, v, ch]) => (
                <div key={l} style={{ background: C.neonDim, borderRadius: 8, padding: 12, border: `1px solid ${C.neon}15` }}>
                  <div style={{ fontFamily: M, fontSize: 9, color: C.neon }}>{l}</div>
                  <div style={{ fontFamily: H, fontSize: 18, color: C.neon, fontWeight: 700 }}>{v}</div>
                  <div style={{ fontFamily: M, fontSize: 9, color: C.neonBright }}>{ch}</div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card style={{ textAlign: "center" }}>
              <div style={{ fontFamily: M, fontSize: 9, color: C.textMuted }}>EXTRA AL MES</div>
              <div style={{ fontFamily: H, fontSize: 28, color: C.neon, fontWeight: 900 }}>+{extra}€</div>
            </Card>
            <Card style={{ textAlign: "center", border: `1px solid ${C.neon}40` }}>
              <div style={{ fontFamily: M, fontSize: 9, color: C.neon }}>ROI vs 300€/MES</div>
              <div style={{ fontFamily: H, fontSize: 28, color: C.neonBright, fontWeight: 900 }}>{roi}%</div>
            </Card>
          </div>
        </div>
      </div>
      <AIBox text={pitch} loading={loading} />
      {pitch && <Btn outline onClick={() => navigator.clipboard.writeText(pitch)} style={{ marginTop: 12 }}>📋 Copiar Pitch</Btn>}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PROSPECCIÓN
// ═══════════════════════════════════════════════════
function Prospeccion() {
  const [nicho, setNicho] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tab, setTab] = useState("estrategia");
  const [result, setResult] = useState({ estrategia: "", email: "", script: "" });
  const [loading, setLoading] = useState(false);

  const gen = async (key, sys, user) => {
    setLoading(true);
    const res = await ai(sys, user);
    setResult(r => ({ ...r, [key]: res }));
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="PROSPECCIÓN" sub="ENCUENTRA Y CONTACTA CLIENTES POTENCIALES AUTOMÁTICAMENTE" icon="◎" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <div><Label>NICHO</Label><Inp value={nicho} onChange={setNicho} placeholder="Ej: Clínicas dentales" /></div>
        <div><Label>CIUDAD / ZONA</Label><Inp value={ciudad} onChange={setCiudad} placeholder="Ej: Madrid, España..." /></div>
      </div>

      <Tabs
        tabs={[
          { id: "estrategia", label: "🔍 Estrategia" },
          { id: "email", label: "✉️ Email en Frío" },
          { id: "script", label: "📞 Script Llamada" },
        ]}
        active={tab} setActive={setTab}
      />

      {tab === "estrategia" && (
        <>
          <Btn loading={loading} disabled={!nicho} onClick={() => gen("estrategia",
            "Eres experto en prospección B2B y generación de leads para agencias de IA.",
            `Estrategia COMPLETA para prospectar "${nicho}" en "${ciudad || "España"}":
1. FUENTES GRATUITAS: dónde encontrar emails/contactos (Google Maps, LinkedIn, directorios)
2. QUERIES DE GOOGLE: búsquedas exactas para encontrar empresas
3. LINKEDIN: estrategia de búsqueda con filtros exactos + mensaje de conexión
4. DIRECTORIOS SECTORIALES: cuáles usar específicamente para este nicho
5. PLAN DE ACCIÓN: cómo extraer 100 contactos en 1 hora paso a paso
6. HERRAMIENTAS: gratuitas y de pago recomendadas con links
7. KPIs: cuántos contactos por día para conseguir 1 cliente/semana`
          )} style={{ marginBottom: 14 }}>⚡ GENERAR ESTRATEGIA</Btn>
          <AIBox text={result.estrategia} loading={loading} />
          {result.estrategia && <Btn outline onClick={() => navigator.clipboard.writeText(result.estrategia)} style={{ marginTop: 12 }}>📋 Copiar</Btn>}
        </>
      )}

      {tab === "email" && (
        <>
          <Btn loading={loading} disabled={!nicho} onClick={() => gen("email",
            "Eres copywriter de élite especializado en cold email para agencias de IA.",
            `Crea 3 versiones de cold email para vender agentes de IA al nicho "${nicho}".

EMAIL 1 - ULTRACORTO (3 líneas):
Asunto (3 opciones), cuerpo, CTA, follow-up día 3

EMAIL 2 - CON VALOR (estadística impactante del sector):
Asunto (3 opciones), cuerpo, CTA, follow-up día 3

EMAIL 3 - DEMO GRATUITA (con agente ya creado):
Asunto (3 opciones), cuerpo, CTA, follow-up día 3

Tono: humano, específico del nicho, sin parecer spam. Menciona SUS dolores reales.`
          )} style={{ marginBottom: 14 }}>⚡ GENERAR EMAILS EN FRÍO</Btn>
          <AIBox text={result.email} loading={loading} />
          {result.email && <Btn outline onClick={() => navigator.clipboard.writeText(result.email)} style={{ marginTop: 12 }}>📋 Copiar</Btn>}
        </>
      )}

      {tab === "script" && (
        <>
          <Btn loading={loading} disabled={!nicho} onClick={() => gen("script",
            "Eres experto en ventas telefónicas de agentes de IA. Creas scripts que convierten.",
            `Crea un script de llamada en frío para vender agentes de IA al nicho "${nicho}".

INCLUYE:
1. APERTURA: cómo presentarse en 10 segundos
2. GANCHO: pregunta que genera interés inmediato
3. CUALIFICACIÓN: 3 preguntas para saber si es cliente ideal
4. PROPUESTA: cómo explicar el agente en 30 segundos
5. DEMO INMEDIATA: cómo ofrecer la demo en vivo ahora mismo
6. MANEJO DE OBJECIONES: "no me interesa", "ya tenemos algo", "muy caro"
7. CIERRE: cómo cerrar o agendar siguiente paso
8. FOLLOW-UP: qué hacer si no contesta (SMS + email + llamada)

Incluye el script WORD FOR WORD, listo para leer.`
          )} style={{ marginBottom: 14 }}>⚡ GENERAR SCRIPT DE LLAMADA</Btn>
          <AIBox text={result.script} loading={loading} />
          {result.script && <Btn outline onClick={() => navigator.clipboard.writeText(result.script)} style={{ marginTop: 12 }}>📋 Copiar</Btn>}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CONTENIDO RRSS
// ═══════════════════════════════════════════════════
function ContenidoRRSS() {
  const [nicho, setNicho] = useState("");
  const [plataforma, setPlataforma] = useState("instagram");
  const [tipo, setTipo] = useState("educativo");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await ai(
      "Eres experto en content marketing viral para agencias de IA. Creas contenido que para scrolls y genera leads.",
      `Crea UN POST COMPLETO para ${plataforma} tipo "${tipo}" para agencia de IA enfocada en "${nicho}".

1. HOOK: primera línea/frase que para el scroll (brutal, sin ser clickbait)
2. CUERPO: contenido completo adaptado al formato de ${plataforma}
3. CTA: llamada a la acción específica y directa
4. HASHTAGS: 15 hashtags relevantes en español + inglés
5. VARIANTES DEL HOOK: 3 alternativas para A/B test
6. MEJOR DÍA Y HORA para publicar en ${plataforma}
7. FORMATO IDEAL: carrusel/reel/historia/post + por qué
8. IDEA DE VISUAL: descripción exacta de la imagen/video que acompaña

Tono: ${tipo === "educativo" ? "educativo y útil, que enseña algo accionable" : tipo === "caso_exito" ? "narrativo con prueba social y números reales" : tipo === "venta" ? "directo a la venta, urgencia real" : "personal y auténtico, marca personal"}`,
      1000
    );
    setResult(res);
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="CONTENIDO RRSS" sub="GENERA POSTS VIRALES CON IA PARA CADA PLATAFORMA" icon="▣" />

      <div style={{ marginBottom: 18 }}>
        <Label>NICHO / TEMÁTICA</Label>
        <Inp value={nicho} onChange={setNicho} placeholder="Ej: Agentes IA para clínicas dentales, Automatización..." />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div>
          <Label>PLATAFORMA</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {["instagram", "linkedin", "tiktok", "twitter"].map(p => (
              <div key={p} onClick={() => setPlataforma(p)} style={{
                padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${plataforma === p ? C.neon : C.border}`,
                background: plataforma === p ? C.neonDim : "transparent",
                fontFamily: M, fontSize: 10, color: plataforma === p ? C.neon : C.textMuted,
                textTransform: "capitalize", transition: "all 0.15s",
              }}>{p}</div>
            ))}
          </div>
        </div>
        <div>
          <Label>TIPO DE CONTENIDO</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {[
              { id: "educativo", label: "📚 Educativo" },
              { id: "caso_exito", label: "🏆 Caso de Éxito" },
              { id: "venta", label: "💰 Venta Directa" },
              { id: "personal", label: "👤 Marca Personal" },
            ].map(t => (
              <div key={t.id} onClick={() => setTipo(t.id)} style={{
                padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${tipo === t.id ? C.neon : C.border}`,
                background: tipo === t.id ? C.neonDim : "transparent",
                fontFamily: M, fontSize: 10, color: tipo === t.id ? C.neon : C.textMuted,
                transition: "all 0.15s",
              }}>{t.label}</div>
            ))}
          </div>
        </div>
      </div>

      <Btn onClick={generate} loading={loading} disabled={!nicho} style={{ marginBottom: 14 }}>⚡ GENERAR POST COMPLETO</Btn>
      <AIBox text={result} loading={loading} />
      {result && <Btn outline onClick={() => navigator.clipboard.writeText(result)} style={{ marginTop: 12 }}>📋 Copiar Post</Btn>}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CAMPAÑAS
// ═══════════════════════════════════════════════════
function Campanas() {
  const [nicho, setNicho] = useState("");
  const [presupuesto, setPresupuesto] = useState("500");
  const [objetivo, setObjetivo] = useState("leads");
  const [plataforma, setPlataforma] = useState("meta");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await ai(
      "Eres experto en publicidad digital paid media con más de 10M€ gestionados en Meta, Google y TikTok.",
      `Crea una estrategia de campaña completa para:
Nicho: "${nicho}", Plataforma: ${plataforma}, Presupuesto: ${presupuesto}€/mes, Objetivo: ${objetivo}

ESTRUCTURA:
1. ARQUITECTURA: campañas → grupos de anuncios → anuncios (detallado)
2. SEGMENTACIÓN: audiencias exactas (intereses, comportamientos, cargos, lookalikes)
3. ANUNCIOS: 3 anuncios completos con titular + descripción + CTA
4. CREATIVIDADES: descripción exacta de qué imagen/video usar para cada anuncio
5. PRESUPUESTO: distribución exacta por campaña/adset/anuncio
6. ESTRATEGIA DE PUJA: qué elegir y por qué
7. KPIs: métricas, objetivos realistas (CPC, CPL, CTR, ROAS)
8. A/B TESTING: plan de pruebas primeras 2 semanas
9. PLAN DE ESCALADO: cómo escalar cuando funcione

Este plan debe funcionar desde el día 1.`,
      1000
    );
    setResult(res);
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="CAMPAÑAS" sub="DISEÑA TUS CAMPAÑAS DE MARKETING CON IA" icon="◆" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div><Label>NICHO OBJETIVO</Label><Inp value={nicho} onChange={setNicho} placeholder="Ej: Clínicas dentales" /></div>
        <div><Label>PRESUPUESTO MENSUAL (€)</Label><Inp value={presupuesto} onChange={setPresupuesto} placeholder="500" /></div>
        <div>
          <Label>OBJETIVO</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ id: "leads", label: "Leads" }, { id: "ventas", label: "Ventas" }].map(o => (
              <div key={o.id} onClick={() => setObjetivo(o.id)} style={{
                padding: "10px 16px", borderRadius: 8, cursor: "pointer", flex: 1, textAlign: "center",
                border: `1px solid ${objetivo === o.id ? C.neon : C.border}`,
                background: objetivo === o.id ? C.neonDim : "transparent",
                fontFamily: M, fontSize: 11, color: objetivo === o.id ? C.neon : C.textMuted,
                transition: "all 0.15s",
              }}>{o.label}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <Label>PLATAFORMA</Label>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "meta", label: "📱 Meta Ads" },
            { id: "google", label: "🔍 Google Ads" },
            { id: "tiktok", label: "🎵 TikTok Ads" },
            { id: "linkedin", label: "💼 LinkedIn Ads" },
          ].map(p => (
            <div key={p.id} onClick={() => setPlataforma(p.id)} style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              border: `1px solid ${plataforma === p.id ? C.neon : C.border}`,
              background: plataforma === p.id ? C.neonDim : "transparent",
              fontFamily: M, fontSize: 11, color: plataforma === p.id ? C.neon : C.textMuted,
              transition: "all 0.15s",
            }}>{p.label}</div>
          ))}
        </div>
      </div>

      <Btn onClick={generate} loading={loading} disabled={!nicho} style={{ marginBottom: 14 }}>⚡ DISEÑAR CAMPAÑA COMPLETA</Btn>
      <AIBox text={result} loading={loading} />
      {result && <Btn outline onClick={() => navigator.clipboard.writeText(result)} style={{ marginTop: 12 }}>📋 Copiar Estrategia</Btn>}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CRM
// ═══════════════════════════════════════════════════
function CRM({ clients, setClients }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [form, setForm] = useState({ name: "", sector: "", status: "prospecto", value: "", notes: "", email: "" });

  const STATUS = {
    prospecto: { color: C.info, label: "Prospecto" },
    demo: { color: C.warning, label: "Demo Enviada" },
    negociacion: { color: "#ff8800", label: "Negociación" },
    cerrado: { color: C.neon, label: "✓ Cerrado" },
    perdido: { color: C.danger, label: "Perdido" },
  };

  const add = () => {
    if (!form.name) return;
    setClients([...clients, { ...form, id: Date.now(), date: new Date().toLocaleDateString("es-ES") }]);
    setForm({ name: "", sector: "", status: "prospecto", value: "", notes: "", email: "" });
    setShowAdd(false);
  };

  const remove = (id) => setClients(clients.filter(c => c.id !== id));

  const filtered = filter === "todos" ? clients : clients.filter(c => c.status === filter);
  const revenue = clients.filter(c => c.status === "cerrado").reduce((s, c) => s + Number(c.value || 0), 0);
  const pipeline = clients.filter(c => !["cerrado", "perdido"].includes(c.status)).reduce((s, c) => s + Number(c.value || 0), 0);

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="CRM CLIENTES" sub="GESTIONA TU PIPELINE DE VENTAS" icon="▦" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          ["TOTAL", clients.length], ["CERRADOS", clients.filter(c => c.status === "cerrado").length],
          ["FACTURADO", revenue + "€"], ["PIPELINE", pipeline + "€"],
        ].map(([l, v]) => (
          <Card key={l}>
            <div style={{ fontFamily: M, fontSize: 9, color: C.textMuted, letterSpacing: 2, marginBottom: 6 }}>{l}</div>
            <div style={{ fontFamily: H, fontSize: 24, color: C.neon, fontWeight: 900 }}>{v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ id: "todos", label: "Todos" }, ...Object.entries(STATUS).map(([k, v]) => ({ id: k, label: v.label }))].map(f => (
            <div key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 10,
              border: `1px solid ${filter === f.id ? C.neon : C.border}`,
              background: filter === f.id ? C.neonDim : "transparent",
              fontFamily: M, color: filter === f.id ? C.neon : C.textMuted,
              transition: "all 0.15s",
            }}>{f.label}</div>
          ))}
        </div>
        <Btn onClick={() => setShowAdd(!showAdd)}>⊕ Añadir Cliente</Btn>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: M, fontSize: 10, color: C.neon, marginBottom: 14, letterSpacing: 2 }}>NUEVO CLIENTE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <Inp value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Nombre del negocio *" />
            <Inp value={form.sector} onChange={v => setForm({ ...form, sector: v })} placeholder="Sector" />
            <Inp value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="Email" />
            <Inp value={form.value} onChange={v => setForm({ ...form, value: v })} placeholder="Valor € (contrato)" />
            <Sel value={form.status} onChange={v => setForm({ ...form, status: v })}
              options={Object.entries(STATUS).map(([k, v]) => ({ value: k, label: v.label }))} />
            <Inp value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder="Notas" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={add}>Guardar</Btn>
            <Btn outline onClick={() => setShowAdd(false)}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 36 }}>
          <div style={{ fontFamily: M, fontSize: 12, color: C.textMuted }}>No hay clientes en esta categoría</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(c => (
            <Card key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: M, fontSize: 12, color: C.text, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontFamily: M, fontSize: 9, color: C.textMuted, marginTop: 3 }}>
                  {c.sector}{c.email ? " · " + c.email : ""} · {c.date}
                </div>
                {c.notes && <div style={{ fontFamily: M, fontSize: 10, color: C.textMuted, marginTop: 3 }}>{c.notes}</div>}
              </div>
              <div style={{ fontFamily: H, fontSize: 16, color: C.neon, fontWeight: 700, minWidth: 70, textAlign: "right" }}>
                {c.value ? c.value + "€" : "—"}
              </div>
              <Tag color={STATUS[c.status]?.color || C.textMuted}>{STATUS[c.status]?.label || c.status}</Tag>
              <div onClick={() => remove(c.id)} style={{ cursor: "pointer", color: C.danger, fontFamily: M, fontSize: 11, opacity: 0.6 }}>✕</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// AJUSTES
// ═══════════════════════════════════════════════════
function Ajustes() {
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ padding: 32 }}>
      <Hdr title="AJUSTES" sub="CONFIGURA TU PLATAFORMA" icon="⚙" />
      <div style={{ maxWidth: 580 }}>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: M, fontSize: 10, color: C.neon, marginBottom: 18, letterSpacing: 2 }}>ESTADO DE CONEXIONES</div>
          {[
            { label: "Claude AI (Motor IA Principal)", status: true, desc: "Conectado y activo" },
            { label: "Jina AI Scraper (Extractor Web)", status: true, desc: "Sin API key — gratis y funcionando" },
            { label: "Make.com Webhook", status: false, desc: "Opcional — automatizaciones externas" },
            { label: "Go High Level CRM", status: false, desc: "Opcional — CRM externo" },
            { label: "WhatsApp Business API", status: false, desc: "Necesario para agentes de WhatsApp reales" },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 14px", background: C.surface, borderRadius: 8, marginBottom: 8
            }}>
              <div>
                <div style={{ fontFamily: M, fontSize: 11, color: C.text }}>{item.label}</div>
                <div style={{ fontFamily: M, fontSize: 9, color: C.textMuted, marginTop: 3 }}>{item.desc}</div>
              </div>
              <Tag color={item.status ? C.neon : C.textMuted}>{item.status ? "✓ Activo" : "No configurado"}</Tag>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontFamily: M, fontSize: 10, color: C.neon, marginBottom: 14, letterSpacing: 2 }}>ACERCA DE</div>
          <div style={{ fontFamily: M, fontSize: 11, color: C.textMuted, lineHeight: 2 }}>
            <div>Plataforma: <span style={{ color: C.text }}>SYSTEMAGENT Agency OS v1.0</span></div>
            <div>Dominio: <span style={{ color: C.neon }}>systemagent.com</span></div>
            <div>Motor IA: <span style={{ color: C.text }}>Claude Sonnet 4 (Anthropic)</span></div>
            <div>Scraper: <span style={{ color: C.text }}>Jina AI Reader (gratuito)</span></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Btn onClick={save}>{saved ? "✓ Guardado" : "Guardar Configuración"}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════
export default function SystemAgent() {
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState([
    { id: 1, name: "Clínica Dental Martínez", sector: "Dental", status: "demo", value: "1200", date: "01/03/2026", notes: "Pendiente demo WhatsApp", email: "" },
    { id: 2, name: "Inmobiliaria Las Villas", sector: "Inmobiliaria", status: "cerrado", value: "2500", date: "28/02/2026", notes: "Agente de voz instalado", email: "" },
  ]);

  const views = {
    dashboard: <Dashboard setPage={setPage} clients={clients} />,
    roadmap: <RoadmapWizard />,
    demo: <DemoCreator />,
    web: <WebGenerator />,
    prospeccion: <Prospeccion />,
    roi: <ROISimulator />,
    contenido: <ContenidoRRSS />,
    campanas: <Campanas />,
    crm: <CRM clients={clients} setClients={setClients} />,
    ajustes: <Ajustes />,
  };

  return (
    <>
      <FontLoader />
      <div style={{
        display: "flex", height: "100vh",
        background: C.bg, color: C.text,
        overflow: "hidden", fontFamily: B,
      }}>
        {/* Scanline effect */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)",
        }} />
        <Sidebar page={page} setPage={setPage} />
        <main style={{ flex: 1, overflowY: "auto", background: C.bg, position: "relative" }}>
          {views[page] || views.dashboard}
        </main>
      </div>
    </>
  );
}
