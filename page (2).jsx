'use client';

export default function LandingPage() {
  return (
    <>
      <style>{`
  :root{
    --navy: #0B1F3A;
    --navy-deep: #071427;
    --gold: #D4AF37;
    --gold-soft: #E8CD7A;
    --white: #FFFFFF;
    --gray-bg: #F5F6F8;
    --ivory: #FBF8F0;
    --ink-soft: rgba(11,31,58,0.66);
    --ink-faint: rgba(11,31,58,0.45);
    --ring-track: rgba(212,175,55,0.18);
  }
  *{ box-sizing: border-box; margin:0; padding:0; }
  html{ scroll-behavior: smooth; }
  body{
    font-family: 'Inter', sans-serif;
    color: var(--navy);
    background: var(--white);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  h1,h2,h3,.display{
    font-family: 'Fraunces', serif;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .mono{ font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.02em; }
  a{ color: inherit; text-decoration: none; }
  ul{ list-style: none; }
  img,svg{ display:block; max-width:100%; }
  .wrap{ max-width: 1180px; margin: 0 auto; padding: 0 24px; }
  section{ padding: 96px 0; }
  @media (max-width: 720px){ section{ padding: 64px 0; } }

  /* Reduced motion respect */
  @media (prefers-reduced-motion: reduce){
    *{ animation: none !important; transition: none !important; }
  }

  /* ---------- Nav ---------- */
  header{
    position: sticky; top:0; z-index: 50;
    background: rgba(255,255,255,0.86);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(11,31,58,0.08);
  }
  nav.wrap{
    display:flex; align-items:center; justify-content: space-between;
    padding-top: 18px; padding-bottom: 18px;
  }
  .logo{ display:flex; align-items:center; gap:10px; font-family:'Fraunces',serif; font-weight:700; font-size:1.25rem; }
  .logo .dot{
    width: 30px; height:30px; border-radius:50%;
    background: conic-gradient(var(--gold) 0deg 250deg, var(--ring-track) 250deg 360deg);
    display:flex; align-items:center; justify-content:center;
  }
  .logo .dot::after{
    content:''; width:20px; height:20px; border-radius:50%; background:var(--navy);
  }
  nav .links{ display:flex; gap: 32px; font-size: 0.95rem; font-weight:500; }
  nav .links a{ color: var(--ink-soft); transition: color .2s; }
  nav .links a:hover{ color: var(--navy); }
  nav .actions{ display:flex; gap:12px; align-items:center; }
  @media (max-width: 860px){ nav .links{ display:none; } }

  .btn{
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding: 13px 26px; border-radius: 999px; font-weight:600; font-size:0.95rem;
    cursor:pointer; border: 1px solid transparent; transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
  }
  .btn:focus-visible{ outline: 3px solid var(--gold-soft); outline-offset: 2px; }
  .btn-gold{ background: var(--gold); color: var(--navy-deep); }
  .btn-gold:hover{ transform: translateY(-2px); box-shadow: 0 10px 24px rgba(212,175,55,0.35); }
  .btn-navy{ background: var(--navy); color: var(--white); }
  .btn-navy:hover{ transform: translateY(-2px); box-shadow: 0 10px 24px rgba(11,31,58,0.28); }
  .btn-ghost{ background: transparent; color: var(--navy); border-color: rgba(11,31,58,0.18); }
  .btn-ghost:hover{ background: rgba(11,31,58,0.05); }
  .btn-sm{ padding: 9px 18px; font-size: 0.85rem; }

  /* ---------- Hero ---------- */
  .hero{
    background: var(--navy);
    color: var(--white);
    position: relative;
    overflow: hidden;
    padding: 84px 0 100px;
  }
  .hero::before{
    content:'';
    position:absolute; inset:0;
    background:
      radial-gradient(600px 400px at 85% -10%, rgba(212,175,55,0.16), transparent 60%),
      radial-gradient(500px 500px at -10% 110%, rgba(212,175,55,0.10), transparent 60%);
    pointer-events:none;
  }
  .hero .wrap{ display:grid; grid-template-columns: 1.05fr 0.85fr; gap: 56px; align-items:center; position:relative; }
  @media (max-width: 900px){ .hero .wrap{ grid-template-columns: 1fr; } }
  .eyebrow{
    display:inline-flex; align-items:center; gap:8px;
    font-family:'IBM Plex Mono',monospace; font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase;
    color: var(--gold-soft); border:1px solid rgba(212,175,55,0.35); padding:7px 14px; border-radius:999px;
    margin-bottom: 26px;
  }
  .eyebrow .pip{ width:6px; height:6px; border-radius:50%; background:var(--gold); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse{ 0%,100%{ opacity:1; } 50%{ opacity:0.35; } }
  .hero h1{
    font-size: clamp(2.4rem, 4.6vw, 3.65rem);
    line-height: 1.06;
    max-width: 620px;
  }
  .hero h1 em{ font-style: italic; color: var(--gold-soft); }
  .hero p.sub{
    margin-top: 22px; font-size: 1.12rem; color: rgba(255,255,255,0.72); max-width: 490px;
  }
  .hero .cta-row{ display:flex; gap:14px; margin-top: 36px; flex-wrap: wrap; }
  .hero .trust{ margin-top: 46px; display:flex; gap: 30px; flex-wrap:wrap; }
  .hero .trust div{ }
  .hero .trust .num{ font-family:'Fraunces',serif; font-size:1.5rem; font-weight:600; color:var(--gold-soft); }
  .hero .trust .lbl{ font-size:0.8rem; color: rgba(255,255,255,0.55); margin-top:2px; }

  /* Signature: the 60-second ring */
  .ring-stage{ display:flex; align-items:center; justify-content:center; position:relative; }
  .ring{
    --p: 78;
    width: 320px; height: 320px; border-radius:50%;
    position:relative;
    background: conic-gradient(var(--gold) calc(var(--p)*1%), rgba(255,255,255,0.10) 0);
    animation: sweep 3.4s cubic-bezier(.4,0,.2,1) 0.2s 1;
    display:flex; align-items:center; justify-content:center;
  }
  @keyframes sweep{ from{ --p: 0; } to{ --p: 78; } }
  .ring::before{
    content:''; position:absolute; inset:14px; border-radius:50%;
    background: var(--navy-deep);
    box-shadow: inset 0 0 0 1px rgba(212,175,55,0.25);
  }
  .ring-inner{
    position:relative; z-index:2; text-align:center; color:var(--white);
  }
  .ring-inner .playbtn{
    width: 62px; height:62px; border-radius:50%; background: var(--gold);
    display:flex; align-items:center; justify-content:center; margin: 0 auto 14px;
    box-shadow: 0 8px 26px rgba(212,175,55,0.4);
  }
  .ring-inner .playbtn svg{ margin-left:3px; }
  .ring-inner .timer{ font-family:'IBM Plex Mono',monospace; font-size:1.05rem; color: var(--gold-soft); }
  .ring-inner .cap{ font-size:0.78rem; color: rgba(255,255,255,0.55); margin-top:4px; }
  .ring-card{
    position:absolute; bottom: -8px; right: -6px; background: var(--white); color: var(--navy);
    border-radius: 16px; padding: 12px 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.28);
    display:flex; align-items:center; gap:10px; font-size:0.82rem; font-weight:600;
  }
  @media (max-width: 900px){ .ring{ width:260px; height:260px; margin-top: 20px;} }

  /* ---------- Stats ---------- */
  .stats{ background: var(--gray-bg); }
  .stats-grid{ display:grid; grid-template-columns: repeat(4,1fr); gap: 28px; }
  @media (max-width: 860px){ .stats-grid{ grid-template-columns: repeat(2,1fr); } }
  .stat{ text-align:center; }
  .stat .n{ font-family:'Fraunces',serif; font-weight:700; font-size: 2.4rem; color: var(--navy); }
  .stat .n span{ color: var(--gold); }
  .stat .l{ margin-top:6px; font-size:0.9rem; color: var(--ink-soft); }

  /* ---------- Section headers ---------- */
  .sec-head{ max-width: 620px; margin-bottom: 52px; }
  .sec-head .kicker{
    font-family:'IBM Plex Mono',monospace; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em;
    color: var(--gold); display:flex; align-items:center; gap:10px; margin-bottom:14px;
  }
  .sec-head .kicker::before{ content:''; width:26px; height:1px; background: var(--gold); }
  .sec-head h2{ font-size: clamp(1.7rem, 3vw, 2.3rem); }
  .sec-head p{ margin-top:14px; color: var(--ink-soft); font-size:1.02rem; }
  .sec-head.center{ margin-left:auto; margin-right:auto; text-align:center; }
  .sec-head.center .kicker{ justify-content:center; }
  .sec-head.center .kicker::before{ display:none; }

  /* ---------- How it works (ring-segment steps) ---------- */
  .how{ background: var(--white); }
  .how-grid{ display:grid; grid-template-columns: repeat(3,1fr); gap: 30px; }
  @media (max-width: 860px){ .how-grid{ grid-template-columns: 1fr; } }
  .how-card{
    border-radius: 20px; padding: 32px 28px; background: var(--ivory);
    border: 1px solid rgba(212,175,55,0.18); position:relative;
  }
  .how-arc{
    width:58px; height:58px; border-radius:50%; margin-bottom:22px;
    background: conic-gradient(var(--gold) var(--arc,33%), rgba(11,31,58,0.10) 0);
    display:flex; align-items:center; justify-content:center;
  }
  .how-arc::after{
    content: attr(data-n); font-family:'IBM Plex Mono',monospace; font-weight:500; font-size:0.85rem;
    width:44px; height:44px; border-radius:50%; background:var(--ivory); color:var(--navy);
    display:flex; align-items:center; justify-content:center;
  }
  .how-card h3{ font-size:1.18rem; margin-bottom: 10px; }
  .how-card p{ color: var(--ink-soft); font-size:0.95rem; }

  /* ---------- Featured cards (shared) ---------- */
  .grid-3{ display:grid; grid-template-columns: repeat(3,1fr); gap: 26px; }
  @media (max-width: 900px){ .grid-3{ grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px){ .grid-3{ grid-template-columns: 1fr; } }

  .talent-card{
    border-radius: 20px; overflow:hidden; background: var(--white);
    box-shadow: 0 4px 18px rgba(11,31,58,0.08); border: 1px solid rgba(11,31,58,0.06);
    transition: transform .22s ease, box-shadow .22s ease;
  }
  .talent-card:hover{ transform: translateY(-5px); box-shadow: 0 18px 34px rgba(11,31,58,0.14); }
  .talent-video{
    position:relative; aspect-ratio: 4/3; background: linear-gradient(135deg,#12294d,#0B1F3A);
    display:flex; align-items:center; justify-content:center;
  }
  .talent-video .avatar{
    width:74px; height:74px; border-radius:50%; background: rgba(255,255,255,0.12);
    display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-weight:600;
    color: var(--gold-soft); font-size:1.4rem; border:1px solid rgba(212,175,55,0.3);
  }
  .talent-video .badge{
    position:absolute; top:12px; left:12px; background: rgba(212,175,55,0.92); color:var(--navy-deep);
    font-size:0.68rem; font-weight:700; padding:4px 10px; border-radius:999px; letter-spacing:0.03em;
  }
  .talent-video .dur{
    position:absolute; bottom:12px; right:12px; background: rgba(7,20,39,0.65); color:var(--white);
    font-family:'IBM Plex Mono',monospace; font-size:0.72rem; padding:4px 9px; border-radius:8px;
  }
  .talent-video .playmini{
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s;
    background: rgba(7,20,39,0.35);
  }
  .talent-card:hover .playmini{ opacity:1; }
  .talent-body{ padding: 20px 22px 24px; }
  .talent-body h3{ font-size:1.08rem; font-family:'Fraunces',serif; font-weight:600; }
  .talent-body .role{ font-size:0.86rem; color: var(--ink-faint); margin-top:2px; }
  .talent-tags{ display:flex; gap:6px; flex-wrap:wrap; margin-top:14px; }
  .tag{ font-size:0.72rem; background: var(--gray-bg); color: var(--ink-soft); padding:5px 10px; border-radius:999px; font-weight:500; }
  .talent-foot{ display:flex; justify-content:space-between; align-items:center; margin-top:18px; }
  .loc{ font-size:0.8rem; color: var(--ink-faint); }

  .emp-card{
    border-radius: 18px; padding: 26px; background: var(--gray-bg);
    display:flex; flex-direction:column; gap:14px;
  }
  .emp-top{ display:flex; align-items:center; gap:14px; }
  .emp-logo{
    width:48px; height:48px; border-radius:12px; background:var(--navy); color:var(--gold-soft);
    display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-weight:700;
  }
  .emp-card h3{ font-size:1.02rem; }
  .emp-card .industry{ font-size:0.8rem; color: var(--ink-faint); }
  .emp-card p.desc{ font-size:0.88rem; color: var(--ink-soft); }
  .emp-stats{ display:flex; gap:18px; font-size:0.78rem; color: var(--ink-faint); font-family:'IBM Plex Mono',monospace; }

  /* ---------- Jobs ---------- */
  .jobs-list{ display:flex; flex-direction:column; gap:14px; }
  .job-row{
    display:flex; align-items:center; justify-content:space-between; gap:20px;
    padding: 22px 26px; border-radius: 16px; border:1px solid rgba(11,31,58,0.08);
    transition: border-color .2s, box-shadow .2s;
  }
  .job-row:hover{ border-color: rgba(212,175,55,0.4); box-shadow: 0 8px 22px rgba(11,31,58,0.06); }
  .job-left{ display:flex; align-items:center; gap:16px; }
  .job-icon{ width:44px; height:44px; border-radius:12px; background: var(--ivory); color:var(--gold); display:flex; align-items:center; justify-content:center; font-weight:700; font-family:'Fraunces',serif; flex-shrink:0; }
  .job-title{ font-weight:600; font-size:1rem; }
  .job-meta{ font-size:0.82rem; color: var(--ink-faint); margin-top:3px; }
  .job-right{ display:flex; align-items:center; gap:22px; flex-shrink:0; }
  .job-salary{ font-family:'IBM Plex Mono',monospace; font-size:0.85rem; color: var(--navy); }
  @media (max-width: 700px){ .job-row{ flex-direction:column; align-items:flex-start; } .job-right{ width:100%; justify-content:space-between; } }

  /* ---------- Testimonials ---------- */
  .testi{ background: var(--navy); color: var(--white); }
  .testi-grid{ display:grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  @media (max-width: 900px){ .testi-grid{ grid-template-columns: 1fr; } }
  .testi-card{
    background: rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.2);
    border-radius: 18px; padding: 28px; display:flex; flex-direction:column; gap:18px;
  }
  .testi-card .quote{ font-size:0.95rem; color: rgba(255,255,255,0.85); font-style:italic; font-family:'Fraunces',serif; }
  .testi-who{ display:flex; align-items:center; gap:12px; }
  .testi-avatar{ width:40px; height:40px; border-radius:50%; background: var(--gold); color:var(--navy-deep); display:flex; align-items:center; justify-content:center; font-weight:700; font-family:'Fraunces',serif; }
  .testi-name{ font-size:0.88rem; font-weight:600; }
  .testi-role{ font-size:0.76rem; color: rgba(255,255,255,0.5); }

  /* ---------- Pricing ---------- */
  .pricing-grid{ display:grid; grid-template-columns: repeat(3,1fr); gap: 26px; align-items: stretch; }
  @media (max-width: 900px){ .pricing-grid{ grid-template-columns: 1fr; } }
  .price-card{
    border-radius: 22px; padding: 34px 30px; background: var(--white);
    border: 1px solid rgba(11,31,58,0.10); display:flex; flex-direction:column; position:relative;
  }
  .price-card.pop{ background: var(--navy); color:var(--white); border-color: var(--navy); transform: scale(1.03); box-shadow: 0 20px 50px rgba(11,31,58,0.22); }
  .price-card .pop-tag{ position:absolute; top:-13px; right:28px; background:var(--gold); color:var(--navy-deep); font-size:0.7rem; font-weight:700; padding:5px 12px; border-radius:999px; }
  .price-tier{ font-family:'IBM Plex Mono',monospace; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color: var(--gold); }
  .price-card.pop .price-tier{ color: var(--gold-soft); }
  .price-amt{ font-family:'Fraunces',serif; font-size:2.5rem; font-weight:700; margin: 10px 0 4px; }
  .price-per{ font-size:0.85rem; opacity:0.6; margin-bottom:22px; }
  .price-feat{ display:flex; flex-direction:column; gap:12px; font-size:0.92rem; margin-bottom: 28px; flex:1; }
  .price-feat li{ display:flex; gap:10px; align-items:flex-start; }
  .price-feat li::before{ content:'✓'; color: var(--gold); font-weight:700; flex-shrink:0; }

  /* ---------- FAQ ---------- */
  .faq-list{ display:flex; flex-direction:column; gap:12px; max-width: 760px; margin:0 auto; }
  details{ border:1px solid rgba(11,31,58,0.1); border-radius:14px; padding: 6px 22px; background: var(--white); }
  details[open]{ border-color: rgba(212,175,55,0.45); }
  summary{ padding: 18px 0; cursor:pointer; font-weight:600; list-style:none; display:flex; justify-content:space-between; align-items:center; }
  summary::-webkit-details-marker{ display:none; }
  summary::after{ content:'+'; font-size:1.3rem; color: var(--gold); font-weight:400; transition: transform .2s; }
  details[open] summary::after{ transform: rotate(45deg); }
  details p{ padding-bottom: 20px; color: var(--ink-soft); font-size:0.94rem; max-width: 640px; }

  /* ---------- Newsletter ---------- */
  .news{ background: var(--ivory); }
  .news-box{
    max-width: 720px; margin:0 auto; text-align:center;
  }
  .news-form{ display:flex; gap:10px; margin-top:26px; max-width: 460px; margin-left:auto; margin-right:auto; }
  .news-form input{
    flex:1; padding: 14px 18px; border-radius: 999px; border:1px solid rgba(11,31,58,0.15);
    font-family:'Inter',sans-serif; font-size:0.92rem; background:var(--white);
  }
  .news-form input:focus-visible{ outline: 3px solid var(--gold-soft); outline-offset:1px; }
  @media (max-width: 520px){ .news-form{ flex-direction:column; } }

  /* ---------- Footer ---------- */
  footer{ background: var(--navy-deep); color: rgba(255,255,255,0.65); padding: 64px 0 32px; }
  .foot-grid{ display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr; gap: 36px; }
  @media (max-width: 860px){ .foot-grid{ grid-template-columns: repeat(2,1fr); } }
  .foot-grid h4{ color: var(--white); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:16px; font-family:'IBM Plex Mono',monospace; font-weight:500; }
  .foot-grid ul{ display:flex; flex-direction:column; gap:10px; font-size:0.88rem; }
  .foot-grid a:hover{ color: var(--gold-soft); }
  .foot-bottom{ margin-top: 50px; padding-top: 28px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:0.8rem; }

  ::selection{ background: var(--gold); color: var(--navy-deep); }
      `}</style>
<header>
  <nav className="wrap">
    <div className="logo"><span className="dot"></span> Zenithire</div>
    <div className="links">
      <a href="#how">How it works</a>
      <a href="#talent">Find Talent</a>
      <a href="#jobs">Job Openings</a>
      <a href="#pricing">Pricing</a>
      <a href="#faq">FAQ</a>
    </div>
    <div className="actions">
      <a href="/auth" className="btn btn-ghost btn-sm">Log in</a>
      <a href="/auth" className="btn btn-gold btn-sm">Get Hired</a>
    </div>
  </nav>
</header>

{/* HERO */}
<section className="hero">
  <div className="wrap">
    <div>
      <div className="eyebrow"><span className="pip"></span> Video-first hiring</div>
      <h1>Your career begins with <em>one minute.</em></h1>
      <p className="sub">Skip the wall of text. Record a 60-second introduction, let employers see who you actually are, and get invited to interview by people who already like what they watched.</p>
      <div className="cta-row">
        <a href="/auth" className="btn btn-gold">Find Talent</a>
        <a href="/auth" className="btn btn-navy" style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)'}}>Get Hired</a>
      </div>
      <div className="trust">
        <div><div className="num mono">42,600+</div><div className="lbl">candidate videos</div></div>
        <div><div className="num mono">3,150</div><div className="lbl">hiring companies</div></div>
        <div><div className="num mono">9.4 days</div><div className="lbl">avg. time to interview</div></div>
      </div>
    </div>
    <div className="ring-stage">
      <div className="ring">
        <div className="ring-inner">
          <div className="playbtn">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M1 1.5V18.5L17 10L1 1.5Z" fill="#0B1F3A"/></svg>
          </div>
          <div className="timer">00:47 / 01:00</div>
          <div className="cap">recording your intro</div>
        </div>
      </div>
      <div className="ring-card">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        Profile 92% complete
      </div>
    </div>
  </div>
</section>

{/* STATS */}
<section className="stats">
  <div className="wrap stats-grid">
    <div className="stat"><div className="n">18<span>k</span></div><div className="l">active job seekers</div></div>
    <div className="stat"><div className="n"><span>60</span>s</div><div className="l">max. video length</div></div>
    <div className="stat"><div className="n">3.1<span>k</span></div><div className="l">verified employers</div></div>
    <div className="stat"><div className="n">71<span>%</span></div><div className="l">reply within 48 hrs</div></div>
  </div>
</section>

{/* HOW IT WORKS */}
<section className="how" id="how">
  <div className="wrap">
    <div className="sec-head">
      <div className="kicker">The sequence</div>
      <h2>Sixty seconds, three steps.</h2>
      <p>It's a timed process by design — the same discipline that makes the video work also makes the platform fast to use.</p>
    </div>
    <div className="how-grid">
      <div className="how-card">
        <div className="how-arc" data-n="01" style={{'--arc': '33%'}}></div>
        <h3>Build your profile</h3>
        <p>Add your CV, education, work history, certifications and skills. Set your industries, locations and expected salary.</p>
      </div>
      <div className="how-card">
        <div className="how-arc" data-n="02" style={{'--arc': '66%'}}></div>
        <h3>Record your minute</h3>
        <p>Film from your phone or webcam, or upload a clip. We trim it to 60 seconds, compress it, and generate a thumbnail automatically.</p>
      </div>
      <div className="how-card">
        <div className="how-arc" data-n="03" style={{'--arc': '100%'}}></div>
        <h3>Get invited</h3>
        <p>Employers watch before they reach out. When they want to talk, they send an interview invitation — you accept or decline before any contact details are shared.</p>
      </div>
    </div>
  </div>
</section>

{/* FEATURED JOB SEEKERS */}
<section id="talent" style={{background: 'var(--gray-bg)'}}>
  <div className="wrap">
    <div className="sec-head">
      <div className="kicker">Featured job seekers</div>
      <h2>People, not just PDFs.</h2>
      <p>A sample of candidates currently open to opportunities on Zenithire.</p>
    </div>
    <div className="grid-3">
      <div className="talent-card">
        <div className="talent-video">
          <span className="badge">FEATURED</span>
          <div className="avatar">AO</div>
          <span className="dur">0:58</span>
          <div className="playmini"><svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="17" fill="white" opacity="0.9"/><path d="M13 10L25 17L13 24V10Z" fill="#0B1F3A"/></svg></div>
        </div>
        <div className="talent-body">
          <h3>Amaka O.</h3>
          <div className="role">Financial Analyst · 5 yrs experience</div>
          <div className="talent-tags"><span className="tag">Excel</span><span className="tag">Power BI</span><span className="tag">FP&A</span></div>
          <div className="talent-foot"><span className="loc">Lagos, Nigeria</span><a href="#" className="btn btn-ghost btn-sm">View</a></div>
        </div>
      </div>
      <div className="talent-card">
        <div className="talent-video">
          <div className="avatar">TE</div>
          <span className="dur">0:52</span>
          <div className="playmini"><svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="17" fill="white" opacity="0.9"/><path d="M13 10L25 17L13 24V10Z" fill="#0B1F3A"/></svg></div>
        </div>
        <div className="talent-body">
          <h3>Tunde E.</h3>
          <div className="role">Product Designer · 3 yrs experience</div>
          <div className="talent-tags"><span className="tag">Figma</span><span className="tag">UX Research</span></div>
          <div className="talent-foot"><span className="loc">Remote</span><a href="#" className="btn btn-ghost btn-sm">View</a></div>
        </div>
      </div>
      <div className="talent-card">
        <div className="talent-video">
          <span className="badge">FEATURED</span>
          <div className="avatar">CN</div>
          <span className="dur">1:00</span>
          <div className="playmini"><svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="17" fill="white" opacity="0.9"/><path d="M13 10L25 17L13 24V10Z" fill="#0B1F3A"/></svg></div>
        </div>
        <div className="talent-body">
          <h3>Chidinma N.</h3>
          <div className="role">Backend Engineer · 6 yrs experience</div>
          <div className="talent-tags"><span className="tag">Node.js</span><span className="tag">PostgreSQL</span><span className="tag">AWS</span></div>
          <div className="talent-foot"><span className="loc">Abuja, Nigeria</span><a href="#" className="btn btn-ghost btn-sm">View</a></div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* FEATURED EMPLOYERS */}
