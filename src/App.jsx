import { useState, useEffect } from "react";

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
          <span style={{fontSize:13,fontWeight:700,color:C.t1,fontFamily:"'Syne',sans-serif"}}>{title}</span>
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
const PLAYBOOKS = [
  { id:"PB1",title:"ARI Sync Recovery",           cat:"Incident",    effort:"2h",impact:"$28K+", tenant:"Hilton/BA",    status:"InProgress",due:"Today", owner:"Marcus T." },
  { id:"PB2",title:"Rate Restriction Remediation",cat:"Incident",    effort:"1h",impact:"$12K+", tenant:"Expedia/Omni", status:"InProgress",due:"Mar 6", owner:"Priya S."  },
  { id:"PB3",title:"GDS Mapping Correction",      cat:"Data Quality",effort:"3h",impact:"$6K+",  tenant:"Amadeus",      status:"Unassigned",due:"Mar 8", owner:"—"         },
  { id:"PB4",title:"Content Score Uplift",        cat:"Activation",  effort:"4h",impact:"+8%",   tenant:"Agoda Push",   status:"Unassigned",due:"Mar 10",owner:"—"         },
  { id:"PB5",title:"Cancellation Rate Audit",     cat:"Revenue",     effort:"2h",impact:"Net+3%",tenant:"Wyndham",      status:"Active",    due:"Mar 7", owner:"Lisa K."   },
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
  { id:"home",      label:"Health Overview",      phase:"SEE"       },
  { id:"errors",    label:"Error Intelligence",   phase:"PRIORITISE"},
  { id:"revenue",   label:"Revenue at Risk",      phase:"PRIORITISE"},
  { id:"playbooks", label:"Playbooks & Queue",    phase:"FIX"       },
  { id:"levers",    label:"16-Lever Grid",        phase:"SEE"       },
  { id:"ltb",       label:"Look-to-Book",         stub:true         },
  { id:"qbr",       label:"Reporting / QBR",      stub:true         },
];


