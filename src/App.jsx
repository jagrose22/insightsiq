import React, { useState, useEffect } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const C = {
  pageBg:      "#F0F2F8",
  cardBg:      "#FFFFFF",
  headerBg:    "#12172A",
  inputBg:     "#F3F4F8",
  rowAlt:      "#FAFBFD",
  brand:       "#6941F2",
  brandL:      "#8B67F5",
  brandDim:    "#EDE9FE",
  brandBorder: "#C4B5FD",
  red:    "#DC2626", redBg:   "#FEF2F2", redBorder:  "#FECACA",
  amber:  "#D97706", amberBg: "#FFFBEB", amberBorder:"#FCD34D",
  green:  "#059669", greenBg: "#F0FDF4", greenBorder:"#86EFAC",
  blue:   "#2563EB", blueBg:  "#EFF6FF", blueBorder: "#BFDBFE",
  cyan:   "#0891B2",
  t1: "#0F172A", t2: "#334155", t3: "#64748B", t4: "#94A3B8", t5: "#CBD5E1", t6: "#E2E8F0",
  border:   "#E2E8F0",
  shadow:   "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
  shadowMd: "0 4px 16px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)",
  shadowLg: "0 8px 32px rgba(15,23,42,0.10), 0 4px 8px rgba(15,23,42,0.06)",
  mono:     "'IBM Plex Mono', monospace",
};

const PHASE_CFG = {
  SEE:       { bg:"#EDE9FE", color:"#6941F2", border:"#C4B5FD", dot:"#7C3AED" },
  PRIORITISE:{ bg:"#FEF2F2", color:"#DC2626", border:"#FECACA", dot:"#EF4444" },
  FIX:       { bg:"#FFFBEB", color:"#D97706", border:"#FCD34D", dot:"#F59E0B" },
  PROVE:     { bg:"#F0FDF4", color:"#059669", border:"#86EFAC", dot:"#10B981" },
  PREVENT:   { bg:"#EFF6FF", color:"#2563EB", border:"#BFDBFE", dot:"#3B82F6" },
};

function Phase({ label }) {
  const p = PHASE_CFG[label] || PHASE_CFG.SEE;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:9,fontFamily:C.mono,
      background:p.bg,color:p.color,border:`1px solid ${p.border}`,borderRadius:4,
      padding:"2px 8px",fontWeight:700,letterSpacing:0.8,whiteSpace:"nowrap"}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:p.dot,flexShrink:0,display:"inline-block"}}/>
      {label}
    </span>
  );
}

const ANN_CFG = {
  backed:{ label:"✓ Current data",   bg:C.greenBg, color:C.green, border:C.greenBorder },
  new:   { label:"⬡ New model",      bg:C.amberBg, color:C.amber, border:C.amberBorder },
  ui:    { label:"◈ UI composition", bg:C.blueBg,  color:C.blue,  border:C.blueBorder  },
};
function Ann({ type }) {
  const a = ANN_CFG[type];
  return <span style={{fontSize:9,fontFamily:C.mono,background:a.bg,color:a.color,
    border:`1px solid ${a.border}`,borderRadius:3,padding:"2px 6px",marginLeft:4,
    verticalAlign:"middle",letterSpacing:0.3,whiteSpace:"nowrap"}}>{a.label}</span>;
}

function Rag({ s }) {
  const m = {
    red:  [C.red,  C.redBg,   C.redBorder,   "HIGH RISK"],
    amber:[C.amber,C.amberBg, C.amberBorder,  "AT RISK"  ],
    green:[C.green,C.greenBg, C.greenBorder,  "HEALTHY"  ],
  };
  const [c,bg,b,l] = m[s] || [C.t3,"#F8FAFC",C.border,"—"];
  return (
    <span style={{fontSize:9,fontFamily:C.mono,background:bg,color:c,
      border:`1px solid ${b}`,borderRadius:4,padding:"2px 8px",fontWeight:700,
      display:"inline-flex",alignItems:"center",gap:4}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:c,display:"inline-block"}}/>
      {l}
    </span>
  );
}

function StatusChip({ s }) {
  const m = {
    Unassigned:[C.t3, "#F8FAFC",  C.border,       "●"],
    InProgress:[C.amber, C.amberBg, C.amberBorder, "●"],
    Mitigated: [C.green, C.greenBg, C.greenBorder, "●"],
    Active:    [C.red,   C.redBg,   C.redBorder,   "●"],
  };
  const [c,bg,b,dot] = m[s] || [C.t3,"#F8FAFC",C.border,"●"];
  return <span style={{fontSize:10,background:bg,color:c,border:`1px solid ${b}`,
    borderRadius:4,padding:"2px 9px",display:"inline-flex",alignItems:"center",gap:4}}>
    <span style={{color:c,fontSize:8}}>{dot}</span>{s}
  </span>;
}

const PRODUCER_TIER = {
  "Wyndham Hotels":        "top",
  "IHG Hotels & Resorts":  "top",
  "Choice Hotels":         "top",
  "Hilton Worldwide":      "top",
  "Marriott International":"top",
  "Omni Hotels & Resorts": "mid",
  "Hyatt Hotels":          "mid",
  "Best Western Hotels":   "mid",
};

function ProducerTier({ name }) {
  const t = PRODUCER_TIER[name] || "low";
  const cfg = {
    top: { label:"TOP PRODUCER",  color:C.green, bg:C.greenBg,  border:C.greenBorder  },
    mid: { label:"MID PRODUCER",  color:C.amber, bg:C.amberBg,  border:C.amberBorder  },
    low: { label:"LOW PRODUCER",  color:C.t3,    bg:"#F8FAFC",  border:C.border        },
  }[t];
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:9,
      fontFamily:C.mono,background:cfg.bg,color:cfg.color,
      border:`1px solid ${cfg.border}`,borderRadius:4,
      padding:"2px 8px",fontWeight:700,letterSpacing:0.8,whiteSpace:"nowrap"}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:cfg.color,
        flexShrink:0,display:"inline-block"}}/>
      {cfg.label}
    </span>
  );
}

function Trend({ v, invert=false }) {
  const good = invert ? v<0 : v>0;
  return <span style={{fontSize:10,color:good?C.green:C.red,fontFamily:C.mono,fontWeight:700,
    display:"inline-flex",alignItems:"center",gap:1}}>
    {v>0?"▲":"▼"} {Math.abs(v)}%
  </span>;
}

function Spark({ data, color, w=100, h=32 }) {
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rng)*(h-6)-3}`).join(" ");
  const lx=w, ly=h-((data[data.length-1]-mn)/rng)*(h-6)-3;
  const gid=`sg${color.replace(/[^a-z0-9]/gi,"")}${w}`;
  return (
    <svg width={w} height={h} style={{overflow:"visible",flexShrink:0,display:"block"}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18}/>
          <stop offset="100%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={`url(#${gid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={lx} cy={ly} r={3.5} fill={C.cardBg} stroke={color} strokeWidth={2}/>
    </svg>
  );
}

let _setToast = null;
export function useToast() {
  return (msg, type="success") => _setToast && _setToast({ msg, type, id: Date.now() });
}
function ToastHost() {
  const [toast, setToast] = useState(null);
  _setToast = setToast;
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  const colors = { success:[C.green,C.greenBg,C.greenBorder], error:[C.red,C.redBg,C.redBorder], info:[C.brand,C.brandDim,C.brandBorder] };
  const [c,bg,b] = colors[toast.type] || colors.info;
  return (
    <div className="toast-in" style={{position:"fixed",bottom:24,right:24,zIndex:9999,
      background:bg,border:`1px solid ${b}`,borderLeft:`3px solid ${c}`,
      borderRadius:10,padding:"11px 16px",boxShadow:C.shadowLg,
      display:"flex",alignItems:"center",gap:10,maxWidth:320,pointerEvents:"none"}}>
      <span style={{fontSize:14}}>{toast.type==="success"?"✓":toast.type==="error"?"✕":"ℹ"}</span>
      <span style={{fontSize:13,color:C.t1,fontWeight:500,lineHeight:1.4}}>{toast.msg}</span>
    </div>
  );
}

function Donut({ pct, color, size=80, label, sub }) {
  const r=30, cx=40, cy=40, circ=2*Math.PI*r;
  const dash = (pct/100)*circ;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <div style={{position:"relative",width:size,height:size}}>
        <svg width={size} height={size} viewBox="0 0 80 80">
          <circle cx={cx} cy={cy} r={r} fill={color+"08"} stroke="none"/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.t6} strokeWidth={8}/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 40 40)" style={{transition:"stroke-dasharray 0.6s ease"}}/>
          <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize={15} fontFamily={C.mono} fontWeight={700}>{pct}</text>
        </svg>
      </div>
      {label && <div style={{fontSize:10,color:C.t2,fontWeight:600,textAlign:"center"}}>{label}</div>}
      {sub   && <div style={{fontSize:9, color:C.t3,textAlign:"center"}}>{sub}</div>}
    </div>
  );
}

function IconBadge({ icon, color, size=32 }) {
  return (
    <div style={{width:size,height:size,borderRadius:8,
      background:`linear-gradient(135deg,${color}22,${color}11)`,
      border:`1px solid ${color}33`,display:"flex",alignItems:"center",
      justifyContent:"center",fontSize:size*0.45,flexShrink:0}}>{icon}</div>
  );
}

function SH({ phase, title, ann, right, sub }) {
  const p = PHASE_CFG[phase] || PHASE_CFG.SEE;
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
      <div style={{width:3,height:sub?32:20,background:p.color,borderRadius:2,flexShrink:0,marginTop:2}}/>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:700,color:C.t1,fontFamily:"'DM Sans',sans-serif"}}>{title}</span>
          <Phase label={phase}/>
          {ann && <Ann type={ann}/>}
          {right && <div style={{marginLeft:"auto"}}>{right}</div>}
        </div>
        {sub && <div style={{fontSize:11,color:C.t3,marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );
}

function Card({ children, style={}, accent, onClick, selected }) {
  return (
    <div onClick={onClick} style={{
      background:C.cardBg,
      border:`1px solid ${selected ? C.brand : C.border}`,
      borderTop: accent ? `3px solid ${accent}` : undefined,
      borderLeft: selected ? `3px solid ${C.brand}` : undefined,
      borderRadius:12,
      boxShadow: selected ? `0 0 0 2px ${C.brand}22, ${C.shadowMd}` : C.shadow,
      overflow:"hidden",
      transition:"box-shadow 0.15s, border-color 0.15s",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>
      {children}
    </div>
  );
}

function KpiTile({ label, value, sub, accent, spark, ann, badge }) {
  return (
    <div style={{
      background:`linear-gradient(145deg, ${C.cardBg} 60%, ${accent}08 100%)`,
      border:`1px solid ${C.border}`,
      borderTop:`3px solid ${accent}`,
      borderRadius:12,
      padding:"16px 18px",
      boxShadow:C.shadow,
    }}>
      <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,marginBottom:10,
        display:"flex",alignItems:"center",gap:4,textTransform:"uppercase"}}>
        {label}{ann && <Ann type={ann}/>}
        {badge && <span style={{marginLeft:"auto",fontSize:9,background:accent+"18",
          color:accent,border:`1px solid ${accent}33`,borderRadius:3,padding:"1px 6px",
          fontWeight:700,fontFamily:C.mono}}>{badge}</span>}
      </div>
      <div style={{fontSize:28,fontWeight:800,color:C.t1,fontFamily:C.mono,
        letterSpacing:"-0.8px",lineHeight:1,marginBottom:sub?6:0}}>{value}</div>
      {sub && <div style={{fontSize:11,color:C.t3,lineHeight:1.4,marginBottom:spark?8:0}}>{sub}</div>}
      {spark && <Spark data={spark} color={accent} w={130} h={30}/>}
    </div>
  );
}

function LoopBar({ active }) {
  const steps = ["SEE","PRIORITISE","FIX","PROVE","PREVENT"];
  const idx   = steps.indexOf(active);
  return (
    <div style={{background:"#FAFBFD",borderBottom:`1px solid ${C.border}`,
      padding:"0 20px",height:36,display:"flex",alignItems:"center",
      gap:0,overflowX:"auto",flexShrink:0}}>
      {steps.map((s,i) => {
        const p    = PHASE_CFG[s];
        const done = i <= idx;
        const cur  = i === idx;
        return (
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"0 12px",
              height:35,fontSize:9,fontFamily:C.mono,fontWeight:700,
              color:done?p.color:C.t5,letterSpacing:0.6,
              borderBottom:`2px solid ${done?p.color:"transparent"}`,
              background:cur?p.bg:"transparent",
              borderRadius:cur?"4px 4px 0 0":undefined,
              transition:"all 0.2s",whiteSpace:"nowrap",userSelect:"none"}}>
              <span className={cur?"live-dot":undefined}
                style={{width:6,height:6,borderRadius:"50%",
                  background:done?p.color:C.t5,flexShrink:0,
                  boxShadow:done?`0 0 0 3px ${p.color}22`:undefined,
                  transition:"all 0.2s"}}/>
              {s}
            </div>
            {i<steps.length-1 && (
              <div style={{width:20,height:1,
                background:i<idx?`linear-gradient(90deg,${PHASE_CFG[steps[i]].color}66,${PHASE_CFG[steps[i+1]].color}44)`:C.t6,
                flexShrink:0}}/>
            )}
          </div>
        );
      })}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,
        fontSize:9,color:C.t4,fontFamily:C.mono,whiteSpace:"nowrap",flexShrink:0}}>
        <span style={{width:5,height:5,borderRadius:"50%",background:C.green,
          animation:"dotPulse 2s ease-in-out infinite",display:"inline-block"}}/>
        08:47 · next in 8m
      </div>
    </div>
  );
}

const ENTERPRISE_ACCOUNTS = [
  { id:1,  name:"Best Western Hotels",    short:"Best Western" },
  { id:2,  name:"Choice Hotels",          short:"Choice"       },
  { id:3,  name:"Hilton Worldwide",       short:"Hilton"       },
  { id:4,  name:"Hyatt Hotels",           short:"Hyatt"        },
  { id:5,  name:"IHG Hotels & Resorts",   short:"IHG"          },
  { id:6,  name:"Marriott International", short:"Marriott"     },
  { id:7,  name:"Omni Hotels & Resorts",  short:"Omni"         },
  { id:8,  name:"Wyndham Hotels",         short:"Wyndham"      },
];

const ACCOUNT_BRANDS = {
  "Best Western Hotels": [
    "WorldHotels Luxury","WorldHotels Elite","WorldHotels Crafted","WorldHotels Distinctive",
    "BW Premier Collection","BW Signature Collection","Vib","Aiden","Sadie",
    "Best Western Premier","Best Western Plus","Best Western","GLo",
    "SureStay Hotel","SureStay Collection","Executive Residency","@HOME","SureStay Studio",
  ],
  "Choice Hotels": [
    "Radisson Collection","Radisson Blu","Radisson","Park Plaza by Radisson",
    "Ascend Hotel Collection","Cambria Hotels","Park Inn by Radisson",
    "Country Inn & Suites","Clarion","Clarion Pointe","Comfort Inn","Comfort Suites",
    "Quality Inn","Sleep Inn","Econo Lodge","Rodeway Inn",
    "Everhome Suites","MainStay Suites","Suburban Studios","WoodSpring Suites",
  ],
  "IHG Hotels & Resorts": [
    "Six Senses","Regent Hotels & Resorts","InterContinental","Vignette Collection",
    "Kimpton","Hotel Indigo","Noted Collection","Crowne Plaza","voco Hotels",
    "Ruby Hotels","HUALUXE","EVEN Hotels","Holiday Inn","Holiday Inn Express",
    "avid hotels","Garner","Atwell Suites","Staybridge Suites","Candlewood Suites",
    "Holiday Inn Club Vacations","Iberostar Beachfront Resorts",
  ],
  "Hilton Worldwide": [
    "Waldorf Astoria","LXR Hotels & Resorts","Conrad","Signia by Hilton","NoMad Hotels",
    "Canopy by Hilton","Graduate by Hilton","Tempo by Hilton","Motto by Hilton",
    "Hilton Hotels & Resorts","DoubleTree by Hilton","Curio Collection",
    "Tapestry Collection","Outset Collection","Embassy Suites","Homewood Suites",
    "Home2 Suites","LivSmart Studios","Hilton Garden Inn","Hampton by Hilton",
    "Tru by Hilton","Spark by Hilton","Hilton Grand Vacations",
    "Small Luxury Hotels","AutoCamp",
  ],
  "Hyatt Hotels": [
    "Park Hyatt","Miraval","Alila","Impression by Secrets","Unbound Collection","Atona",
    "Andaz","Thompson Hotels","The Standard","JdV by Hyatt","Bunkhouse Hotels",
    "Dream Hotels","me and all Hotels","Breathless Resorts",
    "Hyatt Ziva","Hyatt Zilara","Hyatt Vivid","Dreams Resorts","Secrets Resorts",
    "Alua Hotels & Resorts","Sunscape Resorts","Zoetry Wellness",
    "Grand Hyatt","Hyatt Regency","Hyatt","Hyatt Centric","Destination by Hyatt",
    "Hyatt Vacation Club","Hyatt Place","Hyatt House","Caption by Hyatt","Hyatt Studios",
  ],
  "Marriott International": [
    "The Ritz-Carlton","Ritz-Carlton Reserve","St. Regis","The Luxury Collection",
    "Edition Hotels","JW Marriott","W Hotels","Bvlgari Hotels",
    "Marriott Hotels","Sheraton","Westin","Renaissance Hotels","Le Meridien",
    "Delta Hotels","Marriott Vacation Clubs","Gaylord Hotels","CitizenM",
    "Autograph Collection","Design Hotels","Tribute Portfolio","MGM Collection",
    "AC Hotels","Aloft Hotels","Courtyard","Fairfield","Four Points by Sheraton",
    "Moxy Hotels","Protea Hotels","SpringHill Suites","City Express","Series by Marriott",
    "Residence Inn","TownePlace Suites","Element","Marriott Executive Apartments",
    "Apartments by Marriott Bonvoy","Homes & Villas","StudioRes",
  ],
  "Omni Hotels & Resorts": [
    "Omni Hotels & Resorts",
  ],
  "Wyndham Hotels": [
    "Registry Collection","Dolce Hotels and Resorts","Wyndham Hotels and Resorts",
    "Wyndham Grand","TRYP by Wyndham","Dazzler by Wyndham","Esplendor by Wyndham",
    "Trademark Collection","Vienna House","Ramada","Wyndham Garden","Wingate",
    "La Quinta","Baymont","AmericInn","Days Inn","Howard Johnson","Super 8",
    "Travelodge","Microtel","Hawthorn Suites","WaterWalk Extended Stay",
    "Wyndham Alltra","Club Wyndham","WorldMark",
    "Margaritaville Vacation Club","Shell Vacations Club",
  ],
};

// Demo defaults
const DEFAULT_CLIENT    = "Wyndham Hotels";
const DEFAULT_PARTNERS  = ["Hotel Key","Tricept"];
const DEFAULT_BRANDS    = ["All Brands"];

// Auto-select partners per account (from real pairing data)
const ACCOUNT_PARTNER_MAP = {
  "Wyndham Hotels":         ["Hotel Key","Tricept"],
  "Best Western Hotels":    ["Delta Vacation"],
  "Choice Hotels":          ["Agoda"],
  "Hilton Worldwide":       ["British Airways"],
  "Hyatt Hotels":           ["Trisept Solutions"],
  "Marriott International": ["British Airways"],
  "IHG Hotels & Resorts":   ["Hotel Tonight"],
  "Omni Hotels & Resorts":  ["Agoda"],
};

const DEMAND_PARTNERS = [
  "Agoda","Airbnb","Booking.com","British Airways",
  "Delta Vacation","Despegar","Expedia",
  "Hopper Capital One","Hopper Travel Services",
  "Hotel Key","Hotel Tonight","Intel","MMT","Sabre",
  "Tricept","Traveloka","Trisept Solutions","Trip.com",
];

// Wyndham Account View — Brand Health Grid data
const WYNDHAM_BRANDS = [
  { brand: "Registry Collection", tier: "Luxury", health: 82, err: 2.1, rag: "green", properties: 12 },
  { brand: "Dolce Hotels", tier: "Upscale", health: 74, err: 4.2, rag: "amber", properties: 28 },
  { brand: "Wyndham Hotels & Resorts", tier: "Upscale", health: 71, err: 5.8, rag: "amber", properties: 214 },
  { brand: "Wyndham Grand", tier: "Upscale", health: 78, err: 3.4, rag: "amber", properties: 55 },
  { brand: "TRYP by Wyndham", tier: "Lifestyle", health: 68, err: 7.2, rag: "amber", properties: 96 },
  { brand: "Vienna House", tier: "Boutique", health: 73, err: 4.8, rag: "amber", properties: 41 },
  { brand: "Trademark Collection", tier: "Lifestyle", health: 58, err: 11.4, rag: "red", properties: 87 },
  { brand: "La Quinta", tier: "Midscale", health: 48, err: 13.5, rag: "red", properties: 912 },
  { brand: "Ramada", tier: "Midscale", health: 44, err: 14.2, rag: "red", properties: 783 },
  { brand: "Days Inn", tier: "Economy", health: 31, err: 18.4, rag: "red", properties: 1847 },
  { brand: "Super 8", tier: "Economy", health: 29, err: 19.2, rag: "red", properties: 2203 },
  { brand: "Howard Johnson", tier: "Economy", health: 35, err: 16.9, rag: "red", properties: 421 },
  { brand: "Hawthorn Suites", tier: "Extended Stay", health: 67, err: 7.8, rag: "amber", properties: 128 },
  { brand: "Wyndham Alltra", tier: "All-Inclusive", health: 76, err: 3.8, rag: "amber", properties: 22 },
];

// Wyndham Account View — Demand Partners data
const WYNDHAM_DEMAND_PARTNERS = [
  { name: "Tek Travel", bookings: 16737, type: "Aggregator" },
  { name: "HotelTonight", bookings: 14973, type: "OTA" },
  { name: "Trisept Partners", bookings: 6127, type: "Leisure Pkg" },
  { name: "Hotwire", bookings: 4385, type: "OTA" },
  { name: "Entertainment Benefits", bookings: 4095, type: "Benefits" },
  { name: "Trisept Solutions", bookings: 720, type: "Leisure Pkg" },
];

const WYNDHAM_DEMAND_PARTNERS_EXTENDED = [
  { name: "Delta Vacations", bookings: 427, type: "Leisure Pkg" },
  { name: "British Airways", bookings: 127, type: "Airline" },
  { name: "Inntel UD Interface", bookings: 307, type: "GDS" },
];

// Wyndham — properties with content critical errors (images below threshold)
// Source: POC-Wyndham_Missing_Property_List.xlsx — 202 properties, 14 brands
const WYNDHAM_CONTENT_ERRORS = [
  { brand:"DI", label:"Days Inn", count:47, properties:[{pid:6342,name:"Days Hotel Batangas"},{pid:17777,name:"Test Days Inn Wilkesboro Vickie"},{pid:32642,name:"Days Inn Athabasca"},{pid:45670,name:"Days Hotel Suites Liangping"},{pid:46139,name:"Days Hotel by Wyndham Cebu Toledo"},{pid:47433,name:"Days Inn Panguitch"},{pid:48550,name:"Days Hotel Suites Ivy Zunyi"},{pid:48556,name:"Days Hotel & Suites Jinzheng Shijiazhuang"},{pid:48909,name:"Days Hotel Wuhu Anqi"},{pid:49999,name:"Test Days Inn Wilkesboro"},{pid:50007,name:"Days Hotel Hainan Baoting"},{pid:50121,name:"Days Hotel by Wyndham Reno Airport"},{pid:51027,name:"Days Inn Guangzhou Boju"},{pid:52184,name:"Days Inn by Wyndham Wuxi Shengma"},{pid:55941,name:"Days Inn & Suites Kansas City Downtown"},{pid:4838,name:"Days Inn West Memphis"},{pid:5393,name:"Days Inn Wagoner"},{pid:55674,name:"DI Plattsburgh"},{pid:56415,name:"Days Inn by Wyndham Oklahoma City Bricktown"},{pid:56931,name:"DI Lamont"},{pid:284,name:"DI Dothan"},{pid:2407,name:"Days Inn by Wyndham Thomson"},{pid:11040,name:"Days Inn Donalsonville"},{pid:33866,name:"Days Inn City Centre Xian"},{pid:48554,name:"Days Hotel Xinjinyue Fuzhou"},{pid:48907,name:"Days Inn by Wyndham Panyu"},{pid:48921,name:"Days Hotel by Wyndham Shishi Fujian"},{pid:50899,name:"Days Inn Fuzhou Woer"},{pid:50978,name:"Days Hotel Chongqing Kaichuang"},{pid:51863,name:"DI King Winston Salem Area"},{pid:54328,name:"Days Inn Indianapolis South"},{pid:54833,name:"DI Pocatello"},{pid:55934,name:"Days Inn by Wyndham Shreveport"},{pid:5263,name:"DI Chrlstn Arprt"},{pid:47217,name:"Days Inn Hot Springs"},{pid:48460,name:"Days Inn by Wyndham Jacksonville Baymeadows"},{pid:48561,name:"Days Hotel Shanxi Xinzhou"},{pid:50320,name:"Days Inn Abilene"},{pid:54209,name:"Days Inn Brawley"},{pid:56085,name:"Days Inn by Wyndham Canadian"},{pid:57586,name:"Days Inn & Suites Summerside"},{pid:60242,name:"Days Inn Suites Colorado City"}] },
  { brand:"HJ", label:"Howard Johnson", count:31, properties:[{pid:18272,name:"HJ Spokane"},{pid:19979,name:"Howard Johnson by Wyndham Piedras Moras"},{pid:46298,name:"Howard Johnson Tianzhu Fuyang"},{pid:46320,name:"Howard Johnson Shipu Ningbo"},{pid:46321,name:"Howard Johnson by Wyndham Minmetals Plaza Yingkou"},{pid:47192,name:"Howard Johnson Qinlu Yingtan"},{pid:47227,name:"HO JO Xiushan Plaza Chongqing"},{pid:47917,name:"Howard Johnson by Wyndham Chilecito Hotel"},{pid:49329,name:"Howard Johnson by Wyndham Neuquen"},{pid:49422,name:"Howard Johnson Jinyi Hotel Cho"},{pid:49423,name:"Howard Johnson Zunyue Hotel Ch"},{pid:49432,name:"Howard Johnson by Wyndham Riverview Hotel Guangzhou"},{pid:49433,name:"Howard Johnson by Wyndham Shenyang Jinlian"},{pid:49555,name:"Howard Johnson by Wyndham City of Flower Kunming"},{pid:50120,name:"Howard Johnson Huizhou"},{pid:50440,name:"Howard Johnson by Wyndham Tianmu Lake Plaza Liyang"},{pid:50519,name:"Howard Johnson by Wyndham Life Mountain View Chengdu"},{pid:50829,name:"Howard Johnson by Wyndham Huaihai Resort Lushan"},{pid:51358,name:"Howard Johnson by Wyndham Life Parkview Yuqing"},{pid:53469,name:"HoJo Downtown Gatlinburg"},{pid:58620,name:"HJ Upark Business Club Chengdu"},{pid:32760,name:"Howard Johnson by Wyndham Ezeiza Convention Center"},{pid:52475,name:"HoJo Dream Sea Resort Weihai"},{pid:59317,name:"Howard Johnson Maitreya Plaza"},{pid:46981,name:"Howard Johnson Trenque Lauquen"},{pid:50521,name:"Howard Johnson by Wyndham La Plata"},{pid:15029,name:"Howard Johnson by Wyndham Rio Ceballos"},{pid:15243,name:"Howard Johnson Plaza Guiyang"},{pid:45501,name:"HoJo Lake George"},{pid:48482,name:"Howard Johnson Dammam Hotel"},{pid:58644,name:"Howard Johnson Azusa"}] },
  { brand:"SE", label:"Super 8", count:31, properties:[{pid:3637,name:"SE Chisago City"},{pid:8089,name:"Super 8 by Wyndham Kelso Longview Area"},{pid:16355,name:"Super 8 by Wyndham Yangtse River Qingshan"},{pid:50213,name:"Super 8 by Wyndham Vancouver"},{pid:50577,name:"Super 8 by Wyndham Chengde"},{pid:53550,name:"Super 8 by Wyndham Beijing Xin Tian Tan"},{pid:9818,name:"Travelodge Florence"},{pid:58556,name:"Super 8 Florence OR"},{pid:3562,name:"Super 8 by Wyndham Lewiston"},{pid:3581,name:"Super 8 Milbank SD"},{pid:8372,name:"SE Chenoa"},{pid:8458,name:"Super 8 Canton TX"},{pid:32127,name:"Super 8 by Wyndham Jilin Beijing Lu"},{pid:48496,name:"Super 8 by Wyndham Zhongshan"},{pid:53488,name:"Super 8 Sonora"},{pid:54339,name:"Super 8 by Wyndham Koblenz"},{pid:3695,name:"Ramada York Harrisburg Hershey"},{pid:32267,name:"Super 8 Brooks"},{pid:47445,name:"Super 8 by Wyndham Hangzhou"},{pid:51850,name:"Super 8 Kenedy"},{pid:53608,name:"Super 8 Great Bend"},{pid:54194,name:"Super 8 Asheville/Biltmore"},{pid:56981,name:"SE Penticton"},{pid:57032,name:"Super 8 Vancouver East"},{pid:58032,name:"Super 8 Big Spring TX"},{pid:58977,name:"Super 8 Tracy"},{pid:60125,name:"Super 8 Aurora East"},{pid:60128,name:"Super 8 Livermore"},{pid:60132,name:"Super 8 Santa Clara"},{pid:65312,name:"Super 8 Mesa Downtown"}] },
  { brand:"TL", label:"Travelodge", count:29, properties:[{pid:2490,name:"TL Bellmawr"},{pid:9454,name:"Travelodge by Wyndham Forest Grove Hillsboro"},{pid:46818,name:"Travelodge by Wyndham Harriman"},{pid:51260,name:"Travelodge Raton"},{pid:58488,name:"Red Arrow Inn and Suites TL"},{pid:57195,name:"TL Rockford South"},{pid:9565,name:"Travelodge New Philadelphia"},{pid:14034,name:"Travelodge Winnipeg Airport"},{pid:25637,name:"Travelodge by Wyndham Stockbridge Atlanta South"},{pid:51271,name:"Travelodge Ogallala"},{pid:54386,name:"Travelodge Farmington"},{pid:54823,name:"TL Grand Rapids N"},{pid:56327,name:"TL Roanoke"},{pid:57710,name:"TL Canyonville"},{pid:4341,name:"Travelodge by Wyndham Pocatello"},{pid:4410,name:"Travelodge Odessa"},{pid:9676,name:"Travelodge by Wyndham Vancouver Lions Gate"},{pid:10238,name:"Travelodge Johnson Chehalis"},{pid:33968,name:"Travelodge Green River UT"},{pid:40130,name:"Days Inn Tiffin"},{pid:50278,name:"Travelodge Rosetown"},{pid:50495,name:"Travelodge Sacramento Convention"},{pid:53581,name:"Travelodge Ozone Park"},{pid:53582,name:"Travelodge by Wyndham Blythe"},{pid:54352,name:"Travelodge by Wyndham Downtown Gatlinburg"},{pid:54380,name:"Travelodge Benton Harbor MI"},{pid:58034,name:"Travelodge Carlisle North"},{pid:59859,name:"Days Inn Dumas Arkansas"},{pid:60430,name:"Primm Valley Travelodge"}] },
  { brand:"RA", label:"Ramada", count:20, properties:[{pid:19175,name:"Ramada by Wyndham Al Khobar King Abdullah Street"},{pid:20092,name:"Ramada by Wyndham Pueblo"},{pid:53536,name:"Ramada Changsha Downtown"},{pid:54037,name:"Ramada Halong Bay View"},{pid:56426,name:"Ramada Cheltenham"},{pid:58006,name:"Ramada Coxs Bazar"},{pid:46890,name:"Ramada by Wyndham Sulaymaniyah"},{pid:48658,name:"Ramada by Wyndham Gunsan"},{pid:49811,name:"Ramada Yongin"},{pid:60002,name:"Ramada Kirkland Lake"},{pid:32021,name:"Ramada Buenos Aires"},{pid:49872,name:"Rockville RAM"},{pid:50051,name:"Ramada Hotel & Resort by Wyndham GyeongJu"},{pid:54721,name:"Ramada by Wyndham Southfield"},{pid:54993,name:"Ramada Nashville/Music Valley"},{pid:55410,name:"Ramada Gumi"},{pid:48189,name:"Ramada by Wyndham Jeju Hamdeok"},{pid:49938,name:"Ramada Encore Gimpo Han River"},{pid:51161,name:"Ramada Michigan City"},{pid:57701,name:"Ramada Kingston"}] },
  { brand:"BU", label:"Baymont", count:14, properties:[{pid:10397,name:"Baymont by Wyndham Rock Springs"},{pid:17905,name:"Baymont Paducah"},{pid:46817,name:"Baymont Inn and Suites Harriman"},{pid:52707,name:"Baymont Fort Myers Central"},{pid:57563,name:"Baymont Bessemer"},{pid:37020,name:"Baymont Harlan"},{pid:36657,name:"BU Willow Park"},{pid:50700,name:"Baymont Mt Vernon"},{pid:54024,name:"Baymont by Wyndham Ferndale/Royal Oak"},{pid:55481,name:"Baymont by Wyndham Cedar City"},{pid:58555,name:"River House Inn Baymont"},{pid:58786,name:"Baymont Bakersfield"},{pid:60466,name:"Baymont Iowa Lake Charles"}] },
  { brand:"TC", label:"Trademark Collection", count:8, properties:[{pid:54042,name:"Chateau Bedford"},{pid:57788,name:"LTC"},{pid:6950,name:"Lux Hotel and Spa Trademark"},{pid:51487,name:"Flamingo Las Vegas Trademark Collection"},{pid:15531,name:"The Hotel Pendleton Trademark"},{pid:12960,name:"Ramada Plaza by Wyndham Sault Ste. Marie"},{pid:56440,name:"HYPERION Hotel Salzburg"},{pid:58066,name:"H2 Hotel Wien"}] },
  { brand:"WY", label:"Wyndham Hotels", count:8, properties:[{pid:48072,name:"Wyndham Garden Charleston Civic Center"},{pid:51590,name:"Wyndham Ribeirao Preto"},{pid:57464,name:"Wyndham Grand Ninh Binh"},{pid:55418,name:"Wyndham Garden Nagaizumi"},{pid:56852,name:"Wyndham Garden Wuhan West"},{pid:49087,name:"Wyndham Garden LaGuardia South"},{pid:59272,name:"Wyndham Flint Grand Blanc Conf"}] },
  { brand:"WG", label:"Wingate by Wyndham", count:4, properties:[{pid:50195,name:"Wingate by Wyndham Anaheim"},{pid:51450,name:"Wingate by Wyndham Mentor OH"},{pid:47023,name:"Wingate by Wyndham Foshan Sanshui"},{pid:59083,name:"Wingate St. Louis Fenton Rt.66"}] },
  { brand:"MI", label:"Microtel", count:4, properties:[{pid:30918,name:"Microtel Rawlins"},{pid:27713,name:"Baymont Henrietta/Rochester"},{pid:30920,name:"Microtel by Wyndham Cabanatuan"},{pid:47105,name:"Microtel by Wyndham General Santos"}] },
  { brand:"BH", label:"Hawthorn / Wyndham Garden", count:3, properties:[{pid:47950,name:"Wyndham Garden Manama"},{pid:58456,name:"Hawthorn Xishuang Banna Jingho"},{pid:59982,name:"Hawthorn Kilgore"}] },
  { brand:"LQ", label:"La Quinta", count:1, properties:[{pid:1033,name:"La Quinta Inn Ste Jackson"}] },
  { brand:"DX", label:"Dazzler by Wyndham", count:1, properties:[{pid:54659,name:"Akti Imperial Hotel Convention"}] },
  { brand:"AA", label:"AmericInn", count:1, properties:[{pid:55749,name:"AmericInn Memphis East"}] },
];