<section>
  <div className="wrap">
    <div className="sec-head">
      <div className="kicker">Featured employers</div>
      <h2>Companies hiring on Zenithire.</h2>
      <p>Verified employers actively reviewing candidate videos this month.</p>
    </div>
    <div className="grid-3">
      <div className="emp-card">
        <div className="emp-top"><div className="emp-logo">NB</div><div><h3>Northbridge Capital</h3><div className="industry">Financial Services</div></div></div>
        <p className="desc">Mid-size investment firm hiring analysts and operations staff across Lagos and Abuja.</p>
        <div className="emp-stats"><span>14 open roles</span><span>Responds in ~2 days</span></div>
      </div>
      <div className="emp-card">
        <div className="emp-top"><div className="emp-logo">PV</div><div><h3>Pivot Logistics</h3><div className="industry">Supply Chain</div></div></div>
        <p className="desc">Regional logistics network scaling its planning and warehouse operations teams.</p>
        <div className="emp-stats"><span>9 open roles</span><span>Responds in ~1 day</span></div>
      </div>
      <div className="emp-card">
        <div className="emp-top"><div className="emp-logo">AR</div><div><h3>Arclight Studio</h3><div className="industry">Product & Design</div></div></div>
        <p className="desc">Remote-first product studio building tools for African fintechs.</p>
        <div className="emp-stats"><span>6 open roles</span><span>Responds in ~3 days</span></div>
      </div>
    </div>
  </div>
