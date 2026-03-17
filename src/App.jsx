import { useState, useEffect, useRef } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#fff;--fg:#1a1d21;--muted:#5c5e62;--muted-40:rgba(92,94,98,0.4);
  --border:#e5e5e5;--secondary:#f5f5f5;--accent:#3366ff;--accent-hover:#2952cc;
  --btn-dark:rgba(57,60,65,0.85);--btn-dark-hover:#393c41;
  --btn-light:rgba(245,245,245,0.9);--btn-light-hover:#f5f5f5;
  --font:'Montserrat',sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--fg)}

/* ── Navbar ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  padding:0 24px;height:52px;
  background:#ffffff;
  border-bottom:1px solid rgba(0,0,0,0.1);
}
.nav-logo{
  font-size:13px;font-weight:700;letter-spacing:0.25em;
  text-decoration:none;color:#1a1d21;
  font-family:var(--font);
  justify-self:start;
}
.nav-center{
  display:flex;gap:0;
  justify-self:center;
}
.nav-center a{
  font-size:13px;font-weight:400;color:rgba(26,29,33,0.82);
  text-decoration:none;padding:6px 14px;border-radius:4px;
  transition:background .15s,color .15s;white-space:nowrap;
}
.nav-center a:hover{background:rgba(0,0,0,0.06);color:#1a1d21}
.nav-right{
  display:flex;align-items:center;gap:2px;
  justify-self:end;
}
.nav-icon{
  display:flex;align-items:center;justify-content:center;
  width:36px;height:36px;border-radius:50%;border:none;
  background:none;cursor:pointer;color:rgba(26,29,33,0.7);
  transition:background .15s,color .15s;
}
.nav-icon:hover{background:rgba(0,0,0,0.07);color:#1a1d21}
.nav-icon svg{width:18px;height:18px;display:block;flex-shrink:0}

/* ── Hero ── */
.hero{position:relative;width:100%;height:100vh;overflow:hidden;background:#000}
.hero-slide{position:absolute;inset:0;transition:opacity 1.2s ease}
.hero-slide img{width:100%;height:100%;object-fit:cover;display:block}
.hero-grad{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.06) 0%,rgba(0,0,0,0.01) 40%,rgba(0,0,0,0.58) 100%)}
/* FSD slide */
.fsd-wrap{position:absolute;inset:0;overflow:hidden}
.fsd-wrap img{width:100%;height:100%;object-fit:cover;filter:brightness(0.82)}
.fsd-tint{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(4,10,4,0.55) 0%,rgba(4,10,4,0.08) 42%,rgba(0,0,0,0.7) 100%)}
.fsd-screen{position:absolute;top:50%;left:50%;transform:translate(-50%,-44%);width:210px;height:148px;background:#0b0f16;border-radius:8px;border:1px solid rgba(255,255,255,0.18);overflow:hidden;box-shadow:0 0 48px rgba(0,90,255,0.22)}
.fsd-wheel{position:absolute;bottom:-90px;left:50%;transform:translateX(-50%);width:360px;height:360px;opacity:0.42;pointer-events:none}
/* Hero overlay */
.hero-ui{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:100px 24px 54px;pointer-events:none}
.hero-text{text-align:center;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,0.4)}
.hero-tag{font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;opacity:0.82;margin-bottom:8px;min-height:16px}
.hero-title{font-size:clamp(2rem,5.5vw,3.8rem);font-weight:700;line-height:1.08;letter-spacing:-0.02em;margin-bottom:9px}
.hero-sub{font-size:clamp(13px,1.8vw,16px);color:rgba(255,255,255,0.75)}
.hero-bottom{display:flex;flex-direction:column;align-items:center;gap:18px;pointer-events:all}
.hero-btns{display:flex;gap:12px}
.btn-primary{padding:11px 28px;font-size:13.5px;font-weight:500;border-radius:4px;border:none;cursor:pointer;background:var(--btn-dark);color:#fff;font-family:var(--font);backdrop-filter:blur(8px);transition:background .2s}
.btn-primary:hover{background:var(--btn-dark-hover)}
.btn-secondary{padding:11px 28px;font-size:13.5px;font-weight:500;border-radius:4px;border:none;cursor:pointer;background:var(--btn-light);color:var(--fg);font-family:var(--font);backdrop-filter:blur(8px);transition:background .2s}
.btn-secondary:hover{background:var(--btn-light-hover)}
.btn-accent{padding:11px 28px;font-size:13.5px;font-weight:500;border-radius:4px;border:none;cursor:pointer;background:var(--accent);color:#fff;font-family:var(--font);transition:background .2s}
.btn-accent:hover{background:var(--accent-hover)}
.hero-dots{display:flex;gap:9px}
.hero-dot{width:9px;height:9px;border-radius:50%;border:none;cursor:pointer;transition:background .3s,transform .2s}
.hero-dot:hover{transform:scale(1.3)}
.hero-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:6;background:rgba(255,255,255,0.13);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.9);font-size:26px;cursor:pointer;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all .2s;pointer-events:all}
.hero-arrow:hover{background:rgba(255,255,255,0.28)}
.hero-arrow.left{left:20px}
.hero-arrow.right{right:20px}
.pause-btn{position:absolute;bottom:26px;left:26px;z-index:6;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;pointer-events:all;backdrop-filter:blur(4px)}

