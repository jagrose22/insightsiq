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

/* ─── MICRO COMPONENTS ───────────────────────────────────────────────────── */
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

/* ─── TOAST SYSTEM ──────────────────────────────────────────────────────── */
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

/* ─── DONUT MINI-GAUGE ──────────────────────────────────────────────────── */
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

/* ─── ICON BADGE ────────────────────────────────────────────────────────── */
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

/* ─── CARD WRAPPER ──────────────────────────────────────────────────────── */
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

/* ─── KPI TILE ──────────────────────────────────────────────────────────── */
function KpiTile({ label, value, sub, accent, spark, ann, badge }) {
  const tintHex = accent ? accent + "08" : "transparent";
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

/* ─── LOOP PROGRESS BAR ─────────────────────────────────────────────────── */
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

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const TENANTS = [
  { id:1, name:"Omni Hotels & Resorts",    type:"Enterprise", health:61, err:8.1, arr:4.2, trend:-4,  status:"InProgress", rag:"amber", owner:"Priya S.",  leversRed:3 },
  { id:2, name:"Hilton / British Airways", type:"Enterprise", health:44, err:12.7,arr:6.8, trend:-11, status:"Active",     rag:"red",   owner:"Marcus T.", leversRed:6 },
  { id:3, name:"Choice Hotels",            type:"Mid-Market", health:78, err:3.4, arr:2.1, trend:+6,  status:"Mitigated",  rag:"green", owner:"Lisa K.",   leversRed:0 },
  { id:4, name:"Expedia / Omni Dallas",    type:"Mid-Market", health:52, err:9.8, arr:3.3, trend:-7,  status:"InProgress", rag:"amber", owner:"Priya S.",  leversRed:2 },
  { id:5, name:"Wyndham Hotels",           type:"Enterprise", health:38, err:15.2,arr:5.9, trend:-14, status:"Unassigned", rag:"red",   owner:"—",         leversRed:7 },
  { id:6, name:"IHG / Hotwire",            type:"Enterprise", health:71, err:5.6, arr:4.1, trend:+2,  status:"Mitigated",  rag:"green", owner:"Marcus T.", leversRed:0 },
  { id:7, name:"Marriott Bonvoy",          type:"Enterprise", health:59, err:7.9, arr:7.2, trend:-3,  status:"InProgress", rag:"amber", owner:"Lisa K.",   leversRed:2 },
  { id:8, name:"Accor / Booking.com",      type:"Mid-Market", health:66, err:6.2, arr:1.8, trend:+1,  status:"Mitigated",  rag:"green", owner:"Priya S.",  leversRed:1 },
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
const LEVERS_DATA = [
  { id:1, name:"ARI Sync",       status:"red",  val:24, bench:85,impact:"$28.4K" },
  { id:2, name:"Rate Parity",    status:"amber",val:61, bench:90,impact:"$12.4K" },
  { id:3, name:"Availability",   status:"green",val:92, bench:88,impact:"—"      },
  { id:4, name:"Restrictions",   status:"red",  val:31, bench:82,impact:"$8.1K"  },
  { id:5, name:"Content Score",  status:"amber",val:54, bench:75,impact:"$6.4K"  },
  { id:6, name:"Images",         status:"amber",val:67, bench:80,impact:"$4.2K"  },
  { id:7, name:"Amenities",      status:"green",val:88, bench:78,impact:"—"      },
  { id:8, name:"Descriptions",   status:"amber",val:58, bench:76,impact:"$3.1K"  },
  { id:9, name:"Error Rate",     status:"red",  val:19, bench:85,impact:"$28.4K" },
  { id:10,name:"Booking Pace",   status:"green",val:81, bench:72,impact:"—"      },
  { id:11,name:"Look-to-Book",   status:"amber",val:3.4,bench:4.8,impact:"$9.2K" },
  { id:12,name:"Channel Mix",    status:"green",val:76, bench:70,impact:"—"      },
  { id:13,name:"Cancellation",   status:"amber",val:18, bench:12,impact:"$11.4K" },
  { id:14,name:"Activation",     status:"red",  val:42, bench:80,impact:"$5.8K"  },
  { id:15,name:"Mapping",        status:"amber",val:71, bench:85,impact:"$2.9K"  },
  { id:16,name:"Commission",     status:"green",val:94, bench:88,impact:"—"      },
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

/* ══════════════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage]             = useState("home");
  const [role, setRole]             = useState("exec");
  const [selTenant, setSelTenant]   = useState(TENANTS[4]);
  const [detailTab, setDetailTab]   = useState("snapshot");
  const [selCluster, setSelCluster] = useState(ERROR_CLUSTERS[0]);
  const [selRisk, setSelRisk]       = useState(RISK_ROWS[0]);
  const [pbTab, setPbTab]           = useState("queue");
  const [leversFor, setLeversFor]   = useState(null);
  const [alertOpen, setAlertOpen]   = useState(false);
  const [kanban, setKanban]         = useState(false);

  const goLevers = (name) => { setLeversFor(name); setPage("levers"); };
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

        /* ── Row interactions */
        .tr-hover:hover{background:#F5F3FF !important;transition:background 0.1s}
        .tr-sel{background:#F5F3FF !important;transition:background 0.1s}

        /* ── Button utilities */
        .btn-ghost{transition:background 0.12s,color 0.12s,border-color 0.12s}
        .btn-ghost:hover{background:#F1F5F9 !important}
        .btn-primary{transition:box-shadow 0.15s,transform 0.1s,opacity 0.12s}
        .btn-primary:hover{opacity:0.88;transform:translateY(-1px)}
        .btn-primary:active{transform:translateY(0)}

        /* ── Card lifts */
        .card-hover{transition:box-shadow 0.18s,transform 0.18s}
        .card-hover:hover{box-shadow:0 8px 24px rgba(15,23,42,0.11) !important;transform:translateY(-2px)}
        .lever-card{transition:box-shadow 0.15s,border-color 0.15s,transform 0.15s}
        .lever-card:hover{box-shadow:0 4px 16px rgba(105,65,242,0.14) !important;border-color:#C4B5FD !important;transform:translateY(-1px)}

        /* ── Animations */
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

        /* ── Phase accent bars (left border on active nav) */
        .nav-active-see       {border-bottom:2px solid #6941F2 !important;color:#6941F2 !important}
        .nav-active-prioritise{border-bottom:2px solid #DC2626 !important;color:#DC2626 !important}
        .nav-active-fix       {border-bottom:2px solid #D97706 !important;color:#D97706 !important}
        .nav-active-prove     {border-bottom:2px solid #059669 !important;color:#059669 !important}
        .nav-active-prevent   {border-bottom:2px solid #2563EB !important;color:#2563EB !important}

        /* ── Subtle page grid pattern */
        body{background-image:radial-gradient(circle,#CBD5E155 1px,transparent 1px);background-size:24px 24px}
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{background:C.headerBg,padding:"0 20px",height:50,display:"flex",
        alignItems:"center",gap:14,position:"sticky",top:0,zIndex:200,
        boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>

        {/* Logo */}
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

        {/* Client */}
        <div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:6,padding:"4px 12px",fontSize:13,color:"#E2E8F0",fontWeight:600}}>
          Omni Hotels &amp; Resorts
        </div>

        {["Demand Partner","Brand"].map(l=>(
          <div key={l} style={{display:"flex",flexDirection:"column",gap:1}}>
            <span style={{fontSize:9,color:"#6B7280",letterSpacing:0.5,textTransform:"uppercase"}}>{l}</span>
            <select style={{background:"transparent",border:"none",color:"#CBD5E1",fontSize:12,outline:"none"}}>
              <option>ALL</option>
            </select>
          </div>
        ))}

        {/* Year nav */}
        <div style={{display:"flex",alignItems:"center",gap:5,marginLeft:4,
          background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"3px 8px"}}>
          <button style={{background:"none",border:"none",color:"#64748B",fontSize:13,padding:"0 2px"}}>‹</button>
          <span style={{color:"#64748B",fontSize:11,fontFamily:C.mono}}>2025</span>
          <span style={{color:"#FFF",fontSize:15,fontWeight:800,fontFamily:C.mono,padding:"0 4px"}}>2026</span>
          <span style={{color:"#64748B",fontSize:11,fontFamily:C.mono}}>2027</span>
          <button style={{background:"none",border:"none",color:"#64748B",fontSize:13,padding:"0 2px"}}>›</button>
        </div>

        <div style={{flex:1}}/>

        {/* Role toggle */}
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

        {/* Alerts */}
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

      {/* ── TAB NAV ────────────────────────────────────────────────────── */}
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
          <button className="btn-ghost" style={{background:"transparent",
            border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 12px",
            fontSize:12,color:C.t3}}>Reset</button>
        </div>
      </div>

      {/* ── LOOP BAR ───────────────────────────────────────────────────── */}
      <LoopBar active={loopPhase}/>

      {/* ── PAGE CONTENT ───────────────────────────────────────────────── */}
      <div style={{padding:"20px",minHeight:"calc(100vh - 136px)"}} className="fade-in" key={page}>
        {page==="home"     && <HomePage role={role} sel={selTenant} setSel={setSelTenant} tab={detailTab} setTab={setDetailTab} goLevers={goLevers} toast={toast}/>}
        {page==="errors"   && <ErrorPage sel={selCluster} setSel={setSelCluster} toast={toast}/>}
        {page==="revenue"  && <RevenuePage role={role} sel={selRisk} setSel={setSelRisk} toast={toast}/>}
        {page==="playbooks"&& <PlaybooksPage tab={pbTab} setTab={setPbTab} kanban={kanban} setKanban={setKanban} toast={toast}/>}
        {page==="levers"   && <LeversPage tenant={leversFor} setTenant={setLeversFor} toast={toast}/>}
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
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,
            color:C.t1,letterSpacing:"-0.6px",lineHeight:1}}>Health Overview</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>
            {isExec ? "Cross-tenant executive view · 84 active tenants" : "Operator view · Your assigned tenants"}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" style={{background:C.cardBg,border:`1px solid ${C.border}`,
            borderRadius:8,padding:"7px 16px",fontSize:12,color:C.t2,fontWeight:500}}
            onClick={()=>toast("Export queued — check your downloads","info")}>↗ Export</button>
          <button className="btn-primary" style={{background:C.brand,border:"none",borderRadius:8,
            padding:"7px 16px",fontSize:12,color:"#fff",fontWeight:700,
            boxShadow:`0 2px 8px ${C.brand}44`}}
            onClick={()=>toast("QBR Snapshot generating…","success")}>QBR Snapshot</button>
        </div>
      </div>

      {/* SEE — KPI band */}
      <SH phase="SEE" title="Portfolio Health Summary" ann="ui"
        sub={isExec?"All segments · 84 tenants":"Your assigned tenants · 8 properties"}/>
      <div style={{display:"grid",gridTemplateColumns:"210px 1fr 1fr 1fr",gap:12,marginBottom:22}}>

        {/* Health Score */}
        <div style={{
          background:`linear-gradient(145deg,${C.cardBg} 50%,${C.amber}0A 100%)`,
          border:`1px solid ${C.border}`,borderTop:`3px solid ${C.amber}`,
          borderRadius:12,padding:"16px",boxShadow:C.shadow,
          display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,
            textTransform:"uppercase",marginBottom:8,alignSelf:"flex-start"}}>
            Health Score <Ann type="ui"/>
          </div>
          <div style={{position:"relative",width:84,height:84}}>
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx={42} cy={42} r={32} fill="none" stroke={C.t6} strokeWidth={9}/>
              <circle cx={42} cy={42} r={32} fill={C.amber+"08"} stroke="none"/>
              <circle cx={42} cy={42} r={32} fill="none" stroke={C.amber} strokeWidth={9}
                strokeDasharray={`${(hs/100)*circ} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 42 42)"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:26,fontWeight:800,color:C.amber,fontFamily:C.mono,lineHeight:1}}>{hs}</span>
              <span style={{fontSize:9,color:C.t4,fontFamily:C.mono}}>/100</span>
            </div>
          </div>
          <div style={{fontSize:11,color:C.amber,fontWeight:700}}>AT RISK</div>
          <div style={{fontSize:10,color:C.t4}}>▼ 3 pts vs last week</div>
        </div>

        <KpiTile label="Error Index" value="8.1/1k"
          sub="▲ 1.1 vs last period" accent={C.red}
          spark={[6.2,6.8,7.1,6.9,7.8,8.3,7.9,8.1]} ann="backed" badge="▲ RISING"/>
        <KpiTile label={isExec?"Revenue at Risk":"Your Revenue at Risk"} value="$47.2K"
          sub="ARI $28.4K · Rate $12.4K · Content $6.4K" accent={C.brand} ann="new"/>

        {/* Pulse tile */}
        <div style={{
          background:`linear-gradient(145deg,${C.cardBg} 50%,${C.cyan}08 100%)`,
          border:`1px solid ${C.border}`,borderTop:`3px solid ${C.cyan}`,
          borderRadius:12,padding:"16px",boxShadow:C.shadow}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,
            textTransform:"uppercase",marginBottom:10}}>
            {isExec?"Portfolio Pulse":"Operator Pulse"} <Ann type="backed"/>
          </div>
          {isExec ? <>
            <div style={{fontSize:28,fontWeight:800,fontFamily:C.mono,color:C.t1,marginBottom:4}}>
              9<span style={{fontSize:14,color:C.t4,fontWeight:500}}>/84</span>
            </div>
            <div style={{fontSize:11,color:C.t3,marginBottom:10}}>tenants with critical issues</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[[9,"Critical",C.red],[22,"At risk",C.amber],[53,"Healthy",C.green]].map(([n,l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:4,background:C.t6,borderRadius:2}}>
                    <div style={{width:`${(n/84)*100}%`,height:"100%",background:c,borderRadius:2}}/>
                  </div>
                  <span style={{fontSize:10,color:c,fontWeight:600,fontFamily:C.mono,width:14,textAlign:"right"}}>{n}</span>
                  <span style={{fontSize:10,color:C.t3,width:50}}>{l}</span>
                </div>
              ))}
            </div>
          </> : <>
            <div style={{fontSize:28,fontWeight:800,fontFamily:C.mono,color:C.t1,marginBottom:4}}>
              3<span style={{fontSize:14,color:C.t4,fontWeight:500}}>/8</span>
            </div>
            <div style={{fontSize:11,color:C.t3,marginBottom:10}}>need action today</div>
            {[["Wyndham","due today",C.red],["Expedia/Omni","due Mar 6",C.amber]].map(([t,d,c])=>(
              <div key={t} style={{display:"flex",justifyContent:"space-between",
                alignItems:"center",padding:"5px 8px",background:c+"0C",
                borderRadius:6,marginBottom:5,border:`1px solid ${c}22`}}>
                <span style={{fontSize:11,color:C.t2,fontWeight:600}}>{t}</span>
                <span style={{fontSize:10,color:c,fontWeight:700,fontFamily:C.mono}}>{d}</span>
              </div>
            ))}
          </>}
        </div>
      </div>

      {/* PRIORITISE + FIX */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 368px",gap:14,marginBottom:22}}>

        {/* Priority grid */}
        <Card>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,
            background:"#FAFBFD",display:"flex",alignItems:"center",gap:8}}>
            <Phase label="PRIORITISE"/>
            <span style={{fontSize:13,fontWeight:700,color:C.t1}}>
              {isExec ? "Priority Grid — Impact × Urgency" : "Your Assigned Tenants"}
            </span>
            <Ann type="ui"/>
            <span style={{marginLeft:"auto",fontSize:10,color:C.t4}}>Sort: Impact ▾</span>
          </div>
          <div style={{overflowX:"auto"}}>
            <table>
              <thead>
                <tr style={{background:"#F8FAFC"}}>
                  {["Tenant","Tier","Health","Err/1k","ARR $M","Trend","Status","Owner",""].map(h=>(
                    <th key={h} style={{padding:"8px 12px",textAlign:"left",color:C.t4,
                      fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`,
                      whiteSpace:"nowrap",letterSpacing:0.3}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...TENANTS].sort((a,b)=>a.health-b.health).map((t,i)=>{
                  const s = sel?.id===t.id;
                  return (
                    <tr key={t.id} onClick={()=>setSel(t)}
                      className={s?"tr-sel":"tr-hover"}
                      style={{background:s?"#F5F3FF":i%2===0?"#fff":"#FAFBFD",
                        borderBottom:`1px solid ${C.t6}`,cursor:"pointer",
                        borderLeft:`3px solid ${s?C.brand:"transparent"}`,
                        transition:"all 0.1s"}}>
                      <td style={{padding:"9px 12px",fontWeight:s?700:500,
                        color:s?C.brand:C.t1,fontSize:12}}>{t.name}</td>
                      <td style={{padding:"9px 12px"}}>
                        <span style={{fontSize:10,color:C.t3,background:C.t6,
                          borderRadius:4,padding:"2px 7px"}}>{t.type}</span>
                      </td>
                      <td style={{padding:"9px 12px"}}><Rag s={t.rag}/></td>
                      <td style={{padding:"9px 12px",fontFamily:C.mono,fontWeight:700,fontSize:12,
                        color:{red:C.red,amber:C.amber,green:C.green}[t.rag]}}>{t.err}</td>
                      <td style={{padding:"9px 12px",fontFamily:C.mono,fontSize:12,color:C.t2}}>{t.arr}</td>
                      <td style={{padding:"9px 12px"}}><Trend v={t.trend} invert/></td>
                      <td style={{padding:"9px 12px"}}><StatusChip s={t.status}/></td>
                      <td style={{padding:"9px 12px",color:C.t3,fontSize:11}}>{t.owner}</td>
                      <td style={{padding:"9px 10px"}}>
                        <button onClick={e=>{e.stopPropagation();goLevers(t.name);}}
                          style={{background:C.brandDim,border:`1px solid ${C.brandBorder}`,
                            borderRadius:6,padding:"3px 9px",fontSize:10,color:C.brand,
                            fontWeight:700,whiteSpace:"nowrap",transition:"all 0.12s"}}
                          onMouseEnter={e=>{e.target.style.background=C.brand;e.target.style.color="#fff";}}
                          onMouseLeave={e=>{e.target.style.background=C.brandDim;e.target.style.color=C.brand;}}>
                          ⬡ 16 →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail drawer */}
        <DetailPane row={sel} tab={tab} setTab={setTab} goLevers={goLevers}/>
      </div>

      {/* PREVENT */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{padding:16}}>
          <SH phase="PREVENT" title="Emerging Risk Patterns" ann="new"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["ARI sync failure pattern across 3 Enterprise tenants this week","red"],
              ["Rate restriction spikes correlate with weekend inventory windows","amber"],
              ["Content score decline precedes error rate increase by ~14 days","amber"]].map(([txt,s])=>(
              <div key={txt} style={{display:"flex",alignItems:"center",gap:10,
                padding:"10px 12px",borderRadius:8,
                background:{red:C.redBg,amber:C.amberBg}[s]||C.rowAlt,
                border:`1px solid ${{red:C.redBorder,amber:C.amberBorder}[s]||C.border}`,
                borderLeft:`3px solid ${C[s]}`}}>
                <span style={{fontSize:12,color:C.t2,flex:1,lineHeight:1.5}}>{txt}</span>
                <button className="btn-ghost" style={{background:C.cardBg,
                  border:`1px solid ${C.border}`,borderRadius:6,
                  padding:"3px 10px",fontSize:10,color:C.t3,flexShrink:0}}>View →</button>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{padding:16}}>
          <SH phase="PREVENT" title="Recommended Preventive Playbooks" ann="ui"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {["Standardise retry policy for ARI sync across all Tier 1 tenants",
              "Add pre-deployment health check for onboarding + content modules",
              "Set automated alert threshold for error index > 10 /1k events"].map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,
                padding:"10px 12px",background:"#F8FAFC",borderRadius:8,border:`1px solid ${C.border}`}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:C.blue,flexShrink:0}}/>
                <span style={{fontSize:12,color:C.t2,flex:1,lineHeight:1.5}}>{t}</span>
                <button className="btn-ghost" style={{background:C.cardBg,
                  border:`1px solid ${C.border}`,borderRadius:6,
                  padding:"3px 10px",fontSize:10,color:C.t3,flexShrink:0}}>Add →</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── Detail Pane ──────────────────────────────────────────────────────────── */
function DetailPane({ row, tab, setTab, goLevers }) {
  if (!row) return (
    <Card style={{display:"flex",alignItems:"center",justifyContent:"center",
      flexDirection:"column",gap:8,padding:24,minHeight:200}}>
      <div style={{fontSize:28,opacity:0.15}}>⬡</div>
      <div style={{fontSize:12,color:C.t4}}>Select a tenant to inspect</div>
    </Card>
  );
  const TABS=[["snapshot","Snapshot"],["drivers","Drivers"],["actions","Actions"],["impact","Impact"]];
  const phaseMap={snapshot:"SEE",drivers:"PRIORITISE",actions:"FIX",impact:"PROVE"};
  return (
    <Card style={{display:"flex",flexDirection:"column",overflow:"hidden"}} selected>
      {/* Head */}
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div style={{fontSize:14,fontWeight:800,color:C.t1,fontFamily:"'Syne',sans-serif",
            lineHeight:1.2,flex:1,marginRight:8}}>{row.name}</div>
          <Rag s={row.rag}/>
        </div>
        <div style={{fontSize:11,color:C.t3,marginBottom:10}}>
          ARR: <b style={{fontFamily:C.mono,color:C.t2}}>${row.arr}M</b> · Owner: {row.owner}
          {row.leversRed>0 && <span style={{marginLeft:8,color:C.red,fontWeight:700}}>
            {row.leversRed} lever{row.leversRed!==1?"s":""} critical
          </span>}
        </div>
        <button onClick={()=>goLevers(row.name)} style={{width:"100%",
          background:`linear-gradient(135deg,${C.brandDim},${C.brand}18)`,
          border:`1px solid ${C.brandBorder}`,borderRadius:8,padding:"8px",
          fontSize:12,color:C.brand,fontWeight:700,
          display:"flex",alignItems:"center",justifyContent:"center",gap:6,
          transition:"all 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.background=C.brand+"; color:#fff"}
          onMouseLeave={e=>e.currentTarget.style.background=`linear-gradient(135deg,${C.brandDim},${C.brand}18)`}>
          ⬡ View 16-Lever Diagnostic — {row.name.split(" ")[0]}
          <span style={{fontSize:10,opacity:0.7}}>→</span>
        </button>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        {TABS.map(([k,l])=>{
          const active = tab===k;
          const p = PHASE_CFG[phaseMap[k]];
          return (
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 4px",
              background:active?p.bg:"transparent",border:"none",
              borderBottom:`2px solid ${active?p.color:"transparent"}`,
              color:active?p.color:C.t3,fontSize:11,fontWeight:active?700:400,
              transition:"all 0.15s"}}>
              {l}
            </button>
          );
        })}
      </div>
      {/* Body */}
      <div style={{flex:1,overflowY:"auto",padding:14}} className="fade-in" key={tab}>
        {tab==="snapshot" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Health",row.health+"/100",C.amber],["Error /1k",row.err,C.red],
                ["ARR","$"+row.arr+"M",C.brand],
                ["Trend",(row.trend>0?"+":"")+row.trend+"%",row.trend<0?C.red:C.green]
              ].map(([l,v,c])=>(
                <div key={l} style={{background:`linear-gradient(145deg,#F8FAFC,${c}06)`,
                  border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:C.t3,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:C.mono,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{padding:"8px 10px",background:C.t6,borderRadius:6,
              fontSize:10,color:C.t3,fontStyle:"italic"}}>
              Sources: RGI Bookings + Errors screens · backed by current data
            </div>
          </div>
        )}
        {tab==="drivers" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["ARI sync failure — Expedia","red","$28.4K/day"],
              ["Rate restriction block","amber","$12.4K/day"],
              ["Content score <55","amber","Conv −14%"]
            ].slice(0,row.rag==="green"?1:row.rag==="amber"?2:3).map(([t,s,v])=>(
              <div key={t} style={{padding:"10px 12px",
                borderLeft:`3px solid ${C[s]}`,
                background:{red:C.redBg,amber:C.amberBg}[s],
                border:`1px solid ${{red:C.redBorder,amber:C.amberBorder}[s]}`,
                borderRadius:"0 8px 8px 0"}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t1,marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,fontFamily:C.mono,color:C[s],fontWeight:700}}>{v}</div>
              </div>
            ))}
          </div>
        )}
        {tab==="actions" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PLAYBOOKS.slice(0,3).map(pb=>(
              <div key={pb.id} style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
                borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t1,marginBottom:5}}>{pb.title}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:10,color:C.t3}}>
                    Due: <span style={{color:pb.due==="Today"?C.red:C.t2,fontWeight:600}}>{pb.due}</span>
                    {" · "}{pb.owner}
                  </span>
                  <StatusChip s={pb.status}/>
                </div>
              </div>
            ))}
            <button style={{background:"#F8FAFC",border:`1px dashed ${C.t5}`,
              borderRadius:8,padding:"9px",color:C.t3,fontSize:11,
              textAlign:"center"}}>+ Create New Playbook</button>
          </div>
        )}
        {tab==="impact" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,
              borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",
                letterSpacing:0.5,marginBottom:6}}>Est. ARR Protected (30d) <Ann type="new"/></div>
              <div style={{fontSize:30,fontWeight:800,fontFamily:C.mono,color:C.green}}>$42K</div>
              <div style={{fontSize:11,color:C.t3,marginTop:3}}>model-based estimate</div>
            </div>
            <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
              borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:10,
                textTransform:"uppercase",letterSpacing:0.5}}>Error Rate Trend — 8 Weeks</div>
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
          <div style={{fontSize:12,marginTop:4}}>
            <span style={{color:C.red,fontWeight:700}}>These aren't system bugs — these are guests who couldn't book.</span>
            <span style={{color:C.t3}}> Every error = a lost arrival.</span>
          </div>
        </div>
        <button style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,
          padding:"7px 14px",fontSize:12,color:C.t2}}>↓ Export</button>
      </div>

      {/* Filter bar */}
      <Card style={{padding:"12px 16px",marginBottom:16,display:"flex",gap:16,
        alignItems:"flex-end",flexWrap:"wrap"}}>
        {[["Brand","ALL"],["Demand Partner","ALL"],["Error Type","Booking Errors"]].map(([l,v])=>(
          <div key={l}>
            <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:4,
              textTransform:"uppercase",letterSpacing:0.4}}>{l}</div>
            <select style={{background:C.inputBg,border:`1px solid ${C.border}`,
              color:C.t1,borderRadius:7,padding:"6px 10px",fontSize:12,outline:"none",minWidth:120}}>
              <option>{v}</option>
            </select>
          </div>
        ))}
        <div>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:4,
            textTransform:"uppercase",letterSpacing:0.4}}>Date Range</div>
          <input defaultValue="1 Mar – 31 Mar '26" style={{background:C.inputBg,
            border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,
            padding:"6px 10px",fontSize:12,outline:"none",width:160}}/>
        </div>
        <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 20px",
          fontSize:12,color:"#fff",fontWeight:700,marginLeft:"auto",
          boxShadow:`0 2px 8px ${C.brand}44`}}>Search</button>
        <Ann type="backed"/>
      </Card>

      {/* Metrics */}
      <SH phase="SEE" title="Error Summary — March 2026" ann="backed"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[["Total Errors MTD","601",C.red,"+18% vs Feb","backed"],
          ["MTTR Average","4.2h",C.amber,"↓ 0.3h improving","backed"],
          ["Tenants Impacted","9",C.red,"3 currently active","backed"],
          ["Est. Bookings Lost","289",C.brand,"this period","new"]
        ].map(([l,v,c,s,a])=>(
          <KpiTile key={l} label={l} value={v} sub={s} accent={c} ann={a}/>
        ))}
      </div>

      {/* Clusters + Detail */}
      <div style={{display:"grid",gridTemplateColumns:"310px 1fr",gap:14}}>
        {/* Cluster list */}
        <Card>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <Phase label="PRIORITISE"/>
              <span style={{fontSize:12,fontWeight:700,color:C.t1}}>Error Clusters</span>
            </div>
            <span style={{fontSize:10,color:C.t4}}>Rev Impact ▾</span>
          </div>
          {ERROR_CLUSTERS.map(ec=>{
            const isSel = sel?.id===ec.id;
            const sc = {red:C.red,amber:C.amber,green:C.green}[ec.sev];
            return (
              <div key={ec.id} onClick={()=>setSel(ec)} style={{
                padding:"11px 14px",borderBottom:`1px solid ${C.t6}`,cursor:"pointer",
                background:isSel?"#F5F3FF":"#fff",
                borderLeft:`3px solid ${isSel?C.brand:sc}`,transition:"background 0.1s"}}>
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"flex-start",marginBottom:5}}>
                  <span style={{fontSize:12,fontWeight:600,
                    color:isSel?C.brand:C.t1,lineHeight:1.3,flex:1,marginRight:8}}>{ec.name}</span>
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

        {/* Cluster detail */}
        {sel && (
          <Card key={sel.id} className="fade-in" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:C.t1,
                  fontFamily:"'Syne',sans-serif",marginBottom:4}}>{sel.name}</div>
                <div style={{fontSize:11,color:C.t3,display:"flex",alignItems:"center",gap:6}}>
                  <span>Type: <b>{sel.type}</b></span><span>·</span>
                  <span>{sel.freq} events</span><span>·</span>
                  <span>{sel.tenants} tenants</span>
                  <Ann type="backed"/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <Phase label="FIX"/>
                <div style={{fontSize:24,fontWeight:800,fontFamily:C.mono,color:C.red,marginTop:4}}>{sel.impact}</div>
              </div>
            </div>
            <div style={{padding:"16px 18px",flex:1,overflowY:"auto"}}>
              <SH phase="SEE" title="Error Volume — 12-Day Trend" ann="backed"/>
              <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
                borderRadius:10,padding:"14px 16px",marginBottom:18}}>
                <svg width="100%" height="72" viewBox={`0 0 ${sel.bars.length*44} 72`} preserveAspectRatio="none">
                  {sel.bars.map((v,i)=>{
                    const h=Math.max(4,(v/Math.max(...sel.bars))*64);
                    const isMax = v===Math.max(...sel.bars);
                    return (
                      <g key={i}>
                        <rect x={i*44+4} y={72-h} width={36} height={h} rx={4}
                          fill={isMax?C.red+"CC":C.brand+"44"}/>
                        {isMax && <rect x={i*44+4} y={72-h} width={36} height={3} rx={2} fill={C.red}/>}
                      </g>
                    );
                  })}
                </svg>
                <div style={{display:"flex",justifyContent:"space-between",
                  fontSize:9,color:C.t4,fontFamily:C.mono,marginTop:6}}>
                  {["F22","F23","F24","F25","F26","F27","F28","M1","M2","M3","M4","M5"].map(d=>
                    <span key={d}>{d}</span>)}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
                <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
                  borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:C.t3,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>
                    Impacted Partners <Ann type="backed"/>
                  </div>
                  {["Expedia","Booking.com","Sabre GDS"].slice(0,sel.tenants).map((p,i)=>(
                    <div key={p} style={{display:"flex",justifyContent:"space-between",
                      alignItems:"center",padding:"5px 0",
                      borderBottom:i<sel.tenants-1?`1px solid ${C.t6}`:"none"}}>
                      <span style={{fontSize:12,color:C.t2}}>● {p}</span>
                      <span style={{fontFamily:C.mono,fontSize:11,color:C.red,fontWeight:700}}>
                        {Math.floor(sel.freq/sel.tenants)}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,
                  borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:C.t3,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>
                    Root Cause Hints <Ann type="new"/>
                  </div>
                  <div style={{fontSize:12,color:C.amber,lineHeight:1.6,fontWeight:600}}>
                    ARI date range mismatch<br/>Rate push timestamp lag<br/>
                    <span style={{color:C.t3,fontWeight:400}}>Est. fix effort: 2h</span>
                  </div>
                </div>
              </div>

              <SH phase="FIX" title="Actions"/>
              <div style={{display:"flex",gap:8}}>
                {[["▶ Launch Playbook",C.brand,C.brand+"22","#fff","success","Playbook launched — assigned to Marcus T."],
                  ["Assign Owner","transparent",C.border,C.t2,"info","Owner assignment opened"],
                  ["✓ Mark Mitigated",C.greenBg,C.greenBorder,C.green,"success","Cluster marked as mitigated"]
                ].map(([l,bg,b,c,type,msg])=>(
                  <button key={l} className="btn-ghost" onClick={()=>toast(msg,type)}
                    style={{flex:1,background:bg,border:`1px solid ${b}`,borderRadius:8,
                      padding:"9px",color:c,fontSize:12,fontWeight:l.includes("Launch")?700:500,
                      boxShadow:l.includes("Launch")?`0 2px 8px ${C.brand}33`:undefined}}>{l}</button>
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
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>
            Quantify and prioritise financial impact · {role==="exec"?"All tenants":"Your tenants"} · Renewal risk overlay
          </div>
        </div>
        <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",
          fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>↓ Export to QBR</button>
      </div>

      <SH phase="SEE" title="Risk Summary" ann="new"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[["TOTAL ARR AT RISK","$29.5M",C.red,"12 high-risk tenants"],
          ["IMMINENT RENEWALS","3",C.amber,"<90 days · $16.1M combined"],
          ["ARR PROTECTED (30d)","$2.1M",C.green,"via active playbooks · est."]
        ].map(([l,v,c,s])=>(
          <div key={l} style={{
            background:`linear-gradient(145deg,${C.cardBg} 40%,${c}08 100%)`,
            border:`1px solid ${C.border}`,borderTop:`3px solid ${c}`,
            borderRadius:12,padding:"18px",boxShadow:C.shadow,textAlign:"center"}}>
            <div style={{fontSize:10,color:C.t3,fontWeight:600,letterSpacing:0.6,
              textTransform:"uppercase",marginBottom:12}}>{l} <Ann type="new"/></div>
            <div style={{fontSize:38,fontWeight:800,fontFamily:C.mono,color:c,
              letterSpacing:"-1.5px",lineHeight:1}}>{v}</div>
            <div style={{fontSize:11,color:C.t3,marginTop:8}}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
        <Card>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:"#FAFBFD",
            display:"flex",alignItems:"center",gap:8}}>
            <Phase label="PRIORITISE"/>
            <span style={{fontSize:12,fontWeight:700,color:C.t1}}>Revenue Risk Grid</span>
            <Ann type="backed"/>
          </div>
          <table>
            <thead>
              <tr style={{background:"#F8FAFC"}}>
                {["Tenant","ARR $M","Risk Score","Key Drivers","Renewal","Owner","Trend"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",color:C.t4,
                    fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RISK_ROWS.map((r,i)=>{
                const isSel = sel?.tenant===r.tenant;
                const rc = r.risk>80?C.red:r.risk>50?C.amber:C.green;
                return (
                  <tr key={r.tenant} onClick={()=>setSel(r)}
                    className={isSel?"tr-sel":"tr-hover"}
                    style={{background:isSel?"#F5F3FF":i%2===0?"#fff":"#FAFBFD",
                      borderBottom:`1px solid ${C.t6}`,cursor:"pointer",
                      borderLeft:`3px solid ${isSel?C.brand:"transparent"}`}}>
                    <td style={{padding:"9px 12px",fontWeight:isSel?700:500,
                      color:isSel?C.brand:C.t1,fontSize:12}}>{r.tenant}</td>
                    <td style={{padding:"9px 12px",fontFamily:C.mono,fontWeight:600,color:C.t2,fontSize:12}}>{r.arr}</td>
                    <td style={{padding:"9px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:56,height:6,background:C.t6,borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${r.risk}%`,height:"100%",background:rc,
                            borderRadius:3,transition:"width 0.3s"}}/>
                        </div>
                        <span style={{fontFamily:C.mono,fontSize:11,color:rc,fontWeight:700}}>{r.risk}</span>
                      </div>
                    </td>
                    <td style={{padding:"9px 12px",color:C.t3,fontSize:11}}>{r.drivers[0]}</td>
                    <td style={{padding:"9px 12px",fontFamily:C.mono,fontSize:11,
                      color:r.renewal.includes("Apr")||r.renewal.includes("May")?C.amber:C.t3,
                      fontWeight:r.renewal.includes("Apr")?700:400}}>{r.renewal}</td>
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
            <div style={{fontSize:15,fontWeight:800,color:C.t1,
              fontFamily:"'Syne',sans-serif",margin:"10px 0 4px"}}>{sel.tenant}</div>
            <div style={{fontSize:11,color:C.t3,marginBottom:14}}>
              ARR: <b style={{fontFamily:C.mono}}>${sel.arr}M</b> · Renewal: <b style={{color:C.amber}}>{sel.renewal}</b>
            </div>
            <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
              borderRadius:10,padding:"12px",marginBottom:12}}>
              <div style={{fontSize:10,color:C.t3,fontWeight:600,
                textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Risk Score <Ann type="new"/></div>
              <div style={{width:"100%",height:8,background:C.t6,borderRadius:4,marginBottom:8,overflow:"hidden"}}>
                <div style={{width:`${sel.risk}%`,height:"100%",
                  background:`linear-gradient(90deg,${sel.risk>80?C.red:C.amber},${sel.risk>80?C.red+"88":C.amber+"88"})`,
                  borderRadius:4,transition:"width 0.4s"}}/>
              </div>
              <span style={{fontSize:24,fontWeight:800,fontFamily:C.mono,
                color:sel.risk>80?C.red:sel.risk>50?C.amber:C.green}}>{sel.risk}</span>
              <span style={{fontSize:12,color:C.t3}}>/100</span>
            </div>
            <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",
              letterSpacing:0.5,marginBottom:8}}>Key Drivers</div>
            {sel.drivers.map(d=>(
              <div key={d} style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,
                borderRadius:7,padding:"7px 10px",marginBottom:7,fontSize:12,color:C.t2}}>
                ⚠ {d}
              </div>
            ))}
            <div style={{fontSize:10,color:C.t3,fontWeight:600,textTransform:"uppercase",
              letterSpacing:0.5,margin:"12px 0 8px"}}>ARR Trend <Ann type="backed"/></div>
            <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
              borderRadius:8,padding:"10px"}}>
              <Spark data={[sel.arr*1.1,sel.arr*1.08,sel.arr*1.05,sel.arr*1.04,
                sel.arr*1.02,sel.arr*1.01,sel.arr]} color={C.amber} w={234} h={42}/>
            </div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button className="btn-primary" onClick={()=>toast("Playbook assigned — check Action Queue","success")}
                style={{flex:1,background:C.brand,border:"none",borderRadius:8,
                  padding:"8px",color:"#fff",fontSize:12,fontWeight:700,
                  boxShadow:`0 2px 8px ${C.brand}33`}}>Assign Playbook</button>
              <button className="btn-ghost" onClick={()=>toast("CSM alert sent to "+sel.owner,"info")}
                style={{flex:1,background:"#F8FAFC",
                  border:`1px solid ${C.border}`,borderRadius:8,padding:"8px",
                  color:C.t2,fontSize:12}}>CSM Alert</button>
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
  const kanbanCols = [
    ["To Review","Unassigned","PRIORITISE"],
    ["In Progress","InProgress","FIX"],
    ["Proved","Mitigated","PROVE"],
    ["Preventive","Active","PREVENT"],
  ];
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.6px"}}>Playbooks & Action Queue</h1>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>Operationalise remediation · Track recovery · Build preventive standards</div>
        </div>
        <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",
          fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>+ New Action</button>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
        <div style={{display:"flex",background:C.cardBg,border:`1px solid ${C.border}`,
          borderRadius:9,padding:3,gap:2,boxShadow:C.shadow}}>
          {[["queue","Action Queue"],["library","Playbook Library"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              background:tab===k?C.brand:"transparent",border:"none",borderRadius:7,
              padding:"6px 18px",fontSize:12,color:tab===k?"#fff":C.t3,
              fontWeight:tab===k?700:500,transition:"all 0.15s"}}>{l}
            </button>
          ))}
        </div>
        {tab==="queue" && (
          <button onClick={()=>setKanban(!kanban)} className="btn-ghost"
            style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,
              padding:"6px 14px",fontSize:12,color:kanban?C.brand:C.t3,
              fontWeight:kanban?700:400}}>
            {kanban ? "⊞ List View" : "⬡ Kanban View"}
          </button>
        )}
      </div>

      {tab==="queue" && !kanban && (
        <>
          <SH phase="FIX" title="Open Actions" ann="ui"/>
          <Card>
            <table>
              <thead>
                <tr style={{background:"#F8FAFC"}}>
                  {["Action","Tenant","Category","Owner","Due","Status","Impact"].map(h=>(
                    <th key={h} style={{padding:"9px 12px",textAlign:"left",color:C.t4,
                      fontSize:10,fontWeight:600,borderBottom:`1px solid ${C.border}`}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAYBOOKS.map((pb,i)=>(
                  <tr key={pb.id} className="tr-hover"
                    style={{background:i%2===0?"#fff":"#FAFBFD",
                      borderBottom:`1px solid ${C.t6}`}}>
                    <td style={{padding:"10px 12px",fontWeight:600,color:C.t1,fontSize:12}}>{pb.title}</td>
                    <td style={{padding:"10px 12px",color:C.t2,fontSize:12}}>{pb.tenant}</td>
                    <td style={{padding:"10px 12px"}}>
                      <span style={{fontSize:10,background:"#F1F5F9",border:`1px solid ${C.border}`,
                        borderRadius:5,padding:"2px 8px",color:C.t3}}>{pb.cat}</span>
                    </td>
                    <td style={{padding:"10px 12px",color:C.t3,fontSize:11}}>{pb.owner}</td>
                    <td style={{padding:"10px 12px",fontFamily:C.mono,fontSize:11,
                      color:pb.due==="Today"?C.red:C.t2,fontWeight:pb.due==="Today"?700:400}}>{pb.due}</td>
                    <td style={{padding:"10px 12px"}}><StatusChip s={pb.status}/></td>
                    <td style={{padding:"10px 12px",fontFamily:C.mono,color:C.green,fontWeight:700,fontSize:11}}>{pb.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab==="queue" && kanban && (
        <>
          <SH phase="FIX" title="Kanban — SEE → PROVE → PREVENT Flow" ann="ui"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {kanbanCols.map(([col,stat,ph])=>{
              const items = PLAYBOOKS.filter(p=>p.status===stat);
              const p = PHASE_CFG[ph];
              return (
                <div key={col} style={{background:C.cardBg,border:`1px solid ${C.border}`,
                  borderTop:`3px solid ${p.color}`,borderRadius:12,
                  boxShadow:C.shadow,overflow:"hidden"}}>
                  <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}`,
                    background:p.bg,display:"flex",alignItems:"center",
                    justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <Phase label={ph}/>
                      <span style={{fontSize:12,fontWeight:700,color:C.t1}}>{col}</span>
                    </div>
                    <span style={{fontFamily:C.mono,fontSize:11,color:C.t4,
                      background:"#fff",borderRadius:4,padding:"1px 7px",
                      border:`1px solid ${C.border}`}}>{items.length}</span>
                  </div>
                  <div style={{padding:10,display:"flex",flexDirection:"column",gap:8,minHeight:100}}>
                    {items.map(pb=>(
                      <div key={pb.id} className="card-hover"
                        style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
                          borderRadius:9,padding:"10px 12px"}}>
                        <div style={{fontSize:12,fontWeight:600,color:C.t1,marginBottom:4,lineHeight:1.3}}>{pb.title}</div>
                        <div style={{fontSize:11,color:C.t3,marginBottom:7}}>{pb.tenant}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:9,background:"#F1F5F9",borderRadius:4,
                            padding:"2px 7px",color:C.t3,border:`1px solid ${C.border}`}}>{pb.cat}</span>
                          <span style={{fontSize:11,fontFamily:C.mono,color:C.green,fontWeight:700}}>{pb.impact}</span>
                        </div>
                        <div style={{fontSize:10,color:pb.due==="Today"?C.red:C.t4,
                          marginTop:6,fontFamily:C.mono}}>Due: {pb.due}</div>
                      </div>
                    ))}
                    {items.length===0 && (
                      <div style={{textAlign:"center",padding:"24px 0",
                        color:C.t5,fontSize:12}}>No items</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab==="library" && (
        <>
          <SH phase="PREVENT" title="Reusable Playbook Library" ann="ui"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {PB_LIBRARY.map((pb,i)=>(
              <div key={i} className="card-hover"
                style={{background:C.cardBg,border:`1px solid ${C.border}`,
                  borderRadius:12,padding:"16px",boxShadow:C.shadow,
                  display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"flex-start",gap:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.t1,
                    lineHeight:1.3,flex:1}}>{pb.title}</span>
                  <span style={{fontSize:10,background:"#F1F5F9",
                    border:`1px solid ${C.border}`,borderRadius:5,
                    padding:"2px 9px",color:C.t3,flexShrink:0}}>{pb.cat}</span>
                </div>
                <div style={{fontSize:12,color:C.t3,lineHeight:1.6,flex:1}}>{pb.desc}</div>
                <div style={{display:"flex",gap:12,fontSize:11,alignItems:"center"}}>
                  <span style={{color:C.t3}}>⏱ {pb.effort}</span>
                  <span style={{
                    fontWeight:700,
                    color:pb.impact==="High"?C.red:C.amber,
                    background:pb.impact==="High"?C.redBg:C.amberBg,
                    border:`1px solid ${pb.impact==="High"?C.redBorder:C.amberBorder}`,
                    borderRadius:4,padding:"1px 8px",fontSize:10
                  }}>Impact: {pb.impact}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn-primary" onClick={()=>toast(`"${pb.title}" added to Action Queue`,"success")}
                    style={{flex:1,background:C.brand,border:"none",borderRadius:8,
                      padding:"7px",color:"#fff",fontSize:12,fontWeight:700,
                      boxShadow:`0 2px 8px ${C.brand}33`}}>Apply Playbook</button>
                  <button className="btn-ghost" style={{background:"#F8FAFC",
                    border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",
                    color:C.t2,fontSize:12}}>View</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 5 — 16-LEVER GRID
══════════════════════════════════════════════════════════════════════════ */
function LeversPage({ tenant, setTenant, toast }) {
  const [selLever, setSelLever] = useState(LEVERS_DATA[0]);
  const reds   = LEVERS_DATA.filter(l=>l.status==="red").length;
  const ambers = LEVERS_DATA.filter(l=>l.status==="amber").length;
  const greens = LEVERS_DATA.filter(l=>l.status==="green").length;

  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,
              color:C.t1,letterSpacing:"-0.6px"}}>16-Lever Diagnostic</h1>
            {tenant && (
              <div style={{background:C.brandDim,border:`1px solid ${C.brandBorder}`,
                borderRadius:7,padding:"4px 12px",fontSize:12,color:C.brand,fontWeight:700,
                display:"flex",alignItems:"center",gap:5}}>
                <span style={{opacity:0.6}}>📍</span> {tenant}
              </div>
            )}
          </div>
          <div style={{fontSize:12,color:C.t3}}>Full RAG diagnostic across all 16 distribution levers · Click any lever for drill-down</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select onChange={e=>setTenant(e.target.value)} value={tenant||"All Tenants"}
            style={{background:C.cardBg,border:`1px solid ${C.border}`,borderRadius:8,
              padding:"7px 12px",fontSize:12,color:C.t1,outline:"none",boxShadow:C.shadow}}>
            <option>All Tenants</option>
            {TENANTS.map(t=><option key={t.id}>{t.name}</option>)}
          </select>
          <button style={{background:C.brand,border:"none",borderRadius:8,padding:"7px 16px",
            fontSize:12,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${C.brand}44`}}>↗ Export Grid</button>
        </div>
      </div>

      {/* RAG Summary */}
      <SH phase="SEE" title="RAG Summary" ann="backed"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:22}}>
        {[[reds,"RED","Critical — Fix Today",C.red,C.redBg,C.redBorder],
          [ambers,"AMBER","Needs Attention",C.amber,C.amberBg,C.amberBorder],
          [greens,"GREEN","Distribution Healthy",C.green,C.greenBg,C.greenBorder]
        ].map(([n,l,s,c,bg,b])=>(
          <div key={l} style={{background:bg,border:`1px solid ${b}`,borderRadius:12,
            padding:"16px",display:"flex",alignItems:"center",gap:16,
            boxShadow:C.shadow}}>
            <div style={{width:52,height:52,borderRadius:"50%",
              background:`linear-gradient(135deg,${c},${c}88)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:24,fontWeight:800,color:"#fff",fontFamily:C.mono,
              flexShrink:0,boxShadow:`0 4px 12px ${c}44`}}>{n}</div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:c,fontFamily:C.mono}}>{l}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:3}}>{s}</div>
              <div style={{fontSize:10,color:c,marginTop:4,fontWeight:600}}>
                {n} of 16 levers
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4x4 Grid + Detail */}
      <SH phase="PRIORITISE" title="All 16 Levers — Click any lever to drill down" ann="backed"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:14}}>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,alignContent:"start"}}>
          {LEVERS_DATA.map(lv=>{
            const isSel = selLever?.id===lv.id;
            const c  = {red:C.red,amber:C.amber,green:C.green}[lv.status];
            const bg = {red:C.redBg,amber:C.amberBg,green:C.greenBg}[lv.status];
            const b  = {red:C.redBorder,amber:C.amberBorder,green:C.greenBorder}[lv.status];
            const attain = Math.min(100,(lv.val/lv.bench)*100);
            return (
              <div key={lv.id} onClick={()=>setSelLever(lv)}
                className="lever-card"
                style={{background:isSel?"#F5F3FF":bg,
                  border:`1px solid ${isSel?C.brand:b}`,
                  borderTop:`3px solid ${isSel?C.brand:c}`,
                  borderRadius:10,padding:"12px",cursor:"pointer",
                  boxShadow:isSel?`0 0 0 2px ${C.brand}33,${C.shadowMd}`:C.shadow,
                  transition:"all 0.15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:9,fontFamily:C.mono,color:C.t4,fontWeight:600}}>
                    L{String(lv.id).padStart(2,"0")}
                  </span>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c,
                    boxShadow:`0 0 0 3px ${c}22`}}/>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:isSel?C.brand:C.t1,
                  marginBottom:6,lineHeight:1.2}}>{lv.name}</div>
                {/* Mini progress bar */}
                <div style={{width:"100%",height:4,background:"rgba(0,0,0,0.06)",
                  borderRadius:2,marginBottom:6,overflow:"hidden"}}>
                  <div style={{width:`${attain}%`,height:"100%",background:c,borderRadius:2}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}>
                  <span style={{fontFamily:C.mono,color:c,fontWeight:700}}>{lv.val}</span>
                  <span style={{color:C.t4,fontFamily:C.mono}}>/{lv.bench}</span>
                </div>
                {lv.impact!=="—" && (
                  <div style={{fontSize:9,color:c,fontWeight:700,marginTop:4,
                    fontFamily:C.mono,opacity:0.8}}>{lv.impact}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lever detail */}
        {selLever && (
          <Card key={selLever.id} style={{padding:16,display:"flex",flexDirection:"column",gap:12}} selected>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:9,color:C.t4,fontFamily:C.mono,marginBottom:4,fontWeight:600,letterSpacing:0.8}}>
                  LEVER {String(selLever.id).padStart(2,"0")}
                </div>
                <div style={{fontSize:18,fontWeight:800,color:C.t1,fontFamily:"'Syne',sans-serif"}}>{selLever.name}</div>
              </div>
              <Rag s={selLever.status}/>
            </div>

            {/* 2x2 KPIs */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Current",selLever.val,{red:C.red,amber:C.amber,green:C.green}[selLever.status]],
                ["Benchmark",selLever.bench,C.t2],
                ["Rev. Impact",selLever.impact,selLever.impact!=="—"?C.red:C.green],
                ["Gap",`${Math.abs(selLever.bench-selLever.val).toFixed(0)}`,
                  selLever.val<selLever.bench?C.red:C.green]
              ].map(([l,v,c])=>(
                <div key={l} style={{background:`linear-gradient(145deg,#F8FAFC,${c}06)`,
                  border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:C.t3,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:C.mono,color:c}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Attainment bar */}
            <div>
              <div style={{display:"flex",justifyContent:"space-between",
                fontSize:10,color:C.t3,marginBottom:5}}>
                <span>Attainment vs benchmark</span>
                <span style={{fontFamily:C.mono,fontWeight:700,
                  color:{red:C.red,amber:C.amber,green:C.green}[selLever.status]}}>
                  {Math.round((selLever.val/selLever.bench)*100)}%
                </span>
              </div>
              <div style={{width:"100%",height:10,background:C.t6,borderRadius:5,overflow:"hidden"}}>
                <div style={{
                  width:`${Math.min(100,(selLever.val/selLever.bench)*100)}%`,
                  height:"100%",
                  background:`linear-gradient(90deg,${
                    {red:C.red,amber:C.amber,green:C.green}[selLever.status]},${
                    {red:C.red+"99",amber:C.amber+"99",green:C.green+"99"}[selLever.status]})`,
                  borderRadius:5,transition:"width 0.4s ease"}}/>
              </div>
            </div>

            {/* Trend */}
            <div style={{background:"#F8FAFC",border:`1px solid ${C.border}`,
              borderRadius:9,padding:"12px 14px"}}>
              <div style={{fontSize:10,color:C.t3,fontWeight:600,
                textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>7-Day Trend <Ann type="backed"/></div>
              <Spark
                data={[selLever.val*0.85,selLever.val*0.9,selLever.val*0.88,
                  selLever.val*0.95,selLever.val*0.92,selLever.val*0.97,selLever.val]}
                color={{red:C.red,amber:C.amber,green:C.green}[selLever.status]}
                w={270} h={48}/>
            </div>

            {selLever.status!=="green" && (
              <div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,
                borderRadius:9,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:C.t3,fontWeight:600,
                  textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>
                  Recommended Action <Ann type="new"/>
                </div>
                <div style={{fontSize:12,color:C.t2,lineHeight:1.6}}>
                  Launch <b>"{selLever.name}"</b> playbook to diagnose root cause and begin remediation.
                  Estimated effort: 2–4 hours.
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:8}}>
              <button className="btn-primary" onClick={()=>toast(`"${selLever.name}" playbook launched`,"success")}
                style={{flex:1,background:C.brand,border:"none",borderRadius:8,
                  padding:"9px",color:"#fff",fontSize:12,fontWeight:700,
                  boxShadow:`0 2px 8px ${C.brand}33`}}>▶ Launch Playbook</button>
              <button className="btn-ghost" style={{background:"#F8FAFC",
                border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 14px",
                color:C.t2,fontSize:12}}>History</button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