</section>

{/* LATEST JOB OPENINGS */}
<section id="jobs" style={{background: 'var(--gray-bg)'}}>
  <div className="wrap">
    <div className="sec-head">
      <div className="kicker">Latest openings</div>
      <h2>Recently posted roles.</h2>
    </div>
    <div className="jobs-list">
      <div className="job-row">
        <div className="job-left">
          <div className="job-icon">N</div>
          <div><div className="job-title">Commercial Analyst</div><div className="job-meta">Northbridge Capital · Lagos, Nigeria · Full-time</div></div>
        </div>
        <div className="job-right"><span className="job-salary">₦450k–₦650k /mo</span><a href="#" className="btn btn-navy btn-sm">Apply</a></div>
      </div>
      <div className="job-row">
        <div className="job-left">
          <div className="job-icon">P</div>
          <div><div className="job-title">Warehouse Operations Lead</div><div className="job-meta">Pivot Logistics · Port Harcourt, Nigeria · Full-time</div></div>
        </div>
        <div className="job-right"><span className="job-salary">₦380k–₦500k /mo</span><a href="#" className="btn btn-navy btn-sm">Apply</a></div>
      </div>
      <div className="job-row">
        <div className="job-left">
          <div className="job-icon">A</div>
          <div><div className="job-title">Senior Product Designer</div><div className="job-meta">Arclight Studio · Remote · Contract</div></div>
        </div>
        <div className="job-right"><span className="job-salary">$2,200–$3,000 /mo</span><a href="#" className="btn btn-navy btn-sm">Apply</a></div>
      </div>
      <div className="job-row">
        <div className="job-left">
          <div className="job-icon">N</div>
          <div><div className="job-title">Backend Engineer (Node.js)</div><div className="job-meta">Northbridge Capital · Abuja, Nigeria · Full-time</div></div>
        </div>
        <div className="job-right"><span className="job-salary">₦600k–₦900k /mo</span><a href="#" className="btn btn-navy btn-sm">Apply</a></div>
      </div>
    </div>
  </div>