/* ── Vehicle Showcase ── */
.vehicles{padding:24px 16px;background:var(--bg)}
.vehicles-inner{max-width:1280px;margin:0 auto}
.vehicles-grid{display:flex;gap:12px;height:500px}
.vehicle-main{position:relative;flex:1;border-radius:8px;overflow:hidden}
.vehicle-main img{width:100%;height:100%;object-fit:cover}
.vehicle-main .tag{position:absolute;top:20px;left:20px;font-size:14px;font-weight:500;color:#fff}
.vehicle-main h2{position:absolute;bottom:24px;left:24px;font-size:clamp(2rem,4vw,3rem);font-weight:600;color:#fff}
.vehicle-next{width:220px;position:relative;border-radius:8px;overflow:hidden;cursor:pointer}
.vehicle-next img{width:100%;height:100%;object-fit:cover}
.vehicle-next .tag{position:absolute;top:16px;left:16px;font-size:12px;font-weight:500;color:#fff}
.vehicle-next h3{position:absolute;bottom:16px;left:16px;font-size:20px;font-weight:600;color:#fff}
.vehicle-next .arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.2);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;border:none;color:#fff;font-size:20px;cursor:pointer}
.dots{display:flex;justify-content:center;gap:12px;padding:12px 0}
.dot{width:12px;height:12px;border-radius:50%;border:none;cursor:pointer;transition:background .3s}

/* ── Offers ── */
.offers{padding:64px 20px;background:var(--secondary)}
.offers-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.offer-card{background:var(--bg);border-radius:4px;overflow:hidden}
.offer-card.with-img{display:flex}
.offer-card .text{padding:32px;flex:1}
.offer-card h3{font-size:24px;font-weight:700;margin-bottom:8px}
.offer-card p{color:var(--muted);margin-bottom:24px}
.offer-card .img{width:192px}
.offer-card .img img{width:100%;height:100%;object-fit:cover}

/* ── Features ── */
.features{padding:64px 20px;background:var(--bg)}
.features-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.feature-card{position:relative;border-radius:4px;overflow:hidden}
.feature-card img{width:100%;aspect-ratio:16/9;object-fit:cover;transition:transform .7s}
.feature-card:hover img{transform:scale(1.05)}
.feature-card .overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,29,33,0.6),transparent)}
.feature-card .info{position:absolute;bottom:32px;left:32px}
.feature-card h3{font-size:clamp(1.2rem,3vw,1.8rem);font-weight:700;color:#fff;margin-bottom:4px}
.feature-card p{font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:16px}
.feature-card .btns{display:flex;gap:12px}

/* ── Charging ── */
.charging{padding:80px 20px;background:var(--secondary)}
.charging-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:48px}
.charging-img{flex:1;border-radius:4px;overflow:hidden}
.charging-img img{width:100%;aspect-ratio:16/10;object-fit:cover}
.charging-text{flex:1}
.charging-text h2{font-size:clamp(1.5rem,4vw,2.5rem);font-weight:700;margin-bottom:16px}
.charging-text p{color:var(--muted);margin-bottom:32px;line-height:1.6}
.charging-stats{display:flex;gap:32px;margin-bottom:32px}
.stat h4{font-size:28px;font-weight:700}
.stat span{font-size:12px;color:var(--muted)}