const BRAND_MAP = {
  "Best Western Hotels":    ["All Brands","Best Western Plus","Best Western Premier"],
  "Choice Hotels":          ["All Brands","Cambria Hotels","Comfort Inn"],
  "IHG Hotels & Resorts":   ["All Brands","Holiday Inn","InterContinental Hotels & Resorts"],
  "Hilton Worldwide":        ["All Brands","Hampton by Hilton","Hilton Hotels & Resorts"],
  "Hyatt Hotels":            ["All Brands","Grand Hyatt","Hyatt Regency"],
  "Wyndham Hotels":          ["All Brands","Ramada","Wyndham Hotels & Resorts"],
  "Marriott International":  ["All Brands","Courtyard by Marriott","Marriott Hotels"],
  "Omni Hotels & Resorts":   ["All Brands","Omni Hotels & Resorts","Omni PGA Frisco Resort"],
};

const TENANTS = [
  { id:1, name:"Omni Hotels & Resorts",   type:"Enterprise", health:61, err:8.1, arr:4.2, trend:-4,  status:"InProgress", rag:"amber", owner:"Priya S.",  leversRed:3 },
  { id:2, name:"Best Western Hotels",     type:"Enterprise", health:55, err:9.4, arr:3.8, trend:-6,  status:"InProgress", rag:"amber", owner:"Lisa K.",   leversRed:4 },
  { id:3, name:"Choice Hotels",           type:"Enterprise", health:78, err:3.4, arr:2.1, trend:+6,  status:"Mitigated",  rag:"green", owner:"Lisa K.",   leversRed:0 },
  { id:4, name:"IHG Hotels & Resorts",    type:"Enterprise", health:71, err:5.6, arr:4.1, trend:+2,  status:"Mitigated",  rag:"green", owner:"Marcus T.", leversRed:0 },
  { id:5, name:"Hyatt Hotels",            type:"Enterprise", health:66, err:6.8, arr:5.2, trend:-2,  status:"InProgress", rag:"amber", owner:"Priya S.",  leversRed:2 },
  { id:6, name:"Hilton Worldwide",        type:"Enterprise", health:44, err:12.7,arr:6.8, trend:-11, status:"Active",     rag:"red",   owner:"Marcus T.", leversRed:6 },
  { id:7, name:"Marriott International",  type:"Enterprise", health:59, err:7.9, arr:7.2, trend:-3,  status:"InProgress", rag:"amber", owner:"Lisa K.",   leversRed:2 },
  { id:8, name:"Wyndham Hotels",          type:"Enterprise", health:38, err:15.2,arr:5.9, trend:-14, status:"Unassigned", rag:"red",   owner:"—",         leversRed:7 },
];
const ERROR_CLUSTERS = [
  { id:"E1", name:"ARI Sync Failure — Expedia",           type:"ARI",     freq:247,tenants:3,trend:-18,impact:"$28.4K/day",sev:"red",  bars:[12,18,22,15,31,28,24,47,38,41,52,47] },
  { id:"E2", name:"Rate Restriction Block — Booking.com", type:"Rate",    freq:134,tenants:2,trend:-9, impact:"$12.4K/day",sev:"red",  bars:[8,11,9,14,12,18,22,19,24,28,25,31]  },
  { id:"E3", name:"Mapping Error — Amadeus GDS",          type:"Mapping", freq:89, tenants:4,trend:+2, impact:"$6.1K/day", sev:"amber",bars:[14,12,16,11,13,10,12,9,11,8,10,9]  },
  { id:"E4", name:"Inventory Gap — Sabre GDS",            type:"ARI",     freq:67, tenants:2,trend:-3, impact:"$4.8K/day", sev:"amber",bars:[5,8,6,9,7,8,6,11,9,8,10,12]        },
  { id:"E5", name:"Content Score <60 — Agoda Push",       type:"Content", freq:41, tenants:6,trend:+4, impact:"$2.3K/day", sev:"amber",bars:[3,4,4,5,3,4,3,5,4,3,4,4]           },
  { id:"E6", name:"Booking Timeout — Galileo GDS",        type:"Booking", freq:22, tenants:1,trend:+11,impact:"$0.9K/day", sev:"green",bars:[1,2,1,2,1,3,2,1,2,3,2,2]           },
];
const RISK_ROWS = [
  { tenant:"Wyndham Hotels",           arr:5.9,risk:91,renewal:"Apr '26",drivers:["Error rate +154%","No CSM contact 45d"],owner:"Unassigned",trend:-14 },
  { tenant:"Hilton / British Airways", arr:6.8,risk:84,renewal:"Jun '26",drivers:["ARI sync fail","Cancellation +22%"],    owner:"Marcus T.", trend:-11 },
  { tenant:"Expedia / Omni Dallas",    arr:3.3,risk:67,renewal:"May '26",drivers:["Rate parity gap","Content <55"],         owner:"Priya S.",  trend:-7  },
  { tenant:"Omni Hotels & Resorts",    arr:4.2,risk:58,renewal:"Aug '26",drivers:["Error spike Feb","Usage -8%"],           owner:"Priya S.",  trend:-4  },
  { tenant:"Marriott Bonvoy",          arr:7.2,risk:52,renewal:"Sep '26",drivers:["Moderate error index","SLA breach"],     owner:"Lisa K.",   trend:-3  },
  { tenant:"Accor / Booking.com",      arr:1.8,risk:28,renewal:"Nov '26",drivers:["Minor content gaps"],                    owner:"Priya S.",  trend:+1  },
];
const playbooks_relativeDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
const PLAYBOOKS = [
  { id:"PB1",title:"ARI Sync Recovery",           cat:"Incident",    effort:"2h",impact:"$28K+", tenant:"Hilton/BA",    status:"InProgress",due:"Today", owner:"Marcus T." },
  { id:"PB2",title:"Rate Restriction Remediation",cat:"Incident",    effort:"1h",impact:"$12K+", tenant:"Expedia/Omni", status:"InProgress",due:playbooks_relativeDate(2), owner:"Priya S."  },
  { id:"PB3",title:"GDS Mapping Correction",      cat:"Data Quality",effort:"3h",impact:"$6K+",  tenant:"Amadeus",      status:"Unassigned",due:playbooks_relativeDate(4), owner:"—"         },
  { id:"PB4",title:"Content Score Uplift",        cat:"Activation",  effort:"4h",impact:"+8%",   tenant:"Agoda Push",   status:"Unassigned",due:playbooks_relativeDate(6),owner:"—"         },
  { id:"PB5",title:"Cancellation Rate Audit",     cat:"Revenue",     effort:"2h",impact:"Net+3%",tenant:"Wyndham",      status:"Active",    due:playbooks_relativeDate(9), owner:"Lisa K."   },
  { id:"PB6",title:"ARI Sync Fixed — La Quinta",  cat:"Recovery",    effort:"—", impact:"+$12K", tenant:"Wyndham",      status:"Mitigated", due:playbooks_relativeDate(-3),owner:"Marcus T." },
  ];
const PB_LIBRARY = [
  { title:"ARI Sync Recovery Protocol",       cat:"Incident",    effort:"2h",impact:"High",  desc:"Reconnect ARI feed, validate date ranges, confirm sync with demand partner" },
  { title:"Rate Parity Correction",           cat:"Revenue",     effort:"1h",impact:"High",  desc:"Identify parity gaps across OTAs, update rate rules, verify display" },
  { title:"Content Score Uplift",             cat:"Activation",  effort:"4h",impact:"Medium",desc:"Audit images, amenities, descriptions against each OTA's content rubric" },
  { title:"GDS Mapping Repair",               cat:"Data Quality",effort:"3h",impact:"Medium",desc:"Reconcile property codes, validate room-type mapping table, push corrections" },
  { title:"New Partner Activation",           cat:"Activation",  effort:"6h",impact:"Medium",desc:"Credential setup, content push, test booking sequence, go-live confirmation" },
  { title:"Cancellation Rate Investigation",  cat:"Revenue",     effort:"2h",impact:"Medium",desc:"Segment cancellations by partner, identify policy triggers, escalate to CSM" },
];

const TOP_NAV = [
  { id:"dist",      label:"Distribution Health",  phase:"SEE"       },
  { id:"home",      label:"Health Overview",      phase:"SEE"       },
  { id:"errors",    label:"Error Intelligence",   phase:"PRIORITISE"},
  { id:"revenue",   label:"Revenue at Risk",      phase:"PRIORITISE"},
  { id:"playbooks", label:"Playbooks & Queue",    phase:"FIX"       },
  { id:"recovery",  label:"Revenue Recovery",    phase:"PROVE"     },
  { id:"levers",    label:"16-Lever Grid",        phase:"SEE"       },
  { id:"ltb",       label:"Look-to-Book",         stub:true         },
  { id:"qbr",       label:"Reporting / QBR",      stub:true         },
];