</section>

{/* TESTIMONIALS */}
<section className="testi">
  <div className="wrap">
    <div className="sec-head center" style={{color: 'white'}}>
      <div className="kicker">What people say</div>
      <h2>Trusted by candidates and hiring teams.</h2>
    </div>
    <div className="testi-grid">
      <div className="testi-card">
        <div className="quote">"I sent forty applications with a CV and heard nothing back. I recorded one video on Zenithire and had two interview invitations by the following week."</div>
        <div className="testi-who"><div className="testi-avatar">A</div><div><div className="testi-name">Amaka O.</div><div className="testi-role">Financial Analyst</div></div></div>
      </div>
      <div className="testi-card">
        <div className="quote">"We cut our first-round screening time by more than half. Watching a candidate speak for sixty seconds tells us more than a page of bullet points ever did."</div>
        <div className="testi-who"><div className="testi-avatar">S</div><div><div className="testi-name">Sade K.</div><div className="testi-role">Head of Talent, Northbridge Capital</div></div></div>
      </div>
      <div className="testi-card">
        <div className="quote">"The invite-to-interview flow means I'm never contacted out of nowhere. I get to see who's interested before I share anything personal."</div>
        <div className="testi-who"><div className="testi-avatar">T</div><div><div className="testi-name">Tunde E.</div><div className="testi-role">Product Designer</div></div></div>
      </div>
    </div>
  </div>