/* ── Energy ── */
.energy{padding:64px 20px;background:var(--bg)}
.energy-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.energy-card{position:relative;border-radius:4px;overflow:hidden}
.energy-card img{width:100%;aspect-ratio:16/9;object-fit:cover;transition:transform .7s}
.energy-card:hover img{transform:scale(1.05)}
.energy-card .overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,29,33,0.6),transparent)}
.energy-card .info{position:absolute;bottom:32px;left:32px}
.energy-card h3{font-size:clamp(1.2rem,3vw,1.8rem);font-weight:700;color:#fff;margin-bottom:4px}
.energy-card p{font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:16px}
.energy-card .btns{display:flex;gap:12px}

/* ── Footer ── */
.footer{padding:32px 20px;border-top:1px solid var(--border)}
.footer-inner{max-width:1280px;margin:0 auto}
.footer-note{font-size:12px;color:var(--muted);margin-bottom:24px}
.footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;font-size:12px;color:var(--muted)}
.footer-links a{color:var(--muted);text-decoration:none;transition:color .2s}
.footer-links a:hover{color:var(--fg)}

@media(max-width:768px){
  .nav-center{display:none}
  .vehicles-grid{height:auto;flex-direction:column}
  .vehicle-main{height:350px}
  .vehicle-next{display:none}
  .offers-grid,.features-grid,.energy-grid{grid-template-columns:1fr}
  .charging-inner{flex-direction:column}
  .offer-card.with-img{flex-direction:column}
  .offer-card .img{width:100%;height:192px}
  .fsd-wheel{width:260px;height:260px;bottom:-50px}
  .fsd-screen{width:150px;height:106px}
}
`;

// ─── Images ───────────────────────────────────────────────────────────────────
// All images from upload.wikimedia.org — fully public domain, no CORS issues
const IMAGES = {
  heroModel3:  "https://static.vecteezy.com/system/resources/thumbnails/055/672/799/small/red-modern-red-sport-car-driving-fast-on-scenic-road-in-forest-at-sunset-automotive-background-tuning-template-auto-transport-photo.jpg",
  heroModelS:  "https://i.insider.com/592f4169b74af41b008b5977?width=1200&format=jpeg",
  heroFsd:     "https://cdn.aarp.net/content/dam/aarp/auto/2018/10/1140-self-driving-car.jpg",
  fleet:       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Tesla_Model_3_facelift_%28cropped%29.jpg/800px-Tesla_Model_3_facelift_%28cropped%29.jpg",
  features:    "https://cdn.punchng.com/wp-content/uploads/2018/01/03092606/Luxury-cars.jpg",
  fsdVision:   "https://static.vecteezy.com/system/resources/previews/040/742/444/large_2x/yong-pretty-woman-standing-near-a-big-all-terrain-car-outdoors-driver-girl-in-casual-clothes-outside-her-vehicle-photo.jpg",

  solar:       "https://media.wired.com/photos/66f6d9e8edd5b22be7017791/16:9/w_4336,h_2439,c_limit/GettyImages-1681913304.jpg",
  powerwall:   "data:image/jpeg;base64,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",
};

const HERO_SLIDES = [
  { type:"image", image:IMAGES.heroModel3, tag:"Sport Sedan",       title:"Model 3", subtitle:"0.99% APR Available",           primaryBtn:"Order Now",            secondaryBtn:"View Inventory", accent:false },
  { type:"image", image:IMAGES.heroModelS, tag:"Performance Sedan", title:"Model S", subtitle:"Ludicrous Mode. 0–60 in 1.99s", primaryBtn:"Order Now",            secondaryBtn:"View Inventory", accent:false },
  { type:"fsd",   image:IMAGES.heroFsd,    tag:"",                  title:"Full Self-Driving (Supervised)", subtitle:"Available for $99/mo¹", primaryBtn:"Demo FSD (Supervised)", secondaryBtn:"Learn More", accent:true },
];

const VEHICLES = [
  { image:"https://static0.hotcarsimages.com/wordpress/wp-content/uploads/2022/07/2022_Lexus_IS_350_001-Cropped.jpg", tag:"Sport Sedan",       title:"Model 3"    },
  { image:"https://cdn.jdpower.com/JDPA_2020%20Chevrolet%20Blazer%20RS%20Red%20Front%20View.jpg", tag:"Midsize SUV", title:"Model Y" },
  { image:"https://torquecafe.b-cdn.net/wp-content/uploads/2025/01/2025-BMW-M5_1.jpg", tag:"Performance Sedan", title:"Model S" },
  { image:"https://www.apetogentleman.com/wp-content/uploads/2021/05/bestsuvsmain3.jpg", tag:"Performance SUV", title:"Model X" },
  { image:"https://carlots.ng/oc-content/uploads/blog/blog/58.jpg", tag:"Full-Size Truck", title:"Cybertruck" },
];

// ─── FSD Canvas ───────────────────────────────────────────────────────────────
function FSDScreen() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0, raf;
    function draw() {
      const W = 210, H = 148;
      ctx.fillStyle = "#0a0e18"; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = "#111827"; ctx.fillRect(0,0,W,55);
      const hg = ctx.createLinearGradient(0,42,0,58);
      hg.addColorStop(0,"rgba(30,80,180,0)"); hg.addColorStop(.5,"rgba(30,80,180,0.18)"); hg.addColorStop(1,"rgba(30,80,180,0)");
      ctx.fillStyle = hg; ctx.fillRect(0,42,W,16);
      ctx.fillStyle = "#171e2e";
      ctx.beginPath(); ctx.moveTo(52,H); ctx.lineTo(76,56); ctx.lineTo(134,56); ctx.lineTo(158,H); ctx.closePath(); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=.8; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(52,H); ctx.lineTo(76,56); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(158,H); ctx.lineTo(134,56); ctx.stroke();
      const off = (t*2.4)%18;
      for(let y=H; y>58; y-=18){
        const p=(y-58)/(H-58);
        ctx.strokeStyle=`rgba(255,210,0,${0.55*p})`; ctx.lineWidth=1.2*p;
        ctx.setLineDash([7*p,11*p]); ctx.lineDashOffset=-off*p;
        ctx.beginPath(); ctx.moveTo(W/2,y); ctx.lineTo(W/2,y-7*p); ctx.stroke();
      }
      ctx.setLineDash([]); ctx.lineDashOffset=0;
      ctx.fillStyle="rgba(20,40,20,0.6)";
      ctx.beginPath(); ctx.ellipse(22,60,18,30,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(188,58,16,28,0,0,Math.PI*2); ctx.fill();
      const lx=88+Math.sin(t*.04)*2, ly=62+Math.sin(t*.03)*2;
      ctx.strokeStyle="rgba(70,160,255,0.92)"; ctx.lineWidth=1.3; ctx.strokeRect(lx,ly,20,12);
      ctx.fillStyle="rgba(255,60,60,0.8)"; ctx.fillRect(lx,ly+1,3,4); ctx.fillRect(lx+17,ly+1,3,4);
      ctx.strokeStyle="rgba(70,160,255,0.2)"; ctx.lineWidth=.5; ctx.strokeRect(lx-2,ly+12,24,3);
      const sx=118+Math.sin(t*.025+1)*1.5;
      ctx.strokeStyle="rgba(70,160,255,0.8)"; ctx.lineWidth=1.2; ctx.strokeRect(sx,72,18,11);
      const ex=87, ey=112;
      ctx.strokeStyle="rgba(60,220,110,0.96)"; ctx.lineWidth=1.6; ctx.strokeRect(ex,ey,26,18);
      ctx.fillStyle="rgba(60,220,110,0.08)"; ctx.fillRect(ex,ey,26,18);
      ctx.fillStyle="rgba(220,230,255,0.7)"; ctx.fillRect(ex+1,ey,5,3); ctx.fillRect(ex+20,ey,5,3);
      ctx.strokeStyle="rgba(60,220,110,0.55)"; ctx.lineWidth=1.1; ctx.setLineDash([3,6]);
      ctx.beginPath(); ctx.moveTo(ex+13,ey); ctx.quadraticCurveTo(W/2,92,W/2,58); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="rgba(255,255,255,0.6)"; ctx.font="bold 10px sans-serif"; ctx.textAlign="right";
      ctx.fillText("72",W-6,H-14);
      ctx.font="7px sans-serif"; ctx.fillStyle="rgba(255,255,255,.32)"; ctx.fillText("mph",W-6,H-6);
      ctx.textAlign="left";
      ctx.fillStyle="rgba(60,220,110,0.8)"; ctx.font="bold 7px sans-serif"; ctx.fillText("FSD",6,12);
      ctx.fillStyle="rgba(60,220,110,0.9)"; ctx.beginPath(); ctx.arc(6,H-8,3.5,0,Math.PI*2); ctx.fill();
      t++; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} width={210} height={148} style={{display:"block",width:"100%",height:"100%"}} />;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINK = {
  fontSize: "13px", fontWeight: "400", color: "rgba(26,29,33,0.82)",
  textDecoration: "none", padding: "6px 10px", borderRadius: "4px",
  whiteSpace: "nowrap", fontFamily: "'Montserrat',sans-serif",
  cursor: "pointer",
};
const ICON_BTN = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "36px", height: "36px", borderRadius: "50%", border: "none",
  background: "none", cursor: "pointer", color: "rgba(26,29,33,0.72)",
  flexShrink: 0,
};

function Navbar() {
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "grid", gridTemplateColumns: "200px 1fr 200px",
      alignItems: "center", padding: "0 40px", height: "52px",
      background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.1)",
    }}>

      {/* Logo — left */}
      <a href="#" style={{
        fontSize: "13px", fontWeight: "700", letterSpacing: "0.18em",
        textDecoration: "none", color: "#1a1d21",
        fontFamily: "'Montserrat',sans-serif", justifySelf: "start",
        whiteSpace: "nowrap",
      }}>TESLA</a>

      {/* Links — center */}
      <nav style={{ display: "flex", gap: "0", justifyContent: "center"  }}>
        {[ "Vehicles","Energy","Charging","Discover","Shop"].map(link => (
          <a key={link} href="#" style={NAV_LINK}>{link}</a>
        ))}
      </nav>
      

      {/* Icons — right */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", justifySelf: "end" }}>

        {/* Help */}
        <button style={ICON_BTN} title="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        {/* Globe */}
        <button style={ICON_BTN} title="Language">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>

        {/* Account */}
        <button style={ICON_BTN} title="Account">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>

      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!paused) {
      timerRef.current = setInterval(() => setIdx(i => (i + 1) % HERO_SLIDES.length), 6000);
    }
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const slide = HERO_SLIDES[idx];

  return (
    <section className="hero">

      {/* Slide 0 — Model 3 */}
      <div className="hero-slide" style={{ opacity: idx === 0 ? 1 : 0 }}>
        <img src={IMAGES.heroModel3} alt="Model 3" />
        <div className="hero-grad" />
      </div>

      {/* Slide 1 — Model S */}
      <div className="hero-slide" style={{ opacity: idx === 1 ? 1 : 0 }}>
        <img src={IMAGES.heroModelS} alt="Model S" />
        <div className="hero-grad" />
      </div>

      {/* Slide 2 — FSD */}
      <div className="hero-slide" style={{ opacity: idx === 2 ? 1 : 0 }}>
        <div className="fsd-wrap">
          <img src={IMAGES.heroFsd} alt="Full Self-Driving" />
          <div className="fsd-tint" />
          <div className="fsd-screen"><FSDScreen /></div>
          <div className="fsd-wheel">
            <svg viewBox="0 0 360 360" fill="none">
              <circle cx="180" cy="180" r="163" stroke="rgba(255,255,255,0.65)" strokeWidth="22"/>
              <line x1="180" y1="17" x2="180" y2="107" stroke="rgba(255,255,255,0.52)" strokeWidth="19" strokeLinecap="round"/>
              <line x1="31" y1="255" x2="107" y2="213" stroke="rgba(255,255,255,0.52)" strokeWidth="19" strokeLinecap="round"/>
              <line x1="329" y1="255" x2="253" y2="213" stroke="rgba(255,255,255,0.52)" strokeWidth="19" strokeLinecap="round"/>
              <circle cx="180" cy="180" r="37" fill="rgba(25,25,25,0.92)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
              <text x="180" y="188" textAnchor="middle" fontSize="24" fill="rgba(255,255,255,0.82)" fontFamily="Montserrat,sans-serif" fontWeight="600">T</text>
            </svg>
          </div>
        </div>
      </div>

      {/* UI overlay */}
      <div className="hero-ui">
        <div className="hero-text">
          <div className="hero-tag">{slide.tag}</div>
          <div className="hero-title">{slide.title}</div>
          <div className="hero-sub">{slide.subtitle}</div>
        </div>
        <div className="hero-bottom">
          <div className="hero-btns">
            <button className={slide.accent ? "btn-accent" : "btn-primary"}>{slide.primaryBtn}</button>
            <button className="btn-secondary">{slide.secondaryBtn}</button>
          </div>
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} className="hero-dot" onClick={() => setIdx(i)}
                style={{ background: i === idx ? "#fff" : "rgba(255,255,255,0.38)" }} />
            ))}
          </div>
        </div>
      </div>

      <button className="hero-arrow left"  onClick={() => setIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}>‹</button>
      <button className="hero-arrow right" onClick={() => setIdx(i => (i + 1) % HERO_SLIDES.length)}>›</button>
      <button className="pause-btn" onClick={() => setPaused(p => !p)}>{paused ? "▶" : "⏸"}</button>
    </section>
  );
}

// ─── Vehicle Showcase ─────────────────────────────────────────────────────────
function VehicleShowcase() {
  const [idx, setIdx] = useState(0);
  const current = VEHICLES[idx];
  const next    = VEHICLES[(idx + 1) % VEHICLES.length];

  return (
    <section style={{ background: "#fff" }}>

      {/* Cards row — no bottom padding so dots sit flush below */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 16px 0" }}>
        <div style={{ display: "flex", gap: "10px", height: "460px" }}>

          {/* Main large card */}
          <div style={{ position: "relative", flex: 1, borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}>
            <img
              src={current.image}
              alt={current.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <span style={{
              position: "absolute", top: "20px", left: "20px",
              fontSize: "14px", fontWeight: "500", color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              fontFamily: "'Montserrat',sans-serif",
            }}>{current.tag}</span>
            <h2 style={{
              position: "absolute", bottom: "24px", left: "24px",
              fontSize: "clamp(2rem,4vw,3rem)", fontWeight: "600", color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              fontFamily: "'Montserrat',sans-serif", margin: 0,
            }}>{current.title}</h2>
          </div>

          {/* Peek card */}
          <div
            onClick={() => setIdx(i => (i + 1) % VEHICLES.length)}
            style={{ position: "relative", width: "200px", borderRadius: "8px", overflow: "hidden", cursor: "pointer", flexShrink: 0 }}
          >
            <img
              src={next.image}
              alt={next.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <span style={{
              position: "absolute", top: "16px", left: "16px",
              fontSize: "12px", fontWeight: "500", color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              fontFamily: "'Montserrat',sans-serif",
            }}>{next.tag}</span>
            <h3 style={{
              position: "absolute", bottom: "16px", left: "16px",
              fontSize: "22px", fontWeight: "600", color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              fontFamily: "'Montserrat',sans-serif", margin: 0,
            }}>{next.title}</h3>
            <button style={{
              position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
              width: "32px", height: "32px", borderRadius: "50%",
              background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff", fontSize: "20px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>›</button>
          </div>

        </div>
      </div>

      {/* Dots strip — sits between section 2 and section 3 */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: "12px",
        padding: "20px 0",
        background: "#f5f5f5",
      }}>
        {VEHICLES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: "11px", height: "11px", borderRadius: "50%", border: "none",
              cursor: "pointer", transition: "background .3s", padding: 0,
              background: i === idx ? "#1a1d21" : "rgba(92,94,98,0.32)",
            }}
          />
        ))}
      </div>

    </section>
  );
}

// ─── Offers ───────────────────────────────────────────────────────────────────
function Offers() {
  const CARD = {
    background: "#fff", borderRadius: "6px", overflow: "hidden",
    display: "flex", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  };
  const TEXT = { padding: "32px 28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" };
  const H3   = { fontSize: "22px", fontWeight: "700", color: "#1a1d21", marginBottom: "10px", fontFamily: "'Montserrat',sans-serif" };
  const P    = { fontSize: "14px", color: "#5c5e62", marginBottom: "24px", lineHeight: "1.6", fontFamily: "'Montserrat',sans-serif" };
  const BTN  = { display: "inline-block", padding: "9px 20px", fontSize: "13px", fontWeight: "500", border: "1px solid #1a1d21", borderRadius: "4px", background: "#fff", color: "#1a1d21", cursor: "pointer", fontFamily: "'Montserrat',sans-serif" };
  const IMG  = { width: "220px", flexShrink: 0, overflow: "hidden" };

  return (
    <section style={{ padding: "48px 20px", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Card 1 — Current Offers */}
        <div style={CARD}>
          <div style={TEXT}>
            <h3 style={H3}>Current Offers</h3>
            <p style={P}>Explore limited-time offers on Tesla vehicles.</p>
            <button style={BTN}>Learn More</button>
          </div>
          <div style={IMG}>
            <img
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=85"
              alt="Current Offers"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        {/* Card 2 — American Heroes */}
        <div style={CARD}>
          <div style={TEXT}>
            <h3 style={H3}>American Heroes</h3>
            <p style={P}>$500 off for military, first responders, healthcare, teachers and students.</p>
            <button style={BTN}>Learn More</button>
          </div>
          <div style={IMG}>
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85"
              alt="American Heroes"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section className="features">
      <div className="features-grid">
        <div className="feature-card">
          <img src={IMAGES.features} alt="Standard Features" />
          <div className="overlay" />
          <div className="info">
            <h3>Standard Features</h3>
            <p>Autopilot & premium connectivity included</p>
            <div className="btns">
              <button className="btn-accent" style={{ fontSize:12, padding:"8px 16px" }}>Order Now</button>
              <button className="btn-secondary" style={{ fontSize:12, padding:"8px 16px" }}>Learn More</button>
            </div>
          </div>
        </div>
        <div className="feature-card">
          <img src={IMAGES.fsdVision} alt="FSD" />
          <div className="overlay" />
          <div className="info">
            <h3>Full Self-Driving</h3>
            <p>Navigate on Autopilot</p>
            <div className="btns">
              <button className="btn-accent" style={{ fontSize:12, padding:"8px 16px" }}>Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



function Charging() {
  return (
    <section style={{ background: "#fff", padding: "0" }}>

      {/* Info bar */}
      <div style={{
        padding: "32px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "24px",
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
      }}>
        {/* Left: title + subtitle */}
        <div style={{ maxWidth: "480px" }}>
          <h2 style={{
            fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: "700",
            color: "#1a1d21", marginBottom: "8px",
            fontFamily: "'Montserrat',sans-serif",
          }}>Find Your Charge</h2>
          <p style={{
            fontSize: "14px", color: "#5c5e62", lineHeight: "1.6",
            fontFamily: "'Montserrat',sans-serif", margin: 0,
          }}>
            View the network of Tesla Superchargers and Destination Chargers available near you.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button style={{
              padding: "10px 22px", fontSize: "13px", fontWeight: "600",
              background: "#1a1d21", color: "#fff", border: "none",
              borderRadius: "4px", cursor: "pointer",
              fontFamily: "'Montserrat',sans-serif",
            }}>View Network</button>
            <button style={{
              padding: "10px 22px", fontSize: "13px", fontWeight: "500",
              background: "transparent", color: "#1a1d21",
              border: "1px solid transparent", borderRadius: "4px",
              cursor: "pointer", fontFamily: "'Montserrat',sans-serif",
            }}>Learn More</button>
          </div>
        </div>

        {/* Right: stats */}
        <div style={{ display: "flex", gap: "40px", flexShrink: 0 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: "700",
                color: "#1a1d21", fontFamily: "'Montserrat',sans-serif",
              }}>31,461</span>
              <span style={{
                width: "26px", height: "26px", background: "#e31937",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#5c5e62", margin: "4px 0 0", fontFamily: "'Montserrat',sans-serif" }}>Superchargers</p>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: "700",
                color: "#1a1d21", fontFamily: "'Montserrat',sans-serif",
              }}>412</span>
              <span style={{
                width: "26px", height: "26px", background: "#1a1d21",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/>
                </svg>
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#5c5e62", margin: "4px 0 0", fontFamily: "'Montserrat',sans-serif" }}>Destination<br/>Chargers</p>
          </div>
        </div>
      </div>

     
      
       
   

    </section>
  );
}

// ─── Energy ───────────────────────────────────────────────────────────────────
const ENERGY_CARDS = [
  { key:"solar",    title:"Solar Panels",  subtitle:"Power Your Home and Reduce Your Bill" },
  { key:"powerwall",title:"Powerwall",     subtitle:"Keep Your Lights On During Outages"   },
];

function Energy() {
  const [dot, setDot] = useState(0);

  return (
    <section className="energy">
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"64px 20px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
          {ENERGY_CARDS.map((card, i) => (
            <div key={i} className="energy-card">
              <img src={IMAGES[card.key]} alt={card.title} />
              <div className="overlay" />
              <div className="info">
                <h3>{card.title}</h3>
                <p>{card.subtitle}</p>
                <div className="btns">
                  <button className="btn-accent" style={{ fontSize:12, padding:"8px 16px" }}>Order Now</button>
                  <button className="btn-secondary" style={{ fontSize:12, padding:"8px 16px" }}>Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 dots */}
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"12px", padding:"20px 0 28px", background:"var(--bg)" }}>
        {[0,1,2,3].map(i => (
          <button
            key={i}
            onClick={() => setDot(i)}
            style={{
              width:"11px", height:"11px", borderRadius:"50%", border:"none",
              cursor:"pointer", transition:"background .3s", padding:0,
              background: i === dot ? "#1a1d21" : "rgba(92,94,98,0.32)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-note">¹ Price reflects monthly subscription, subject to terms and conditions.</p>
        <div className="footer-links">
          <span>Tesla © 2026</span>
          <a href="#">Privacy & Legal</a>
          <a href="#">Vehicle Recalls</a>
          <a href="#">Contact</a>
          <a href="#">News</a>
          <a href="#">Get Updates</a>
          <a href="#">Locations</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function TeslaClone() {
  useEffect(() => {
    if (!document.getElementById("tesla-styles")) {
      const tag = document.createElement("style");
      tag.id = "tesla-styles";
      tag.textContent = css;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <VehicleShowcase />
      <Offers />
      <Features />
      <Charging />
      <Energy />
      <Footer />
    </>
  );
}