/* ── MultiSelect dropdown ─────────��─������────────────────────────────────── */
function MultiSelect({ label, options, selected, onChange, isOpen, setOpen }) {
  const allSelected = selected.includes("All Brands") || selected.includes("All");
  const displayLabel = selected.length === 0 ? "None"
    : allSelected ? "All"
    : selected.length === 1 ? selected[0]
    : `${selected.length} selected`;

  const toggle = (opt) => {
    if (opt === "All Brands" || opt === "All") {
      onChange(["All Brands"]);
      return;
    }
    const next = selected.filter(s => s !== "All Brands" && s !== "All");
    if (next.includes(opt)) {
      const removed = next.filter(s => s !== opt);
      onChange(removed.length === 0 ? ["All Brands"] : removed);
    } else {
      onChange([...next, opt]);
    }
  };

  return (
    <div style={{position:"relative",display:"flex",flexDirection:"column",gap:1}}>
      <span style={{fontSize:9,color:"#6B7280",letterSpacing:0.5,textTransform:"uppercase"}}>{label}</span>
      <button onClick={e=>{e.stopPropagation();setOpen(!isOpen);}}
        style={{background:"transparent",border:"none",color:"#CBD5E1",fontSize:12,outline:"none",
          cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:4,padding:0,
          maxWidth:140,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
        <span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{displayLabel}</span>
        <span style={{fontSize:8,opacity:0.6,flexShrink:0}}>{isOpen?"▲":"▼"}</span>
      </button>
      {isOpen && (
        <div style={{position:"absolute",top:"100%",left:0,marginTop:6,background:"#1E2433",
          border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,minWidth:200,zIndex:500,
          boxShadow:"0 8px 24px rgba(0,0,0,0.4)",overflow:"hidden"}}>
          <div style={{padding:"6px 0",maxHeight:280,overflowY:"auto"}}>
            {[...(options.some(o=>o==="All Brands")?[]:["All Brands"]), ...options].map(opt => {
              const checked = selected.includes(opt) || (opt==="All Brands" && allSelected);
              return (
                <label key={opt} onClick={()=>toggle(opt)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",
                    cursor:"pointer",fontSize:12,color:"#E2E8F0",
                    background:checked?"rgba(105,65,242,0.15)":"transparent",
                    transition:"background 0.1s"}}>
                  <span style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${checked?"#6941F2":"rgba(255,255,255,0.25)"}`,
                    background:checked?"#6941F2":"transparent",display:"flex",alignItems:"center",
                    justifyContent:"center",flexShrink:0,fontSize:9,color:"#fff",transition:"all 0.1s"}}>
                    {checked && "✓"}
                  </span>
                  {opt}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════════════ */
/* ── Content Error Detail Modal ─────────────────────────────────────────── */
function ContentErrorModal({ onClose }) {
  const [expanded, setExpanded] = useState(null);
  const total = WYNDHAM_CONTENT_ERRORS.reduce((s,b) => s + b.count, 0);
  const maxCount = WYNDHAM_CONTENT_ERRORS[0].count;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",
      justifyContent:"center",background:"rgba(15,20,40,0.55)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div style={{background:"#FFFFFF",borderRadius:16,width:"min(760px,92vw)",
        maxHeight:"85vh",display:"flex",flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.25)",overflow:"hidden"}}
        onClick={e=>e.stopPropagation()}>
        {/* Purple header */}
        <div style={{background:"linear-gradient(135deg,#6941F2 0%,#8B67F5 100%)",padding:"20px 24px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.7)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>InsightsIQ · Content Quality Analysis</div>
              <div style={{fontSize:18,fontWeight:800,color:"#FFFFFF",fontFamily:"'DM Sans',sans-serif",letterSpacing:"-0.3px"}}>Image Error Report — Wyndham Hotels</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:4}}>{total} properties below image threshold · {WYNDHAM_CONTENT_ERRORS.length} brands · Source: Hotel Key + Tricept POC</div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:"#fff",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            {[["202","Properties affected"],["14","Brands impacted"],["DI","Worst brand (47)"],["$29.8K","Revenue at risk"]].map(([v,l])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"6px 14px",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <span style={{fontSize:15,fontWeight:800,color:"#fff",fontFamily:"'IBM Plex Mono',monospace"}}>{v}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.7)",whiteSpace:"nowrap"}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Column headers */}
        <div style={{display:"grid",gridTemplateColumns:"160px 1fr 160px 24px",padding:"8px 20px",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",flexShrink:0}}>
          {["Brand","Properties","Volume",""].map(h=><div key={h} style={{fontSize:10,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</div>)}
        </div>
        {/* Brand rows */}
        <div style={{overflowY:"auto",flex:1}}>
          {WYNDHAM_CONTENT_ERRORS.map(b => (
            <div key={b.brand}>
              <div onClick={()=>setExpanded(expanded===b.brand?null:b.brand)}
                style={{display:"grid",gridTemplateColumns:"160px 1fr 160px 24px",alignItems:"center",padding:"10px 20px",cursor:"pointer",borderBottom:"1px solid #F1F5F9",background:expanded===b.brand?"#F5F3FF":"#FFFFFF",transition:"background 0.12s"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:34,height:22,borderRadius:4,background:expanded===b.brand?"#6941F2":"#DC2626",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff"}}>{b.brand}</div>
                  <span style={{fontSize:11,color:"#374151",fontWeight:600}}>{b.label}</span>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:expanded===b.brand?"#6941F2":"#DC2626"}}>{b.count} {b.count===1?"property":"properties"}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{flex:1,height:5,background:"#E5E7EB",borderRadius:3}}>
                    <div style={{width:`${(b.count/maxCount)*100}%`,height:"100%",background:expanded===b.brand?"#6941F2":"#DC2626",borderRadius:3,transition:"background 0.12s"}}/>
                  </div>
                </div>
                <div style={{textAlign:"center",fontSize:10,color:"#9CA3AF"}}>{expanded===b.brand?"▲":"▼"}</div>
              </div>
              {expanded===b.brand && (
                <div style={{background:"#FAFBFF",borderBottom:"2px solid #EDE9FE"}}>
                  <div style={{display:"grid",gridTemplateColumns:"100px 1fr",padding:"7px 20px 4px",borderBottom:"1px solid #E5E7EB"}}>
                    {["Property ID","Property Name"].map(h=><div key={h} style={{fontSize:10,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</div>)}
                  </div>
                  {b.properties.map((p,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"100px 1fr",alignItems:"center",padding:"5px 20px",background:i%2===0?"transparent":"#F5F3FF",borderBottom:"1px solid #F3F4F6"}}>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#6941F2",fontWeight:600}}>{p.pid}</div>
                      <div style={{fontSize:12,color:"#374151"}}>{p.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div style={{padding:"10px 24px",borderTop:"1px solid #E2E8F0",background:"#F8FAFC",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:11,color:"#9CA3AF"}}>Click any brand row to expand property list</span>
          <span style={{fontSize:11,fontWeight:700,color:"#DC2626"}}>⚠ 202 properties need immediate image upload</span>
        </div>
      </div>
    </div>
  );
}

function InnovationModal({ tab, setTab, onClose, toast }) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [idea, setIdea] = useState("");
  const [priority, setPriority] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [feedback, setFeedback] = useState("");

  const resetForm = () => {
    setName(""); setAccount(""); setIdea(""); setPriority("");
    setSentiment(null); setFeedback("");
  };

  const handleIdeaSubmit = () => {
    toast("💡 Idea submitted — thank you!", "success");
    resetForm();
    onClose();
  };

  const handleFeedbackSubmit = () => {
    toast("✓ Feedback received — thank you!", "success");
    resetForm();
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:800,display:"flex",alignItems:"center",
      justifyContent:"center",background:"rgba(15,20,40,0.6)",backdropFilter:"blur(4px)"}}
      onClick={onClose}>
      <div style={{background:"#FFFFFF",borderRadius:16,width:"min(520px,92vw)",
        maxHeight:"85vh",display:"flex",flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.25)",overflow:"hidden"}}
        onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:"20px 24px 0",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>💡</span>
          <span style={{fontSize:18,fontWeight:800,color:C.t1,fontFamily:"'DM Sans',sans-serif",flex:1}}>Shape the Future</span>
          <button onClick={onClose} style={{background:C.cardBg,border:`1px solid ${C.border}`,color:C.t3,width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:0,padding:"12px 24px 0",borderBottom:`1px solid ${C.border}`}}>
          {[["shape","Shape the Future"],["feedback","Give Feedback"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              background:"transparent",border:"none",
              padding:"8px 16px",fontSize:13,fontWeight:tab===k?700:500,
              color:tab===k?C.brand:C.t3,cursor:"pointer",
              borderBottom:tab===k?`2px solid ${C.brand}`:"2px solid transparent",
              marginBottom:-1,transition:"all 0.15s"}}>{l}</button>
          ))}
        </div>
        {/* Tab Content */}
        <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
          {tab === "shape" && (
            <>
              <div style={{fontSize:13,color:C.t3,marginBottom:20,lineHeight:1.5}}>Help us build the next generation of distribution intelligence. Your insights drive our roadmap.</div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:C.t2,marginBottom:4}}>Your Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)}
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:C.t2,marginBottom:4}}>Brand / Account</label>
                <select value={account} onChange={e=>setAccount(e.target.value)}
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"}}>
                  <option value="">Select account</option>
                  {["Wyndham Hotels","Hilton Worldwide","Marriott International","IHG Hotels & Resorts","Hyatt Hotels","Best Western Hotels","Choice Hotels","Omni Hotels & Resorts"].map(a=>(
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:C.t2,marginBottom:4}}>Your Idea</label>
                <textarea value={idea} onChange={e=>setIdea(e.target.value)} rows={4}
                  placeholder="Describe your idea for improving RateIQ..."
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",resize:"vertical"}}/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:C.t2,marginBottom:4}}>Priority</label>
                <select value={priority} onChange={e=>setPriority(e.target.value)}
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",background:"#fff"}}>
                  <option value="">Select priority</option>
                  {["Critical","High","Medium","Low"].map(p=>(
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleIdeaSubmit}
                style={{width:"100%",background:C.brand,color:"#fff",border:"none",borderRadius:8,padding:11,fontSize:14,fontWeight:700,marginTop:4,cursor:"pointer"}}
                onMouseEnter={e=>e.target.style.opacity="0.88"}
                onMouseLeave={e=>e.target.style.opacity="1"}>Submit Idea</button>
              <div style={{marginTop:20}}>
                <div style={{fontSize:11,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Recent Innovation Wins</div>
                {["Weekend error pattern detection (suggested by NORAM team)","Push connectivity opportunity scoring (suggested by enterprise workshop)"].map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:C.greenBg,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.green}}>✓</div>
                    <span style={{fontSize:12,color:C.t2}}>{t}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === "feedback" && (
            <>
              <div style={{fontSize:13,color:C.t3,marginBottom:16}}>How is your experience with RateIQ?</div>
              <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:16}}>
                {["😞","😐","😊"].map((emoji,i)=>(
                  <button key={emoji} onClick={()=>setSentiment(i)}
                    style={{width:48,height:48,borderRadius:"50%",
                      border:sentiment===i?`2px solid ${C.brand}`:`2px solid ${C.border}`,
                      background:sentiment===i?C.brandDim:"#fff",
                      boxShadow:sentiment===i?`0 0 0 3px ${C.brandBorder}`:"none",
                      fontSize:22,cursor:"pointer",transition:"all 0.15s"}}>{emoji}</button>
                ))}
              </div>
              <textarea value={feedback} onChange={e=>setFeedback(e.target.value.slice(0,500))} rows={4}
                placeholder="Anything you want to tell us?"
                style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",resize:"vertical",marginTop:16}}/>
              <div style={{textAlign:"right",fontSize:11,color:C.t4,marginTop:4}}>{feedback.length} / 500 characters</div>
              <button onClick={handleFeedbackSubmit}
                style={{width:"100%",background:C.brand,color:"#fff",border:"none",borderRadius:8,padding:11,fontSize:14,fontWeight:700,marginTop:8,cursor:"pointer"}}
                onMouseEnter={e=>e.target.style.opacity="0.88"}
                onMouseLeave={e=>e.target.style.opacity="1"}>Submit Feedback</button>
              <div style={{fontSize:11,color:C.t4,textAlign:"center",marginTop:12}}>Need help? Contact your RateGain account team.</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage]             = useState("dist");
  const [role, setRole]             = useState("exec");
  const [showContentErrors, setShowContentErrors] = useState(false);
  const [activeClient, setActiveClient]         = useState(ENTERPRISE_ACCOUNTS.find(a=>a.name===DEFAULT_CLIENT));
  const [activePartners, setActivePartners]     = useState(DEFAULT_PARTNERS);
  const [activeBrands, setActiveBrands]         = useState(DEFAULT_BRANDS);
  const [dpOpen, setDpOpen]                     = useState(false);
  const [clientOpen, setClientOpen]             = useState(false);
  const [brandOpen, setBrandOpen]               = useState(false);
  const [selTenant, setSelTenant]   = useState(TENANTS[7]);
  const [detailTab, setDetailTab]   = useState("snapshot");
  const [selCluster, setSelCluster] = useState(ERROR_CLUSTERS[0]);
  const [selRisk, setSelRisk]       = useState(RISK_ROWS[0]);
  const [pbTab, setPbTab]           = useState("smart");
  const [leversFor, setLeversFor]   = useState(null);
  const [alertOpen, setAlertOpen]   = useState(false);
  const [kanban, setKanban]         = useState(true);
  const [authed, setAuthed]         = useState(false);
  const [innovOpen, setInnovOpen]   = useState(false);
  const [innovTab, setInnovTab]     = useState("shape");
  const [avatarOpen, setAvatarOpen] = useState(false);

  const goLevers = (name) => { setLeversFor(name); setPage("levers"); };
  // Close multi-select dropdowns on outside click
  useEffect(() => {
    const handler = () => { setDpOpen(false); setBrandOpen(false); setClientOpen(false); setAvatarOpen(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  const toast    = useToast();
  const curNav   = TOP_NAV.find(n=>n.id===page);
  const loopPhase = curNav?.phase || "SEE";

  // Login state
  const [loginUser, setLoginUser] = useState("");
  const [loginPin, setLoginPin]   = useState("");
  const [loginError, setLoginError] = useState(false);
  const [slide, setSlide] = useState(0);
  const [showPin, setShowPin] = useState(false);

  // Auto-rotate slides on login screen
  useEffect(() => {
    if (authed) return;
    const t = setInterval(() => setSlide(s => s===0?1:0), 8500);
    return () => clearInterval(t);
  }, [authed]);

  const handleLogin = () => {
    if (loginUser === "RGRateIQ" && loginPin === "RG2026") {
      setAuthed(true);
      setLoginError(false);
      setLoginUser("");
      setLoginPin("");
    } else {
      setLoginError(true);
    }
  };

  // PIN Gate — Two-panel login screen
  if (!authed) {
    const handleLoginSubmit = () => {
      if (loginUser === "RGRateIQ" && loginPin === "RG2026") {
        setAuthed(true);
        setLoginError(false);
        setLoginUser("");
        setLoginPin("");
      } else {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 3000);
      }
    };

    return (
      <div style={{width:"100vw",height:"100vh",display:"flex",overflow:"hidden",
        background:"linear-gradient(135deg, #0A0714 0%, #12172A 40%, #1A0A3D 70%, #0D1B3E 100%)",
        fontFamily:"'DM Sans',system-ui,sans-serif"}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
          @keyframes bgDrift {0%,100%{background-position:0 0}50%{background-position:14px 14px}}
          @keyframes fadeSlideUp {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes slideInLeft {from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
          @keyframes countUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow {0%,100%{box-shadow:0 0 20px rgba(128,33,255,0.3)}50%{box-shadow:0 0 40px rgba(128,33,255,0.6)}}
          .login-input:focus{border-color:#8021FF !important;box-shadow:0 0 0 3px rgba(128,33,255,0.12) !important;outline:none}
          .login-btn:hover{opacity:0.9;transform:translateY(-1px)}
          .login-btn:active{transform:translateY(0)}
          .dot-nav:hover{opacity:0.8;cursor:pointer}
        `}</style>

        {/* Dot grid overlay */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
          background:"radial-gradient(circle, rgba(128,33,255,0.18) 1px, transparent 1px)",
          backgroundSize:"28px 28px",animation:"bgDrift 25s ease infinite"}}/>

        {/* LEFT PANEL */}
        <div style={{width:"55%",height:"100vh",padding:"52px 56px",display:"flex",flexDirection:"column",
          justifyContent:"space-between",position:"relative",zIndex:1,
          background:"linear-gradient(160deg, rgba(30,10,74,0.95) 0%, rgba(18,23,42,0.98) 100%)",
          borderRight:"1px solid rgba(128,33,255,0.2)"}}>

          {/* TOP — Logo row */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src="/Logo-RG.png" alt="RG" style={{width:32,height:32,borderRadius:6,objectFit:"contain"}}/>
            <span style={{fontSize:20,fontWeight:800,color:"#67E8F9"}}>RateIQ</span>
          </div>

          {/* MIDDLE — Rotating content */}
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            {slide === 0 && (
              <div style={{animation:"slideInLeft 0.5s ease both"}} key="slide0">
                <div style={{color:"#A78BFA",fontSize:10,fontWeight:700,letterSpacing:"1.2px",
                  fontFamily:"'IBM Plex Mono',monospace",marginBottom:16}}>&#9679; DISTRIBUTION HEALTH CRISIS</div>
                <h2 style={{fontSize:46,fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:8}}>
                  Your revenue is<br/><span style={{color:"#67E8F9"}}>leaking</span>. Right now.
                </h2>
                <p style={{fontSize:15,color:"rgba(255,255,255,0.6)",lineHeight:1.65,maxWidth:420,marginBottom:36}}>
                  Distribution errors cost enterprise hotel chains millions every year — silently, across brands, channels, and properties. Most teams find out from a quarterly report. By then, the damage is done.
                </p>

                {/* Stat tiles */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  {[
                    {val:"$633K",color:"#fff",label:"avg revenue at risk per enterprise account",accent:"#8021FF"},
                    {val:"15.2",color:"#67E8F9",label:"errors per 1k \u00B7 Wyndham portfolio today",accent:"#67E8F9"},
                    {val:"770",color:"#A78BFA",label:"properties \u00B7 zero OTA bookings \u00B7 6 months",accent:"#A78BFA"},
                  ].map((t,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",
                      borderRadius:12,padding:"16px 14px",borderLeft:`3px solid ${t.accent}`,
                      animation:`countUp 0.6s ease both`,animationDelay:`${i*0.1}s`}}>
                      <div style={{color:t.color,fontSize:28,fontWeight:800,fontFamily:"'IBM Plex Mono',monospace"}}>{t.val}</div>
                      <div style={{color:"rgba(255,255,255,0.45)",fontSize:10,lineHeight:1.4,marginTop:6}}>{t.label}</div>
                    </div>
                  ))}
                </div>

                {/* SPFPP Operating Loop strip */}
                <div style={{color:"rgba(255,255,255,0.3)",fontSize:9,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"1px",marginTop:28,marginBottom:8}}>THE RATEIQ OPERATING LOOP</div>
                <div style={{display:"flex",alignItems:"stretch",borderRadius:10,overflow:"hidden",border:"1px solid rgba(128,33,255,0.2)"}}>
                  {[
                    {n:"01",l:"SEE",s:"Health score"},
                    {n:"02",l:"PRIORITIZE",s:"Revenue impact"},
                    {n:"03",l:"FIX",s:"Playbooks"},
                    {n:"04",l:"PROVE",s:"Recovery"},
                    {n:"05",l:"PROTECT",s:"Stay green"},
                  ].map((d,i,arr)=>(
                    <React.Fragment key={d.n}>
                      <div style={{flex:1,padding:"10px 6px",textAlign:"center",background:"rgba(128,33,255,0.12)"}}>
                        <div style={{fontSize:9,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.8px",color:"#A78BFA"}}>{d.n} {d.l}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:3}}>{d.s}</div>
                      </div>
                      {i < arr.length - 1 && <div style={{display:"flex",alignItems:"center",background:"rgba(128,33,255,0.12)",color:"rgba(255,255,255,0.2)",fontSize:10,padding:"0 2px"}}>&rarr;</div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {slide === 1 && (
              <div style={{animation:"slideInLeft 0.5s ease both"}} key="slide1">
                <div style={{color:"#A78BFA",fontSize:10,fontWeight:700,letterSpacing:"1.2px",
                  fontFamily:"'IBM Plex Mono',monospace",marginBottom:16}}>&#9679; THE RG4D REVENUE FRAMEWORK</div>
                <h2 style={{fontSize:46,fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:8}}>
                  From signal to <span style={{color:"#67E8F9"}}>recovery</span>.<br/>One platform. Four stages.
                </h2>
                <p style={{fontSize:15,color:"rgba(255,255,255,0.6)",lineHeight:1.65,maxWidth:420,marginBottom:28}}>
                  RateGain is the only end-to-end hospitality intelligence platform connecting pricing, distribution, content, and payments — across the full RG4D loop.
                </p>

                {/* RG4D strip */}
                <div style={{color:"rgba(255,255,255,0.3)",fontSize:9,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"1px",marginBottom:8}}>THE RG4D&#8482; REVENUE FRAMEWORK</div>
                <div style={{display:"flex",alignItems:"stretch",borderRadius:10,overflow:"hidden",border:"1px solid rgba(103,232,249,0.2)"}}>
                  {[
                    {n:"01",l:"DISCOVER",s:"Find the leak"},
                    {n:"02",l:"DIAGNOSE",s:"16-lever grid"},
                    {n:"03",l:"DELIVER",s:"Fix & track"},
                    {n:"04",l:"DRIVE",s:"Agentic AI"},
                  ].map((d,i,arr)=>(
                    <React.Fragment key={d.n}>
                      <div style={{flex:1,padding:"10px 8px",textAlign:"center",background:"rgba(103,232,249,0.08)"}}>
                        <div style={{fontSize:9,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.8px",color:"#67E8F9"}}>{d.n} {d.l}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:3}}>{d.s}</div>
                      </div>
                      {i < arr.length - 1 && <div style={{display:"flex",alignItems:"center",background:"rgba(103,232,249,0.08)",color:"rgba(255,255,255,0.2)",fontSize:10,padding:"0 2px"}}>&rarr;</div>}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontStyle:"italic",textAlign:"center",marginTop:12}}>
                  RateIQ is your entry point into the full RG4D loop.
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM — Dot navigation */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {[0,1].map(i=>(
              <div key={i} onClick={()=>setSlide(i)} className="dot-nav"
                style={{width:slide===i?28:10,height:10,borderRadius:slide===i?5:5,
                  background:slide===i?"#8021FF":"rgba(255,255,255,0.2)",
                  animation:slide===i?"glow 2s ease infinite":"none",
                  transition:"all 0.3s ease",cursor:"pointer"}}/>
            ))}
            <span style={{marginLeft:"auto",fontSize:10,fontFamily:"'IBM Plex Mono',monospace",
              color:"rgba(255,255,255,0.25)"}}>RateGain · RG4D Framework · Early Access</span>
          </div>
        </div>

        {/* RIGHT PANEL — Login form */}
        <div style={{width:"45%",height:"100vh",display:"flex",flexDirection:"column",
          justifyContent:"center",alignItems:"center",padding:"56px 48px",
          background:"rgba(255,255,255,0.97)",position:"relative",zIndex:1}}>

          <div style={{maxWidth:360,width:"100%"}}>
            {/* Top logo */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
              <img src="/Logo-RG.png" alt="RG" style={{width:28,height:28,borderRadius:5,objectFit:"contain"}}/>
              <span style={{fontSize:18,fontWeight:800,color:"#0891B2"}}>RateIQ</span>
            </div>

            {/* Header */}
            <h1 style={{fontSize:30,fontWeight:800,color:"#0F172A",marginBottom:4}}>Welcome back</h1>
            <p style={{fontSize:13,color:"#64748B",marginBottom:28}}>Distribution Intelligence Platform</p>

            {/* Form */}
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,letterSpacing:"0.3px"}}>Username</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94A3B8"}}>&#128100;</span>
                <input type="text" className="login-input" value={loginUser} onChange={e=>setLoginUser(e.target.value)}
                  style={{width:"100%",border:"1.5px solid #E2E8F0",borderRadius:10,padding:"12px 14px 12px 40px",
                    fontSize:14,fontFamily:"inherit",background:"#F8FAFC",boxSizing:"border-box",
                    transition:"border-color 0.15s, box-shadow 0.15s"}}/>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,letterSpacing:"0.3px"}}>PIN</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94A3B8"}}>&#128272;</span>
                <input type={showPin?"text":"password"} className="login-input" value={loginPin}
                  onChange={e=>setLoginPin(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleLoginSubmit()}
                  style={{width:"100%",border:"1.5px solid #E2E8F0",borderRadius:10,padding:"12px 40px 12px 40px",
                    fontSize:14,fontFamily:"inherit",background:"#F8FAFC",boxSizing:"border-box",
                    transition:"border-color 0.15s, box-shadow 0.15s"}}/>
                <button onClick={()=>setShowPin(!showPin)} type="button"
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",fontSize:14,color:"#94A3B8",cursor:"pointer",padding:0}}>
                  {showPin ? "\uD83D\uDC41\u200D\uD83D\uDDE8" : "\uD83D\uDC41"}
                </button>
              </div>
            </div>

            {/* Error message */}
            {loginError && (
              <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderLeft:"3px solid #DC2626",
                borderRadius:8,padding:"10px 14px",fontSize:12,color:"#DC2626",marginTop:8,
                display:"flex",alignItems:"center",gap:8}}>
                <span>&#9888;</span> Invalid credentials — please try again.
              </div>
            )}

            {/* Login button */}
            <button className="login-btn" onClick={handleLoginSubmit}
              style={{width:"100%",background:"linear-gradient(135deg, #8021FF 0%, #6941F2 100%)",
                color:"#fff",border:"none",borderRadius:10,padding:14,fontSize:15,fontWeight:700,
                marginTop:20,cursor:"pointer",boxShadow:"0 4px 16px rgba(128,33,255,0.35)",
                transition:"all 0.15s",letterSpacing:"0.3px"}}>
              Sign In to RateIQ &rarr;
            </button>
            <div style={{color:"#94A3B8",fontSize:11,textAlign:"center",marginTop:14}}>Demo Access · RateGain Internal Only</div>

            {/* Bottom of right panel */}
            <div style={{borderTop:"1px solid #F1F5F9",marginTop:40,paddingTop:16,
              display:"flex",justifyContent:"center",alignItems:"center"}}>
              <span style={{fontSize:10,color:"#CBD5E1"}}>&copy; 2026 RateGain Technologies</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:C.pageBg,minHeight:"100vh",color:C.t1}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#94A3B8}
        button,select,input{font-family:inherit;cursor:pointer}
        table{border-collapse:collapse;width:100%}
        .tr-hover:hover{background:#F5F3FF !important;transition:background 0.1s}
        .tr-sel{background:#F5F3FF !important;transition:background 0.1s}
        .btn-ghost{transition:background 0.12s,color 0.12s,border-color 0.12s}
        .btn-ghost:hover{background:#F1F5F9 !important}
        .btn-primary{transition:box-shadow 0.15s,transform 0.1s,opacity 0.12s}
        .btn-primary:hover{opacity:0.88;transform:translateY(-1px)}
        .btn-primary:active{transform:translateY(0)}
        .card-hover{transition:box-shadow 0.18s,transform 0.18s}
        .card-hover:hover{box-shadow:0 8px 24px rgba(15,23,42,0.11) !important;transform:translateY(-2px)}
        .lever-card{transition:box-shadow 0.15s,border-color 0.15s,transform 0.15s}
        .lever-card:hover{box-shadow:0 4px 16px rgba(105,65,242,0.14) !important;border-color:#C4B5FD !important;transform:translateY(-1px)}
        .lever-card:hover .lever-cta{opacity:1 !important;transform:translateY(0) !important;}
        .lever-actions{display:flex;gap:6px;margin-top:12px;opacity:0;transform:translateY(4px);transition:opacity 0.15s,transform 0.15s;}
        .lever-card:hover .lever-actions{opacity:1 !important;transform:translateY(0) !important;}
        .lever-btn{flex:1;padding:5px 0;border-radius:6px;font-size:10px;font-weight:700;border:none;cursor:pointer;transition:opacity 0.12s,transform 0.1s;letter-spacing:0.02em;}
        .lever-btn:hover{opacity:0.85;transform:translateY(-1px);}
        .lever-btn:active{transform:translateY(0);}
        @keyframes fadeIn   {from{opacity:0} to{opacity:1}}
        @keyframes fadeSlide{from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)}}
        @keyframes pulse    {0%,100%{opacity:1} 50%{opacity:0.5}}
        @keyframes toastIn  {from{opacity:0;transform:translateY(16px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes toastOut {from{opacity:1;transform:translateY(0)}    to{opacity:0;transform:translateY(8px)}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        @keyframes dotPulse {0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.6}}
        .fade-in   {animation:fadeIn    0.22s ease-out both}
        .brands-chip:hover .brands-dropdown{display:block !important;}
        .fade-slide{animation:fadeSlide 0.22s ease-out both}
        .toast-in  {animation:toastIn   0.25s cubic-bezier(0.34,1.56,0.64,1) both}
        .live-dot  {animation:dotPulse  2s ease-in-out infinite}
        .nav-active-see       {border-bottom:2px solid #6941F2 !important;color:#6941F2 !important}
        .nav-active-prioritise{border-bottom:2px solid #DC2626 !important;color:#DC2626 !important}
        .nav-active-fix       {border-bottom:2px solid #D97706 !important;color:#D97706 !important}
        .nav-active-prove     {border-bottom:2px solid #059669 !important;color:#059669 !important}
        .nav-active-prevent   {border-bottom:2px solid #2563EB !important;color:#2563EB !important}
        body{background-image:radial-gradient(circle,#CBD5E155 1px,transparent 1px);background-size:24px 24px}
      `}</style>

      <div style={{background:C.headerBg,padding:"0 20px",height:50,display:"flex",
        alignItems:"center",gap:14,position:"sticky",top:0,zIndex:200,
        boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginRight:4}}>
          {(()=>{
            const isInsights = page==="dist";
            return (<>
              <div style={{width:3,height:28,borderRadius:2,
                background:isInsights
                  ? "linear-gradient(180deg,#A78BFA,#6941F2)"
                  : "linear-gradient(180deg,#67E8F9,#0891B2)",
                transition:"background 0.3s ease"}}/>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <img src="/Logo-RG.png" alt="RG" style={{width:24,height:24,borderRadius:4,objectFit:"contain"}}/>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:800,
                  color:"#FFF",letterSpacing:"-0.3px",transition:"all 0.2s ease"}}>
                  {isInsights
                    ? <span style={{color:"#A78BFA"}}>InsightsIQ</span>
                    : <span style={{color:"#67E8F9"}}>RateIQ</span>}
                </div>
              </div>
            </>);
          })()}
        </div>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.1)"}}/>
        <div style={{position:"relative",display:"flex",flexDirection:"column",gap:1}}>
          <span style={{fontSize:9,color:"#6B7280",letterSpacing:0.5,textTransform:"uppercase"}}>Client</span>
          <button onClick={e=>{e.stopPropagation();setClientOpen(!clientOpen);setDpOpen(false);setBrandOpen(false);}}
            style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",
              borderRadius:6,padding:"3px 10px",fontSize:12,color:"#E2E8F0",fontWeight:600,outline:"none",
              cursor:"pointer",minWidth:160,textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
            <span>{activeClient.name}</span>
            <span style={{fontSize:8,opacity:0.6}}>{clientOpen?"▲":"▼"}</span>
          </button>
          {clientOpen && (
            <div style={{position:"absolute",top:"100%",left:0,marginTop:6,background:"#1E2433",
              border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,minWidth:200,zIndex:500,
              boxShadow:"0 8px 24px rgba(0,0,0,0.4)",overflow:"hidden"}}>
              {ENTERPRISE_ACCOUNTS.map(a=>(
                <button key={a.id} onClick={()=>{
                  setActiveClient(a);
                  setActiveBrands(DEFAULT_BRANDS);
                  setActivePartners(ACCOUNT_PARTNER_MAP[a.name] || ["All Brands"]);
                  setClientOpen(false);
                }} style={{display:"block",width:"100%",padding:"8px 14px",background:activeClient.name===a.name?"rgba(105,65,242,0.2)":"transparent",
                  border:"none",color:activeClient.name===a.name?"#A78BFA":"#E2E8F0",fontSize:12,fontWeight:activeClient.name===a.name?700:400,
                  textAlign:"left",cursor:"pointer",transition:"background 0.1s"}}>
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <MultiSelect label="Demand Partner" options={DEMAND_PARTNERS}
          selected={activePartners} onChange={next => {
            // If the newly-added partner has a dedicated pairing key, swap to it exclusively
            const added = next.filter(p => !activePartners.includes(p));
            if (added.length === 1 && ALL_LEVERS[`${activeClient.name}|${added[0]}`]) {
              setActivePartners([added[0]]);
            } else {
              setActivePartners(next);
            }
          }}
          isOpen={dpOpen} setOpen={v=>{setDpOpen(v);setBrandOpen(false);}}/>
        <MultiSelect label="Brand" options={BRAND_MAP[activeClient.name]||["All Brands"]}
          selected={activeBrands} onChange={setActiveBrands}
          isOpen={brandOpen} setOpen={v=>{setBrandOpen(v);setDpOpen(false);}}/>
        <div style={{display:"flex",alignItems:"center",gap:5,marginLeft:4,
          background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"3px 8px"}}>
          <button style={{background:"none",border:"none",color:"#64748B",fontSize:13,padding:"0 2px"}}>‹</button>
          <span style={{color:"#64748B",fontSize:11,fontFamily:C.mono}}>2025</span>
          <span style={{color:"#FFF",fontSize:15,fontWeight:800,fontFamily:C.mono,padding:"0 4px"}}>2026</span>
          <span style={{color:"#64748B",fontSize:11,fontFamily:C.mono}}>2027</span>
          <button style={{background:"none",border:"none",color:"#64748B",fontSize:13,padding:"0 2px"}}>›</button>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex",background:"rgba(255,255,255,0.07)",
          border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:2,gap:1}}>
          {[["exec","Executive"],["ops","Operator"]].map(([k,l])=>(
            <button key={k} onClick={()=>setRole(k)} style={{
              background:role===k?"#6941F2":"transparent",
              color:role===k?"#fff":"#94A3B8",border:"none",borderRadius:5,
              padding:"3px 12px",fontSize:11,fontWeight:role===k?700:400,transition:"all 0.15s"}}>{l}
            </button>
          ))}
        </div>
        <div style={{position:"relative"}}>
          <button onClick={()=>setAlertOpen(!alertOpen)}
            style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:6,width:32,height:30,color:"#CBD5E1",fontSize:14,
              display:"flex",alignItems:"center",justifyContent:"center"}}>🔔</button>
          <div style={{position:"absolute",top:-3,right:-3,background:C.red,borderRadius:"50%",
            width:15,height:15,fontSize:8,color:"#fff",display:"flex",alignItems:"center",
            justifyContent:"center",fontWeight:800,fontFamily:C.mono}}>5</div>
          {alertOpen && (
            <div style={{position:"absolute",right:0,top:40,background:C.cardBg,
              border:`1px solid ${C.border}`,borderRadius:10,width:290,
              boxShadow:C.shadowLg,zIndex:300,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,
                fontSize:10,fontWeight:700,color:C.t3,fontFamily:C.mono,letterSpacing:0.8}}>
                ACTIVE ALERTS
              </div>
              {[["ARI sync failure — Expedia","red"],["Wyndham error rate +154%","red"],
                ["Rate restriction — Booking.com","amber"],["Content score drop — Agoda","amber"],
                ["Galileo timeout pattern","green"]].map(([t,s])=>(
                <div key={t} style={{padding:"9px 14px",display:"flex",alignItems:"center",
                  gap:9,borderBottom:`1px solid ${C.t6}`}}>
                  <div style={{width:7,height:7,borderRadius:"50%",
                    background:{red:C.red,amber:C.amber,green:C.green}[s],flexShrink:0,
                    boxShadow:`0 0 0 3px ${{red:C.redBg,amber:C.amberBg,green:C.greenBg}[s]}`}}/>
                  <span style={{fontSize:12,color:C.t2}}>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={e=>{e.stopPropagation();setInnovOpen(true);}}
          style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:6,width:32,height:30,color:"#CBD5E1",fontSize:16,
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>💡</button>
        <button style={{background:"none",border:"none",color:"#A78BFA",
          fontSize:12,fontWeight:600,letterSpacing:"-0.1px"}}>Grow with RateGain →</button>
        <div style={{position:"relative"}}>
          <div onClick={e=>{e.stopPropagation();setAvatarOpen(!avatarOpen);}} style={{width:30,height:30,borderRadius:"50%",
            background:"linear-gradient(135deg,#7C3AED,#6941F2)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer",
            boxShadow:"0 0 0 2px rgba(255,255,255,0.15)"}}>JR</div>
          {avatarOpen && (
            <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:40,right:0,background:C.cardBg,
              border:`1px solid ${C.border}`,borderRadius:10,width:240,
              boxShadow:C.shadowLg,zIndex:300,overflow:"hidden"}}>
              <div style={{padding:16,display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:"50%",
                  background:"linear-gradient(135deg,#7C3AED,#6941F2)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:15,fontWeight:700,color:"#fff"}}>JR</div>
                <div style={{fontSize:14,fontWeight:700,color:C.t1,marginTop:8}}>Julie Grose</div>
                <div style={{fontSize:11,color:C.t3}}>julie.grose@rategain.com</div>
              </div>
              <div style={{borderTop:`1px solid ${C.border}`}}/>
              {[["🔑","Change Password"],["🔄","Switch Account"],["🚪","Logout"]].map(([icon,label])=>(
                <div key={label} onClick={()=>{
                  if(label==="Logout"){setAuthed(false);setAvatarOpen(false);}
                  else setAvatarOpen(false);
                }} style={{padding:"10px 16px",fontSize:13,color:C.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}
                  onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{background:C.cardBg,borderBottom:`1px solid ${C.border}`,
        padding:"0 20px",display:"flex",alignItems:"center",
        position:"sticky",top:50,zIndex:150,
        boxShadow:"0 1px 4px rgba(15,23,42,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:0,flex:1,overflowX:"auto"}}>
          {TOP_NAV.map(n=>{
            const active = page===n.id;
            if (n.stub) return (
              <button key={n.id} title="Coming in V1.1"
                style={{padding:"12px 16px",background:"transparent",border:"none",
                  borderBottom:"2px solid transparent",color:C.t5,fontSize:12,
                  fontWeight:400,cursor:"not-allowed",whiteSpace:"nowrap",
                  display:"flex",alignItems:"center",gap:6}}>
                {n.label}
                <span style={{fontSize:9,background:"#F1F5F9",color:C.t4,
                  border:`1px solid ${C.t6}`,borderRadius:3,padding:"1px 5px",
                  fontFamily:C.mono,fontWeight:600}}>SOON</span>
              </button>
            );
            return (
              <button key={n.id} onClick={()=>setPage(n.id)}
                style={{padding:"12px 16px",background:"transparent",border:"none",
                  borderBottom:`2px solid ${active?C.brand:"transparent"}`,
                  color:active?C.brand:C.t3,fontSize:13,fontWeight:active?700:500,
                  whiteSpace:"nowrap",transition:"all 0.15s",
                  display:"flex",alignItems:"center",gap:6}}>
                {n.label}
                {n.id==="levers" && leversFor && (
                  <span style={{fontSize:9,background:C.brandDim,color:C.brand,
                    border:`1px solid ${C.brandBorder}`,borderRadius:3,
                    padding:"1px 5px",fontFamily:C.mono}}>
                    {leversFor.split(" ")[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,paddingLeft:12,
          borderLeft:`1px solid ${C.border}`}}>
          <span style={{fontSize:10,background:"#FEF3C7",color:"#92400E",
            border:"1px solid #FCD34D",borderRadius:4,padding:"3px 10px",
            fontWeight:700,letterSpacing:0.5}}>EARLY ACCESS</span>
          <button style={{background:C.brand,border:"none",borderRadius:7,
            padding:"5px 14px",fontSize:12,color:"#fff",fontWeight:700,
            boxShadow:`0 1px 3px ${C.brand}55`}}>Search</button>
          <button className="btn-ghost" onClick={()=>{
              const resetClient = ENTERPRISE_ACCOUNTS.find(a=>a.name===DEFAULT_CLIENT);
              setActiveClient(resetClient);
              setActivePartners(ACCOUNT_PARTNER_MAP[resetClient.name] || DEFAULT_PARTNERS);
              setActiveBrands(DEFAULT_BRANDS);
              setDpOpen(false); setBrandOpen(false); setClientOpen(false);
              setPage("levers");
            }}
            style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,
              padding:"5px 12px",fontSize:12,color:C.t3}}>↺ Reset</button>
        </div>
      </div>

      <LoopBar active={loopPhase}/>

      <div style={{padding:"20px",minHeight:"calc(100vh - 136px)"}} className="fade-in" key={page}>
        {page==="dist"     && <DistributionPage tenant={activeClient.name} activePartners={activePartners} goLevers={goLevers} toast={toast}/>}
        {page==="home"     && <HomePage role={role} sel={selTenant} setSel={setSelTenant} tab={detailTab} setTab={setDetailTab} goLevers={goLevers} toast={toast} activeClient={activeClient} setPage={setPage}/>}
        {page==="errors"   && <ErrorPage sel={selCluster} setSel={setSelCluster} toast={toast}/>}
        {page==="revenue"  && <RevenuePage role={role} sel={selRisk} setSel={setSelRisk} activeClient={activeClient} activePartners={activePartners} toast={toast}/>}
        {page==="playbooks"&& <PlaybooksPage tab={pbTab} setTab={setPbTab} kanban={kanban} setKanban={setKanban} activeClient={activeClient} activePartners={activePartners} goLevers={goLevers} toast={toast}/>}
        {page==="recovery" && <RecoveryPage activeClient={activeClient} goLevers={goLevers} toast={toast}/>}
        {page==="levers"   && <LeversPage tenant={leversFor || activeClient.name} setTenant={setLeversFor} activePartners={activePartners} onContentErrors={()=>setShowContentErrors(true)} toast={toast}/>}
      </div>
      <ToastHost/>
      {showContentErrors && <ContentErrorModal onClose={()=>setShowContentErrors(false)}/>}
      {innovOpen && <InnovationModal 
        tab={innovTab} 
        setTab={setInnovTab} 
        onClose={()=>setInnovOpen(false)} 
        toast={toast}
      />}
    </div>
  );
}



/* ══════════════════════════════════════════════════════════════════════════
   PAGE 1 — HEALTH OVERVIEW
══════════════════════════════════════════════════════════════════════════ */
function HomePage({ role, sel, setSel, tab, setTab, goLevers, toast, activeClient, setPage }) {
  const isExec = role==="exec";
  const [viewMode, setViewMode] = useState("account"); // "account" or "portfolio"
  const [partnersExpanded, setPartnersExpanded] = useState(false);

  // KPI data based on view mode
  const kpiData = viewMode === "account" ? {
    healthScore: 38,
    healthStatus: "AT RISK",
    healthTrend: "▼ 3 pts vs last week",
    healthAccent: C.amber,
    errorIndex: "15.2/1k",
    errorBadge: "▲ RISING",
    errorSub: "▲ 11 vs last period",
    errorSpark: [8, 9, 10, 11, 12, 13, 15.2],
    revenueAtRisk: "$47.2K",
    revenueSub: "ARI $28.4K · Rate $12.4K · Content $6.4K",
    pulseValue: "9",
    pulseTotal: "27",
    pulseSub: "brands with critical issues",
  } : {
    healthScore: 58,
    healthStatus: "AT RISK",
    healthTrend: "▼ 3 pts vs last week",
    healthAccent: C.amber,
    errorIndex: "8.1/1k",
    errorBadge: "▲ RISING",
    errorSub: "▲ 1.1 vs last period",
    errorSpark: [6.2, 6.8, 7.1, 6.9, 7.8, 8.3, 7.9, 8.1],
    revenueAtRisk: "$47.2K",
    revenueSub: "ARI $28.4K · Rate $12.4K · Content $6.4K",
    pulseValue: isExec ? "9" : "3",
    pulseTotal: isExec ? "84" : "8",
    pulseSub: isExec ? "tenants with critical issues" : "need action today",
  };

  const hs = kpiData.healthScore, circ = 2 * Math.PI * 32;
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px",lineHeight:1}}>Health Overview</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>{viewMode === "account" ? `${activeClient?.name || "Wyndham Hotels"} · 27 brands · 9,849 properties` : (isExec ? "Cross-tenant executive view · 84 active tenants" : "Operator view · Your assigned tenants")}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 16px",fontSize:12,color:C.t2,fontWeight:500}} onClick={()=>toast("Export queued — check your downloads","info")}>↗ Export</button>
          <button className="btn-primary" style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}} onClick={()=>toast("QBR Snapshot generating…","success")}>QBR Snapshot</button>
        </div>
      </div>

      {/* View Toggle Pill */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
        <div style={{display:"inline-flex",background:C.inputBg,borderRadius:10,padding:3,border:`1px solid ${C.border}`}}>
          {[
            { key: "account", label: "🏨 Account View" },
            { key: "portfolio", label: "⬡ Portfolio View" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setViewMode(opt.key)}
              style={{
                padding: "8px 20px",
                fontSize: 12,
                fontWeight: viewMode === opt.key ? 700 : 500,
                color: viewMode === opt.key ? "#fff" : C.t2,
                background: viewMode === opt.key ? C.brand : "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <SH phase="SEE" title={viewMode === "account" ? "Account Health Summary" : "Portfolio Health Summary"} ann="ui" sub={viewMode === "account" ? `${activeClient?.name || "Wyndham Hotels"} · 27 brands` : (isExec ? "All segments · 84 tenants" : "Your assigned tenants · 8 properties")}/>
      <div style={{display:"grid",gridTemplateColumns:"210px 1fr 1fr 1fr",gap:12,marginBottom:22}}>
        <div style={{background:`linear-gradient(145deg,${C.cardBg} 50%,${kpiData.healthAccent}0A 100%)`,border:`1px solid ${C.border}`,borderTop:`3px solid ${kpiData.healthAccent}`,borderRadius:12,padding:"16px",boxShadow:C.shadow,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,textTransform:"uppercase",marginBottom:8,alignSelf:"flex-start"}}>Health Score <Ann type="ui"/></div>
          <div style={{position:"relative",width:84,height:84}}>
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx={42} cy={42} r={32} fill="none" stroke={C.t6} strokeWidth={9}/>
              <circle cx={42} cy={42} r={32} fill={kpiData.healthAccent+"08"} stroke="none"/>
              <circle cx={42} cy={42} r={32} fill="none" stroke={kpiData.healthAccent} strokeWidth={9} strokeDasharray={`${(hs/100)*circ} ${circ}`} strokeLinecap="round" transform="rotate(-90 42 42)"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:26,fontWeight:800,color:kpiData.healthAccent,fontFamily:C.mono,lineHeight:1}}>{hs}</span>
              <span style={{fontSize:9,color:C.t4,fontFamily:C.mono}}>/100</span>
            </div>
          </div>
          <div style={{fontSize:11,color:kpiData.healthAccent,fontWeight:700}}>{kpiData.healthStatus}</div>
          <div style={{fontSize:10,color:C.t4}}>{kpiData.healthTrend}</div>
        </div>
        <KpiTile label="Error Index" value={kpiData.errorIndex} sub={kpiData.errorSub} accent={C.red} spark={kpiData.errorSpark} ann="backed" badge={kpiData.errorBadge}/>
        <KpiTile label={viewMode === "account" ? "Revenue at Risk" : (isExec ? "Revenue at Risk" : "Your Revenue at Risk")} value={kpiData.revenueAtRisk} sub={kpiData.revenueSub} accent={viewMode === "account" ? C.red : C.brand} ann="new"/>
        <div style={{background:`linear-gradient(145deg,${C.cardBg} 50%,${viewMode === "account" ? C.amber : C.cyan}08 100%)`,border:`1px solid ${C.border}`,borderTop:`3px solid ${viewMode === "account" ? C.amber : C.cyan}`,borderRadius:12,padding:"16px",boxShadow:C.shadow}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,textTransform:"uppercase",marginBottom:10}}>{viewMode === "account" ? "Brand Pulse" : (isExec ? "Portfolio Pulse" : "Operator Pulse")} <Ann type="backed"/></div>
          <div style={{fontSize:28,fontWeight:800,fontFamily:C.mono,color:C.t1,marginBottom:4}}>{kpiData.pulseValue}<span style={{fontSize:14,color:C.t4,fontWeight:500}}>/{kpiData.pulseTotal}</span></div>
          <div style={{fontSize:11,color:C.t3,marginBottom:10}}>{kpiData.pulseSub}</div>
          {viewMode === "portfolio" && isExec && (
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[[9,"Critical",C.red],[22,"At risk",C.amber],[53,"Healthy",C.green]].map(([n,l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:4,background:C.t6,borderRadius:2}}><div style={{width:`${(n/84)*100}%`,height:"100%",background:c,borderRadius:2}}/></div>
                  <span style={{fontSize:10,color:c,fontWeight:600,fontFamily:C.mono,width:14,textAlign:"right"}}>{n}</span>
                  <span style={{fontSize:10,color:C.t3,width:50}}>{l}</span>
                </div>
              ))}
            </div>
          )}
          {viewMode === "portfolio" && !isExec && (
            <>
              {[["Wyndham","due today",C.red],["Expedia/Omni","due Mar 6",C.amber]].map(([t,d,c])=>(
                <div key={t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:c+"0C",borderRadius:6,marginBottom:5,border:`1px solid ${c}22`}}>
                  <span style={{fontSize:11,color:C.t2,fontWeight:600}}>{t}</span>
                  <span style={{fontSize:10,color:c,fontWeight:700,fontFamily:C.mono}}>{d}</span>
                </div>
              ))}
            </>
          )}
          {viewMode === "account" && (
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[[9,"Critical",C.red],[11,"At risk",C.amber],[7,"Healthy",C.green]].map(([n,l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:4,background:C.t6,borderRadius:2}}><div style={{width:`${(n/27)*100}%`,height:"100%",background:c,borderRadius:2}}/></div>
                  <span style={{fontSize:10,color:c,fontWeight:600,fontFamily:C.mono,width:14,textAlign:"right"}}>{n}</span>
                  <span style={{fontSize:10,color:C.t3,width:50}}>{l}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account View: Brand Health Grid + Demand Partners */}
      {viewMode === "account" && activeClient?.name !== "Wyndham Hotels" && (
        <Card style={{marginBottom:22,padding:48,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:800,color:C.t1,fontFamily:"'DM Sans',sans-serif",marginBottom:8}}>{activeClient?.name || "Selected Account"}</div>
          <div style={{marginBottom:16}}><ProducerTier name={activeClient?.name}/></div>
          <div style={{fontSize:13,color:C.t3,maxWidth:420,lineHeight:1.6,marginBottom:20}}>Full account diagnostic coming in next release. Switch to Portfolio View to compare all enterprise accounts.</div>
          <button 
            onClick={()=>setViewMode("portfolio")} 
            style={{background:C.brand,border:"none",borderRadius:8,padding:"10px 24px",fontSize:13,color:"#fff",fontWeight:700,cursor:"pointer",boxShadow:`0 2px 8px ${C.brand}44`}}
          >
            View Portfolio →
          </button>
        </Card>
      )}
      {viewMode === "account" && activeClient?.name === "Wyndham Hotels" && (
        <div style={{display:"grid",gridTemplateColumns:"60% 40%",gap:16,marginBottom:22}}>
          {/* Left Panel: Brand Health Grid */}
          <Card>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",display:"flex",alignItems:"center",gap:8}}>
              <Phase label="PRIORITISE"/>
              <span style={{fontSize:13,fontWeight:700,color:C.t1}}>Brand Health Grid</span>
              <Ann type="ui"/>
              <span style={{marginLeft:"auto",fontSize:10,color:C.t4}}>Sort: Health ▴</span>
            </div>
            <div style={{overflowX:"auto",maxHeight:420,overflowY:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"#F8FAFC",position:"sticky",top:0,zIndex:1}}>
                    {["Brand","Tier","Health","Err/1k","Status","Properties"].map(h=>(
                      <th key={h} style={{padding:"8px 12px",textAlign:"left",color:C.t4,fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",letterSpacing:0.3,background:"#F8FAFC"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WYNDHAM_BRANDS.map((b,i)=>(
                    <tr key={b.brand} className="tr-hover" style={{background:i%2===0?"#fff":"#FAFBFD",borderBottom:`1px solid ${C.t6}`}}>
                      <td style={{padding:"9px 12px",fontWeight:500,color:C.t1,fontSize:12}}>{b.brand}</td>
                      <td style={{padding:"9px 12px"}}><span style={{fontSize:10,color:C.t3,background:C.t6,borderRadius:4,padding:"2px 7px"}}>{b.tier}</span></td>
                      <td style={{padding:"9px 12px",fontFamily:C.mono,fontWeight:700,fontSize:12,color:b.health>=70?C.green:b.health>=50?C.amber:C.red}}>{b.health}</td>
                      <td style={{padding:"9px 12px",fontFamily:C.mono,fontWeight:700,fontSize:12,color:b.err>=10?C.red:b.err>=5?C.amber:C.green}}>{b.err}</td>
                      <td style={{padding:"9px 12px"}}><Rag s={b.rag}/></td>
                      <td style={{padding:"9px 12px",fontFamily:C.mono,fontSize:12,color:C.t2}}>{b.properties.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right Panel: Demand Partner Pairings */}
          <Card style={{display:"flex",flexDirection:"column"}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <Phase label="SEE"/>
              <span style={{fontSize:13,fontWeight:700,color:C.t1}}>Demand Partner Pairings</span>
              <span style={{fontSize:9,fontFamily:C.mono,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 8px",fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:C.red,display:"inline-block"}}/>
                ALL PULL
              </span>
            </div>
            <div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,fontSize:11,color:C.t3}}>
              {WYNDHAM_DEMAND_PARTNERS.length + WYNDHAM_DEMAND_PARTNERS_EXTENDED.length} active partners · Push migration opportunity
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
              {WYNDHAM_DEMAND_PARTNERS.map(p=>(
                <div key={p.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid ${C.t6}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.t1}}>{p.name}</div>
                    <div style={{fontSize:11,color:C.t3}}>{p.type}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:12,fontFamily:C.mono,color:C.t2}}>{p.bookings.toLocaleString()} bookings</span>
                    <span style={{fontSize:9,fontFamily:C.mono,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 8px",fontWeight:700}}>PULL</span>
                  </div>
                </div>
              ))}
              {partnersExpanded && WYNDHAM_DEMAND_PARTNERS_EXTENDED.map(p=>(
                <div key={p.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid ${C.t6}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.t1}}>{p.name}</div>
                    <div style={{fontSize:11,color:C.t3}}>{p.type}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:12,fontFamily:C.mono,color:C.t2}}>{p.bookings.toLocaleString()} bookings</span>
                    <span style={{fontSize:9,fontFamily:C.mono,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 8px",fontWeight:700}}>PULL</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
              <button 
                onClick={()=>setPartnersExpanded(!partnersExpanded)} 
                style={{background:C.brandDim,border:`1px solid ${C.brandBorder}`,borderRadius:6,padding:"6px 14px",fontSize:11,color:C.brand,fontWeight:600,cursor:"pointer",transition:"all 0.12s"}}
              >
                {partnersExpanded ? "Show Less ↑" : "View All Partners ↓"}
              </button>
              {partnersExpanded && (
                <button style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 12px",fontSize:10,color:C.t3,cursor:"pointer"}}>⬇ Export</button>
              )}
            </div>
            {/* Push Opportunity Callout */}
            <div style={{margin:"0 16px 16px",padding:12,background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderLeft:`3px solid ${C.amber}`,borderRadius:8}}>
              <span style={{fontSize:12,color:C.amber,lineHeight:1.5}}>⚡ <b>Push Opportunity</b> — migrating top 3 partners to Push could recover an estimated $180K–$240K in annual booking volume.</span>
            </div>
          </Card>
        </div>
      )}

      {/* Portfolio View: Original Priority Grid + DetailPane */}
      {viewMode === "portfolio" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 368px",gap:14,marginBottom:22}}>
          <Card>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",display:"flex",alignItems:"center",gap:8}}>
              <Phase label="PRIORITISE"/>
              <span style={{fontSize:13,fontWeight:700,color:C.t1}}>{isExec ? "Priority Grid — Impact × Urgency" : "Your Assigned Tenants"}</span>
              <Ann type="ui"/>
              <span style={{marginLeft:"auto",fontSize:10,color:C.t4}}>Sort: Impact ▾</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table>
                <thead>
                  <tr style={{background:"#F8FAFC"}}>
                    {["Tenant","Tier","Health","Err/1k","ARR $M","Trend","Status","Owner",""].map(h=>(
                      <th key={h} style={{padding:"8px 12px",textAlign:"left",color:C.t4,fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",letterSpacing:0.3}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...TENANTS].sort((a,b)=>a.health-b.health).map((t,i)=>{
                    const s = sel?.id===t.id;
                    return (
                      <tr key={t.id} onClick={()=>setSel(t)} className={s?"tr-sel":"tr-hover"} style={{background:s?"#F5F3FF":i%2===0?"#fff":"#FAFBFD",borderBottom:`1px solid ${C.t6}`,cursor:"pointer",borderLeft:`3px solid ${s?C.brand:"transparent"}`,transition:"all 0.1s"}}>
                        <td style={{padding:"9px 12px",fontWeight:s?700:500,color:s?C.brand:C.t1,fontSize:12}}>{t.name}</td>
                        <td style={{padding:"9px 12px"}}><ProducerTier name={t.name}/></td>
                        <td style={{padding:"9px 12px"}}><span style={{fontSize:10,color:C.t3,background:C.t6,borderRadius:4,padding:"2px 7px"}}>{t.type}</span></td>
                        <td style={{padding:"9px 12px"}}><Rag s={t.rag}/></td>
                        <td style={{padding:"9px 12px",fontFamily:C.mono,fontWeight:700,fontSize:12,color:{red:C.red,amber:C.amber,green:C.green}[t.rag]}}>{t.err}</td>
                        <td style={{padding:"9px 12px",fontFamily:C.mono,fontSize:12,color:C.t2}}>{t.arr}</td>
                        <td style={{padding:"9px 12px"}}><Trend v={t.trend} invert/></td>
                        <td style={{padding:"9px 12px"}}><StatusChip s={t.status}/></td>
                        <td style={{padding:"9px 12px",color:C.t3,fontSize:11}}>{t.owner}</td>
                        <td style={{padding:"9px 10px"}}>
                          <button onClick={e=>{e.stopPropagation();goLevers(t.name);}} style={{background:C.brandDim,border:`1px solid ${C.brandBorder}`,borderRadius:6,padding:"3px 9px",fontSize:10,color:C.brand,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.12s"}} onMouseEnter={e=>{e.target.style.background=C.brand;e.target.style.color="#fff";}} onMouseLeave={e=>{e.target.style.background=C.brandDim;e.target.style.color=C.brand;}}>⬡ 16 →</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <DetailPane row={sel} tab={tab} setTab={setTab} goLevers={goLevers}/>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{padding:16}}>
          <SH phase="PREVENT" title="Emerging Risk Patterns" ann="new"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
{[["ARI sync failure pattern across 3 Enterprise tenants this week","red"],["Rate restriction spikes correlate with weekend inventory windows","amber"],["Content score decline precedes error rate increase by ~14 days","amber"]].map(([txt,s])=>(
  <div key={txt} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:{red:C.redBg,amber:C.amberBg}[s]||C.rowAlt,border:`1px solid ${{red:C.redBorder,amber:C.amberBorder}[s]||C.border}`,borderLeft:`3px solid ${C[s]}`}}>
  <span style={{fontSize:12,color:C.t2,flex:1,lineHeight:1.5}}>{txt}</span>
  <button onClick={()=>setPage("errors")} className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 10px",fontSize:10,color:C.t3,flexShrink:0,cursor:"pointer"}}>View →</button>
  </div>
  ))}
          </div>
        </Card>
        <Card style={{padding:16}}>
          <SH phase="PREVENT" title="Recommended Preventive Playbooks" ann="ui"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
{["Standardise retry policy for ARI sync across all Tier 1 tenants","Add pre-deployment health check for onboarding + content modules","Set automated alert threshold for error index > 10 /1k events"].map((t,i)=>(
  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#F8FAFC",borderRadius:8,border:`1px solid ${C.border}`}}>
  <div style={{width:4,height:4,borderRadius:"50%",background:C.blue,flexShrink:0}}/>
  <span style={{fontSize:12,color:C.t2,flex:1,lineHeight:1.5}}>{t}</span>
  <button onClick={()=>setPage("playbooks")} className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 10px",fontSize:10,color:C.t3,flexShrink:0,cursor:"pointer"}}>Add →</button>
  </div>
  ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DetailPane({ row, tab, setTab, goLevers }) {
  if (!row) return (
    <Card style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,padding:24,minHeight:200}}>
      <div style={{fontSize:28,opacity:0.15}}>⬡</div>
      <div style={{fontSize:12,color:C.t4}}>Select a tenant to inspect</div>
    </Card>
  );
  const TABS=[["snapshot","Snapshot"],["drivers","Drivers"],["actions","Actions"],["impact","Impact"]];
  const phaseMap={snapshot:"SEE",drivers:"PRIORITISE",actions:"FIX",impact:"PROVE"};
  return (
    <Card style={{display:"flex",flexDirection:"column",overflow:"hidden"}} selected>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div style={{fontSize:14,fontWeight:800,color:C.t1,fontFamily:"'DM Sans',sans-serif",lineHeight:1.2,flex:1,marginRight:8}}>{row.name}</div>
          <Rag s={row.rag}/>
        </div>
        <div style={{fontSize:11,color:C.t3,marginBottom:10}}>ARR: <b style={{fontFamily:C.mono,color:C.t2}}>${row.arr}M</b> · Owner: {row.owner}{row.leversRed>0 && <span style={{marginLeft:8,color:C.red,fontWeight:700}}>{row.leversRed} lever{row.leversRed!==1?"s":""} critical</span>}</div>
        <button onClick={()=>goLevers(row.name)} style={{width:"100%",background:`linear-gradient(135deg,${C.brandDim},${C.brand}18)`,border:`1px solid ${C.brandBorder}`,borderRadius:8,padding:"8px",fontSize:12,color:C.brand,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.15s"}}>⬡ View 16-Lever Diagnostic — {row.name.split(" ")[0]}<span style={{fontSize:10,opacity:0.7}}>→</span></button>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        {TABS.map(([k,l])=>{
          const active = tab===k;
          const p = PHASE_CFG[phaseMap[k]];
          return <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 4px",background:active?p.bg:"transparent",border:"none",borderBottom:`2px solid ${active?p.color:"transparent"}`,color:active?p.color:C.t3,fontSize:11,fontWeight:active?700:400,transition:"all 0.15s"}}>{l}</button>;
        })}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:14}} className="fade-in" key={tab}>
        {tab==="snapshot" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Health",row.health+"/100",C.amber],["Error /1k",row.err,C.red],["ARR","$"+row.arr+"M",C.brand],["Trend",(row.trend>0?"+":"")+row.trend+"%",row.trend<0?C.red:C.green]].map(([l,v,c])=>(
                <div key={l} style={{background:`linear-gradient(145deg,#F8FAFC,${c}06)`,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:C.t3,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:C.mono,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{padding:"8px 10px",background:C.t6,borderRadius:6,fontSize:10,color:C.t3,fontStyle:"italic"}}>Sources: RGI Bookings + Errors screens · backed by current data</div>
          </div>
        )}
        {tab==="drivers" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["ARI sync failure — Expedia","red","$28.4K/day"],["Rate restriction block","amber","$12.4K/day"],["Content score <55","amber","Conv −14%"]].slice(0,row.rag==="green"?1:row.rag==="amber"?2:3).map(([t,s,v])=>(
              <div key={t} style={{padding:"10px 12px",borderLeft:`3px solid ${C[s]}`,background:{red:C.redBg,amber:C.amberBg}[s],border:`1px solid ${{red:C.redBorder,amber:C.amberBorder}[s]}`,borderRadius:"0 8px 8px 0"}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t1,marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,fontFamily:C.mono,color:C[s],fontWeight:700}}>{v}</div>
              </div>
            ))}
          </div>
        )}
        {tab==="actions" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PLAYBOOKS.slice(0,3).map(pb=>(
              <div key={pb.id} style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t1,marginBottom:5}}>{pb.title}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:10,color:C.t3}}>Due: <span style={{color:pb.due==="Today"?C.red:C.t2,fontWeight:600}}>{pb.due}</span>{" · "}{pb.owner}</span>
                  <StatusChip s={pb.status}/>
                </div>
              </div>
            ))}
            <button style={{background:"#F8FAFC",border:`1px dashed ${C.t5}`,borderRadius:8,padding:"9px",color:C.t3,fontSize:11,textAlign:"center"}}>+ Create New Playbook</button>
          </div>
        )}
        {tab==="impact" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Est. ARR Protected (30d) <Ann type="new"/></div>
              <div style={{fontSize:30,fontWeight:800,fontFamily:C.mono,color:C.green}}>$42K</div>
              <div style={{fontSize:11,color:C.t3,marginTop:3}}>model-based estimate</div>
            </div>
            <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>Error Rate Trend — 8 Weeks</div>
              <Spark data={[14.2,13.8,12.1,13.4,11.9,10.8,9.4,8.1]} color={C.green} w={294} h={48}/>
              <div style={{fontSize:11,color:C.green,marginTop:8,fontWeight:600}}>▼ 43% since playbook applied</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════�����════════════���════════════════════════════════════════════
   PAGE 2 — ERROR INTELLIGENCE
═════════════════════════════════════════════════════════════════════════��� */
function ErrorPage({ sel, setSel, toast }) {
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Error Intelligence</h1>
          <div style={{fontSize:12,marginTop:4}}><span style={{color:C.red,fontWeight:700}}>These aren't system bugs — these are guests who couldn't book.</span><span style={{color:C.t3}}> Every error = a lost arrival.</span></div>
        </div>
        <button style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",fontSize:12,color:C.t2}}>↓ Export</button>
      </div>
      <Card style={{padding:"12px 16px",marginBottom:16,display:"flex",gap:16,alignItems:"flex-end",flexWrap:"wrap"}}>
        {[["Brand","ALL"],["Demand Partner","ALL"],["Error Type","Booking Errors"]].map(([l,v])=>(
          <div key={l}>
            <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:0.4}}>{l}</div>
            <select style={{background:C.inputBg,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:"6px 10px",fontSize:12,outline:"none",minWidth:120}}><option>{v}</option></select>
          </div>
        ))}
        <div>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:0.4}}>Date Range</div>
          <input defaultValue="1 Mar – 31 Mar '26" style={{background:C.inputBg,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:"6px 10px",fontSize:12,outline:"none",width:160}}/>
        </div>
        <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 20px",fontSize:12,color:"#fff",fontWeight:700,marginLeft:"auto",boxShadow:`0 2px 8px ${C.brand}44`}}>Search</button>
        <Ann type="backed"/>
      </Card>
      <SH phase="SEE" title="Error Summary — March 2026" ann="backed"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[["Total Errors MTD","601",C.red,"+18% vs Feb","backed"],["MTTR Average","4.2h",C.amber,"↓ 0.3h improving","backed"],["Tenants Impacted","9",C.red,"3 currently active","backed"],["Est. Bookings Lost","289",C.brand,"this period","new"]].map(([l,v,c,s,a])=>(
          <KpiTile key={l} label={l} value={v} sub={s} accent={c} ann={a}/>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"310px 1fr",gap:14}}>
        <Card>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><Phase label="PRIORITISE"/><span style={{fontSize:12,fontWeight:700,color:C.t1}}>Error Clusters</span></div>
            <span style={{fontSize:10,color:C.t4}}>Rev Impact ▾</span>
          </div>
          {ERROR_CLUSTERS.map(ec=>{
            const isSel = sel?.id===ec.id;
            const sc = {red:C.red,amber:C.amber,green:C.green}[ec.sev];
            return (
              <div key={ec.id} onClick={()=>setSel(ec)} style={{padding:"11px 14px",borderBottom:`1px solid ${C.t6}`,cursor:"pointer",background:isSel?"#F5F3FF":"#fff",borderLeft:`3px solid ${isSel?C.brand:sc}`,transition:"background 0.1s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                  <span style={{fontSize:12,fontWeight:600,color:isSel?C.brand:C.t1,lineHeight:1.3,flex:1,marginRight:8}}>{ec.name}</span>
                  <Rag s={ec.sev}/>
                </div>
                <div style={{display:"flex",gap:10,fontSize:11}}>
                  <span style={{color:C.t3}}>Freq: <b style={{fontFamily:C.mono,color:C.t2}}>{ec.freq}</b></span>
                  <span style={{color:C.t3}}>Tenants: <b style={{fontFamily:C.mono,color:sc}}>{ec.tenants}</b></span>
                  <span style={{marginLeft:"auto",fontFamily:C.mono,fontWeight:700,color:sc}}>{ec.impact}</span>
                </div>
              </div>
            );
          })}
        </Card>
        {sel && (
          <Card key={sel.id} className="fade-in" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:C.t1,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>{sel.name}</div>
                <div style={{fontSize:11,color:C.t3,display:"flex",alignItems:"center",gap:6}}><span>Type: <b>{sel.type}</b></span><span>·</span><span>{sel.freq} events</span><span>·</span><span>{sel.tenants} tenants</span><Ann type="backed"/></div>
              </div>
              <div style={{textAlign:"right"}}><Phase label="FIX"/><div style={{fontSize:24,fontWeight:800,fontFamily:C.mono,color:C.red,marginTop:4}}>{sel.impact}</div></div>
            </div>
            <div style={{padding:"16px 18px",flex:1,overflowY:"auto"}}>
              <SH phase="SEE" title="Error Volume — 12-Day Trend" ann="backed"/>
              <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:18}}>
                <svg width="100%" height="72" viewBox={`0 0 ${sel.bars.length*44} 72`} preserveAspectRatio="none">
                  {sel.bars.map((v,i)=>{
                    const h=Math.max(4,(v/Math.max(...sel.bars))*64);
                    const isMax = v===Math.max(...sel.bars);
                    return <g key={i}><rect x={i*44+4} y={72-h} width={36} height={h} rx={4} fill={isMax?C.red+"CC":C.brand+"44"}/>{isMax && <rect x={i*44+4} y={72-h} width={36} height={3} rx={2} fill={C.red}/>}</g>;
                  })}
                </svg>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.t4,fontFamily:C.mono,marginTop:6}}>
                  {["F22","F23","F24","F25","F26","F27","F28","M1","M2","M3","M4","M5"].map(d=><span key={d}>{d}</span>)}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
                <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Impacted Partners <Ann type="backed"/></div>
                  {["Expedia","Booking.com","Sabre GDS"].slice(0,sel.tenants).map((p,i)=>(
                    <div key={p} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:i<sel.tenants-1?`1px solid ${C.t6}`:"none"}}>
                      <span style={{fontSize:12,color:C.t2}}>● {p}</span>
                      <span style={{fontFamily:C.mono,fontSize:11,color:C.red,fontWeight:700}}>{Math.floor(sel.freq/sel.tenants)}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Root Cause Hints <Ann type="new"/></div>
                  <div style={{fontSize:12,color:C.amber,lineHeight:1.6,fontWeight:600}}>ARI date range mismatch<br/>Rate push timestamp lag<br/><span style={{color:C.t3,fontWeight:400}}>Est. fix effort: 2h</span></div>
                </div>
              </div>
              <SH phase="FIX" title="Actions"/>
              <div style={{display:"flex",gap:8}}>
                {[["▶ Launch Playbook",C.brand,C.brand+"22","#fff","success","Playbook launched — assigned to Marcus T."],["Assign Owner","transparent",C.border,C.t2,"info","Owner assignment opened"],["✓ Mark Mitigated",C.greenBg,C.greenBorder,C.green,"success","Cluster marked as mitigated"]].map(([l,bg,b,c,type,msg])=>(
                  <button key={l} className="btn-ghost" onClick={()=>toast(msg,type)} style={{flex:1,background:bg,border:`1px solid ${b}`,borderRadius:8,padding:"9px",color:c,fontSize:12,fontWeight:l.includes("Launch")?700:500,boxShadow:l.includes("Launch")?`0 2px 8px ${C.brand}33`:undefined}}>{l}</button>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 3 — REVENUE AT RISK
══════════════════════════════════════════════════════════════════════════ */
function RevenuePage({ role, sel, setSel, activeClient, activePartners, toast }) {
  const [view, setView] = useState("portfolio");

  // Build account-specific lever list sorted by impact descending
  const acctLevers = React.useMemo(() => {
    if (!activeClient) return [];
    const tenant = activeClient.name;
    const partnerKey = (activePartners || [])
      .filter(p => p !== "All Brands")
      .map(p => `${tenant}|${p}`)
      .find(k => ALL_LEVERS[k]) || null;
    const buckets = (partnerKey && ALL_LEVERS[partnerKey]) || ALL_LEVERS[tenant] || DEFAULT_LEVERS;
    return buckets.flatMap(b => b.levers)
      .map(l => ({ ...l, impactNum: parseFloat((l.impact||"$0").replace(/[$K,]/g,"")) * (l.impact?.includes("K")?1000:1) }))
      .sort((a,b) => b.impactNum - a.impactNum);
  }, [activeClient, activePartners]);

  const ST = { critical:{color:"#DC2626",bg:"#FEF2F2",label:"Critical"}, medium:{color:"#D97706",bg:"#FFFBEB",label:"At Risk"}, healthy:{color:"#059669",bg:"#F0FDF4",label:"Healthy"} };

  return (
    <div className="fade-in">
      {/* Page header + toggle */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Revenue at Risk</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>
            {view==="portfolio" ? "All enterprise accounts · Portfolio risk overview" : `${activeClient?.name} · ${(activePartners||[]).join(" + ")} · Account detail view`}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:9,padding:3,boxShadow:C.shadow}}>
            {[["portfolio","Portfolio View"],["account","Account View"]].map(([k,l])=>(
              <button key={k} onClick={()=>setView(k)}
                style={{background:k===view?C.brand:"transparent",border:"none",borderRadius:7,
                  padding:"6px 16px",fontSize:12,color:k===view?"#fff":C.t3,
                  fontWeight:k===view?700:500,cursor:"pointer",transition:"all 0.15s"}}>{l}</button>
            ))}
          </div>
          <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>↓ Export to QBR</button>
        </div>
      </div>

      {/* ── ACCOUNT VIEW ── */}
      {view==="account" && (
        <div>
          <SH phase="PRIORITISE" title={`${activeClient?.short || activeClient?.name} · Revenue Risk by Lever`} ann="new"/>
          {/* Summary strip */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
            {[
              ["CRITICAL LEVERS", acctLevers.filter(l=>l.status==="critical").length, C.red, acctLevers.filter(l=>l.status==="critical").reduce((s,l)=>s+l.impactNum,0)],
              ["AT RISK LEVERS",  acctLevers.filter(l=>l.status==="medium").length,   C.amber, acctLevers.filter(l=>l.status==="medium").reduce((s,l)=>s+l.impactNum,0)],
              ["HEALTHY LEVERS",  acctLevers.filter(l=>l.status==="healthy").length,  C.green, 0],
            ].map(([label,count,color,risk])=>(
              <div key={label} style={{background:`linear-gradient(145deg,${C.cardBg} 40%,${color}08 100%)`,border:`1px solid ${C.border}`,borderTop:`3px solid ${color}`,borderRadius:12,padding:"16px",boxShadow:C.shadow,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,textTransform:"uppercase",marginBottom:8}}>{label}</div>
                <div style={{fontSize:36,fontWeight:800,fontFamily:C.mono,color,letterSpacing:"-1px",lineHeight:1}}>{count}</div>
                {risk>0 && <div style={{fontSize:11,color:C.t3,marginTop:6}}>${(risk/1000).toFixed(1)}K at risk</div>}
              </div>
            ))}
          </div>
          {/* Lever table */}
          <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:12,boxShadow:C.shadow,overflow:"hidden"}}>
            <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",display:"flex",alignItems:"center",gap:8}}>
              <Phase label="PRIORITISE"/>
              <span style={{fontSize:12,fontWeight:700,color:C.t1}}>16 Levers — Ranked by Revenue Impact</span>
              <span style={{fontSize:11,color:C.t3,marginLeft:"auto"}}>{activeClient?.name}</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#F8FAFC"}}>{["#","Lever","Domain","Status","Revenue at Risk","Health Score"].map(h=><th key={h} style={{padding:"8px 14px",textAlign:"left",color:C.t4,fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {acctLevers.map((l,i)=>{
                  const st = ST[l.status] || ST.healthy;
                  return (
                    <tr key={l.id} style={{borderBottom:`1px solid ${C.t6}`,background:i%2===0?"#fff":"#FAFBFD"}}>
                      <td style={{padding:"9px 14px",color:C.t4,fontSize:11,fontFamily:C.mono,fontWeight:600}}>#{i+1}</td>
                      <td style={{padding:"9px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:14}}>{l.icon}</span>
                          <span style={{fontSize:12,fontWeight:600,color:C.t1}}>{l.name}</span>
                        </div>
                      </td>
                      <td style={{padding:"9px 14px",fontSize:11,color:C.t3}}>{l.domain||"—"}</td>
                      <td style={{padding:"9px 14px"}}>
                        <span style={{fontSize:11,fontWeight:700,color:st.color,background:st.bg,padding:"2px 8px",borderRadius:5}}>{st.label}</span>
                      </td>
                      <td style={{padding:"9px 14px",fontFamily:C.mono,fontWeight:700,fontSize:13,color:l.status==="critical"?C.red:l.status==="medium"?C.amber:C.t4}}>{l.impact}</td>
                      <td style={{padding:"9px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:60,height:5,background:C.t6,borderRadius:3,overflow:"hidden"}}>
                            <div style={{width:`${l.score}%`,height:"100%",background:l.score<40?C.red:l.score<70?C.amber:C.green,borderRadius:3}}/>
                          </div>
                          <span style={{fontFamily:C.mono,fontSize:11,color:C.t2}}>{l.score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PORTFOLIO VIEW (existing) ── */}
      {view==="portfolio" && (
      <div>
      <SH phase="SEE" title="Risk Summary" ann="new"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[["TOTAL ARR AT RISK","$29.5M",C.red,"12 high-risk tenants"],["IMMINENT RENEWALS","3",C.amber,"<90 days · $16.1M combined"],["ARR PROTECTED (30d)","$2.1M",C.green,"via active playbooks · est."]].map(([l,v,c,s])=>(
          <div key={l} style={{background:`linear-gradient(145deg,${C.cardBg} 40%,${c}08 100%)`,border:`1px solid ${C.border}`,borderTop:`3px solid ${c}`,borderRadius:12,padding:"18px",boxShadow:C.shadow,textAlign:"center"}}>
            <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,textTransform:"uppercase",marginBottom:12}}>{l} <Ann type="new"/></div>
            <div style={{fontSize:38,fontWeight:800,fontFamily:C.mono,color:c,letterSpacing:"-1.5px",lineHeight:1}}>{v}</div>
            <div style={{fontSize:11,color:C.t3,marginTop:8}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
        <Card>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",display:"flex",alignItems:"center",gap:8}}><Phase label="PRIORITISE"/><span style={{fontSize:12,fontWeight:700,color:C.t1}}>Revenue Risk Grid</span><Ann type="backed"/></div>
          <table>
            <thead>
              <tr style={{background:"#F8FAFC"}}>{["Tenant","ARR $M","Risk Score","Key Drivers","Renewal","Owner","Trend"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:C.t4,fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {RISK_ROWS.map((r,i)=>{
                const isSel = sel?.tenant===r.tenant;
                const rc = r.risk>80?C.red:r.risk>50?C.amber:C.green;
                return (
                  <tr key={r.tenant} onClick={()=>setSel(r)} className={isSel?"tr-sel":"tr-hover"} style={{background:isSel?"#F5F3FF":i%2===0?"#fff":"#FAFBFD",borderBottom:`1px solid ${C.t6}`,cursor:"pointer",borderLeft:`3px solid ${isSel?C.brand:"transparent"}`}}>
                    <td style={{padding:"9px 12px",fontWeight:isSel?700:500,color:isSel?C.brand:C.t1,fontSize:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>{r.tenant}<ProducerTier name={r.tenant}/></div>
                  </td>
                    <td style={{padding:"9px 12px",fontFamily:C.mono,fontWeight:600,color:C.t2,fontSize:12}}>{r.arr}</td>
                    <td style={{padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:56,height:6,background:C.t6,borderRadius:3,overflow:"hidden"}}><div style={{width:`${r.risk}%`,height:"100%",background:rc,borderRadius:3}}/></div><span style={{fontFamily:C.mono,fontSize:11,color:rc,fontWeight:700}}>{r.risk}</span></div></td>
                    <td style={{padding:"9px 12px",color:C.t3,fontSize:11}}>{r.drivers[0]}</td>
                    <td style={{padding:"9px 12px",fontFamily:C.mono,fontSize:11,color:r.renewal.includes("Apr")||r.renewal.includes("May")?C.amber:C.t3,fontWeight:r.renewal.includes("Apr")?700:400}}>{r.renewal}</td>
                    <td style={{padding:"9px 12px",color:C.t3,fontSize:11}}>{r.owner}</td>
                    <td style={{padding:"9px 12px"}}><Trend v={r.trend} invert/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        {sel && (
          <Card key={sel.tenant} style={{padding:16,overflowY:"auto"}} selected>
            <Phase label="PROVE"/>
            <div style={{fontSize:15,fontWeight:800,color:C.t1,fontFamily:"'DM Sans',sans-serif",margin:"10px 0 4px"}}>{sel.tenant}</div>
            <div style={{fontSize:11,color:C.t3,marginBottom:14}}>ARR: <b style={{fontFamily:C.mono}}>${sel.arr}M</b> · Renewal: <b style={{color:C.amber}}>{sel.renewal}</b></div>
            <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:10,padding:"12px",marginBottom:12}}>
              <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Risk Score <Ann type="new"/></div>
              <div style={{width:"100%",height:8,background:C.t6,borderRadius:4,marginBottom:8,overflow:"hidden"}}><div style={{width:`${sel.risk}%`,height:"100%",background:`linear-gradient(90deg,${sel.risk>80?C.red:C.amber},${sel.risk>80?C.red+"88":C.amber+"88"})`,borderRadius:4}}/></div>
              <span style={{fontSize:24,fontWeight:800,fontFamily:C.mono,color:sel.risk>80?C.red:sel.risk>50?C.amber:C.green}}>{sel.risk}</span><span style={{fontSize:12,color:C.t3}}>/100</span>
            </div>
            <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Key Drivers</div>
            {sel.drivers.map(d=><div key={d} style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:7,padding:"7px 10px",marginBottom:7,fontSize:12,color:C.t2}}>⚠ {d}</div>)}
            <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,margin:"12px 0 8px"}}>ARR Trend <Ann type="backed"/></div>
            <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px"}}><Spark data={[sel.arr*1.1,sel.arr*1.08,sel.arr*1.05,sel.arr*1.04,sel.arr*1.02,sel.arr*1.01,sel.arr]} color={C.amber} w={234} h={42}/></div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button className="btn-primary" onClick={()=>toast("Playbook assigned — check Action Queue","success")} style={{flex:1,background:C.brand,border:"none",borderRadius:8,padding:"8px",color:"#fff",fontSize:12,fontWeight:700,boxShadow:`0 2px 8px ${C.brand}33`}}>Assign Playbook</button>
              <button className="btn-ghost" onClick={()=>toast("CSM alert sent to "+sel.owner,"info")} style={{flex:1,background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px",color:C.t2,fontSize:12}}>CSM Alert</button>
            </div>
          </Card>
        )}
      </div>
      </div>)}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 4 — PLAYBOOKS & ACTION QUEUE
══════════════════════════════════════════════════════════════════════════ */
function PlaybooksPage({ tab, setTab, kanban, setKanban, activeClient, activePartners, goLevers, toast }) {
  const relativeDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const kanbanCols = [["To Review","Unassigned","PRIORITISE"],["In Progress","InProgress","FIX"],["Proved","Mitigated","PROVE"],["Preventive","Active","PREVENT"]];
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Playbooks & Action Queue</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>Operationalise remediation · Track recovery · Build preventive standards</div>
        </div>
        <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>+ New Action</button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
        <div style={{display:"flex",background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:9,padding:3,gap:2,boxShadow:C.shadow}}>
          {[["queue","Action Queue"],["smart","Smart Queues"],["library","Playbook Library"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{background:tab===k?C.brand:"transparent",border:"none",borderRadius:7,padding:"6px 18px",fontSize:12,color:tab===k?"#fff":C.t3,fontWeight:tab===k?700:500,transition:"all 0.15s"}}>{l}</button>
          ))}
        </div>
        {tab==="queue" && <button onClick={()=>setKanban(!kanban)} className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 14px",fontSize:12,color:kanban?C.brand:C.t3,fontWeight:kanban?700:400}}>{kanban ? "⊞ List View" : "⬡ Kanban View"}</button>}
      </div>
      {tab==="queue" && !kanban && (<>
        <SH phase="FIX" title="Open Actions" ann="ui"/>
        <Card>
          <table>
            <thead><tr style={{background:"#F8FAFC"}}>{["Action","Tenant","Category","Owner","Due","Status","Impact"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",color:C.t4,fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{PLAYBOOKS.map((pb,i)=>(
              <tr key={pb.id} className="tr-hover" style={{background:i%2===0?"#fff":"#FAFBFD",borderBottom:`1px solid ${C.t6}`}}>
                <td style={{padding:"10px 12px",fontWeight:600,color:C.t1,fontSize:12}}>{pb.title}</td>
                <td style={{padding:"10px 12px",color:C.t2,fontSize:12}}>{pb.tenant}</td>
                <td style={{padding:"10px 12px"}}><span style={{fontSize:10,background:"#F1F5F9",border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 8px",color:C.t3}}>{pb.cat}</span></td>
                <td style={{padding:"10px 12px",color:C.t3,fontSize:11}}>{pb.owner}</td>
                <td style={{padding:"10px 12px",fontFamily:C.mono,fontSize:11,color:pb.due==="Today"?C.red:C.t2,fontWeight:pb.due==="Today"?700:400}}>{pb.due}</td>
                <td style={{padding:"10px 12px"}}><StatusChip s={pb.status}/></td>
                <td style={{padding:"10px 12px",fontFamily:C.mono,color:C.green,fontWeight:700,fontSize:11}}>{pb.impact}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      </>)}
      {tab==="queue" && kanban && (<>
        <SH phase="FIX" title="Kanban — SEE → PROVE → PREVENT Flow" ann="ui"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {kanbanCols.map(([col,stat,ph])=>{
            const items = PLAYBOOKS.filter(p=>p.status===stat);
            const p = PHASE_CFG[ph];
            return (
              <div key={col} style={{background:C.cardBg,border:`1px solid ${C.border}`,borderTop:`3px solid ${p.color}`,borderRadius:12,boxShadow:C.shadow,overflow:"hidden"}}>
                <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}`,background:p.bg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}><Phase label={ph}/><span style={{fontSize:12,fontWeight:700,color:C.t1}}>{col}</span></div>
                  <span style={{fontFamily:C.mono,fontSize:11,color:C.t4,background:"#fff",borderRadius:4,padding:"1px 7px",border:`1px solid ${C.border}`}}>{items.length}</span>
                </div>
                <div style={{padding:10,display:"flex",flexDirection:"column",gap:8,minHeight:100}}>
                  {items.map(pb=>(
                    <div key={pb.id} className="card-hover" style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 12px"}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.t1,marginBottom:4,lineHeight:1.3}}>{pb.title}</div>
                      <div style={{fontSize:11,color:C.t3,marginBottom:7}}>{pb.tenant}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:9,background:"#F1F5F9",borderRadius:4,padding:"2px 7px",color:C.t3,border:`1px solid ${C.border}`}}>{pb.cat}</span>
                        <span style={{fontSize:11,fontFamily:C.mono,color:C.green,fontWeight:700}}>{pb.impact}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
                        <span style={{fontSize:10,color:pb.due==="Today"?C.red:C.t4,fontFamily:C.mono}}>Due: {pb.due}</span>
                        <span style={{fontSize:10,color:C.t3,fontFamily:C.mono}}>⏱ {pb.effort}</span>
                      </div>
                      <div style={{fontSize:10,color:C.t4,marginTop:4}}>👤 {pb.owner}</div>
                    </div>
                  ))}
                  {items.length===0 && <div style={{textAlign:"center",padding:"24px 0",color:C.t5,fontSize:12}}>No items</div>}
                </div>
              </div>
            );
          })}
        </div>
      </>)}
      {tab==="smart" && (() => {
        // key on activeClient forces recompute when account switches
        // Build lever list for active account
        const tenant = activeClient?.name || "";
        const partnerKey = (activePartners || [])
          .filter(p => p !== "All Brands")
          .map(p => `${tenant}|${p}`)
          .find(k => ALL_LEVERS[k]) || null;
        const buckets = (partnerKey && ALL_LEVERS[partnerKey]) || ALL_LEVERS[tenant] || DEFAULT_LEVERS;
        const levers = buckets.flatMap(b => b.levers);

        const impactNum = l => parseFloat(l.impact.replace(/[^0-9.]/g,"")) * (l.impact.includes("K")?1000:1);
        const tag = l => ISSUE_TAGS[l.id] || ["PIPE","RG Fix"];

        const PLAYLISTS = [
          {
            id:"fix-week", icon:"⚡", label:"Fix This Week",
            badge:C.red, badgeBg:C.redBg, badgeBdr:C.redBorder,
            tagline:"Highest impact fixes — sorted by revenue at risk",
            phase:"PRIORITISE",
            items: levers.filter(l=>l.status==="critical")
                         .sort((a,b)=>impactNum(b)-impactNum(a))
                         .slice(0,8),
          },
          {
            id:"rg-owns", icon:"🔧", label:"RateGain Owns",
            badge:C.green, badgeBg:C.greenBg, badgeBdr:C.greenBorder,
            tagline:"Actions RateGain can resolve without client dependency",
            phase:"FIX",
            items: levers.filter(l=>l.status!=="healthy" && tag(l)[1]==="RG Fix")
                         .sort((a,b)=>impactNum(b)-impactNum(a))
                         .slice(0,15),
          },
          {
            id:"client-it", icon:"🏢", label:"Client IT Queue",
            badge:C.amber, badgeBg:C.amberBg, badgeBdr:C.amberBorder,
            tagline:"Escalations ready for your internal IT team",
            phase:"FIX",
            items: levers.filter(l=>l.status!=="healthy" && tag(l)[1]==="Client IT")
                         .sort((a,b)=>impactNum(b)-impactNum(a))
                         .slice(0,15),
          },
          {
            id:"property", icon:"📋", label:"Property Outreach",
            badge:C.blue, badgeBg:C.blueBg, badgeBdr:C.blueBorder,
            tagline:"Properties that need direct outreach to resolve",
            phase:"FIX",
            items: levers.filter(l=>l.status!=="healthy" && tag(l)[1]==="Property")
                         .sort((a,b)=>impactNum(b)-impactNum(a))
                         .slice(0,15),
          },
          {
            id:"quick-wins", icon:"✨", label:"Quick Wins",
            badge:C.brand, badgeBg:C.brandDim, badgeBdr:C.brandBorder,
            tagline:"Medium effort, meaningful return — act now",
            phase:"SEE",
            items: levers.filter(l=>l.status==="medium" && tag(l)[1]==="RG Fix" && impactNum(l)>=10000)
                         .sort((a,b)=>impactNum(b)-impactNum(a))
                         .slice(0,15),
          },
        ];

        return (
          <div key={activeClient?.name}>
            <SH phase="PRIORITISE" title="Smart Queues" ann="new"
              sub={`${tenant} · Pre-filtered action lists · ${levers.filter(l=>l.status!=="healthy").length} open issues`}/>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {PLAYLISTS.map(pl => (
                <div key={pl.id} style={{background:C.cardBg,border:`1px solid ${C.border}`,
                  borderRadius:14,overflow:"hidden",boxShadow:C.shadow}}>
                  {/* Playlist header */}
                  <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
                    background:`linear-gradient(135deg,${pl.badgeBg} 0%,${C.cardBg} 60%)`,
                    display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18}}>{pl.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                        <span style={{fontSize:14,fontWeight:800,color:C.t1,fontFamily:"'DM Sans',sans-serif"}}>{pl.label}</span>
                        <Phase label={pl.phase}/>
                        <span style={{fontSize:11,fontWeight:700,fontFamily:C.mono,
                          color:pl.badge,background:pl.badgeBg,
                          border:`1px solid ${pl.badgeBdr}`,borderRadius:99,
                          padding:"1px 10px",marginLeft:2}}>
                          {pl.items.length}
                        </span>
                      </div>
                      <div style={{fontSize:11,color:C.t3,fontStyle:"italic"}}>{pl.tagline}</div>
                    </div>
                  </div>
                  {/* Items */}
                  {pl.items.length === 0 ? (
                    <div style={{padding:"18px 20px",color:C.t3,fontSize:12,fontStyle:"italic",
                      display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:16}}>✓</span>
                      No items in this queue for {tenant} — all clear!
                    </div>
                  ) : (
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead>
                        <tr style={{background:"#F8FAFC"}}>
                          {["Lever","Type","Owner","Revenue at Risk",""].map(h=>(
                            <th key={h} style={{padding:"7px 16px",textAlign:"left",
                              fontSize:10,fontWeight:700,color:C.t4,
                              textTransform:"uppercase",letterSpacing:0.5,
                              borderBottom:`1px solid ${C.border}`}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pl.items.map((l,i) => {
                          const [type, owner] = tag(l);
                          const tc = ISSUE_TYPE_CFG[type]  || ISSUE_TYPE_CFG.PIPE;
                          const oc = OWNER_CFG[owner]      || OWNER_CFG["Property"];
                          const chip = (cfg, lbl) => (
                            <span key={lbl} style={{display:"inline-flex",alignItems:"center",gap:3,
                              fontSize:9,fontFamily:C.mono,background:cfg.bg,color:cfg.color,
                              border:`1px solid ${cfg.border}`,borderRadius:4,
                              padding:"2px 7px",fontWeight:700,letterSpacing:0.6,
                              whiteSpace:"nowrap"}}>
                              <span style={{width:4,height:4,borderRadius:"50%",
                                background:cfg.color,display:"inline-block"}}/>
                              {lbl}
                            </span>
                          );
                          return (
                            <tr key={l.id} style={{borderBottom:i<pl.items.length-1?`1px solid ${C.t6}`:"none",
                              background:i%2===0?"#fff":"#FAFBFD"}}>
                              <td style={{padding:"10px 16px"}}>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <span style={{fontSize:14}}>{l.icon}</span>
                                  <span style={{fontSize:13,fontWeight:600,color:C.t1}}>{l.name}</span>
                                </div>
                              </td>
                              <td style={{padding:"10px 16px"}}>{chip(tc, type)}</td>
                              <td style={{padding:"10px 16px"}}>{chip(oc, owner)}</td>
                              <td style={{padding:"10px 16px",fontFamily:C.mono,fontWeight:700,
                                fontSize:13,
                                color:l.status==="critical"?C.red:C.amber}}>{l.impact}</td>
                              <td style={{padding:"10px 16px"}}>
                                <button onClick={()=>{goLevers(tenant);}}
                                  style={{background:C.brandDim,border:`1px solid ${C.brandBorder}`,
                                    borderRadius:7,padding:"4px 12px",fontSize:11,color:C.brand,
                                    fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",
                                    transition:"all 0.12s"}}
                                  onMouseEnter={e=>{e.currentTarget.style.background=C.brand;e.currentTarget.style.color="#fff";}}
                                  onMouseLeave={e=>{e.currentTarget.style.background=C.brandDim;e.currentTarget.style.color=C.brand;}}>
                                  Open Lever →
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      {tab==="library" && (<>
        <SH phase="PREVENT" title="Reusable Playbook Library" ann="ui"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {PB_LIBRARY.map((pb,i)=>(
            <div key={i} className="card-hover" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",boxShadow:C.shadow,display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <span style={{fontSize:13,fontWeight:700,color:C.t1,lineHeight:1.3,flex:1}}>{pb.title}</span>
                <span style={{fontSize:10,background:"#F1F5F9",border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 9px",color:C.t3,flexShrink:0}}>{pb.cat}</span>
              </div>
              <div style={{fontSize:12,color:C.t3,lineHeight:1.6,flex:1}}>{pb.desc}</div>
              <div style={{display:"flex",gap:12,fontSize:11,alignItems:"center"}}>
                <span style={{color:C.t3}}>⏱ {pb.effort}</span>
                <span style={{fontWeight:700,color:pb.impact==="High"?C.red:C.amber,background:pb.impact==="High"?C.redBg:C.amberBg,border:`1px solid ${pb.impact==="High"?C.redBorder:C.amberBorder}`,borderRadius:4,padding:"1px 8px",fontSize:10}}>Impact: {pb.impact}</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn-primary" onClick={()=>toast(`"${pb.title}" added to Action Queue`,"success")} style={{flex:1,background:C.brand,border:"none",borderRadius:8,padding:"7px",color:"#fff",fontSize:12,fontWeight:700,boxShadow:`0 2px 8px ${C.brand}33`}}>Apply Playbook</button>
                <button className="btn-ghost" style={{background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",color:C.t2,fontSize:12}}>View</button>
              </div>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}

/* ── ScoreCircle (for LeversPage v2) ──────────────────────────────────── */
function ScoreCircle({ score, color, size = 64 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f1f5" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size > 56 ? 15 : 12, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600 }}>/100</span>
      </div>
    </div>
  );
}


/* ─── Per-account lever data ─────────────────────────────────────────────── */
function makeBuckets(ari, dist, content, demand) {
  return [
    { name:"ARI Integrity",      color:"#6366f1", levers: ari     },
    { name:"Distribution Errors",color:"#f59e0b", levers: dist    },
    { name:"Content Quality",    color:"#10b981", levers: content },
    { name:"Demand Performance", color:"#3b82f6", levers: demand  },
  ];
}

const ACCOUNT_LEVERS_BASE = {
  /* ── WYNDHAM — real POC data (HK + Tricept combined, March 2026) ── */
  "Wyndham Hotels": makeBuckets(
    /* ARI Integrity */
    [
      { id:"ari-sync", icon:"🔄", name:"ARI Sync", score:31, impact:"$42.1K", status:"medium",
        parityLink: true,
        detail:{ description:"TC Brand Activation Gaps — Days Inn, Super 8, Baymont strong on HotelTonight but nearly invisible on Tricept. Avoidable brand concentration risk driven by ARI feed gaps.", breakdown:[{label:"Days Inn: HT 18% vs TC",value:"1%"},{label:"Super 8: HT 14% vs TC",value:"1%"},{label:"Baymont: HT 7% vs TC",value:"0.6%"},{label:"La Quinta + Wyndham TC share",value:"57% concentration"}], estimatedImpact:"$42,100", actions:["Investigate Brand Mapping","Fix TC Activation (DI/SE/BU/MI)","Download Brand Report"] }},
      { id:"availability", icon:"📅", name:"Availability", score:38, impact:"$67.3K", status:"medium",
        detail:{ description:"HT Availability Errors — 92% of HotelTonight booking errors are 'Property Not Available'. Channel delivers 42K bookings but demand is being turned away at scale.", breakdown:[{label:"'Property Not Available' errors",value:"92%"},{label:"Other errors",value:"8%"},{label:"HT total bookings (Jul–Feb)",value:"42,040"},{label:"Monthly trend",value:"6,073 Jul → 4,220 Feb"}], estimatedImpact:"$67,300", actions:["Investigate Cache Freshness","Fix CTA/MLOS/Restrictions","Download Error Log"] }},
      { id:"restrictions", icon:"⛔", name:"Restrictions", score:82, impact:"$8.4K", status:"healthy",
        detail:{ description:"CTA and MLOS restriction settings contributing to HT 'Property Not Available' errors. Restriction logic not aligned with HotelTonight's availability requirements.", breakdown:[{label:"CTA blocks",value:"Linked to HT errors"},{label:"MLOS violations",value:"Under review"},{label:"Channels impacted",value:"HotelTonight (primary)"}], estimatedImpact:"$8,400", actions:["Investigate Restriction Settings","Fix CTA/MLOS Rules","Download Data"] }},
      { id:"rate-parity", icon:"⚖️", name:"Rate Parity", score:78, impact:"$82.4K", status:"healthy",
        parityLink: true,
        detail:{ description:"Rate parity failures linked to TC connectivity errors — parity symptom on Expedia traces back to ARI/mapping failures in Tricept. Brand mix distortion compounds the issue.", breakdown:[{label:"Root cause",value:"TC mapping failure"},{label:"Parity violations",value:"34 properties"},{label:"Channels impacted",value:"Expedia, Booking.com"},{label:"← Linked to",value:"ARI Sync (TC brands)"}], estimatedImpact:"$82,400", actions:["Investigate Parity","Fix via ARI Sync →","Download Violations"] }},
    ],
    /* Distribution Errors */
    [
      { id:"error-rate", icon:"⚠️", name:"Error Rate", score:81, impact:"$54.8K", status:"healthy",
        detail:{ description:"TC Booking Errors Critical — only 5.3% of TC properties contributing to bookings. 94.7% of TC inventory is effectively broken due to mapping failures cascading into error responses.", breakdown:[{label:"TC properties contributing",value:"5.3% only"},{label:"TC inventory broken",value:"94.7%"},{label:"'Property Not Found' errors",value:"60% of all TC errors"},{label:"'Property Not Available'",value:"20% of TC errors"},{label:"'Room Type Not Available'",value:"11% of TC errors"}], estimatedImpact:"$54,800", actions:["Investigate Error Breakdown","Fix Property Mapping","Download Error Report"] }},
      { id:"activation", icon:"⚙️", name:"Activation", score:52, impact:"$38.2K", status:"medium",
        detail:{ description:"HT Property Activation Gap — 3,840 idle HotelTonight properties despite channel proving 42,040 bookings. 48.2% of HT inventory untapped — cleanest growth lever available.", breakdown:[{label:"HT bookings (Jul–Feb)",value:"42,040 total"},{label:"Properties contributing",value:"51.8% only"},{label:"Idle properties",value:"3,840"},{label:"Monthly trend",value:"Declining (6,073 → 4,220)"}], estimatedImpact:"$38,200", actions:["Investigate Idle Properties","Fix Activation (Top 100)","Download Activation List"] }},
      { id:"mapping", icon:"🔗", name:"Mapping", score:8, impact:"$74.6K", status:"critical",
        detail:{ description:"TC Property Mapping Failure — 94.7% of TC inventory broken. 60% of booking errors are 'Property Number Not Found' — a fundamental system-level mapping failure, not a demand problem.", breakdown:[{label:"TC properties with bookings",value:"5.3% only"},{label:"'Property Number Not Found'",value:"60% of errors"},{label:"'Property Not Available'",value:"20% of errors"},{label:"'Room Type Not Available'",value:"11% of errors"},{label:"Priority audit",value:"Top 100 properties"}], estimatedImpact:"$74,600", actions:["Investigate Mapping (Top 100)","Fix NRC+RPC+RTC Linkage","Download Error Map"] }},
      { id:"commission", icon:"💰", name:"Commission", score:84, impact:"$14.1K", status:"healthy",
        detail:{ description:"Commission rate anomalies vs contracted rates across TC and HT channels, compounded by brand mix distortion.", breakdown:[{label:"Overcharged properties",value:"11"},{label:"Avg overcharge",value:"2.1%"},{label:"Channels",value:"Tricept, HotelTonight"}], estimatedImpact:"$14,100", actions:["Investigate Rates","Fix Contracts","Download Report"] }},
    ],
    /* Content Quality */
    [
      { id:"images", icon:"📷", name:"Images", score:28, impact:"$29.8K", status:"critical",
        detail:{ description:"202 Wyndham properties across 14 brands below OTA image threshold. Days Inn leads with 47 properties, followed by Howard Johnson (31) and Super 8 (31) — fastest content win available.", breakdown:[{label:"Total properties with errors",value:"202 across 14 brands"},{label:"Worst brand (DI)",value:"47 properties"},{label:"HJ + SE combined",value:"62 properties"},{label:"TL + RA combined",value:"49 properties"}], estimatedImpact:"$29,800", actions:["Investigate Image Gaps","Fix: Upload Missing Images","Download Property List"], hasErrorDetail:true }},
      { id:"amenities", icon:"🏨", name:"Amenities", score:86, impact:"$7.2K", status:"healthy",
        detail:{ description:"Missing or incorrect amenity data reducing OTA search ranking across Wyndham portfolio.", breakdown:[{label:"Missing amenities",value:"44 props"},{label:"Incorrect data",value:"12"},{label:"OTAs impacted",value:"Agoda, Booking.com"}], estimatedImpact:"$7,200", actions:["Investigate Amenities","Fix Bulk Update","Download Gaps"] }},
      { id:"descriptions", icon:"📝", name:"Descriptions", score:83, impact:"$6.9K", status:"healthy",
        detail:{ description:"Properties with short or missing descriptions across Days Inn, Super 8, Baymont brands reducing conversion.", breakdown:[{label:"Under 150 words",value:"21 props"},{label:"Missing entirely",value:"6"},{label:"Duplicate content",value:"9"}], estimatedImpact:"$6,900", actions:["Investigate Content","Fix Descriptions","Download List"] }},
      { id:"content-score", icon:"🖼️", name:"Content Score", score:77, impact:"$19.7K", status:"healthy",
        detail:{ description:"OTA content score below threshold — image gaps are the primary driver. Properties with <10 images face lower search ranking and reduced conversion on all OTAs.", breakdown:[{label:"Below 70 score",value:"31 props"},{label:"Below 50 score",value:"14"},{label:"Avg score",value:"48/100"},{label:"Primary driver",value:"Image count below threshold"}], estimatedImpact:"$19,700", actions:["Investigate Scores","Fix via Image Upload","Download Report"] }},
    ],
    /* Demand Performance */
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book", score:79, impact:"$31.4K", status:"healthy",
        detail:{ description:"Search-to-booking conversion suppressed by parity failures and content gaps across TC-distributed properties.", breakdown:[{label:"Avg L2B ratio",value:"1:168"},{label:"Below threshold",value:"24 props"},{label:"Top miss channel",value:"Expedia (TC parity gap)"}], estimatedImpact:"$31,400", actions:["Investigate L2B","Fix Rate Strategy","Download Analytics"] }},
      { id:"booking-pace", icon:"📈", name:"Booking Pace", score:75, impact:"$54.2K", status:"healthy",
        detail:{ description:"TC Cancellation Leakage — losing 26–40% of gross bookings every month. Average 33.5% leakage. July/August worst at 39.4–39.7%. Net realization only 66%.", breakdown:[{label:"Monthly cancellation loss",value:"26–40% (avg 33.5%)"},{label:"Bookings lost Jul–Feb",value:"3,628 (~450/month)"},{label:"Net realization",value:"66%"},{label:"Worst months",value:"Jul 39.4%, Aug 39.7%"}], estimatedImpact:"$54,200", actions:["Investigate Cancellation Reasons","Fix Booking Policies","Download Pace Report"] }},
      { id:"channel-mix", icon:"🌐", name:"Channel Mix", score:80, impact:"$13.2K", status:"healthy",
        detail:{ description:"TC brand concentration risk — 57% of TC bookings from La Quinta + Wyndham Hotels only. Days Inn, Super 8, Baymont underutilised on TC vs strong HT performance.", breakdown:[{label:"La Quinta + Wyndham TC share",value:"57%"},{label:"HT channel share",value:"51.8% active"},{label:"TC channel share",value:"5.3% active"}], estimatedImpact:"$13,200", actions:["Investigate Channel Mix","Fix Brand Activation","Download Data"] }},
      { id:"cancellation", icon:"❌", name:"Cancellation", score:18, impact:"$88.9K", status:"critical",
        detail:{ description:"TC Cancellation Leakage — 3,628 bookings lost July through February. 33.5% average monthly cancellation rate with July/August at 39.4–39.7% — worst leakage window.", breakdown:[{label:"Avg monthly cancel rate",value:"33.5%"},{label:"Total bookings lost (Jul–Feb)",value:"3,628"},{label:"Net realization rate",value:"66%"},{label:"Peak leakage",value:"Jul 39.4% / Aug 39.7%"},{label:"Root cause",value:"Policy + availability accuracy"}], estimatedImpact:"$88,900", actions:["Investigate by Property","Fix Policy + Guarantee Terms","Download Cancellation Report"] }},
    ]
  ),

  /* ── HILTON — elevated errors, mostly amber/red ── */
  "Hilton Worldwide": makeBuckets(
    [
      { id:"ari-sync",     icon:"🔄", name:"ARI Sync",    score:71, impact:"$22.8K", status:"healthy",
        detail:[["Sync lag","<3 min avg"],["Update frequency","Every 15 min"],["Failure rate","2.4%"]] },
      { id:"availability", icon:"📅", name:"Availability", score:28, impact:"$98.4K", status:"critical",
        detail:[["RPC10/SYS81 error","13.38% each"],["SYS82/SYS84 error","13.38% each"],["SYS83/SYS25 error","13.38%/9.86%"],["Multiple high-error codes","Booking flow severely impacted"],["Action","System-level audit required"]] },
      { id:"restrictions", icon:"⛔", name:"Restrictions",  score:80, impact:"$11.4K", status:"healthy",
        detail:[["Restriction conflicts","Low"],["Min stay violations","3.8%"],["Blackout clashes","1.4%"]] },
      { id:"rate-parity",  icon:"⚖️", name:"Rate Parity",  score:77, impact:"$18.9K", status:"healthy",
        detail:[["Parity score","77/100"],["Undercut instances","5.4%"],["BA vs direct gap","<4%"]] },
    ],
    [
      { id:"error-rate",   icon:"⚠️", name:"Error Rate",   score:81, impact:"$14.2K", status:"healthy",
        detail:[["Booking error rate","Low — 2.11% max"],["SYS82 booking","2.11%"],["SYS84 booking","2.82%"],["Stability","Booking flow stable"]] },
      { id:"activation",   icon:"⚙️", name:"Activation",   score:14, impact:"$124.8K",status:"critical",
        detail:[["Bookable properties","91%"],["Actually booking","7% only"],["Non-bookable","2% minimal"],["Monetization gap","84% bookable but idle"],["Active brands","21 of 25 (4 inactive)"]] },
      { id:"mapping",      icon:"🔗", name:"Mapping",       score:83, impact:"$12.1K", status:"healthy",
        detail:[["Mapping accuracy","98.4%"],["Unmatched","1.6%"],["Room type gaps","0.8%"]] },
      { id:"commission",   icon:"💰", name:"Commission",    score:86, impact:"$9.2K",  status:"healthy",
        detail:[["Avg commission rate","14.8%"],["Overrides","4 active"],["Net margin","Within SLA"]] },
    ],
    [
      { id:"images",       icon:"📷", name:"Images",        score:58, impact:"$38.6K", status:"medium",
        detail:[["Properties with images","8,504"],["Below threshold","303 properties"],["Coverage","96.6%"],["Impact","Conversion + discoverability"]] },
      { id:"amenities",    icon:"🏨", name:"Amenities",     score:84, impact:"$8.9K",  status:"healthy",
        detail:[["Amenity fill rate","92%"],["Missing","<5 per property"],["Top gap","EV charging"]] },
      { id:"descriptions", icon:"📝", name:"Descriptions",  score:82, impact:"$7.4K",  status:"healthy",
        detail:[["Completeness","95%"],["Char avg","380"],["Missing","5%"]] },
      { id:"content-score",icon:"🖼️", name:"Content Score", score:83, impact:"$11.2K", status:"healthy",
        detail:[["Overall","83/100"],["Image","58 flagged"],["Text","89"],["Structured","86"]] },
    ],
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book",  score:78, impact:"$18.4K", status:"healthy",
        detail:[["LTB ratio","1:156"],["Search volume","High — BA customer base"],["Conversion","0.64%"]] },
      { id:"booking-pace", icon:"📈", name:"Booking Pace",  score:76, impact:"$22.4K", status:"healthy",
        detail:[["Peak month","September"],["Pattern","Strong Sep, softer Oct–Nov"],["YoY","Stable"]] },
      { id:"channel-mix",  icon:"🌐", name:"Channel Mix",   score:49, impact:"$62.3K", status:"medium",
        detail:[["HL contribution","38.64% (10,566 bookings)"],["HH contribution","24.33% (6,653)"],["Top 2 brands","63% concentration"],["Inactive brands","4 of 25"],["Long-tail","Minimal"]] },
      { id:"cancellation", icon:"❌", name:"Cancellation",  score:67, impact:"$44.1K", status:"medium",
        detail:[["Cancel trend","Consistently declining"],["Seasonal softening","Oct–Nov"],["Impact","Moderate — improving"],["Action","Rate stability in shoulder seasons"]] },
    ]
  ),


  /* ── BEST WESTERN — moderate issues, mixed amber/green ── */
  "Best Western Hotels": makeBuckets(
    [
      { id:"ari-sync",     icon:"🔄", name:"ARI Sync",    score:74, impact:"$18.4K", status:"healthy",
        detail:[["Sync lag","<3 min avg"],["Update frequency","Every 15 min"],["Failure rate","2.1%"]] },
      { id:"availability", icon:"📅", name:"Availability", score:21, impact:"$67.8K", status:"critical",
        detail:[["PID10 avail error","10.34%"],["PIR01 avail error","10.34%"],["SYS81/82 errors","10.34%"],["Primary bottleneck","Availability sync failures"],["Channel impact","Direct booking failures"]] },
      { id:"restrictions", icon:"⛔", name:"Restrictions",  score:78, impact:"$8.1K",  status:"healthy",
        detail:[["Restriction conflicts","Low"],["Min stay violations","4.2%"],["Blackout clashes","1.8%"]] },
      { id:"rate-parity",  icon:"⚖️", name:"Rate Parity",  score:76, impact:"$14.2K", status:"healthy",
        detail:[["Parity score","76/100"],["Undercut instances","6.1%"],["Direct vs OTA gap","<3%"]] },
    ],
    [
      { id:"error-rate",   icon:"⚠️", name:"Error Rate",   score:58, impact:"$28.4K", status:"medium",
        detail:[["Booking error rate","3.45% consistent"],["PID10 booking","3.45%"],["RTY10 booking","3.45%"],["Availability errors","Primary driver"],["Stability","Consistent but elevated"]] },
      { id:"activation",   icon:"⚙️", name:"Activation",   score:11, impact:"$89.2K", status:"critical",
        detail:[["Bookable properties","83%"],["Actually booking","1% only"],["Non-bookable","16%"],["Monetization gap","82% bookable but idle"],["Action","Convert bookable-not-booking urgently"]] },
      { id:"mapping",      icon:"🔗", name:"Mapping",       score:81, impact:"$10.2K", status:"healthy",
        detail:[["Mapping accuracy","97.8%"],["Unmatched","2.2%"],["Room type gaps","1.1%"]] },
      { id:"commission",   icon:"💰", name:"Commission",    score:83, impact:"$7.8K",  status:"healthy",
        detail:[["Avg commission rate","13.8%"],["Overrides","2 active"],["Net margin","Within SLA"]] },
    ],
    [
      { id:"images",       icon:"📷", name:"Images",        score:62, impact:"$12.3K", status:"medium",
        detail:[["Properties with images","4,432"],["Below threshold","84 properties"],["Coverage","98.1%"],["Action","Prioritise image enrichment"]] },
      { id:"amenities",    icon:"🏨", name:"Amenities",     score:82, impact:"$6.8K",  status:"healthy",
        detail:[["Amenity fill rate","89%"],["Missing","<6 per property"],["Top gap","Parking info"]] },
      { id:"descriptions", icon:"📝", name:"Descriptions",  score:80, impact:"$5.9K",  status:"healthy",
        detail:[["Completeness","92%"],["Char avg","290"],["Missing","8%"]] },
      { id:"content-score",icon:"🖼️", name:"Content Score", score:78, impact:"$7.4K",  status:"healthy",
        detail:[["Overall","78/100"],["Image","62 flagged"],["Text","80"],["Structured","79"]] },
    ],
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book",  score:71, impact:"$9.4K",  status:"healthy",
        detail:[["LTB ratio","1:89"],["Search volume","Moderate"],["Conversion","1.1%"]] },
      { id:"booking-pace", icon:"📈", name:"Booking Pace",  score:68, impact:"$14.8K", status:"healthy",
        detail:[["Peak month","October (328 gross)"],["Volatility","High month-to-month"],["Net recovery","Inconsistent"]] },
      { id:"channel-mix",  icon:"🌐", name:"Channel Mix",   score:52, impact:"$31.7K", status:"medium",
        detail:[["BW contribution","95.73% (1,616 bookings)"],["UR contribution","3.32% (56)"],["XW contribution","0.95% (16)"],["Inactive brands","1 of 4"],["Risk","Critical BW dependency"]] },
      { id:"cancellation", icon:"❌", name:"Cancellation",  score:12, impact:"$154.5K",status:"critical",
        detail:[["Oct: 328 gross / 128 net","200 cancellations (61%)"],["Aug cancel rate","67% (172/256)"],["Sep cancel rate","70% (173/243)"],["Total Jun–Dec cancels","1,030"],["Net realization avg","54.8%"]] },
    ]
  ),

  /* ── CHOICE HOTELS — Agoda pairing report, Jun–Dec 2025 ── */
  "Choice Hotels": makeBuckets(
    /* ARI Integrity — healthy across the board */
    [
      { id:"ari-sync",    icon:"🔄", name:"ARI Sync",     score:82, impact:"$4.2K",  status:"healthy",
        detail:{ description:"ARI sync performing well — no sync failures detected in Jun–Dec 2025 Agoda report. Precheck errors are configuration-driven, not sync failures.", breakdown:[{label:"Review requests processed",value:"30.07M"},{label:"Sync-related errors",value:"None flagged"},{label:"Properties participating",value:"6,793"}], estimatedImpact:"$4,200", actions:["Investigate Feed","View Sync Logs","Download Report"] }},
      { id:"availability",icon:"📅", name:"Availability", score:86, impact:"$3.1K",  status:"healthy",
        detail:{ description:"Availability performing strongly — gross-to-net conversion averaging 93%+ across Jun–Dec 2025.", breakdown:[{label:"Gross bookings/month",value:"300K–352K"},{label:"Net bookings/month",value:"281K–330K"},{label:"Avg conversion rate",value:"~93%"}], estimatedImpact:"$3,100", actions:["Investigate Calendar","View Availability","Download Gaps"] }},
      { id:"restrictions",icon:"⛔", name:"Restrictions",  score:88, impact:"$1.8K",  status:"healthy",
        detail:{ description:"Restriction rules well configured — no CTA or MLOS issues flagged in report period.", breakdown:[{label:"CTA blocks",value:"None flagged"},{label:"MLOS violations",value:"None flagged"},{label:"Channels impacted",value:"None"}], estimatedImpact:"$1,800", actions:["Investigate Restrictions","View Rules","Download Data"] }},
      { id:"rate-parity", icon:"⚖️", name:"Rate Parity",  score:84, impact:"$2.9K",  status:"healthy",
        detail:{ description:"Rate parity maintained across Agoda — no parity-related errors in booking or precheck error sets.", breakdown:[{label:"Parity violations",value:"None detected"},{label:"Rate consistency",value:"Strong"},{label:"Agoda display",value:"Aligned"}], estimatedImpact:"$2,900", actions:["Investigate Parity","View Listings","Download Report"] }},
    ],
    /* Distribution Errors — 3 amber issues */
    [
      { id:"error-rate",  icon:"⚠️", name:"Error Rate",   score:58, impact:"$18.4K", status:"medium",
        detail:{ description:"RMR10 is the dominant error — 31.3K precheck errors and 0.6K booking errors. Top error across both precheck and booking error sets. API timeout and retry pattern also visible (SYS81, SYS82, SYS84).", breakdown:[{label:"RMR10 precheck errors",value:"31.3K"},{label:"RMR10 booking errors",value:"0.6K (top error)"},{label:"SYS81 booking errors",value:"0.4K"},{label:"SYS84 booking errors",value:"0.3K"},{label:"SYS82 booking errors",value:"0.2K"}], estimatedImpact:"$18,400", actions:["Investigate RMR10 Root Cause","Fix API Retry Logic","Download Error Report"] }},
      { id:"activation",  icon:"⚙️", name:"Activation",   score:62, impact:"$14.2K", status:"medium",
        detail:{ description:"240 silent properties not converting to bookings — participating but receiving no bookings. Visibility-to-booking gap needs activation attention.", breakdown:[{label:"Participating properties",value:"6,793"},{label:"Properties receiving bookings",value:"6,553"},{label:"Silent properties",value:"~240 (3.5% of portfolio)"},{label:"Properties receiving reviews",value:"6,590"}], estimatedImpact:"$14,200", actions:["Investigate Silent Properties","Fix Activation for 240 Props","Download Property List"] }},
      { id:"mapping",     icon:"🔗", name:"Mapping",       score:54, impact:"$22.1K", status:"medium",
        detail:{ description:"IND35 and IND07 precheck errors indicate configuration-driven mapping gaps — inventory refresh cycle mismatches causing availability response issues.", breakdown:[{label:"IND35 precheck errors",value:"18.8K"},{label:"IND07 precheck errors",value:"4.7K"},{label:"SYS82 errors (precheck)",value:"3.8K"},{label:"SYS84 errors (precheck)",value:"3.4K"},{label:"Root cause",value:"Mapping + inventory refresh config"}], estimatedImpact:"$22,100", actions:["Investigate IND35 & IND07","Fix Inventory Refresh Config","Download Mapping Report"] }},
      { id:"commission",  icon:"💰", name:"Commission",    score:86, impact:"$2.4K",  status:"healthy",
        detail:{ description:"Commission rates aligned with contracted Agoda terms — no anomalies in report period.", breakdown:[{label:"Overcharged properties",value:"None flagged"},{label:"Avg commission variance",value:"<0.3%"},{label:"Channels",value:"Agoda — compliant"}], estimatedImpact:"$2,400", actions:["Investigate Contracts","View Rates","Download Report"] }},
    ],
    /* Content Quality — healthy, leveraging 30M review signals */
    [
      { id:"images",      icon:"📷", name:"Images",        score:81, impact:"$3.8K",  status:"healthy",
        detail:{ description:"Image coverage meeting Agoda thresholds — strong review engagement (30M requests) confirms content quality.", breakdown:[{label:"Properties receiving reviews",value:"6,590 of 6,793"},{label:"Review requests",value:"30.07M total"},{label:"Image-related complaints",value:"None flagged"}], estimatedImpact:"$3,800", actions:["Investigate Gallery","View Images","Download List"] }},
      { id:"amenities",   icon:"🏨", name:"Amenities",     score:84, impact:"$2.1K",  status:"healthy",
        detail:{ description:"Amenity data complete — Agoda review signals confirm property data quality.", breakdown:[{label:"Missing amenities",value:"Minor only"},{label:"Incorrect data",value:"Not flagged"},{label:"OTAs impacted",value:"None"}], estimatedImpact:"$2,100", actions:["Investigate Amenities","View Data","Download Gaps"] }},
      { id:"descriptions",icon:"📝", name:"Descriptions",  score:83, impact:"$2.6K",  status:"healthy",
        detail:{ description:"Descriptions meeting Agoda content standards — high review volume confirms strong content engagement.", breakdown:[{label:"Under 150 words",value:"Minimal"},{label:"Missing entirely",value:"0"},{label:"Content quality signal",value:"30M+ reviews processed"}], estimatedImpact:"$2,600", actions:["Investigate Content","View Descriptions","Download List"] }},
      { id:"content-score",icon:"🖼️",name:"Content Score", score:80, impact:"$4.1K",  status:"healthy",
        detail:{ description:"Content scores strong across Agoda portfolio — 30M review requests indicate high visibility and search ranking.", breakdown:[{label:"Review requests (Jun–Dec)",value:"30.07M"},{label:"Properties receiving reviews",value:"6,590 (97%)"},{label:"Avg content health",value:"Strong"}], estimatedImpact:"$4,100", actions:["Investigate Scores","View Content Plan","Download Report"] }},
    ],
    /* Demand Performance — strong across the board */
    [
      { id:"look-to-book",icon:"🔍", name:"Look-to-Book",  score:84, impact:"$5.2K",  status:"healthy",
        detail:{ description:"Look-to-book conversion strong — 30M review requests converting to 300K+ gross bookings/month. Well above industry benchmark.", breakdown:[{label:"Review requests/month",value:"~4.3M avg"},{label:"Gross bookings/month",value:"300K–352K"},{label:"Conversion signal",value:"Strong — above benchmark"}], estimatedImpact:"$5,200", actions:["Investigate L2B","View Analytics","Download Data"] }},
      { id:"booking-pace",icon:"📈", name:"Booking Pace",  score:82, impact:"$4.8K",  status:"healthy",
        detail:{ description:"Booking pace consistent and strong — Jul peak at 352K gross, recovering to 325K by Dec. Demand stable throughout period.", breakdown:[{label:"Peak month (Jul)",value:"352K gross"},{label:"Dec bookings",value:"324.8K gross"},{label:"Net bookings range",value:"281K–330K/month"}], estimatedImpact:"$4,800", actions:["Investigate Pace","View Pace Report","Download Report"] }},
      { id:"channel-mix", icon:"🌐", name:"Channel Mix",   score:85, impact:"$3.2K",  status:"healthy",
        detail:{ description:"Channel mix healthy on Agoda — 97% of properties receiving reviews, 96% receiving bookings. Well-distributed portfolio.", breakdown:[{label:"Properties participating",value:"6,793"},{label:"Properties booking",value:"6,553 (96%)"},{label:"Coverage gap",value:"240 properties only"}], estimatedImpact:"$3,200", actions:["Investigate Mix","View Strategy","Download Data"] }},
      { id:"cancellation",icon:"❌", name:"Cancellation",  score:87, impact:"$2.8K",  status:"healthy",
        detail:{ description:"Cancellation / leakage minimal — report explicitly notes 'healthy conversion and minimal leakage' across Jun–Dec 2025.", breakdown:[{label:"Gross-to-net gap",value:"~7% avg (minimal)"},{label:"Jul gross vs net",value:"342K → 320K"},{label:"Dec gross vs net",value:"324.8K → 308.1K"}], estimatedImpact:"$2,800", actions:["Investigate Cancellations","View Policy","Download Report"] }},
    ]
  ),

  /* ── HYATT | TRISEPT SOLUTIONS — Jun–Dec 2025 ── */
  "Hyatt Hotels": makeBuckets(
    [
      { id:"ari-sync",     icon:"🔄", name:"ARI Sync",    score:69, impact:"$19.4K", status:"healthy",
        detail:[["Sync lag","<4 min avg"],["Update frequency","Every 20 min"],["Failure rate","2.8%"]] },
      { id:"availability", icon:"📅", name:"Availability", score:24, impact:"$76.2K", status:"critical",
        detail:[["PID10 error","14.81%"],["PID06 error","14.81%"],["SYS82 error","11.11%"],["SYS83 error","11.11%"],["Biggest barrier","Booking conversion blocked"]] },
      { id:"restrictions", icon:"⛔", name:"Restrictions",  score:79, impact:"$9.8K",  status:"healthy",
        detail:[["Restriction conflicts","Low"],["Min stay violations","3.4%"],["Blackout clashes","1.6%"]] },
      { id:"rate-parity",  icon:"⚖️", name:"Rate Parity",  score:74, impact:"$16.2K", status:"healthy",
        detail:[["Parity score","74/100"],["Undercut instances","7.2%"],["Trisept vs direct","<5%"]] },
    ],
    [
      { id:"error-rate",   icon:"⚠️", name:"Error Rate",   score:56, impact:"$29.6K", status:"medium",
        detail:[["Booking error rate","3.70% across codes"],["RTY10/PID10","3.70% each"],["Multiple codes","GCN7, SYS84, GUA24"],["Status","Adds friction to flow"]] },
      { id:"activation",   icon:"⚙️", name:"Activation",   score:54, impact:"$43.8K", status:"medium",
        detail:[["Bookable","46%"],["Actively booking","45% — strong once live"],["Non-bookable","9%"],["Scale constraint","Limited property base"],["Growth lever","Expand coverage"]] },
      { id:"mapping",      icon:"🔗", name:"Mapping",       score:82, impact:"$11.8K", status:"healthy",
        detail:[["Mapping accuracy","98.1%"],["Unmatched","1.9%"],["Room type gaps","1.0%"]] },
      { id:"commission",   icon:"💰", name:"Commission",    score:84, impact:"$8.6K",  status:"healthy",
        detail:[["Avg commission rate","15.2%"],["Overrides","3 active"],["Net margin","Within SLA"]] },
    ],
    [
      { id:"images",       icon:"📷", name:"Images",        score:78, impact:"$14.4K", status:"healthy",
        detail:[["Properties with images","1,265"],["Below threshold","94 properties"],["Coverage","93.1%"],["Action","Enrich 94 under-threshold"]] },
      { id:"amenities",    icon:"🏨", name:"Amenities",     score:83, impact:"$7.2K",  status:"healthy",
        detail:[["Amenity fill rate","90%"],["Missing","<6 per property"],["Top gap","Spa details"]] },
      { id:"descriptions", icon:"📝", name:"Descriptions",  score:81, impact:"$6.4K",  status:"healthy",
        detail:[["Completeness","93%"],["Char avg","310"],["Missing","7%"]] },
      { id:"content-score",icon:"🖼️", name:"Content Score", score:80, impact:"$8.8K",  status:"healthy",
        detail:[["Overall","80/100"],["Image","78"],["Text","81"],["Structured","80"]] },
    ],
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book",  score:72, impact:"$12.8K", status:"healthy",
        detail:[["LTB ratio","1:118"],["Search volume","Moderate"],["Conversion","0.85%"]] },
      { id:"booking-pace", icon:"📈", name:"Booking Pace",  score:68, impact:"$19.2K", status:"healthy",
        detail:[["Peak month","July (2,331 gross)"],["Sep trough","1,370"],["Q4 recovery","1,470–1,481"]] },
      { id:"channel-mix",  icon:"🌐", name:"Channel Mix",   score:8,  impact:"$87.3K", status:"critical",
        detail:[["HY contribution","100.00% (12,119 bookings)"],["JV contribution","0.00%"],["DN contribution","0.00%"],["Inactive brands","5 of 6"],["Risk","Single brand total dependency"]] },
      { id:"cancellation", icon:"❌", name:"Cancellation",  score:18, impact:"$112.4K",status:"critical",
        detail:[["July","1,052 / 2,331 gross = 45.1%"],["June","665 / 1,989 = 33.4%"],["All months","Consistently high"],["Total cancels","4,806 Jul–Dec"],["Net realization","Severely impacted"]] },
    ]
  ),

  /* ── MARRIOTT | BRITISH — Jan–Dec 2025 ── */
  "Marriott International": makeBuckets(
    [
      { id:"ari-sync",     icon:"🔄", name:"ARI Sync",    score:73, impact:"$21.4K", status:"healthy",
        detail:[["Sync lag","<2 min avg"],["Update frequency","Real-time"],["Failure rate","1.9%"]] },
      { id:"availability", icon:"📅", name:"Availability", score:68, impact:"$34.8K", status:"healthy",
        detail:[["Availability error","Primary error type at scale"],["Cumulative %","Up to 100.02%"],["Context","Dominant but partially scale-expected"]] },
      { id:"restrictions", icon:"⛔", name:"Restrictions",  score:81, impact:"$12.4K", status:"healthy",
        detail:[["Restriction conflicts","Low"],["Min stay violations","3.2%"],["Blackout clashes","1.1%"]] },
      { id:"rate-parity",  icon:"⚖️", name:"Rate Parity",  score:79, impact:"$19.8K", status:"healthy",
        detail:[["Parity score","79/100"],["Undercut instances","4.8%"],["British vs direct","<3%"]] },
    ],
    [
      { id:"error-rate",   icon:"⚠️", name:"Error Rate",   score:22, impact:"$94.2K", status:"critical",
        detail:[["Mean error count","684,424"],["Std deviation","2,933,652 — massive variability"],["Error % mean","4.35%"],["Error % std","18.64% — spike risk"],["Exceptions flagged","26 — 0 resolved"],["Action","Root cause investigation"]] },
      { id:"activation",   icon:"⚙️", name:"Activation",   score:51, impact:"$58.4K", status:"medium",
        detail:[["Booked properties","846 of 9,470 bookable"],["Booking rate","8.93%"],["Bookable %","95.25% of 9,942 total"],["Non-bookable","472 properties"],["Gap","Large idle bookable segment"]] },
      { id:"mapping",      icon:"🔗", name:"Mapping",       score:84, impact:"$13.2K", status:"healthy",
        detail:[["Mapping accuracy","98.7%"],["Unmatched","1.3%"],["Room type gaps","0.7%"]] },
      { id:"commission",   icon:"💰", name:"Commission",    score:87, impact:"$10.4K", status:"healthy",
        detail:[["Avg commission rate","14.1%"],["Overrides","5 active"],["Net margin","Within SLA"]] },
    ],
    [
      { id:"images",       icon:"📷", name:"Images",        score:84, impact:"$11.8K", status:"healthy",
        detail:[["Image coverage","Strong across 9,942 properties"],["Critical gaps","None"],["Status","Well maintained"]] },
      { id:"amenities",    icon:"🏨", name:"Amenities",     score:86, impact:"$8.4K",  status:"healthy",
        detail:[["Amenity fill rate","93%"],["Missing","<4 per property"],["Top gap","Parking"]] },
      { id:"descriptions", icon:"📝", name:"Descriptions",  score:84, impact:"$7.2K",  status:"healthy",
        detail:[["Completeness","96%"],["Char avg","410"],["Missing","4%"]] },
      { id:"content-score",icon:"🖼️", name:"Content Score", score:85, impact:"$10.8K", status:"healthy",
        detail:[["Overall","85/100"],["Image","84"],["Text","86"],["Structured","84"]] },
    ],
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book",  score:76, impact:"$16.8K", status:"healthy",
        detail:[["LTB ratio","1:142"],["Search volume","High — British leisure travel"],["Conversion","0.70%"]] },
      { id:"booking-pace", icon:"📈", name:"Booking Pace",  score:72, impact:"$24.4K", status:"healthy",
        detail:[["Peak month","September (+51.6% MoM)"],["Oct drop","-39.6% MoM"],["Volatility","High — external drivers"]] },
      { id:"channel-mix",  icon:"🌐", name:"Channel Mix",   score:48, impact:"$67.8K", status:"medium",
        detail:[["Total brands monitored","42"],["Booked brands","26 (61.9%)"],["Unbooked brands","16 (38.1%)"],["Top brand MC","20.07% (2,205 bookings)"],["Top 5 brands","53.69% total"]] },
      { id:"cancellation", icon:"❌", name:"Cancellation",  score:58, impact:"$44.9K", status:"medium",
        detail:[["Total cancellations","931 (8.48% avg rate)"],["Sep surge","+34.4% cancels"],["Oct correction","-51.6% cancels"],["Pattern","Volatile MoM"],["Net bookings","10,056 of 10,987 gross"]] },
    ]
  ),

  /* ── IHG HOTELS | HOTEL TONIGHT — Jun–Dec 2025 ── */
  "IHG Hotels & Resorts": makeBuckets(
    [
      { id:"ari-sync",     icon:"🔄", name:"ARI Sync",    score:76, impact:"$18.4K", status:"healthy",
        detail:[["Sync lag","<2 min avg"],["Update frequency","Real-time"],["Failure rate","1.6%"]] },
      { id:"availability", icon:"📅", name:"Availability", score:41, impact:"$58.4K", status:"medium",
        detail:[["PID10 avail error","9.15%"],["PID07 avail error","8.50%"],["SYS81 avail error","9.15%"],["SYS82/SYS84/SYS90","9.15% each"],["Impact","Lost conversion at search"]] },
      { id:"restrictions", icon:"⛔", name:"Restrictions",  score:82, impact:"$9.8K",  status:"healthy",
        detail:[["Restriction conflicts","Low"],["Min stay violations","2.8%"],["Blackout clashes","1.1%"]] },
      { id:"rate-parity",  icon:"⚖️", name:"Rate Parity",  score:80, impact:"$16.8K", status:"healthy",
        detail:[["Parity score","80/100"],["Undercut instances","3.9%"],["HT vs direct gap","<3%"]] },
    ],
    [
      { id:"error-rate",   icon:"⚠️", name:"Error Rate",   score:53, impact:"$34.2K", status:"medium",
        detail:[["SYS81 booking error","6.54%"],["PID10 booking error","4.58%"],["RMR10 booking","1.96%"],["SYS84 booking","3.27%"],["Impact","Checkout friction on high-intent sessions"]] },
      { id:"activation",   icon:"⚙️", name:"Activation",   score:32, impact:"$89.4K", status:"critical",
        detail:[["Actively booking","49%"],["Bookable-not-converting","45% — largest growth lever"],["Non-bookable","6%"],["Root cause","Pricing parity, LOS/CTA restrictions, content"],["Action","Diagnostics on 45% idle segment"]] },
      { id:"mapping",      icon:"🔗", name:"Mapping",       score:84, impact:"$12.4K", status:"healthy",
        detail:[["Mapping accuracy","98.5%"],["Unmatched","1.5%"],["Room type gaps","0.8%"]] },
      { id:"commission",   icon:"💰", name:"Commission",    score:86, impact:"$9.8K",  status:"healthy",
        detail:[["Avg commission rate","14.4%"],["Overrides","3 active"],["Net margin","Within SLA"]] },
    ],
    [
      { id:"images",       icon:"📷", name:"Images",        score:88, impact:"$8.4K",  status:"healthy",
        detail:[["Properties with images","7,161"],["Below threshold","42 properties"],["Coverage","99.4%"],["Action","Close 42 — quick win"]] },
      { id:"amenities",    icon:"🏨", name:"Amenities",     score:85, impact:"$7.8K",  status:"healthy",
        detail:[["Amenity fill rate","92%"],["Missing","<5 per property"],["Top gap","EV charging"]] },
      { id:"descriptions", icon:"📝", name:"Descriptions",  score:83, impact:"$6.9K",  status:"healthy",
        detail:[["Completeness","95%"],["Char avg","350"],["Missing","5%"]] },
      { id:"content-score",icon:"🖼️", name:"Content Score", score:86, impact:"$10.2K", status:"healthy",
        detail:[["Overall","86/100"],["Image","88"],["Text","84"],["Structured","85"]] },
    ],
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book",  score:81, impact:"$14.8K", status:"healthy",
        detail:[["LTB ratio","1:138"],["Search volume","Growing — HT last-minute demand"],["Conversion","0.72%"]] },
      { id:"booking-pace", icon:"📈", name:"Booking Pace",  score:84, impact:"$21.4K", status:"healthy",
        detail:[["Jun baseline","1,866 net"],["Dec peak","3,643 net"],["Trend","Consistent growth — 0 cancellations"]] },
      { id:"channel-mix",  icon:"🌐", name:"Channel Mix",   score:24, impact:"$78.6K", status:"critical",
        detail:[["HI brand contribution","70.23% (15,495 bookings)"],["CP contribution","6.58% (1,452)"],["YO contribution","6.02% (1,329)"],["Inactive brands","6 of 20"],["Dependency risk","HI dominance is single point of failure"]] },
      { id:"cancellation", icon:"❌", name:"Cancellation",  score:100,impact:"$0",     status:"healthy",
        detail:[["Jun–Dec cancellations","0 (zero)"],["Gross = Net","Every month"],["Status","Best-in-class cancellation performance"],["Insight","Clean conversion — protect at all cost"]] },
    ]
  ),

  /* ── OMNI HOTELS | AGODA — Jun–Dec 2025 ── */
  "Omni Hotels & Resorts": makeBuckets(
    [
      { id:"ari-sync",     icon:"🔄", name:"ARI Sync",    score:72, impact:"$19.8K", status:"healthy",
        detail:[["Sync lag","<3 min avg"],["Update frequency","Every 15 min"],["Failure rate","2.2%"]] },
      { id:"availability", icon:"📅", name:"Availability", score:32, impact:"$64.2K", status:"critical",
        detail:[["SYS90/SYS84/PID10/SYS82/SYS81","12.50% each"],["IND07 avail error","12.50%"],["Impact","Suppresses bookings even when demand exists"],["Action","Validate ARI mapping + credentials"]] },
      { id:"restrictions", icon:"⛔", name:"Restrictions",  score:80, impact:"$10.4K", status:"healthy",
        detail:[["Restriction conflicts","Low"],["Min stay violations","3.2%"],["Blackout clashes","1.4%"]] },
      { id:"rate-parity",  icon:"⚖️", name:"Rate Parity",  score:78, impact:"$17.2K", status:"healthy",
        detail:[["Parity score","78/100"],["Undercut instances","4.8%"],["Agoda vs direct gap","<4%"]] },
    ],
    [
      { id:"error-rate",   icon:"⚠️", name:"Error Rate",   score:62, impact:"$28.4K", status:"medium",
        detail:[["Booking error SYS81","6.25%"],["NNT01 avail error","6.25%"],["Stability","Moderate — needs monitoring"]] },
      { id:"activation",   icon:"⚙️", name:"Activation",   score:88, impact:"$12.4K", status:"healthy",
        detail:[["Actively booking","93% — best in portfolio"],["Bookable-not-booking","5%"],["Non-bookable","2%"],["Status","Strongest property activation of all accounts"]] },
      { id:"mapping",      icon:"🔗", name:"Mapping",       score:83, impact:"$11.8K", status:"healthy",
        detail:[["Mapping accuracy","98.2%"],["Unmatched","1.8%"],["Room type gaps","0.9%"]] },
      { id:"commission",   icon:"💰", name:"Commission",    score:85, impact:"$9.4K",  status:"healthy",
        detail:[["Avg commission rate","15.1%"],["Overrides","2 active"],["Net margin","Within SLA"]] },
    ],
    [
      { id:"images",       icon:"📷", name:"Images",        score:98, impact:"$2.1K",  status:"healthy",
        detail:[["Properties with images","53"],["Below threshold","1 property only"],["Coverage","98.1%"],["Action","Upload 1 remaining — trivial"]] },
      { id:"amenities",    icon:"🏨", name:"Amenities",     score:87, impact:"$6.8K",  status:"healthy",
        detail:[["Amenity fill rate","93%"],["Missing","<4 per property"],["Top gap","Pool hours"]] },
      { id:"descriptions", icon:"📝", name:"Descriptions",  score:85, impact:"$5.9K",  status:"healthy",
        detail:[["Completeness","96%"],["Char avg","390"],["Missing","4%"]] },
      { id:"content-score",icon:"🖼️", name:"Content Score", score:89, impact:"$7.2K",  status:"healthy",
        detail:[["Overall","89/100"],["Image","98"],["Text","86"],["Structured","84"]] },
    ],
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book",  score:79, impact:"$16.4K", status:"healthy",
        detail:[["LTB ratio","1:148"],["Search volume","Moderate — luxury segment"],["Conversion","0.68%"]] },
      { id:"booking-pace", icon:"📈", name:"Booking Pace",  score:76, impact:"$22.8K", status:"healthy",
        detail:[["Peak month","August (7,370 gross / 6,545 net)"],["Nov–Dec rebound","5,248 + 5,602"],["Total gross","37,513"]] },
      { id:"channel-mix",  icon:"🌐", name:"Channel Mix",   score:12, impact:"$94.8K", status:"critical",
        detail:[["OM brand contribution","100.00% (37,513 bookings)"],["AV brand contribution","0.00%"],["Total brands","2"],["Inactive","1 of 2 (AV)"],["Risk","Total single-brand dependency"]] },
      { id:"cancellation", icon:"❌", name:"Cancellation",  score:58, impact:"$48.2K", status:"medium",
        detail:[["Total cancellations","4,871 (~13% of gross)"],["Peak cancels","November (911)"],["Net realization","86.9%"],["Drivers","Pricing/availability volatility"],["Action","Rate parity + min LOS guardrails"]] },
    ]
  ),

  /* ── HYATT HOTELS | TRISEPT SOLUTIONS — Jun–Dec 2025 ── */
  };


/* Choice Hotels — partner-specific data key for Hopper vs Agoda story */
/* This block extends ACCOUNT_LEVERS with partner-keyed entries */
const PARTNER_LEVERS = {
  /* ── CHOICE HOTELS | HOPPER — Jun–Dec 2025 — severe errors ── */
  "Choice Hotels|Hopper Travel Services": makeBuckets(
    [
      { id:"ari-sync",     icon:"🔄", name:"ARI Sync",    score:72, impact:"$31.4K", status:"healthy",
        detail:[["Sync lag","<2 min avg"],["Update frequency","Real-time"],["Failure rate","1.8%"]] },
      { id:"availability", icon:"📅", name:"Availability", score:22, impact:"$89.4K", status:"critical",
        detail:[["SYS82 avail error","37.21%"],["SYS90 avail error","35.05%"],["SYS81 avail error","4.27%"],["Primary bottleneck","SYS82 + SYS90"],["Action","Immediate system audit"]] },
      { id:"restrictions", icon:"⛔", name:"Restrictions",  score:81, impact:"$9.2K",  status:"healthy",
        detail:[["Restriction conflicts","Low"],["Min stay violations","3.1%"],["Blackout clashes","1.2%"]] },
      { id:"rate-parity",  icon:"⚖️", name:"Rate Parity",  score:79, impact:"$18.4K", status:"healthy",
        detail:[["Parity score","79/100"],["Undercut instances","4.2%"],["Overcut instances","2.1%"]] },
    ],
    [
      { id:"error-rate",   icon:"⚠️", name:"Error Rate",   score:14, impact:"$74.2K", status:"critical",
        detail:[["SYS83 booking error","54.31%"],["RTY10 booking error","42.16%"],["SYS84 booking error","3.55%"],["Checkout instability","Confirmed"],["Action","Fix SYS83 + RTY10 immediately"]] },
      { id:"activation",   icon:"⚙️", name:"Activation",   score:44, impact:"$62.8K", status:"medium",
        detail:[["Bookable properties","9,666 (57.8%)"],["Non-bookable","22.5% (2,172)"],["Idle bookable","1,903 properties"],["Potential uplift","114K annual bookings"],["Segment","Revenue-ready but dormant"]] },
      { id:"mapping",      icon:"🔗", name:"Mapping",       score:82, impact:"$11.3K", status:"healthy",
        detail:[["Mapping accuracy","98.2%"],["Unmatched","1.8%"],["Room type gaps","0.9%"]] },
      { id:"commission",   icon:"💰", name:"Commission",    score:85, impact:"$8.4K",  status:"healthy",
        detail:[["Avg commission rate","14.2%"],["Overrides","3 active"],["Net margin","Within SLA"]] },
    ],
    [
      { id:"images",       icon:"📷", name:"Images",        score:88, impact:"$6.2K",  status:"healthy",
        detail:[["Properties with images","7,161"],["Below threshold","42"],["Coverage","99.4%"]] },
      { id:"amenities",    icon:"🏨", name:"Amenities",     score:84, impact:"$7.1K",  status:"healthy",
        detail:[["Amenity fill rate","91%"],["Missing","<5 per property avg"],["Top gap","Parking"]] },
      { id:"descriptions", icon:"📝", name:"Descriptions",  score:82, impact:"$6.8K",  status:"healthy",
        detail:[["Completeness","94%"],["Char avg","320"],["Missing","6%"]] },
      { id:"content-score",icon:"🖼️", name:"Content Score", score:86, impact:"$9.4K",  status:"healthy",
        detail:[["Overall","86/100"],["Image","88"],["Text","84"],["Structured","82"]] },
    ],
    [
      { id:"look-to-book", icon:"🔍", name:"Look-to-Book",  score:77, impact:"$14.2K", status:"healthy",
        detail:[["LTB ratio","1:124"],["Search volume","High mid-year"],["Conversion","0.81%"]] },
      { id:"booking-pace", icon:"📈", name:"Booking Pace",  score:79, impact:"$19.8K", status:"healthy",
        detail:[["Peak month","July (12,727 gross)"],["YoY trend","+8.4%"],["Dec net","9,806"]] },
      { id:"channel-mix",  icon:"🌐", name:"Channel Mix",   score:55, impact:"$38.4K", status:"medium",
        detail:[["Active brands","15 of 18"],["Inactive brands","3"],["CC contribution","21.32%"],["Top 4 brands","69.06%"],["Action","Activate 3 inactive brands"]] },
      { id:"cancellation", icon:"❌", name:"Cancellation",  score:61, impact:"$31.7K", status:"medium",
        detail:[["Cancel rate","6–8% of gross"],["Peak cancels","July (698) + Aug (704)"],["Net realization","Weakens at peak"],["Total cancels","3,965 Jun–Dec"],["Action","Rate stability + booking flow"]] },
    ]
  ),
};

/* Merge partner levers into account levers lookup */
const ALL_LEVERS = { ...ACCOUNT_LEVERS_BASE, ...PARTNER_LEVERS };


/* Default/fallback for accounts without specific data */
const DEFAULT_LEVERS = makeBuckets(
  [
    { id:"ari-sync",    icon:"🔄", name:"ARI Sync",     score:79, impact:"$8.1K",  status:"healthy",
      detail:{ description:"ARI sync performing within acceptable thresholds.", breakdown:[{label:"Avg sync lag",value:"0.8h"},{label:"Sync fail rate",value:"2%"},{label:"Properties affected",value:"4"}], estimatedImpact:"$8,100", actions:["Investigate Feed","View Sync Logs","Download Report"] }},
    { id:"availability",icon:"📅", name:"Availability", score:84, impact:"$5.2K",  status:"healthy",
      detail:{ description:"Availability windows healthy across demand partners.", breakdown:[{label:"Closed dates",value:"12"},{label:"Channels affected",value:"1"},{label:"Lost nights",value:"8"}], estimatedImpact:"$5,200", actions:["Investigate Calendar","View Availability","Download Gaps"] }},
    { id:"restrictions",icon:"⛔", name:"Restrictions",  score:88, impact:"$2.4K",  status:"healthy",
      detail:{ description:"Restriction rules well configured — minor optimisation available.", breakdown:[{label:"Min stay violations",value:"4"},{label:"CTA blocks",value:"1"},{label:"Channels impacted",value:"1"}], estimatedImpact:"$2,400", actions:["Investigate Restrictions","View Rules","Download Data"] }},
    { id:"rate-parity", icon:"⚖️", name:"Rate Parity",  score:82, impact:"$6.8K",  status:"healthy",
      detail:{ description:"Rate parity broadly maintained across OTAs.", breakdown:[{label:"Booking.com",value:"2 violations"},{label:"Expedia",value:"1 violation"},{label:"Agoda",value:"0 violations"}], estimatedImpact:"$6,800", actions:["Investigate Parity","View Listings","Download Report"] }},
  ],
  [
    { id:"error-rate",  icon:"⚠️", name:"Error Rate",   score:81, impact:"$4.9K",  status:"healthy",
      detail:{ description:"Error rate within benchmark — no immediate action required.", breakdown:[{label:"API errors",value:"21/day"},{label:"Booking failures",value:"0.6%"},{label:"Retry rate",value:"3%"}], estimatedImpact:"$4,900", actions:["Investigate Errors","View Error Log","Download Report"] }},
    { id:"activation",  icon:"⚙️", name:"Activation",   score:91, impact:"$1.8K",  status:"healthy",
      detail:{ description:"Property activations up to date across all channels.", breakdown:[{label:"Pending activation",value:"2 props"},{label:"Partial setup",value:"1"},{label:"Avg days",value:"2.1"}], estimatedImpact:"$1,800", actions:["Investigate Queue","View Status","Download List"] }},
    { id:"mapping",     icon:"🔗", name:"Mapping",       score:86, impact:"$3.4K",  status:"healthy",
      detail:{ description:"Room type mapping largely clean — minor discrepancies only.", breakdown:[{label:"Unmapped rooms",value:"4"},{label:"Rate mismatch",value:"2"},{label:"OTAs affected",value:"1"}], estimatedImpact:"$3,400", actions:["Investigate Mappings","View Room Types","Download Errors"] }},
    { id:"commission",  icon:"💰", name:"Commission",    score:89, impact:"$2.1K",  status:"healthy",
      detail:{ description:"Commission rates aligned with contracted terms.", breakdown:[{label:"Overcharged",value:"1 prop"},{label:"Avg overcharge",value:"0.4%"},{label:"Channels",value:"None flagged"}], estimatedImpact:"$2,100", actions:["Investigate Contracts","View Rates","Download Report"] }},
  ],
  [
    { id:"images",      icon:"📷", name:"Images",        score:83, impact:"$3.6K",  status:"healthy",
      detail:{ description:"Image coverage meeting OTA thresholds across all properties.", breakdown:[{label:"Below 10 images",value:"3 props"},{label:"No exterior shot",value:"1"},{label:"Low res flagged",value:"2"}], estimatedImpact:"$3,600", actions:["Investigate Gallery","View Images","Download List"] }},
    { id:"amenities",   icon:"🏨", name:"Amenities",     score:88, impact:"$2.2K",  status:"healthy",
      detail:{ description:"Amenity data complete — minor gaps only.", breakdown:[{label:"Missing amenities",value:"6 props"},{label:"Incorrect data",value:"2"},{label:"OTAs impacted",value:"1"}], estimatedImpact:"$2,200", actions:["Investigate Amenities","View Data","Download Gaps"] }},
    { id:"descriptions",icon:"📝", name:"Descriptions",  score:85, impact:"$2.8K",  status:"healthy",
      detail:{ description:"Descriptions meeting length and quality standards.", breakdown:[{label:"Under 150 words",value:"4 props"},{label:"Missing entirely",value:"0"},{label:"Duplicate content",value:"2"}], estimatedImpact:"$2,800", actions:["Investigate Content","View Descriptions","Download List"] }},
    { id:"content-score",icon:"🖼️",name:"Content Score", score:80, impact:"$4.8K",  status:"healthy",
      detail:{ description:"Content scores above threshold on major OTAs.", breakdown:[{label:"Below 70 score",value:"5 props"},{label:"Below 50 score",value:"0"},{label:"Avg score",value:"78/100"}], estimatedImpact:"$4,800", actions:["Investigate Scores","View Content Plan","Download Report"] }},
  ],
  [
    { id:"look-to-book",icon:"🔍", name:"Look-to-Book",  score:74, impact:"$6.9K",  status:"medium",
      detail:{ description:"Search-to-booking conversion within acceptable range.", breakdown:[{label:"Avg L2B ratio",value:"1:98"},{label:"Below threshold",value:"4 props"},{label:"Top miss channel",value:"Agoda"}], estimatedImpact:"$6,900", actions:["Investigate L2B","View Analytics","Download Data"] }},
    { id:"booking-pace",icon:"📈", name:"Booking Pace",  score:79, impact:"$5.4K",  status:"medium",
      detail:{ description:"Booking pace tracking broadly in line with forecast.", breakdown:[{label:"Behind forecast",value:"3 props"},{label:"Avg gap",value:"-4%"},{label:"Critical window",value:"Next 30 days"}], estimatedImpact:"$5,400", actions:["Investigate Pace","View Pace Report","Download Report"] }},
    { id:"channel-mix", icon:"🌐", name:"Channel Mix",   score:82, impact:"$3.8K",  status:"healthy",
      detail:{ description:"Channel mix well balanced — OTA and direct in healthy ratio.", breakdown:[{label:"OTA share",value:"58%"},{label:"Direct share",value:"26%"},{label:"Target direct",value:"25%"}], estimatedImpact:"$3,800", actions:["Investigate Mix","View Strategy","Download Data"] }},
    { id:"cancellation",icon:"❌", name:"Cancellation",  score:81, impact:"$4.2K",  status:"healthy",
      detail:{ description:"Cancellation rate within benchmark — no immediate action.", breakdown:[{label:"Avg cancel rate",value:"11%"},{label:"High risk props",value:"2"},{label:"Peak window",value:"72h pre-arrival"}], estimatedImpact:"$4,200", actions:["Investigate Cancellations","View Policy","Download Report"] }},
  ]
);

const LEVER_STATUS_CFG = {
  critical: { label:"Critical", color:"#ef4444", bg:"#fef2f2", bar:"#ef4444", icon:"🔥" },
  medium:   { label:"At Risk",  color:"#f59e0b", bg:"#fffbeb", bar:"#f59e0b", icon:"⚠️" },
  healthy:  { label:"Healthy",  color:"#10b981", bg:"#f0fdf4", bar:"#10b981", icon:"✓"  },
};

const FIX_STATUS_CFG = {
  "Open":        { color:"#64748B", bg:"#F1F5F9", border:"#CBD5E1" },
  "In Progress": { color:"#D97706", bg:"#FFFBEB", border:"#FCD34D" },
  "Resolved":    { color:"#059669", bg:"#F0FDF4", border:"#86EFAC" },
};
const FIX_STATUS_CYCLE = ["Open","In Progress","Resolved"];



/* ══════════════════════════════════════════════════════════════════════════
   PAGE 5 — 16-LEVER GRID (v2)
══════════════════════════════════════════════════════════════════════════ */
function downloadLeverCSV(lever, tenantName) {
  const rows = [
    ["Tenant","Lever","Metric","Value","Status"],
    [tenantName, lever.name, "Revenue at Risk", lever.impact, lever.status],
    [tenantName, lever.name, "Health Score", lever.score + "/100", lever.status],
    ...(lever.breakdown || []).map(b => [tenantName, lever.name, b.label, b.value, lever.status]),
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type:"text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href:url, download:`${tenantName}_${lever.name.replace(/\s+/g,"_")}.csv` });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const DIST_HEALTH_DATA = {
  "Wyndham Hotels": {
    kpis: [
      { label:"Net Bookings YTD",  value:"42,040", rag:"green"  },
      { label:"Cancellation Rate", value:"8.3%",   rag:"amber"  },
      { label:"Active Partners",   value:"2 of 4", rag:"amber"  },
      { label:"Error Rate /1k",    value:"15.2",   rag:"red"    },
    ],
    grossTrend: [6073,5840,5290,5680,5100,4890,4510,4220],
    netTrend:   [5550,5300,4820,5190,4660,4470,4120,3880],
    trendLabel: "▼ 8% vs prior period",
    partners: [
      { name:"HotelTonight",  contribution:"68%", errorRate:"4.1%", rag:"green" },
      { name:"Tricept",       contribution:"32%", errorRate:"28.4%",rag:"red"   },
    ],
  },
  "IHG Hotels & Resorts": {
    kpis: [
      { label:"Net Bookings YTD",  value:"28,300", rag:"green"  },
      { label:"Cancellation Rate", value:"0%",     rag:"green"  },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"5.6",    rag:"amber"  },
    ],
    grossTrend: [3200,3400,3550,3800,3700,3900,4100,4200],
    netTrend:   [3200,3400,3550,3800,3700,3900,4100,4200],
    trendLabel: "▲ 2% vs prior period",
    partners: [
      { name:"Hotel Tonight", contribution:"100%", errorRate:"5.6%", rag:"amber" },
    ],
  },
  "Omni Hotels & Resorts": {
    kpis: [
      { label:"Net Bookings YTD",  value:"19,400", rag:"green"  },
      { label:"Cancellation Rate", value:"13%",    rag:"amber"  },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"8.1",    rag:"amber"  },
    ],
    grossTrend: [2300,2450,2600,2550,2400,2380,2200,2150],
    netTrend:   [2000,2130,2260,2220,2090,2070,1910,1870],
    trendLabel: "▼ 4% vs prior period",
    partners: [
      { name:"Agoda", contribution:"100%", errorRate:"8.1%", rag:"amber" },
    ],
  },
  "Choice Hotels": {
    kpis: [
      { label:"Net Bookings YTD",  value:"31,200", rag:"green"  },
      { label:"Cancellation Rate", value:"6.1%",   rag:"amber"  },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"3.4",    rag:"green"  },
    ],
    grossTrend: [3400,3600,3750,3900,4100,4300,4200,4500],
    netTrend:   [3190,3380,3520,3660,3850,4040,3940,4220],
    trendLabel: "▲ 6% vs prior period",
    partners: [
      { name:"Agoda",  contribution:"78%", errorRate:"2.1%",  rag:"green" },
      { name:"Hopper", contribution:"22%", errorRate:"18.7%", rag:"red"   },
    ],
  },
  "Choice Hotels|Hopper Travel Services": {
    kpis: [
      { label:"Net Bookings YTD",  value:"6,864",  rag:"amber"  },
      { label:"Cancellation Rate", value:"11.2%",  rag:"red"    },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"18.7",   rag:"red"    },
    ],
    grossTrend: [820,940,980,1050,1120,1080,990,880],
    netTrend:   [728,834,870,932,994,958,878,780],
    trendLabel: "▼ 12% vs prior period",
    partners: [
      { name:"Hopper", contribution:"100%", errorRate:"18.7%", rag:"red" },
    ],
  },
  "Best Western Hotels": {
    kpis: [
      { label:"Net Bookings YTD",  value:"18,400", rag:"amber"  },
      { label:"Cancellation Rate", value:"66%",    rag:"red"    },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"9.4",    rag:"red"    },
    ],
    grossTrend: [2800,2650,2500,2200,1980,1840,1700,1530],
    netTrend:   [952,901,850,748,673,626,578,520],
    trendLabel: "▼ 14% vs prior period",
    partners: [
      { name:"Delta Vacation", contribution:"100%", errorRate:"9.4%", rag:"red" },
    ],
  },
  "Hilton Worldwide": {
    kpis: [
      { label:"Net Bookings YTD",  value:"22,100", rag:"amber"  },
      { label:"Cancellation Rate", value:"9.2%",   rag:"amber"  },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"12.7",   rag:"red"    },
    ],
    grossTrend: [2900,2800,2750,2680,2600,2540,2480,2310],
    netTrend:   [2635,2545,2500,2437,2365,2311,2254,2102],
    trendLabel: "▼ 11% vs prior period",
    partners: [
      { name:"British Airways", contribution:"100%", errorRate:"12.7%", rag:"red" },
    ],
  },
  "Hyatt Hotels": {
    kpis: [
      { label:"Net Bookings YTD",  value:"14,800", rag:"amber"  },
      { label:"Cancellation Rate", value:"16.4%",  rag:"red"    },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"6.8",    rag:"amber"  },
    ],
    grossTrend: [2100,1980,1900,1820,1750,1690,1640,1520],
    netTrend:   [1757,1656,1589,1523,1464,1414,1371,1271],
    trendLabel: "▼ 8% vs prior period",
    partners: [
      { name:"Trisept Solutions", contribution:"100%", errorRate:"6.8%", rag:"amber" },
    ],
  },
  "Marriott International": {
    kpis: [
      { label:"Net Bookings YTD",  value:"31,600", rag:"green"  },
      { label:"Cancellation Rate", value:"7.1%",   rag:"amber"  },
      { label:"Active Partners",   value:"1 of 2", rag:"amber"  },
      { label:"Error Rate /1k",    value:"7.9",    rag:"amber"  },
    ],
    grossTrend: [3800,3850,3900,3820,3780,3900,3850,3920],
    netTrend:   [3530,3579,3627,3552,3517,3627,3580,3644],
    trendLabel: "▼ 3% vs prior period",
    partners: [
      { name:"British Airways", contribution:"100%", errorRate:"7.9%", rag:"amber" },
    ],
  },
};

const ACCOUNT_PERFORMANCE = {
  "Wyndham Hotels":        { bookings:42040, revenue:"$3.96M", cancelRate:"8.3%",  channel:"Hotel Tonight", yoy:-8 },
  "IHG Hotels & Resorts":  { bookings:28300, revenue:"$3.34M", cancelRate:"4.1%",  channel:"Hotel Tonight", yoy:+2 },
  "Omni Hotels & Resorts": { bookings:19400, revenue:"$3.63M", cancelRate:"6.2%",  channel:"Agoda",         yoy:-4 },
  "Choice Hotels":         { bookings:31200, revenue:"$2.56M", cancelRate:"5.8%",  channel:"Hopper",        yoy:+6 },
};

function PropertyPerformanceCard({ tenant }) {
  const [open, setOpen] = useState(false);
  const d = ACCOUNT_PERFORMANCE[tenant];
  return (
    <div style={{marginBottom:18}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          width:"100%",background:"none",border:"none",cursor:"pointer",padding:0,
          marginBottom: open ? 10 : 0}}>
        <span style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",
          letterSpacing:"0.07em"}}>Property Performance</span>
        <span style={{fontSize:10,color:C.brand,fontWeight:600}}>
          {open ? "▲ Hide" : "▼ Show"}
        </span>
      </button>
      {open && (
        d ? (
          <div style={{background:"#F8FAFC",borderRadius:10,border:`1px solid ${C.border}`,
            padding:"12px 14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 16px",marginBottom:12}}>
              {[
                ["Bookings (12 mo)", d.bookings.toLocaleString()],
                ["Net Revenue",      d.revenue],
                ["Cancellation Rate",d.cancelRate],
                ["Top Channel",      d.channel],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{fontSize:10,color:C.t4,fontWeight:600,letterSpacing:0.4,
                    textTransform:"uppercase",marginBottom:2}}>{label}</div>
                  <div style={{fontSize:15,fontWeight:800,color:C.t1,
                    fontFamily:C.mono}}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{paddingTop:10,borderTop:`1px solid ${C.t6}`,
              display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:10,color:C.t4,fontWeight:600,textTransform:"uppercase",
                letterSpacing:0.4}}>YoY Trend</span>
              <Trend v={d.yoy} invert/>
            </div>
          </div>
        ) : (
          <div style={{background:"#F8FAFC",borderRadius:10,border:`1px solid ${C.border}`,
            padding:"12px 14px",textAlign:"center",color:C.t3,fontSize:12,fontStyle:"italic"}}>
            Performance data loading…
          </div>
        )
      )}
    </div>
  );
}

/* ── Revenue Recovery data ── */
const RECOVERY_DATA = {
  "Wyndham Hotels": {
    pocStart:"Jan 2026", monthsIn:3,
    forecastBookings:80,  forecastRevenue:"$7,520",
    realizedBookings:47,  realizedRevenue:"$4,418",
    progress:59,
    baseline:"Dec 2025",
    monthly:[12, 21, 35, 47],  // realized bookings per month
    forecast:80,               // flat forecast line
    pillars:[
      { name:"ARI",           fixed:2, total:4, bookings:18, revenue:"$1,692", rag:"green" },
      { name:"Errors",        fixed:3, total:4, bookings:16, revenue:"$1,504", rag:"green" },
      { name:"Content",       fixed:1, total:4, bookings:8,  revenue:"$752",   rag:"amber" },
      { name:"Look-to-Book",  fixed:0, total:4, bookings:0,  revenue:"—",      rag:"grey"  },
    ],
  },
  "IHG Hotels & Resorts": {
    pocStart:"Nov 2025", monthsIn:4,
    forecastBookings:55,  forecastRevenue:"$6,490",
    realizedBookings:61,  realizedRevenue:"$7,198",
    progress:110,
    baseline:"Oct 2025",
    monthly:[18, 38, 55, 61],
    forecast:55,
    pillars:[
      { name:"ARI",           fixed:3, total:4, bookings:24, revenue:"$2,832", rag:"green" },
      { name:"Errors",        fixed:2, total:4, bookings:20, revenue:"$2,360", rag:"green" },
      { name:"Content",       fixed:2, total:4, bookings:12, revenue:"$1,416", rag:"green" },
      { name:"Look-to-Book",  fixed:1, total:4, bookings:5,  revenue:"$590",   rag:"amber" },
    ],
  },
  "Omni Hotels & Resorts": {
    pocStart:"Feb 2026", monthsIn:2,
    forecastBookings:40,  forecastRevenue:"$7,480",
    realizedBookings:28,  realizedRevenue:"$5,236",
    progress:70,
    baseline:"Jan 2026",
    monthly:[11, 28],
    forecast:40,
    pillars:[
      { name:"ARI",           fixed:2, total:4, bookings:14, revenue:"$2,618", rag:"green" },
      { name:"Errors",        fixed:1, total:4, bookings:9,  revenue:"$1,683", rag:"amber" },
      { name:"Content",       fixed:1, total:4, bookings:5,  revenue:"$935",   rag:"amber" },
      { name:"Look-to-Book",  fixed:0, total:4, bookings:0,  revenue:"—",      rag:"grey"  },
    ],
  },
  "Choice Hotels": {
    pocStart:"Oct 2025", monthsIn:5,
    forecastBookings:95,  forecastRevenue:"$7,790",
    realizedBookings:88,  realizedRevenue:"$7,216",
    progress:93,
    baseline:"Sep 2025",
    monthly:[28, 51, 70, 82, 88],
    forecast:95,
    pillars:[
      { name:"ARI",           fixed:3, total:4, bookings:36, revenue:"$2,952", rag:"green" },
      { name:"Errors",        fixed:3, total:4, bookings:29, revenue:"$2,378", rag:"green" },
      { name:"Content",       fixed:2, total:4, bookings:16, revenue:"$1,312", rag:"green" },
      { name:"Look-to-Book",  fixed:1, total:4, bookings:7,  revenue:"$574",   rag:"amber" },
    ],
  },
};

function RecoveryPage({ activeClient, goLevers, toast }) {
  const tenant = activeClient?.name || "";
  const d = RECOVERY_DATA[tenant];

  if (!d) return (
    <div className="fade-in" style={{padding:40,textAlign:"center",color:C.t3}}>
      <div style={{fontSize:32,marginBottom:12}}>📊</div>
      <div style={{fontSize:16,fontWeight:700,color:C.t1,marginBottom:6}}>Recovery tracking not yet active</div>
      <div style={{fontSize:13}}>Full uplift data available for Wyndham, IHG, Omni and Choice.</div>
    </div>
  );

  // Build bar chart SVG — bars for realized, dashed line for forecast
  const BAR_W = 560, BAR_H = 120;
  const n = d.monthly.length;
  const barW = Math.floor((BAR_W - 40) / n) - 8;
  const maxVal = Math.max(d.forecast * 1.2, ...d.monthly);
  const barH = (v) => Math.max(4, ((v / maxVal) * (BAR_H - 24)));
  const forecastY = BAR_H - 16 - ((d.forecast / maxVal) * (BAR_H - 24));
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  // derive month labels from pocStart
  const startMonthIdx = monthLabels.indexOf(d.pocStart.split(" ")[0]);
  const barLabels = d.monthly.map((_,i) => monthLabels[(startMonthIdx + i) % 12]);

  const ragColor = { green:C.green, amber:C.amber, grey:C.t3 };
  const ragBg    = { green:C.greenBg, amber:C.amberBg, grey:"#F8FAFC" };
  const ragBdr   = { green:C.greenBorder, amber:C.amberBorder, grey:C.border };

  const pct = Math.min(d.progress, 100);
  const isOver = d.progress > 100;

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px",margin:0}}>Revenue Recovery</h1>
            <Phase label="PROVE"/>
            <ProducerTier name={tenant}/>
          </div>
          <div style={{fontSize:12,color:C.t3}}>Program scorecard · {tenant} · POC started {d.pocStart}</div>
        </div>
        <button onClick={()=>toast("QBR export queued","info")}
          style={{background:C.brand,border:"none",borderRadius:8,padding:"8px 18px",
            fontSize:13,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`,cursor:"pointer"}}>
          ↓ Export to QBR
        </button>
      </div>

      {/* 1. Program Scorecard */}
      <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:14,
        padding:"20px 24px",marginBottom:16,boxShadow:C.shadow}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <Phase label="PROVE"/>
          <span style={{fontSize:12,fontWeight:700,color:C.t1}}>Program Scorecard</span>
          <Ann type="backed"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
          {[
            ["POC Start Date",         d.pocStart,                       C.brand ],
            ["Forecast (monthly)",     `+${d.forecastBookings} bookings · ${d.forecastRevenue}`, C.t2 ],
            ["Realized to Date",       `+${d.realizedBookings} bookings · ${d.realizedRevenue}`, isOver?C.green:C.amber ],
            ["Recovery Progress",      `${d.progress}%`,                 isOver?C.green:d.progress>=70?C.amber:C.red ],
          ].map(([label,value,color])=>(
            <div key={label}>
              <div style={{fontSize:10,fontWeight:600,color:C.t4,textTransform:"uppercase",
                letterSpacing:0.5,marginBottom:6}}>{label}</div>
              <div style={{fontSize:14,fontWeight:800,fontFamily:C.mono,color,lineHeight:1.3}}>{value}</div>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:11,color:C.t3}}>Recovery Progress vs Forecast</span>
            <span style={{fontSize:11,fontWeight:700,fontFamily:C.mono,
              color:isOver?C.green:d.progress>=70?C.amber:C.red}}>{d.progress}%</span>
          </div>
          <div style={{height:10,background:C.t6,borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",borderRadius:99,
              background:isOver?C.green:d.progress>=70?C.amber:C.red,
              transition:"width 0.8s ease"}}/>
          </div>
        </div>
        <div style={{fontSize:11,color:C.t4,fontStyle:"italic"}}>
          Baseline established {d.baseline}. All uplift measured against agreed pre-POC baseline.
        </div>
      </div>

      {/* 2 + 3. Chart + Pillar Breakdown */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 420px",gap:14}}>

        {/* Monthly Uplift Chart */}
        <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:14,
          padding:"18px 20px",boxShadow:C.shadow}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <Phase label="PROVE"/>
            <span style={{fontSize:12,fontWeight:700,color:C.t1}}>Monthly Uplift vs Forecast</span>
          </div>
          <div style={{fontSize:11,color:C.t3,marginBottom:16}}>
            {d.monthsIn} months into program · Target: +{d.forecastBookings} bookings/mo
          </div>
          {/* SVG bar chart */}
          <div style={{overflowX:"auto"}}>
            <svg width="100%" viewBox={`0 0 ${BAR_W} ${BAR_H + 24}`} style={{display:"block",minWidth:280}}>
              {/* Forecast dashed line */}
              <line x1="20" y1={forecastY} x2={BAR_W - 20} y2={forecastY}
                stroke={C.brand} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
              <text x={BAR_W - 18} y={forecastY - 4} fontSize="9" fill={C.brand}
                textAnchor="end" fontFamily="IBM Plex Mono" fontWeight="700">TARGET</text>
              {/* Bars */}
              {d.monthly.map((v, i) => {
                const x = 20 + i * ((BAR_W - 40) / n);
                const bh = barH(v);
                const by = BAR_H - 16 - bh;
                const isWin = v >= d.forecast;
                return (
                  <g key={i}>
                    <rect x={x + 2} y={by} width={barW} height={bh}
                      rx="4" fill={isWin ? C.green : C.blue} opacity="0.85"/>
                    <text x={x + 2 + barW/2} y={BAR_H + 8} fontSize="9"
                      textAnchor="middle" fill={C.t4} fontFamily="IBM Plex Mono">{barLabels[i]}</text>
                    <text x={x + 2 + barW/2} y={by - 4} fontSize="9"
                      textAnchor="middle" fill={C.t2} fontFamily="IBM Plex Mono" fontWeight="700">+{v}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          {/* Legend */}
          <div style={{display:"flex",gap:16,marginTop:8}}>
            {[[C.blue,"Realized uplift",""],[C.green,"Exceeded target",""],
              [C.brand,"Forecast line","6 4"]].map(([c,l,dash])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                {dash ? (
                  <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={c} strokeWidth="1.5" strokeDasharray={dash}/></svg>
                ) : (
                  <div style={{width:12,height:10,background:c,borderRadius:2,opacity:0.85}}/>
                )}
                <span style={{fontSize:10,color:C.t3}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar Breakdown Table */}
        <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:14,
          boxShadow:C.shadow,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",gap:8}}>
            <Phase label="PRIORITISE"/>
            <span style={{fontSize:12,fontWeight:700,color:C.t1}}>Uplift by Pillar</span>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",flex:1}}>
            <thead>
              <tr style={{background:"#F8FAFC"}}>
                {["Pillar","Levers Fixed","Bookings/mo","Revenue"].map(h=>(
                  <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,
                    fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:0.4,
                    borderBottom:`1px solid ${C.border}`}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.pillars.map((p,i)=>(
                <tr key={p.name} style={{borderBottom:i<d.pillars.length-1?`1px solid ${C.t6}`:"none",
                  background:i%2===0?"#fff":"#FAFBFD"}}>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:8,height:8,borderRadius:"50%",
                        background:ragColor[p.rag],flexShrink:0}}/>
                      <span style={{fontSize:13,fontWeight:600,color:C.t1}}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <button onClick={()=>goLevers(tenant)}
                      style={{background:ragBg[p.rag],border:`1px solid ${ragBdr[p.rag]}`,
                        borderRadius:6,padding:"3px 10px",fontSize:11,
                        color:ragColor[p.rag],fontWeight:700,fontFamily:C.mono,
                        cursor:"pointer",whiteSpace:"nowrap"}}>
                      {p.fixed} of {p.total}
                    </button>
                  </td>
                  <td style={{padding:"12px 14px",fontFamily:C.mono,fontSize:13,
                    fontWeight:700,color:p.bookings>0?C.green:C.t4}}>
                    {p.bookings>0?`+${p.bookings}`:"—"}
                  </td>
                  <td style={{padding:"12px 14px",fontFamily:C.mono,fontSize:13,
                    fontWeight:700,color:p.revenue!=="—"?C.green:C.t4}}>
                    {p.revenue!=="—"?p.revenue:"—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Totals row */}
          <div style={{padding:"12px 14px",borderTop:`2px solid ${C.border}`,
            background:"#F8FAFC",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr"}}>
            <span style={{fontSize:11,fontWeight:700,color:C.t2}}>Total</span>
            <span style={{fontSize:11,color:C.t4,fontFamily:C.mono}}>{d.pillars.reduce((s,p)=>s+p.fixed,0)} levers</span>
            <span style={{fontSize:11,fontWeight:700,fontFamily:C.mono,color:C.green}}>+{d.realizedBookings}/mo</span>
            <span style={{fontSize:11,fontWeight:700,fontFamily:C.mono,color:C.green}}>{d.realizedRevenue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistributionPage({ tenant, activePartners, goLevers, toast }) {
  // Check for partner-specific key first (e.g. Choice + Hopper), fall back to account key
  const partnerKey = (activePartners || [])
    .filter(p => p !== "All Brands")
    .map(p => `${tenant}|${p}`)
    .find(k => DIST_HEALTH_DATA[k]) || null;
  const d = (partnerKey && DIST_HEALTH_DATA[partnerKey]) || DIST_HEALTH_DATA[tenant];
  const ragColor = { green:C.green, amber:C.amber, red:C.red };
  const ragBg    = { green:C.greenBg, amber:C.amberBg, red:"#FEF2F2" };
  const ragBdr   = { green:C.greenBorder, amber:C.amberBorder, red:C.redBorder };

  if (!d) return (
    <div className="fade-in" style={{padding:40,textAlign:"center",color:C.t3}}>
      <div style={{fontSize:32,marginBottom:12}}>📡</div>
      <div style={{fontSize:16,fontWeight:700,color:C.t1,marginBottom:6}}>Distribution data loading</div>
      <div style={{fontSize:13}}>Full health data available for Wyndham, IHG, Omni and Choice.</div>
    </div>
  );

  const w = 320, h = 80;
  const allVals = [...d.grossTrend, ...d.netTrend];
  const mn = Math.min(...allVals), mx = Math.max(...allVals), rng = mx - mn || 1;
  const pts = (arr) => arr.map((v,i) =>
    `${(i/(arr.length-1))*w},${h-((v-mn)/rng)*(h-10)-5}`).join(" ");
  const grossPts = pts(d.grossTrend);
  const netPts   = pts(d.netTrend);
  const months   = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
  const lastGY   = h-((d.grossTrend[d.grossTrend.length-1]-mn)/rng)*(h-10)-5;
  const lastNY   = h-((d.netTrend[d.netTrend.length-1]-mn)/rng)*(h-10)-5;

  return (
    <div className="fade-in">
      {/* Page header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px",margin:0}}>Distribution Health</h1>
            <Phase label="SEE"/>
            <ProducerTier name={tenant}/>
          </div>
          <div style={{fontSize:12,color:C.t3}}>Current state · {tenant} · RG InsightsIQ signal layer</div>
        </div>
        <button onClick={()=>goLevers(tenant)}
          style={{background:C.brand,border:"none",borderRadius:8,padding:"8px 18px",
            fontSize:13,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`,cursor:"pointer"}}>
          → 16-Lever Analysis
        </button>
      </div>

      {/* 1. Health Snapshot Bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <span style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",
          letterSpacing:"0.07em"}}>Health Snapshot</span>
        <ProducerTier name={tenant}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        {d.kpis.map(k => (
          <div key={k.label} style={{background:C.cardBg,border:`1px solid ${ragBdr[k.rag]}`,
            borderTop:`3px solid ${ragColor[k.rag]}`,borderRadius:12,padding:"16px 18px",
            boxShadow:C.shadow}}>
            <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:"uppercase",
              letterSpacing:0.6,marginBottom:8}}>{k.label}</div>
            <div style={{fontSize:28,fontWeight:800,fontFamily:C.mono,color:ragColor[k.rag],
              letterSpacing:"-1px",lineHeight:1}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* 2+3. Trend + Partners */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>

        {/* Booking Trend Card */}
        <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:12,
          padding:"18px 20px",boxShadow:C.shadow}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.t1}}>Booking Trend</div>
              <div style={{fontSize:11,color:C.t3,marginTop:2}}>Gross vs Net · 8-month window</div>
            </div>
            <span style={{fontSize:11,fontWeight:700,fontFamily:C.mono,
              color:d.trendLabel.startsWith("▲")?C.green:C.red}}>{d.trendLabel}</span>
          </div>
          {/* Dual-line sparkline */}
          <div style={{position:"relative",marginBottom:10}}>
            <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible",display:"block"}}>
              {/* Fill between lines — cancellation gap */}
              <polygon
                points={`${grossPts} ${pts(d.netTrend).split(" ").reverse().join(" ")}`}
                fill={C.red} fillOpacity={0.07}/>
              {/* Gross line */}
              <polyline points={grossPts} fill="none" stroke={C.brand} strokeWidth={2}
                strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3"/>
              <circle cx={w} cy={lastGY} r={3} fill={C.cardBg} stroke={C.brand} strokeWidth={2}/>
              {/* Net line */}
              <polyline points={netPts} fill="none" stroke={C.green} strokeWidth={2.5}
                strokeLinejoin="round" strokeLinecap="round"/>
              <circle cx={w} cy={lastNY} r={3.5} fill={C.cardBg} stroke={C.green} strokeWidth={2}/>
            </svg>
          </div>
          {/* Month labels */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            {months.map(m => <span key={m} style={{fontSize:9,color:C.t4,fontFamily:C.mono}}>{m}</span>)}
          </div>
          {/* Legend */}
          <div style={{display:"flex",gap:16}}>
            {[[C.brand,"Gross bookings","5 3"],[C.green,"Net bookings",""]].map(([c,l,dash])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={c} strokeWidth="2" strokeDasharray={dash}/></svg>
                <span style={{fontSize:10,color:C.t3}}>{l}</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:12,height:8,background:C.red,opacity:0.2,borderRadius:1}}/>
              <span style={{fontSize:10,color:C.t3}}>Cancellation gap</span>
            </div>
          </div>
        </div>

        {/* Partner Contribution Panel */}
        <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:12,
          boxShadow:C.shadow,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",gap:8}}>
            <Phase label="SEE"/>
            <span style={{fontSize:12,fontWeight:700,color:C.t1}}>Partner Contribution</span>
            <span style={{fontSize:11,color:C.t3,marginLeft:"auto"}}>{d.partners.length} active partner{d.partners.length>1?"s":""}</span>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#F8FAFC"}}>
                {["Partner","Contribution","Error Rate"].map(h => (
                  <th key={h} style={{padding:"8px 16px",textAlign:"left",fontSize:10,
                    fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:0.5,
                    borderBottom:`1px solid ${C.border}`}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.partners.map((p,i) => (
                <tr key={p.name} style={{borderBottom:i<d.partners.length-1?`1px solid ${C.t6}`:"none",
                  background:i%2===0?"#fff":"#FAFBFD"}}>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:600,color:C.t1}}>{p.name}</span>
                      <ProducerTier name={tenant}/>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:60,height:5,background:C.t6,borderRadius:3}}>
                        <div style={{width:p.contribution,height:"100%",background:C.brand,borderRadius:3}}/>
                      </div>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:C.mono,color:C.t1}}>{p.contribution}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px"}}>
                    <span style={{fontSize:12,fontWeight:700,fontFamily:C.mono,
                      color:ragColor[p.rag],background:ragBg[p.rag],
                      border:`1px solid ${ragBdr[p.rag]}`,borderRadius:5,
                      padding:"2px 8px"}}>{p.errorRate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Bottom note */}
          {d.partners.some(p=>p.rag==="red") && (
            <div style={{padding:"10px 16px",background:"#FEF2F2",borderTop:`1px solid ${C.redBorder}`,
              fontSize:11,color:C.red,fontWeight:600}}>
              ⚠ High error rate detected — see 16-Lever Grid for root cause
            </div>
          )}
        </div>
      </div>

      {/* 4. Bridge CTA */}
      <div style={{background:`linear-gradient(135deg,${C.brandDim} 0%,#EDE9FE 100%)`,
        border:`1px solid ${C.brandBorder}`,borderRadius:14,padding:"22px 28px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        boxShadow:`0 2px 12px ${C.brand}18`}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.brand,textTransform:"uppercase",
            letterSpacing:"0.07em",marginBottom:6}}>RateIQ · Distribution → Action</div>
          <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:4}}>
            Distribution health identifies where revenue is leaking.
          </div>
          <div style={{fontSize:13,color:C.t3}}>
            The 16-Lever Grid shows you what to fix first.
          </div>
        </div>
        <button onClick={()=>goLevers(tenant)}
          style={{background:C.brand,border:"none",borderRadius:10,
            padding:"12px 24px",fontSize:14,color:"#fff",fontWeight:800,
            boxShadow:`0 4px 16px ${C.brand}55`,cursor:"pointer",
            whiteSpace:"nowrap",flexShrink:0}}>
          → View 16-Lever Analysis
        </button>
      </div>
    </div>
  );
}

// Issue Classification: [issueType, ownership]
// issueType: crs=blue, pipe=amber, ota=brand-purple
// ownership: rg=green, client=amber, property=grey
const ISSUE_TAGS = {
  "ari-sync":    ["PIPE",    "RG Fix"   ],
  "availability":["CRS",     "Client IT"],
  "restrictions":["CRS",     "Property" ],
  "rate-parity": ["PIPE",    "RG Fix"   ],
  "error-rate":  ["PIPE",    "RG Fix"   ],
  "activation":  ["OTA",     "RG Fix"   ],
  "mapping":     ["PIPE",    "RG Fix"   ],
  "images":      ["OTA",     "Property" ],
  "channel-mix": ["OTA",     "Client IT"],
  "cancellation":["OTA",     "Property" ],
  // fallbacks for other levers
  "commission":  ["PIPE",    "RG Fix"   ],
  "amenities":   ["OTA",     "Property" ],
  "descriptions":["OTA",     "Property" ],
  "content-score":["OTA",    "Property" ],
  "look-to-book":["CRS",     "Client IT"],
  "booking-pace":["CRS",     "Client IT"],
};

const ISSUE_TYPE_CFG = {
  PIPE: { bg:C.amberBg,  color:C.amber,  border:C.amberBorder  },
  CRS:  { bg:C.blueBg,   color:C.blue,   border:C.blueBorder   },
  OTA:  { bg:C.brandDim, color:C.brand,  border:C.brandBorder  },
};
const OWNER_CFG = {
  "RG Fix":    { bg:C.greenBg, color:C.green, border:C.greenBorder },
  "Client IT": { bg:C.amberBg, color:C.amber, border:C.amberBorder },
  "Property":  { bg:"#F8FAFC", color:C.t3,    border:C.border      },
};

function IssueTag({ leverId, status }) {
  if (status === "healthy") return null;
  const pair = ISSUE_TAGS[leverId];
  if (!pair) return null;
  const [type, owner] = pair;
  const tc = ISSUE_TYPE_CFG[type]  || ISSUE_TYPE_CFG.PIPE;
  const oc = OWNER_CFG[owner]      || OWNER_CFG["Property"];
  const chip = (cfg, label) => (
    <span key={label} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:9,
      fontFamily:C.mono,background:cfg.bg,color:cfg.color,
      border:`1px solid ${cfg.border}`,borderRadius:4,
      padding:"2px 8px",fontWeight:700,letterSpacing:0.8,whiteSpace:"nowrap"}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:cfg.color,
        flexShrink:0,display:"inline-block"}}/>
      {label}
    </span>
  );
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
      {chip(tc, type)}
      {chip(oc, owner)}
    </span>
  );
}

function LeversPage({ tenant, setTenant, activePartners, onContentErrors, toast }) {
  const [activePanel, setActivePanel] = useState(null);
  const [fixStatus, setFixStatus]     = useState({});

  // Find first partner-specific key that exists (supports single or multi-select)
  const partnerKey = (activePartners || [])
    .filter(p => p !== "All Brands")
    .map(p => `${tenant}|${p}`)
    .find(k => ALL_LEVERS[k]) || null;
  const leverBuckets = ALL_LEVERS[partnerKey] || ALL_LEVERS[tenant] || DEFAULT_LEVERS;
  const allLevers = leverBuckets.flatMap(b => b.levers);

  const cycleFixStatus = (leverId, e) => {
    e.stopPropagation();
    setFixStatus(prev => {
      const cur = prev[leverId] || "Open";
      const next = FIX_STATUS_CYCLE[(FIX_STATUS_CYCLE.indexOf(cur) + 1) % FIX_STATUS_CYCLE.length];
      toast(`Status → ${next}`, next === "Resolved" ? "success" : "info");
      return { ...prev, [leverId]: next };
    });
  };
  const activeLever = allLevers.find(l => l.id === activePanel);

  const totalRisk = allLevers.reduce((sum, l) => sum + parseFloat(l.impact.replace(/[^0-9.]/g,"")), 0);
  const criticalRisk = allLevers.filter(l => l.status === "critical").reduce((sum, l) => sum + parseFloat(l.impact.replace(/[^0-9.]/g,"")), 0);
  const criticalPct = Math.round((criticalRisk / totalRisk) * 100);
  const fmt = (n) => "$" + (n >= 1000 ? (n/1000).toFixed(0) + "K" : n.toFixed(0));

  const topRisks = [...allLevers]
    .filter(l => l.status === "critical")
    .sort((a,b) => parseFloat(b.impact.replace(/[^0-9.]/g,"")) - parseFloat(a.impact.replace(/[^0-9.]/g,"")))
    .slice(0,3);

  return (
    <div className="fade-in">
      {/* Page header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Revenue Cockpit</h1>
            {tenant && (
              <div style={{background:C.brandDim,border:`1px solid ${C.brandBorder}`,borderRadius:7,padding:"4px 12px",fontSize:12,color:C.brand,fontWeight:700}}>
                📍 {tenant}
              </div>
            )}
            {tenant && <ProducerTier name={tenant}/>}
          </div>
          <div style={{fontSize:12,color:C.t3}}>16 levers across 4 domains · Click any card to drill down</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {(() => {
            const brands = ACCOUNT_BRANDS[tenant] || [];
            if (!brands.length) return null;
            return (
              <div style={{position:"relative"}} className="brands-chip">
                <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,
                  padding:"6px 12px",fontSize:12,color:C.t2,display:"flex",alignItems:"center",
                  gap:6,boxShadow:C.shadow,cursor:"default",userSelect:"none"}}>
                  <span style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:0.5}}>Brands</span>
                  <span style={{fontWeight:700,color:C.brand,fontFamily:C.mono,fontSize:13}}>{brands.length}</span>
                  <span style={{fontSize:11,color:C.t3}}>covered</span>
                  <span style={{fontSize:9,color:C.t4,marginLeft:2}}>▾</span>
                </div>
                <div className="brands-dropdown"
                  style={{position:"absolute",top:"calc(100% + 6px)",right:0,
                    background:"#1E2433",border:"1px solid rgba(255,255,255,0.12)",
                    borderRadius:8,minWidth:200,zIndex:500,
                    boxShadow:"0 8px 24px rgba(0,0,0,0.35)",padding:"6px 0",display:"none"}}>
                  {brands.map(b=>(
                    <div key={b} style={{padding:"5px 14px",fontSize:12,color:"#E2E8F0"}}>{b}</div>
                  ))}
                </div>
              </div>
            );
          })()}
          <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>↗ Export Grid</button>
        </div>
      </div>

      {/* ── THERMOMETER HERO ─────────────────────────────────────────── */}
      <div style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:16,padding:"24px 28px",marginBottom:20,boxShadow:C.shadowMd}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Revenue Leakage Monitor</div>
            <div style={{fontSize:40,fontWeight:800,color:C.red,lineHeight:1,letterSpacing:"-0.02em",fontFamily:"'IBM Plex Mono',monospace"}}>
              {fmt(totalRisk * 1000)}
              <span style={{fontSize:15,fontWeight:500,color:C.t4,marginLeft:10,fontFamily:"'DM Sans',sans-serif"}}>total at risk</span>
            </div>
          </div>
          <div style={{display:"flex",gap:24}}>
            {[
              [allLevers.filter(l=>l.status==="critical").length, "Critical", C.red],
              [allLevers.filter(l=>l.status==="medium").length,   "At Risk",  C.amber],
              [allLevers.filter(l=>l.status==="healthy").length,  "Healthy",  C.green],
            ].map(([n,l,c]) => (
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:28,fontWeight:800,color:c,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{n}</div>
                <div style={{fontSize:10,fontWeight:600,color:C.t4,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:3}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,fontWeight:600,color:C.t4}}>Healthy</span>
            <span style={{fontSize:10,fontWeight:600,color:C.t4}}>Critical</span>
          </div>
          <div style={{height:10,borderRadius:99,background:C.t6,overflow:"hidden",position:"relative"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${100-criticalPct}%`,background:`linear-gradient(90deg,${C.green},${C.amber})`,borderRadius:"99px 0 0 99px"}}/>
            <div style={{position:"absolute",right:0,top:0,bottom:0,width:`${criticalPct}%`,background:`linear-gradient(90deg,${C.amber},${C.red})`,borderRadius:"0 99px 99px 0"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
            <span style={{fontSize:10,color:C.green,fontWeight:600}}>{fmt((totalRisk-criticalRisk)*1000)} watch / healthy</span>
            <span style={{fontSize:10,color:C.red,fontWeight:600}}>{fmt(criticalRisk*1000)} critical leakage</span>
          </div>
        </div>
      </div>

      {/* ── TOP RISKS ────────────────────────────────────────────────── */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,fontWeight:700,color:C.t4,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>🔥 Top Revenue Risk Today</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {topRisks.map((l,i) => (
            <div key={l.id} onClick={() => setActivePanel(l.id)}
              style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,flex:1,minWidth:180,boxShadow:C.shadow,transition:"box-shadow 0.15s,transform 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=C.shadowMd;e.currentTarget.style.transform="translateY(-1px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform="translateY(0)"}}>
              <span style={{fontSize:13,fontWeight:800,color:C.t5,minWidth:18}}>#{i+1}</span>
              <span style={{fontSize:16}}>{l.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{l.name}</div>
                <div style={{fontSize:12,color:C.red,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>{l.impact} at risk</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BUCKET SECTIONS ──────────────────────────────────────────── */}
      {leverBuckets.map(bucket => (
        <div key={bucket.name} style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:bucket.color}}/>
            <span style={{fontSize:11,fontWeight:700,color:bucket.color,textTransform:"uppercase",letterSpacing:"0.07em"}}>{bucket.name}</span>
            <div style={{flex:1,height:1,background:C.border}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12}}>
            {bucket.levers.map(lever => {
              const st = LEVER_STATUS_CFG[lever.status];
              return (
                <div key={lever.id} className="lever-card"
                  onClick={() => setActivePanel(lever.id)}
                  style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px",cursor:"pointer",position:"relative",overflow:"hidden",boxShadow:C.shadow}}>
                  {/* Status stripe */}
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:st.bar,borderRadius:"14px 14px 0 0"}}/>
                  {/* Icon + Name */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:17}}>{lever.icon}</span>
                    <span style={{fontSize:13,fontWeight:700,color:C.t1}}>{lever.name}</span>
                  </div>
                  {/* Issue Classification Tags */}
                  <div style={{marginBottom:lever.parityLink?6:12,minHeight:18}}>
                    <IssueTag leverId={lever.id} status={lever.status}/>
                  </div>
                  {/* Parity↔Connectivity callout */}
                  {lever.parityLink && (
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:10,padding:"4px 8px",borderRadius:6,background:"#FFF7ED",border:"1px solid #FED7AA",fontSize:10,fontWeight:600,color:"#C2410C"}}>
                      <span>🔗</span>
                      <span>Parity ↔ Connectivity linked</span>
                    </div>
                  )}
                  {/* Revenue — PRIMARY */}
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:9,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>Revenue at Risk</div>
                    <div style={{fontSize:24,fontWeight:800,color:st.color,letterSpacing:"-0.01em",lineHeight:1,fontFamily:"'IBM Plex Mono',monospace"}}>{lever.impact}</div>
                  </div>
                  {/* Score circle + status — SECONDARY */}
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <ScoreCircle score={lever.score} color={st.bar} size={52}/>
                    <div>
                      <div style={{fontSize:9,fontWeight:600,color:C.t4,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Health Score</div>
                      <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:st.bg,color:st.color,border:`1px solid ${st.color}33`}}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                  </div>
                  {/* Fix status badge */}
                  {(() => {
                    const fs = fixStatus[lever.id] || "Open";
                    const fc = FIX_STATUS_CFG[fs];
                    return (
                      <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <span style={{fontSize:9,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Fix Status</span>
                        <button onClick={e=>cycleFixStatus(lever.id,e)}
                          style={{fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:99,background:fc.bg,color:fc.color,border:`1px solid ${fc.border}`,cursor:"pointer",fontFamily:"inherit"}}>
                          {fs === "Open" ? "● Open" : fs === "In Progress" ? "◑ In Progress" : "✓ Resolved"}
                        </button>
                      </div>
                    );
                  })()}
                  {/* Hover action buttons */}
                  <div className="lever-actions" style={{marginTop:10}}>
                    <button className="lever-btn"
                      onClick={e=>{e.stopPropagation();setActivePanel(lever.id);}}
                      style={{background:"#EFF6FF",color:"#2563EB",flex:1.2}}>🔍 Investigate</button>
                    <button className="lever-btn"
                      onClick={e=>cycleFixStatus(lever.id,e)}
                      style={{background:"#FFFBEB",color:"#D97706",flex:1}}>🔧 Fix</button>
                    <button className="lever-btn"
                      onClick={e=>{e.stopPropagation();downloadLeverCSV(lever,tenant||"Account");}}
                      style={{background:C.brandDim,color:C.brand,flex:1}}>⬇ CSV</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── SLIDE PANEL ──────────────────────────────────────────────── */}
      {activePanel && (
        <>
          <div onClick={() => setActivePanel(null)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.08)",zIndex:400,animation:"fadeIn 0.18s ease"}}/>
          <div style={{position:"fixed",top:50,right:0,bottom:0,width:360,background:C.cardBg,boxShadow:C.shadowLg,zIndex:401,overflowY:"auto",animation:"fadeSlide 0.22s cubic-bezier(0.4,0,0.2,1)"}}>
            {activeLever && (() => {
              const st = LEVER_STATUS_CFG[activeLever.status];
              // Normalise detail — Wyndham uses object format, other accounts use flat array
              const rawDetail = activeLever.detail;
              const detail = Array.isArray(rawDetail)
                ? {
                    description: `${activeLever.name} — ${activeLever.impact} at risk`,
                    breakdown: rawDetail.map(([label,value]) => ({label, value})),
                    estimatedImpact: activeLever.impact,
                    actions: ["Investigate","Download Report"],
                  }
                : rawDetail;
              return (
                <div style={{padding:26}}>
                  {/* Header row: close button + name */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div style={{flex:1,paddingRight:12}}>
                      <div style={{fontSize:26,marginBottom:4}}>{activeLever.icon}</div>
                      <h2 style={{fontSize:20,fontWeight:800,color:C.t1,margin:"0 0 8px",fontFamily:"'DM Sans',sans-serif"}}>{activeLever.name}</h2>
                      <IssueTag leverId={activeLever.id} status={activeLever.status}/>
                    </div>
                    <button onClick={() => setActivePanel(null)}
                      style={{background:"#F1F5F9",border:"none",cursor:"pointer",fontSize:14,
                        color:C.t3,padding:"4px 8px",borderRadius:6,lineHeight:1,flexShrink:0}}>✕</button>
                  </div>
                  <div style={{marginBottom:22}}>
                    <p style={{fontSize:13,color:C.t3,margin:0,lineHeight:1.5}}>{detail.description}</p>
                  </div>
                  {/* Score */}
                  <div style={{background:"#F8FAFC",borderRadius:12,padding:"14px 16px",marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                      <span style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Health Score</span>
                      <span style={{fontSize:22,fontWeight:800,color:C.t1,fontFamily:"'IBM Plex Mono',monospace"}}>{activeLever.score}<span style={{fontSize:11,color:C.t4}}>/100</span></span>
                    </div>
                    <div style={{height:6,borderRadius:99,background:C.t6,overflow:"hidden"}}>
                      <div style={{width:`${activeLever.score}%`,height:"100%",background:st.bar,borderRadius:99,transition:"width 0.5s ease"}}/>
                    </div>
                  </div>
                  {/* Breakdown */}
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Breakdown</div>
                    {detail.breakdown.map((item,i) => (
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<detail.breakdown.length-1?`1px solid ${C.t6}`:"none"}}>
                        <span style={{fontSize:13,color:C.t3}}>{item.label}</span>
                        <span style={{fontSize:13,fontWeight:700,color:C.t1,fontFamily:"'IBM Plex Mono',monospace"}}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {/* Property Performance */}
                  {(activeLever.status === "critical" || activeLever.status === "medium") && (
                    <PropertyPerformanceCard tenant={tenant}/>
                  )}
                  {/* Impact */}
                  <div style={{background:st.bg,border:`1px solid ${st.color}33`,borderRadius:10,padding:"12px 16px",marginBottom:22}}>
                    <div style={{fontSize:10,fontWeight:700,color:st.color,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Estimated Revenue Impact</div>
                    <div style={{fontSize:28,fontWeight:800,color:st.color,fontFamily:"'IBM Plex Mono',monospace"}}>{detail.estimatedImpact}</div>
                  </div>
                  {/* Actions */}
                  <div style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Actions</div>
                  {detail.hasErrorDetail && (
                    <button onClick={onContentErrors}
                      style={{display:"block",width:"100%",textAlign:"left",padding:"10px 14px",
                        background:"rgba(220,38,38,0.08)",border:"1px solid rgba(220,38,38,0.3)",
                        borderRadius:9,fontSize:13,fontWeight:600,color:"#DC2626",cursor:"pointer",
                        marginBottom:8,fontFamily:"inherit"}}>
                      ⚠️ View 202 Properties with Image Errors →
                    </button>
                  )}
                  {detail.actions.map((action,i) => (
                    <button key={i} onClick={() => toast(`"${action}" opened`,"info")}
                      style={{display:"block",width:"100%",textAlign:"left",padding:"10px 14px",background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:9,fontSize:13,fontWeight:600,color:C.t2,cursor:"pointer",marginBottom:8,fontFamily:"inherit",transition:"background 0.12s,border-color 0.12s,color 0.12s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=C.brandDim;e.currentTarget.style.borderColor=C.brandBorder;e.currentTarget.style.color=C.brand}}
                      onMouseLeave={e=>{e.currentTarget.style.background="#F8FAFC";e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.t2}}>
                      → {action}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