</section>

{/* PRICING */}
<section id="pricing">
  <div className="wrap">
    <div className="sec-head center">
      <div className="kicker">Pricing</div>
      <h2>Plans for both sides of the hire.</h2>
      <p>Start free. Upgrade when visibility starts to matter.</p>
    </div>
    <div className="pricing-grid">
      <div className="price-card">
        <div className="price-tier">Candidate — Free</div>
        <div className="price-amt">₦0</div>
        <div className="price-per">forever</div>
        <ul className="price-feat">
          <li>Full profile with CV and video</li>
          <li>Apply to unlimited jobs</li>
          <li>Standard search ranking</li>
          <li>Interview invitations & chat</li>
        </ul>
        <a href="#" className="btn btn-ghost">Get started</a>
      </div>
      <div className="price-card pop">
        <span className="pop-tag">Most popular</span>
        <div className="price-tier">Candidate — Premium</div>
        <div className="price-amt">₦3,500</div>
        <div className="price-per">per month</div>
        <ul className="price-feat">
          <li>Featured profile placement</li>
          <li>Priority search ranking</li>
          <li>Full profile view analytics</li>
          <li>Featured badge on your card</li>
        </ul>
        <a href="#" className="btn btn-gold">Upgrade</a>
      </div>
      <div className="price-card">
        <div className="price-tier">Employer — Premium</div>
        <div className="price-amt">₦45,000</div>
        <div className="price-per">per month</div>
        <ul className="price-feat">
          <li>Unlimited candidate searches</li>
          <li>Unlimited CV downloads</li>
          <li>Advanced filters & analytics</li>
          <li>Featured company placement</li>
        </ul>
        <a href="#" className="btn btn-ghost">Talk to sales</a>
      </div>
    </div>
  </div>
