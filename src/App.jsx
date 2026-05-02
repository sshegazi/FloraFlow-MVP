import { useState } from "react";

// ─────────────────────────────────────────────────────────
const MOCK_USERS = [
  { email: "layla@floraflow.com", password: "password123", role: "customer", name: "Layla Al-Rashid" },
  { email: "admin@floraflow.com", password: "admin123",    role: "admin",    name: "Nour Hassan"     },
];

const today   = new Date();
const fmt     = (d) => d.toISOString().split("T")[0];
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const daysUntil  = (s) => Math.round((new Date(s) - today) / 86400000);
const daysSince  = (s) => Math.round((today - new Date(s)) / 86400000);
const isStale    = (s) => daysSince(s) > 5;
const isReminder = (s) => { const d = daysUntil(s); return d >= 0 && d <= 3; };

// ───────────────────────────────────────────
const INITIAL_EVENTS = [
  { id:1, name:"Al-Rashid Family Wedding",          date: fmt(addDays(today, 2)),  category:"Wedding"    },
  { id:2, name:"Sarah & Mohammed Engagement Party", date: fmt(addDays(today, 3)),  category:"Engagement" },
  { id:3, name:"Reem's Birthday Celebration",       date: fmt(addDays(today, 8)),  category:"Birthday"   },
  { id:4, name:"Manal's University Graduation",     date: fmt(addDays(today,14)),  category:"Graduation" },
  { id:5, name:"Mother's Appreciation Gala",        date: fmt(addDays(today,20)),  category:"Occasion"   },
  { id:6, name:"Arab Women's Day Ceremony",         date: fmt(addDays(today, 1)),  category:"Celebration"},
];

const INITIAL_INVENTORY = [
  { id:1, flower:"Red Roses",         qty:200, supplier:"Al-Batool Farm",    dateReceived: fmt(addDays(today,-6)) },
  { id:2, flower:"White Lilies",      qty: 80, supplier:"Al-Amal Garden",    dateReceived: fmt(addDays(today,-3)) },
  { id:3, flower:"Sunflowers",        qty:150, supplier:"Wahat Al-Zuhoor",   dateReceived: fmt(addDays(today,-7)) },
  { id:4, flower:"Pink Peonies",      qty: 60, supplier:"Al-Batool Farm",    dateReceived: fmt(addDays(today,-1)) },
  { id:5, flower:"Purple Lavender",   qty:300, supplier:"Bustan Al-Rayhan",  dateReceived: fmt(addDays(today,-5)) },
  { id:6, flower:"Luxury Orchids",    qty: 40, supplier:"Nakheel Flowers",   dateReceived: fmt(addDays(today,-2)) },
  { id:7, flower:"White Jasmine",     qty:120, supplier:"Al-Amal Garden",    dateReceived: fmt(addDays(today,-8)) },
];

const CATEGORIES = ["Wedding","Engagement","Birthday","Graduation","Celebration","Occasion","Other"];