/* ── MultiSelect dropdown ─────────────────────────────────────────────── */
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
export default function App() {
  const [page, setPage]             = useState("home");
  const [role, setRole]             = useState("exec");
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
  const [pbTab, setPbTab]           = useState("queue");
  const [leversFor, setLeversFor]   = useState(null);
  const [alertOpen, setAlertOpen]   = useState(false);
  const [kanban, setKanban]         = useState(false);

  const goLevers = (name) => { setLeversFor(name); setPage("levers"); };
  // Close multi-select dropdowns on outside click
  useEffect(() => {
    const handler = () => { setDpOpen(false); setBrandOpen(false); setClientOpen(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  const toast    = useToast();
  const curNav   = TOP_NAV.find(n=>n.id===page);
  const loopPhase = curNav?.phase || "SEE";

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:C.pageBg,minHeight:"100vh",color:C.t1}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
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
        @keyframes fadeIn   {from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)}}
        @keyframes fadeSlide{from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)}}
        @keyframes pulse    {0%,100%{opacity:1} 50%{opacity:0.5}}
        @keyframes toastIn  {from{opacity:0;transform:translateY(16px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes toastOut {from{opacity:1;transform:translateY(0)}    to{opacity:0;transform:translateY(8px)}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        @keyframes dotPulse {0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.6}}
        .fade-in   {animation:fadeIn    0.22s ease-out both}
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
          <div style={{width:3,height:28,background:"linear-gradient(180deg,#A78BFA,#6941F2)",borderRadius:2}}/>
          <div style={{lineHeight:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:"#FFF",letterSpacing:"-0.3px"}}>
              RG<span style={{color:"#A78BFA"}}>Insights</span>
            </div>
            <div style={{fontSize:8,color:"#6B7280",fontFamily:C.mono,letterSpacing:1.2,marginTop:1}}>InsightsIQ  v1.0</div>
          </div>
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
        <button style={{background:"none",border:"none",color:"#A78BFA",
          fontSize:12,fontWeight:600,letterSpacing:"-0.1px"}}>Grow with RateGain →</button>
        <div style={{width:30,height:30,borderRadius:"50%",
          background:"linear-gradient(135deg,#7C3AED,#6941F2)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:11,fontWeight:700,color:"#fff",
          boxShadow:"0 0 0 2px rgba(255,255,255,0.15)"}}>JR</div>
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
        {page==="home"     && <HomePage role={role} sel={selTenant} setSel={setSelTenant} tab={detailTab} setTab={setDetailTab} goLevers={goLevers} toast={toast}/>}
        {page==="errors"   && <ErrorPage sel={selCluster} setSel={setSelCluster} toast={toast}/>}
        {page==="revenue"  && <RevenuePage role={role} sel={selRisk} setSel={setSelRisk} toast={toast}/>}
        {page==="playbooks"&& <PlaybooksPage tab={pbTab} setTab={setPbTab} kanban={kanban} setKanban={setKanban} toast={toast}/>}
        {page==="levers"   && <LeversPage tenant={leversFor || activeClient.name} setTenant={setLeversFor} activePartners={activePartners} toast={toast}/>}
      </div>
      <ToastHost/>
    </div>
  );
}



/* ══════════════════════════════════════════════════════════════════════════
   PAGE 1 — HEALTH OVERVIEW
══════════════════════════════════════════════════════════════════════════ */
function HomePage({ role, sel, setSel, tab, setTab, goLevers, toast }) {
  const isExec = role==="exec";
  const hs=58, circ=2*Math.PI*32;
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px",lineHeight:1}}>Health Overview</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>{isExec ? "Cross-tenant executive view · 84 active tenants" : "Operator view · Your assigned tenants"}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 16px",fontSize:12,color:C.t2,fontWeight:500}} onClick={()=>toast("Export queued — check your downloads","info")}>↗ Export</button>
          <button className="btn-primary" style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}} onClick={()=>toast("QBR Snapshot generating…","success")}>QBR Snapshot</button>
        </div>
      </div>
      <SH phase="SEE" title="Portfolio Health Summary" ann="ui" sub={isExec?"All segments · 84 tenants":"Your assigned tenants · 8 properties"}/>
      <div style={{display:"grid",gridTemplateColumns:"210px 1fr 1fr 1fr",gap:12,marginBottom:22}}>
        <div style={{background:`linear-gradient(145deg,${C.cardBg} 50%,${C.amber}0A 100%)`,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.amber}`,borderRadius:12,padding:"16px",boxShadow:C.shadow,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,textTransform:"uppercase",marginBottom:8,alignSelf:"flex-start"}}>Health Score <Ann type="ui"/></div>
          <div style={{position:"relative",width:84,height:84}}>
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx={42} cy={42} r={32} fill="none" stroke={C.t6} strokeWidth={9}/>
              <circle cx={42} cy={42} r={32} fill={C.amber+"08"} stroke="none"/>
              <circle cx={42} cy={42} r={32} fill="none" stroke={C.amber} strokeWidth={9} strokeDasharray={`${(hs/100)*circ} ${circ}`} strokeLinecap="round" transform="rotate(-90 42 42)"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:26,fontWeight:800,color:C.amber,fontFamily:C.mono,lineHeight:1}}>{hs}</span>
              <span style={{fontSize:9,color:C.t4,fontFamily:C.mono}}>/100</span>
            </div>
          </div>
          <div style={{fontSize:11,color:C.amber,fontWeight:700}}>AT RISK</div>
          <div style={{fontSize:10,color:C.t4}}>▼ 3 pts vs last week</div>
        </div>
        <KpiTile label="Error Index" value="8.1/1k" sub="▲ 1.1 vs last period" accent={C.red} spark={[6.2,6.8,7.1,6.9,7.8,8.3,7.9,8.1]} ann="backed" badge="▲ RISING"/>
        <KpiTile label={isExec?"Revenue at Risk":"Your Revenue at Risk"} value="$47.2K" sub="ARI $28.4K · Rate $12.4K · Content $6.4K" accent={C.brand} ann="new"/>
        <div style={{background:`linear-gradient(145deg,${C.cardBg} 50%,${C.cyan}08 100%)`,border:`1px solid ${C.border}`,borderTop:`3px solid ${C.cyan}`,borderRadius:12,padding:"16px",boxShadow:C.shadow}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,textTransform:"uppercase",marginBottom:10}}>{isExec?"Portfolio Pulse":"Operator Pulse"} <Ann type="backed"/></div>
          {isExec ? <>
            <div style={{fontSize:28,fontWeight:800,fontFamily:C.mono,color:C.t1,marginBottom:4}}>9<span style={{fontSize:14,color:C.t4,fontWeight:500}}>/84</span></div>
            <div style={{fontSize:11,color:C.t3,marginBottom:10}}>tenants with critical issues</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[[9,"Critical",C.red],[22,"At risk",C.amber],[53,"Healthy",C.green]].map(([n,l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:4,background:C.t6,borderRadius:2}}><div style={{width:`${(n/84)*100}%`,height:"100%",background:c,borderRadius:2}}/></div>
                  <span style={{fontSize:10,color:c,fontWeight:600,fontFamily:C.mono,width:14,textAlign:"right"}}>{n}</span>
                  <span style={{fontSize:10,color:C.t3,width:50}}>{l}</span>
                </div>
              ))}
            </div>
          </> : <>
            <div style={{fontSize:28,fontWeight:800,fontFamily:C.mono,color:C.t1,marginBottom:4}}>3<span style={{fontSize:14,color:C.t4,fontWeight:500}}>/8</span></div>
            <div style={{fontSize:11,color:C.t3,marginBottom:10}}>need action today</div>
            {[["Wyndham","due today",C.red],["Expedia/Omni","due Mar 6",C.amber]].map(([t,d,c])=>(
              <div key={t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:c+"0C",borderRadius:6,marginBottom:5,border:`1px solid ${c}22`}}>
                <span style={{fontSize:11,color:C.t2,fontWeight:600}}>{t}</span>
                <span style={{fontSize:10,color:c,fontWeight:700,fontFamily:C.mono}}>{d}</span>
              </div>
            ))}
          </>}
        </div>
      </div>
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
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{padding:16}}>
          <SH phase="PREVENT" title="Emerging Risk Patterns" ann="new"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["ARI sync failure pattern across 3 Enterprise tenants this week","red"],["Rate restriction spikes correlate with weekend inventory windows","amber"],["Content score decline precedes error rate increase by ~14 days","amber"]].map(([txt,s])=>(
              <div key={txt} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:{red:C.redBg,amber:C.amberBg}[s]||C.rowAlt,border:`1px solid ${{red:C.redBorder,amber:C.amberBorder}[s]||C.border}`,borderLeft:`3px solid ${C[s]}`}}>
                <span style={{fontSize:12,color:C.t2,flex:1,lineHeight:1.5}}>{txt}</span>
                <button className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 10px",fontSize:10,color:C.t3,flexShrink:0}}>View →</button>
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
                <button className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 10px",fontSize:10,color:C.t3,flexShrink:0}}>Add →</button>
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
          <div style={{fontSize:14,fontWeight:800,color:C.t1,fontFamily:"'Syne',sans-serif",lineHeight:1.2,flex:1,marginRight:8}}>{row.name}</div>
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

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 2 — ERROR INTELLIGENCE
══════════════════════════════════════════════════════════════════════════ */
function ErrorPage({ sel, setSel, toast }) {
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Error Intelligence</h1>
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
                <div style={{fontSize:15,fontWeight:800,color:C.t1,fontFamily:"'Syne',sans-serif",marginBottom:4}}>{sel.name}</div>
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
function RevenuePage({ role, sel, setSel, toast }) {
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Revenue at Risk</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>Quantify and prioritise financial impact · {role==="exec"?"All tenants":"Your tenants"} · Renewal risk overlay</div>
        </div>
        <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>↓ Export to QBR</button>
      </div>
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
                    <td style={{padding:"9px 12px",fontWeight:isSel?700:500,color:isSel?C.brand:C.t1,fontSize:12}}>{r.tenant}</td>
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
            <div style={{fontSize:15,fontWeight:800,color:C.t1,fontFamily:"'Syne',sans-serif",margin:"10px 0 4px"}}>{sel.tenant}</div>
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
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 4 — PLAYBOOKS & ACTION QUEUE
══════════════════════════════════════════════════════════════════════════ */
function PlaybooksPage({ tab, setTab, kanban, setKanban, toast }) {
  const kanbanCols = [["To Review","Unassigned","PRIORITISE"],["In Progress","InProgress","FIX"],["Proved","Mitigated","PROVE"],["Preventive","Active","PREVENT"]];
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Playbooks & Action Queue</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>Operationalise remediation · Track recovery · Build preventive standards</div>
        </div>
        <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>+ New Action</button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
        <div style={{display:"flex",background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:9,padding:3,gap:2,boxShadow:C.shadow}}>
          {[["queue","Action Queue"],["library","Playbook Library"]].map(([k,l])=>(
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
                      <div style={{fontSize:10,color:pb.due==="Today"?C.red:C.t4,marginTop:6,fontFamily:C.mono}}>Due: {pb.due}</div>
                    </div>
                  ))}
                  {items.length===0 && <div style={{textAlign:"center",padding:"24px 0",color:C.t5,fontSize:12}}>No items</div>}
                </div>
              </div>
            );
          })}
        </div>
      </>)}
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
        detail:{ description:"830 Wyndham properties (9%) below OTA image threshold. 218 properties are CRITICAL priority with fewer than 5 images — below minimum OTA merchandising standards.", breakdown:[{label:"Total properties audited",value:"9,291"},{label:"10+ images (strong baseline)",value:"8,461 (91%)"},{label:"< 5 images — CRITICAL",value:"218 props (2.3%)"},{label:"5–9 images — Below Optimal",value:"612 props (6.6%)"}], estimatedImpact:"$29,800", actions:["Investigate Image Gaps","Fix: Upload 218 Critical Props","Download Property List"] }},
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

function LeversPage({ tenant, setTenant, activePartners, toast }) {
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
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Revenue Cockpit</h1>
            {tenant && (
              <div style={{background:C.brandDim,border:`1px solid ${C.brandBorder}`,borderRadius:7,padding:"4px 12px",fontSize:12,color:C.brand,fontWeight:700}}>
                📍 {tenant}
              </div>
            )}
          </div>
          <div style={{fontSize:12,color:C.t3}}>16 levers across 4 domains · Click any card to drill down</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select onChange={e=>setTenant(e.target.value)} value={tenant||"All Tenants"}
            style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",fontSize:12,color:C.t1,outline:"none",boxShadow:C.shadow}}>
            <option>All Tenants</option>
            {TENANTS.map(t=><option key={t.id}>{t.name}</option>)}
          </select>
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
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:lever.parityLink?6:14}}>
                    <span style={{fontSize:17}}>{lever.icon}</span>
                    <span style={{fontSize:13,fontWeight:700,color:C.t1}}>{lever.name}</span>
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
          <div style={{position:"fixed",top:0,right:0,bottom:0,width:360,background:C.cardBg,boxShadow:C.shadowLg,zIndex:401,overflowY:"auto",animation:"fadeSlide 0.22s cubic-bezier(0.4,0,0.2,1)"}}>
            {activeLever && (() => {
              const st = LEVER_STATUS_CFG[activeLever.status];
              return (
                <div style={{padding:26}}>
                  <button onClick={() => setActivePanel(null)}
                    style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.t4,float:"right",padding:0,lineHeight:1}}>✕</button>
                  <div style={{marginBottom:22}}>
                    <div style={{fontSize:26,marginBottom:6}}>{activeLever.icon}</div>
                    <h2 style={{fontSize:20,fontWeight:800,color:C.t1,margin:"0 0 4px",fontFamily:"'Syne',sans-serif"}}>{activeLever.name}</h2>
                    <p style={{fontSize:13,color:C.t3,margin:0,lineHeight:1.5}}>{activeLever.detail.description}</p>
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
                    {activeLever.detail.breakdown.map((item,i) => (
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<activeLever.detail.breakdown.length-1?`1px solid ${C.t6}`:"none"}}>
                        <span style={{fontSize:13,color:C.t3}}>{item.label}</span>
                        <span style={{fontSize:13,fontWeight:700,color:C.t1,fontFamily:"'IBM Plex Mono',monospace"}}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {/* Impact */}
                  <div style={{background:st.bg,border:`1px solid ${st.color}33`,borderRadius:10,padding:"12px 16px",marginBottom:22}}>
                    <div style={{fontSize:10,fontWeight:700,color:st.color,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>Estimated Revenue Impact</div>
                    <div style={{fontSize:28,fontWeight:800,color:st.color,fontFamily:"'IBM Plex Mono',monospace"}}>{activeLever.detail.estimatedImpact}</div>
                  </div>
                  {/* Actions */}
                  <div style={{fontSize:10,fontWeight:700,color:C.t4,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Actions</div>
                  {activeLever.detail.actions.map((action,i) => (
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