</section>

{/* FAQ */}
<section id="faq" style={{background: 'var(--gray-bg)'}}>
  <div className="wrap">
    <div className="sec-head center">
      <div className="kicker">Questions</div>
      <h2>Before you get started.</h2>
    </div>
    <div className="faq-list">
      <details open>
        <summary>Does an employer get my phone number or email right away?</summary>
        <p>No. Employers can watch your video and send an interview invitation, but your contact details stay private until you accept.</p>
      </details>
      <details>
        <summary>What if my video is longer than 60 seconds?</summary>
        <p>You can trim it in the recorder before publishing, or upload a longer file and we'll help you cut it down during upload.</p>
      </details>
      <details>
        <summary>Can I update my video or profile later?</summary>
        <p>Yes — replace your video, CV, or any profile detail at any time. Employers always see your most recent version.</p>
      </details>
      <details>
        <summary>How does Zenithire verify companies?</summary>
        <p>Employers submit registration details during signup, and our team reviews and approves each company before job posts go live.</p>
      </details>
    </div>
  </div>
</section>

{/* NEWSLETTER */}
<section className="news">
  <div className="wrap news-box">
    <div className="sec-head center" style={{marginBottom: '0'}}>
      <div className="kicker">Stay in the loop</div>
      <h2>Hiring tips and new roles, monthly.</h2>
    </div>
    <form className="news-form" onSubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="you@example.com" required />
      <button className="btn btn-navy" type="submit">Subscribe</button>
    </form>
  </div>