const Icon = ({ d, size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const I = {
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  inventory:"M3 3h18v18H3zM3 9h18M9 21V9",
  bell:     "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  logout:   "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  plus:     "M12 5v14M5 12h14",
  trash:    "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  alert:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:   "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
};

const PETALS = [
  {w:14,h:20,left:"8%", delay:0,  dur:14},
  {w:10,h:15,left:"22%",delay:3,  dur:18},
  {w:18,h:26,left:"38%",delay:1.5,dur:12},
  {w:12,h:18,left:"57%",delay:5,  dur:16},
  {w:8, h:12,left:"72%",delay:2,  dur:20},
  {w:16,h:22,left:"87%",delay:7,  dur:15},
  {w:11,h:16,left:"50%",delay:9,  dur:13},
];

const catBadge = (c) => ({
  "Wedding":    "b-rose",
  "Engagement": "b-lilac",
  "Birthday":   "b-peach",
  "Graduation": "b-mint",
  "Celebration":"b-amber",
  "Occasion":   "b-bark",
  "Other":      "b-bark",
}[c] || "b-bark");

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --rose:#e8a0b4;--rose-d:#d4607e;--rose-lt:#f5c6d5;--rose-p:#fce8ef;
  --blush:#f9dde6;--petal:#fbf0f4;--lilac:#e8d5f0;--lilac-d:#b07cc6;
  --peach:#fad4bb;--peach-d:#e89070;--mint:#c8ead8;--mint-d:#2d7a5c;
  --text:#5a2d4a;--text-lt:#9a6880;--text-x:#c4a0b4;
  --card:#fffbfd;--shadow:rgba(212,96,126,.10);
  --r:16px;--tr:.2s ease;
}
body{font-family:'Nunito',sans-serif;background:var(--petal);color:var(--text)}

.petal-bg{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.petal-bg span{
  position:absolute;border-radius:50% 0 50% 0;
  background:linear-gradient(135deg,var(--rose-lt),var(--lilac));
  opacity:.18;animation:floatP linear infinite;
}
@keyframes floatP{
  0%{transform:translateY(100vh) rotate(0deg);opacity:0}
  10%{opacity:.18}90%{opacity:.12}
  100%{transform:translateY(-120px) rotate(360deg);opacity:0}
}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

/* ── Auth ── */
.auth-wrap{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(160deg,#fce8ef 0%,#f5d0e0 35%,#ede0f5 70%,#fce8ef 100%);
  position:relative;
}
.auth-deco{
  position:absolute;font-size:7rem;opacity:.07;pointer-events:none;
  font-family:'Playfair Display',serif;color:var(--rose-d);user-select:none;
}
.auth-deco.tl{top:40px;left:40px;transform:rotate(-15deg)}
.auth-deco.br{bottom:40px;right:40px;transform:rotate(15deg)}
.auth-card{
  background:rgba(255,248,251,.94);backdrop-filter:blur(16px);
  border-radius:28px;padding:52px 44px;width:430px;
  box-shadow:0 32px 80px rgba(212,96,126,.18),0 0 0 1px rgba(232,160,180,.2);
  position:relative;z-index:1;animation:fadeUp .5s ease both;
}
.auth-logo{text-align:center;margin-bottom:32px}
.logo-icon{
  width:64px;height:64px;border-radius:50%;
  background:linear-gradient(135deg,var(--rose),var(--lilac-d));
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 14px;box-shadow:0 8px 24px rgba(212,96,126,.3);font-size:1.8rem;
}
.auth-logo h1{
  font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:600;
  background:linear-gradient(135deg,var(--rose-d),var(--lilac-d));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.auth-logo p{color:var(--text-lt);font-size:.82rem;margin-top:4px;letter-spacing:.05em}
.auth-tabs{
  display:flex;background:var(--blush);border-radius:12px;
  padding:4px;margin-bottom:28px;gap:4px;
}
.auth-tab{
  flex:1;padding:9px;text-align:center;cursor:pointer;font-size:.88rem;
  font-weight:600;color:var(--text-lt);border-radius:10px;transition:all var(--tr);
  font-family:'Nunito',sans-serif;
}
.auth-tab.active{background:white;color:var(--rose-d);font-weight:700;box-shadow:0 2px 8px rgba(212,96,126,.15)}
.fg{margin-bottom:16px}
.fg label{display:block;font-size:.75rem;font-weight:700;color:var(--text-lt);margin-bottom:6px;letter-spacing:.05em;text-transform:uppercase}
.fw{position:relative}
.fw input{
  width:100%;padding:11px 16px;border:1.5px solid var(--rose-lt);
  border-radius:12px;font-family:'Nunito',sans-serif;font-size:.92rem;
  background:var(--petal);color:var(--text);outline:none;
  transition:border-color var(--tr),box-shadow var(--tr);
}
.fw input:focus{border-color:var(--rose);background:white;box-shadow:0 0 0 3px rgba(232,160,180,.2)}
.eye-btn{
  position:absolute;right:12px;top:50%;transform:translateY(-50%);
  background:none;border:none;cursor:pointer;color:var(--text-x);padding:4px;
}
.demo-hint{
  background:linear-gradient(135deg,var(--rose-p),var(--lilac));
  border-radius:12px;padding:12px 16px;font-size:.79rem;
  color:var(--text-lt);margin-bottom:18px;line-height:1.6;
}
.demo-hint strong{color:var(--text)}
.auth-btn{
  width:100%;padding:14px;
  background:linear-gradient(135deg,var(--rose-d),var(--lilac-d));
  color:white;border:none;border-radius:12px;
  font-family:'Nunito',sans-serif;font-size:1rem;font-weight:700;
  cursor:pointer;box-shadow:0 8px 24px rgba(212,96,126,.35);
  transition:transform var(--tr),box-shadow var(--tr);
}
.auth-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(212,96,126,.4)}
.auth-err{
  color:var(--rose-d);font-size:.82rem;margin-bottom:14px;
  padding:10px 14px;background:var(--rose-p);border-radius:10px;
  border-left:3px solid var(--rose-d);
}

/* ── App shell ── */
.app{display:flex;min-height:100vh;position:relative;z-index:1}
.sidebar{
  width:252px;flex-shrink:0;position:fixed;top:0;left:0;bottom:0;z-index:20;
  background:linear-gradient(180deg,#f9e0ea 0%,#f0d5e8 50%,#ede0f5 100%);
  border-right:1px solid rgba(232,160,180,.3);
  display:flex;flex-direction:column;padding:28px 0;
  box-shadow:4px 0 24px rgba(212,96,126,.08);
}
.sidebar-logo{padding:0 22px 24px;border-bottom:1px solid rgba(232,160,180,.25)}
.s-logo-row{display:flex;align-items:center;gap:12px}
.s-icon{
  width:40px;height:40px;border-radius:12px;flex-shrink:0;
  background:linear-gradient(135deg,var(--rose),var(--lilac-d));
  display:flex;align-items:center;justify-content:center;
  font-size:1.1rem;box-shadow:0 4px 12px rgba(212,96,126,.3);
}
.sidebar-logo h2{
  font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:600;
  background:linear-gradient(135deg,var(--rose-d),var(--lilac-d));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.sidebar-logo p{font-size:.7rem;color:var(--text-x);letter-spacing:.06em;margin-top:2px}
.sidebar-nav{flex:1;padding:18px 12px}
.nav-item{
  display:flex;align-items:center;gap:10px;padding:11px 14px;
  border-radius:12px;cursor:pointer;color:var(--text-lt);font-size:.9rem;
  font-weight:600;transition:all var(--tr);margin-bottom:4px;
}
.nav-item:hover{background:rgba(232,160,180,.2);color:var(--rose-d)}
.nav-item.active{
  background:linear-gradient(135deg,rgba(232,160,180,.35),rgba(232,213,240,.45));
  color:var(--rose-d);font-weight:700;
  box-shadow:inset 0 0 0 1px rgba(232,160,180,.35);
}
.sidebar-footer{padding:16px 12px;border-top:1px solid rgba(232,160,180,.25)}
.user-badge{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  background:rgba(255,248,251,.6);border-radius:12px;margin-bottom:8px;
}
.u-av{
  width:34px;height:34px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--rose),var(--lilac-d));
  display:flex;align-items:center;justify-content:center;
  color:white;font-size:.9rem;font-weight:700;
  box-shadow:0 2px 8px rgba(212,96,126,.25);
}
.u-info p{font-size:.85rem;color:var(--text);font-weight:700}
.u-info span{font-size:.7rem;color:var(--text-x);letter-spacing:.04em;text-transform:capitalize}
.logout-btn{
  width:100%;display:flex;align-items:center;gap:10px;padding:10px 14px;
  background:none;border:none;border-radius:10px;cursor:pointer;
  color:var(--text-lt);font-size:.85rem;font-family:'Nunito',sans-serif;
  font-weight:600;transition:all var(--tr);
}
.logout-btn:hover{background:rgba(232,160,180,.2);color:var(--rose-d)}

/* ── Main ── */
.main{margin-left:252px;flex:1;padding:36px 40px;min-height:100vh}
.page-header{margin-bottom:28px}
.page-header h1{
  font-family:'Playfair Display',serif;font-size:2rem;font-weight:600;
  background:linear-gradient(135deg,var(--rose-d),var(--lilac-d));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.page-header p{color:var(--text-lt);font-size:.88rem;margin-top:5px}

/* ── Stats ── */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.stat-card{
  background:var(--card);border-radius:var(--r);padding:22px 20px;
  box-shadow:0 4px 20px var(--shadow);border:1px solid rgba(232,160,180,.18);
  position:relative;overflow:hidden;transition:transform var(--tr);animation:fadeUp .4s ease both;
}
.stat-card:hover{transform:translateY(-2px)}
.stat-card::before{
  content:'';position:absolute;top:-20px;right:-20px;
  width:80px;height:80px;border-radius:50%;
  background:linear-gradient(135deg,var(--rose-p),var(--lilac));opacity:.6;
}
.s-label{font-size:.72rem;color:var(--text-lt);font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px;position:relative}
.s-val{
  font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:600;
  background:linear-gradient(135deg,var(--rose-d),var(--lilac-d));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  line-height:1;position:relative;
}
.s-sub{font-size:.76rem;color:var(--text-x);margin-top:4px;position:relative}
.stat-card.warn .s-val{background:linear-gradient(135deg,#e53e3e,#c53030);-webkit-background-clip:text}
.stat-card.amber .s-val{background:linear-gradient(135deg,#d97706,#b45309);-webkit-background-clip:text}

/* ── Banners ── */
.banner{
  border-radius:var(--r);padding:16px 20px;margin-bottom:22px;
  display:flex;align-items:flex-start;gap:14px;animation:fadeUp .4s ease both;
}
.banner.reminder{background:linear-gradient(135deg,#fff0f8,#f9e8ff);border:1.5px solid var(--rose-lt)}
.banner.danger{background:linear-gradient(135deg,#fff0f0,#ffe0e0);border:1.5px solid #f4a0a0}
.b-ic{flex-shrink:0;margin-top:2px}
.banner.reminder .b-ic{color:var(--rose-d)}
.banner.danger   .b-ic{color:#c53030}
.banner h3{font-size:.9rem;font-weight:700;margin-bottom:5px}
.banner.reminder h3{color:var(--rose-d)}
.banner.danger   h3{color:#c53030}
.banner ul{list-style:none}
.banner li{font-size:.82rem;color:var(--text-lt);padding:2px 0}
.banner li strong{color:var(--text)}

/* ── Cards ── */
.card{
  background:var(--card);border-radius:var(--r);padding:28px;
  box-shadow:0 4px 24px var(--shadow);border:1px solid rgba(232,160,180,.15);
  margin-bottom:24px;animation:fadeUp .4s ease both;
}
.card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
.card-header h2{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:600;color:var(--rose-d)}
.legend{display:flex;align-items:center;gap:16px;font-size:.76rem;color:var(--text-lt)}
.ldot{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:5px}

/* ── Form ── */
.add-form{display:grid;gap:12px;margin-bottom:22px;align-items:end}
.af4{grid-template-columns:1fr 1fr 1fr auto}
.af5{grid-template-columns:1.5fr .6fr 1fr 1fr auto}
.form-field label{display:block;font-size:.72rem;font-weight:700;color:var(--text-lt);margin-bottom:6px;letter-spacing:.05em;text-transform:uppercase}
.form-field input,.form-field select{
  width:100%;padding:10px 14px;border:1.5px solid var(--rose-lt);
  border-radius:10px;font-family:'Nunito',sans-serif;font-size:.9rem;
  background:var(--petal);color:var(--text);outline:none;
  transition:border-color var(--tr),box-shadow var(--tr);
}
.form-field input:focus,.form-field select:focus{
  border-color:var(--rose);background:white;box-shadow:0 0 0 3px rgba(232,160,180,.2)
}
.add-btn{
  display:flex;align-items:center;gap:7px;padding:10px 20px;
  background:linear-gradient(135deg,var(--rose-d),var(--lilac-d));
  color:white;border:none;border-radius:10px;font-family:'Nunito',sans-serif;
  font-size:.9rem;font-weight:700;cursor:pointer;white-space:nowrap;
  box-shadow:0 4px 14px rgba(212,96,126,.3);transition:transform var(--tr),box-shadow var(--tr);
}
.add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,96,126,.4)}

/* ── Table ── */
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse}
thead tr{border-bottom:2px solid var(--rose-lt)}
th{text-align:left;font-size:.72rem;font-weight:700;color:var(--text-lt);letter-spacing:.06em;text-transform:uppercase;padding:0 16px 12px}
td{padding:13px 16px;font-size:.88rem;border-bottom:1px solid rgba(245,198,213,.4)}
tr:last-child td{border-bottom:none}
tbody tr{transition:background var(--tr)}
tbody tr:hover td{background:rgba(252,232,239,.5)}

/* R5 stale */
.stale-row td{background:#fff5f5 !important}
.stale-row td:first-child{border-left:3px solid #fc8181}

/* ── Badges ── */
.badge{display:inline-block;padding:3px 11px;border-radius:99px;font-size:.73rem;font-weight:700;letter-spacing:.02em}
.b-rose  {background:var(--rose-p);color:var(--rose-d)}
.b-lilac {background:var(--lilac);color:var(--lilac-d)}
.b-peach {background:var(--peach);color:var(--peach-d)}
.b-mint  {background:var(--mint);color:var(--mint-d)}
.b-amber {background:#fff3d0;color:#92660a}
.b-red   {background:#ffe0e0;color:#c53030}
.b-bark  {background:var(--blush);color:var(--text)}

.icon-btn{background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:var(--text-x);display:flex;align-items:center;transition:all var(--tr)}
.icon-btn:hover{background:var(--rose-p);color:var(--rose-d)}
.empty{text-align:center;padding:40px;color:var(--text-x)}
.empty .ei{font-size:2.5rem;margin-bottom:10px}

@media(max-width:960px){
  .sidebar{width:210px}
  .main{margin-left:210px;padding:24px 20px}
  .stats-row{grid-template-columns:repeat(2,1fr)}
  .af4,.af5{grid-template-columns:1fr 1fr}
}
`;

// ══════════════════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [tab,  setTab]  = useState("login");
  const [email,setEmail]= useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [err,  setErr]  = useState("");

  const submit = () => {
    setErr("");
    if (tab === "login") {
      const u = MOCK_USERS.find(u => u.email===email && u.password===pass);
      u ? onLogin(u) : setErr("Incorrect email or password. Try the demo credentials below.");
    } else {
      if (!name||!email||!pass) { setErr("Please fill in all fields."); return; }
      if (pass.length<6)        { setErr("Password must be at least 6 characters."); return; }
      onLogin({ email, name, role:"customer" });
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-wrap">
        <div className="auth-deco tl">✿</div>
        <div className="auth-deco br">✿</div>
        <div className="auth-card">
          <div className="auth-logo">
            <div className="logo-icon">🌸</div>
            <h1>FloraFlow</h1>
            <p>Floral Logistics &amp; Event Platform</p>
          </div>
          <div className="auth-tabs">
            <div className={`auth-tab${tab==="login"?" active":""}`} onClick={()=>{setTab("login");setErr("");}}>Sign In</div>
            <div className={`auth-tab${tab==="signup"?" active":""}`} onClick={()=>{setTab("signup");setErr("");}}>Sign Up</div>
          </div>
          {err && <div className="auth-err">{err}</div>}
          {tab==="login" && (
            <div className="demo-hint">
              <strong>Demo credentials:</strong><br/>
              Customer: layla@floraflow.com / password123<br/>
              Admin: admin@floraflow.com / admin123
            </div>
          )}
          {tab==="signup" && (
            <div className="fg">
              <label style={{display:"block",fontSize:".75rem",fontWeight:700,color:"var(--text-lt)",marginBottom:6,letterSpacing:".05em",textTransform:"uppercase"}}>Full Name</label>
              <input style={{width:"100%",padding:"11px 16px",border:"1.5px solid var(--rose-lt)",borderRadius:"12px",fontFamily:"Nunito,sans-serif",fontSize:".92rem",background:"var(--petal)",color:"var(--text)",outline:"none"}}
                placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
          )}
          <div className="fg">
            <label style={{display:"block",fontSize:".75rem",fontWeight:700,color:"var(--text-lt)",marginBottom:6,letterSpacing:".05em",textTransform:"uppercase"}}>Email</label>
            <div className="fw">
              <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
          </div>
          <div className="fg" style={{marginBottom:22}}>
            <label style={{display:"block",fontSize:".75rem",fontWeight:700,color:"var(--text-lt)",marginBottom:6,letterSpacing:".05em",textTransform:"uppercase"}}>Password</label>
            <div className="fw">
              <input type={show?"text":"password"} placeholder="••••••••" value={pass}
                style={{paddingRight:42}}
                onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
              <button className="eye-btn" onClick={()=>setShow(!show)}>
                <Icon d={show?I.eyeOff:I.eye} size={16}/>
              </button>
            </div>
          </div>
          <button className="auth-btn" onClick={submit}>
            {tab==="login"?"Sign In ✨":"Create Account 🌸"}
          </button>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CUSTOMER DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function CustomerDashboard({ user }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [form,   setForm]   = useState({ name:"", date:"", category:"Wedding" });

  const addEvent = () => {
    if (!form.name||!form.date) return;
    setEvents(p=>[...p,{id:Date.now(),...form}]);
    setForm({name:"",date:"",category:"Wedding"});
  };
  const del = (id) => setEvents(p=>p.filter(e=>e.id!==id));

  const reminders = events.filter(e=>isReminder(e.date));
  const upcoming7 = events.filter(e=>daysUntil(e.date)>=0&&daysUntil(e.date)<=7).length;

  return (
    <>
      <div className="stats-row">
        {[
          {l:"Total Events",    v:events.length,    s:"Scheduled",      c:""},
          {l:"This Week",       v:upcoming7,         s:"Within 7 days",  c:"amber"},
          {l:"Active Reminders",v:reminders.length,  s:"Within 3 days",  c:"warn"},
          {l:"Categories",      v:[...new Set(events.map(e=>e.category))].length,s:"Event types",c:""},
        ].map((s,i)=>(
          <div className={`stat-card ${s.c}`} key={i} style={{animationDelay:`${i*0.08}s`}}>
            <div className="s-label">{s.l}</div>
            <div className="s-val">{s.v}</div>
            <div className="s-sub">{s.s}</div>
          </div>
        ))}
      </div>

      {reminders.length>0&&(
        <div className="banner reminder">
          <div className="b-ic"><Icon d={I.bell} size={22}/></div>
          <div>
            <h3>🌸 Upcoming Event Reminders</h3>
            <ul>
              {reminders.map(e=>(
                <li key={e.id}>
                  <strong>{e.name}</strong> — {e.category} —{" "}
                  {daysUntil(e.date)===0?"Today! 🌹":daysUntil(e.date)===1?"Tomorrow 🌷":`In ${daysUntil(e.date)} days 🌸`}
                  &nbsp;({e.date})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>🗓️ Event Calendar</h2>
          <div className="legend">
            <span><span className="ldot" style={{background:"#d97706"}}></span>Reminder ≤ 3 days</span>
          </div>
        </div>
        <div className="add-form af4">
          <div className="form-field">
            <label>Event Name</label>
            <input placeholder="e.g. Fatima's Wedding" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          </div>
          <div className="form-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
          </div>
          <div className="form-field">
            <label>Category</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <button className="add-btn" onClick={addEvent}>
            <Icon d={I.plus} size={16}/> Add
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Event Name</th><th>Date</th><th>Category</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {events.length===0?(
                <tr><td colSpan={5}><div className="empty"><div className="ei">🌸</div><p>No events yet. Add your first one above!</p></div></td></tr>
              ):[...events].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(e=>(
                <tr key={e.id} style={isReminder(e.date)?{background:"#fff8f0"}:{}}>
                  <td style={{fontWeight:700}}>{e.name}</td>
                  <td>{e.date}</td>
                  <td><span className={`badge ${catBadge(e.category)}`}>{e.category}</span></td>
                  <td>
                    {daysUntil(e.date)<0
                      ?<span className="badge b-bark">Past</span>
                      :isReminder(e.date)
                        ?<span className="badge b-amber">⚑ Reminder</span>
                        :<span className="badge b-mint">✓ Scheduled</span>
                    }
                  </td>
                  <td><button className="icon-btn" onClick={()=>del(e.id)}><Icon d={I.trash} size={15}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function AdminDashboard() {
  const [inv,  setInv]  = useState(INITIAL_INVENTORY);
  const [form, setForm] = useState({ flower:"", qty:"", supplier:"", dateReceived:fmt(today) });

  const addItem = () => {
    if (!form.flower||!form.qty) return;
    setInv(p=>[...p,{id:Date.now(),...form,qty:Number(form.qty)}]);
    setForm({flower:"",qty:"",supplier:"",dateReceived:fmt(today)});
  };
  const del = (id) => setInv(p=>p.filter(i=>i.id!==id));
  const staleCount = inv.filter(i=>isStale(i.dateReceived)).length;

  return (
    <>
      <div className="stats-row">
        {[
          {l:"Flower Types",     v:inv.length,                                  s:"SKUs in stock",  c:""},
          {l:"Total Units",      v:inv.reduce((s,i)=>s+i.qty,0),                s:"In warehouse",   c:""},
          {l:"Freshness Alerts", v:staleCount,                                  s:"Over 5 days old",c:"warn"},
          {l:"Suppliers",        v:[...new Set(inv.map(i=>i.supplier))].length, s:"Active vendors", c:""},
        ].map((s,i)=>(
          <div className={`stat-card ${s.c}`} key={i} style={{animationDelay:`${i*0.08}s`}}>
            <div className="s-label">{s.l}</div>
            <div className="s-val">{s.v}</div>
            <div className="s-sub">{s.s}</div>
          </div>
        ))}
      </div>

      {staleCount>0&&(
        <div className="banner danger">
          <div className="b-ic"><Icon d={I.alert} size={22}/></div>
          <div>
            <h3>🥀 Freshness Alert — {staleCount} item{staleCount>1?"s":""} past prime</h3>
            <p style={{fontSize:".82rem",color:"var(--text-lt)",marginTop:4}}>
              Rows highlighted in red were received more than 5 days ago and may need review or replacement.
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>🌹 Flower Inventory</h2>
          <div className="legend">
            <span><span className="ldot" style={{background:"#fc8181"}}></span>Freshness Alert (&gt;5 days)</span>
            <span><span className="ldot" style={{background:"var(--mint)"}}></span>Fresh</span>
          </div>
        </div>
        <div className="add-form af5">
          <div className="form-field">
            <label>Flower Type</label>
            <input placeholder="e.g. Red Roses" value={form.flower} onChange={e=>setForm({...form,flower:e.target.value})}/>
          </div>
          <div className="form-field">
            <label>Qty</label>
            <input type="number" placeholder="0" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})}/>
          </div>
          <div className="form-field">
            <label>Supplier</label>
            <input placeholder="Supplier name" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/>
          </div>
          <div className="form-field">
            <label>Date Received</label>
            <input type="date" value={form.dateReceived} onChange={e=>setForm({...form,dateReceived:e.target.value})}/>
          </div>
          <button className="add-btn" onClick={addItem}>
            <Icon d={I.plus} size={16}/> Add
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Flower Type</th><th>Qty</th><th>Supplier</th><th>Date Received</th><th>Age</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {inv.map(item=>(
                <tr key={item.id} className={isStale(item.dateReceived)?"stale-row":""}>
                  <td style={{fontWeight:700}}>{item.flower}</td>
                  <td>{item.qty}</td>
                  <td>{item.supplier||"—"}</td>
                  <td>{item.dateReceived}</td>
                  <td>{daysSince(item.dateReceived)}d ago</td>
                  <td>
                    {isStale(item.dateReceived)
                      ?<span className="badge b-red">⚠ Stale</span>
                      :<span className="badge b-mint">✓ Fresh</span>
                    }
                  </td>
                  <td><button className="icon-btn" onClick={()=>del(item.id)}><Icon d={I.trash} size={15}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════════
export default function FloraFlowApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("calendar");

  const login  = (u) => { setUser(u); setView(u.role==="admin"?"inventory":"calendar"); };
  const logout = ()  => { setUser(null); setView("calendar"); };

  if (!user) return <AuthPage onLogin={login}/>;

  const isAdmin = user.role==="admin";
  const navItems = isAdmin
    ? [{id:"inventory",icon:I.inventory,label:"Inventory Dashboard 🌹"}]
    : [
        {id:"calendar",  icon:I.calendar,  label:"Event Calendar 🗓️"},
        {id:"inventory", icon:I.inventory, label:"Inventory 🌸"},
      ];

  return (
    <>
      <style>{css}</style>
      <div className="petal-bg">
        {PETALS.map((p,i)=>(
          <span key={i} style={{
            width:p.w,height:p.h,left:p.left,bottom:"-30px",
            animationDuration:`${p.dur}s`,animationDelay:`${p.delay}s`,
          }}/>
        ))}
      </div>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="s-logo-row">
              <div className="s-icon">🌸</div>
              <div>
                <h2>FloraFlow</h2>
                <p>Floral Logistics Platform</p>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(n=>(
              <div key={n.id} className={`nav-item${view===n.id?" active":""}`} onClick={()=>setView(n.id)}>
                <Icon d={n.icon} size={17}/>{n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-badge">
              <div className="u-av">{(user.name||user.email)[0].toUpperCase()}</div>
              <div className="u-info">
                <p>{user.name||user.email}</p>
                <span>{user.role}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <Icon d={I.logout} size={16}/> Sign Out
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="page-header">
            {view==="calendar"
              ?<><h1>✨ Event Calendar</h1><p>Manage and track your upcoming floral events</p></>
              :<><h1>🌹 Flower Inventory</h1><p>{isAdmin?"Admin view — manage stock and freshness":"Inventory view"}</p></>
            }
          </div>
          {view==="calendar"&&<CustomerDashboard user={user}/>}
          {view==="inventory"&&<AdminDashboard/>}
        </main>
      </div>
    </>
  );
}