</section>

{/* FOOTER */}
<footer>
  <div className="wrap">
    <div className="foot-grid">
      <div>
        <div className="logo" style={{color: 'white'}}><span className="dot"></span> Zenithire</div>
        <p style={{marginTop: '16px', fontSize: '0.88rem', maxWidth: '260px'}}>The video-first recruitment platform. Your career begins with one minute.</p>
      </div>
      <div>
        <h4>Job Seekers</h4>
        <ul><li><a href="#">Create profile</a></li><li><a href="#">Record video</a></li><li><a href="#">Browse jobs</a></li><li><a href="#">Pricing</a></li></ul>
      </div>
      <div>
        <h4>Employers</h4>
        <ul><li><a href="#">Post a job</a></li><li><a href="#">Search candidates</a></li><li><a href="#">Pricing</a></li><li><a href="#">Company verification</a></li></ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul><li><a href="#">About</a></li><li><a href="#">Blog</a></li><li><a href="#">Contact</a></li><li><a href="#">FAQ</a></li></ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Cookie Policy</a></li><li><a href="#">Report Abuse</a></li></ul>
      </div>
    </div>
    <div className="foot-bottom">
      <span>© 2026 Zenithire. All rights reserved.</span>
      <span>Made for candidates and employers who value one honest minute.</span>
    </div>
  </div>
</footer>

    </>
  );
}
