/* =====================================================================
   Anthropic COE Portal — standalone build (single-file, no npm/build).
   React + Bootstrap come from a CDN; JSX is compiled in the browser by
   Babel; all content is read from <script type="text/xml"> blocks that
   are embedded inline in the page, so there is no fetch() (works on
   file:// — just double-click the HTML).
   ===================================================================== */
const { useState, useMemo, useEffect, useRef } = React;

/* ---- XML helpers (read inline <script type="text/xml"> blocks) ------- */
function loadInlineXml(id) {
  const el = document.getElementById(id);
  const doc = new DOMParser().parseFromString(el.textContent, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error('Malformed XML in ' + id);
  return doc;
}
const text = (el, tag) => {
  if (!el) return '';
  const f = tag ? el.querySelector(tag) : el;
  return f ? f.textContent.trim() : '';
};
const attr = (el, name, fb = '') => (el ? el.getAttribute(name) ?? fb : fb);
const mapChildren = (root, tag, fn) => Array.from(root.querySelectorAll(tag)).map(fn);

/* ---- Shared UI + hooks ---------------------------------------------- */
function SectionHeader({ eyebrow, title, sub, center }) {
  return (
    <div className={'mb-5 ' + (center ? 'text-center mx-auto' : '')} style={center ? { maxWidth: 720 } : undefined}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" style={center ? { marginInline: 'auto' } : undefined}>{title}</h2>
      {sub && <p className="section-sub" style={center ? { marginInline: 'auto' } : undefined}>{sub}</p>}
    </div>
  );
}
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}
function useScrolledPast(threshold = 24) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return past;
}

/* ---- Parse all configs once (synchronous, inline) -------------------- */
function parseSite(doc) {
  const brandEl = doc.querySelector('brand');
  const themeEl = doc.querySelector('theme');
  const heroEl = doc.querySelector('hero');
  const titleEl = heroEl.querySelector('title');
  const featuresEl = doc.querySelector('features');
  const footerEl = doc.querySelector('footer');
  const cta = (sel) => ({ label: attr(heroEl.querySelector(sel), 'label'), href: attr(heroEl.querySelector(sel), 'href') });
  return {
    brand: { organization: text(brandEl, 'organization'), product: text(brandEl, 'product'), tagline: text(brandEl, 'tagline') },
    theme: {
      primary: text(themeEl, 'primary'), primaryDark: text(themeEl, 'primaryDark'), ink: text(themeEl, 'ink'),
      cream: text(themeEl, 'cream'), paper: text(themeEl, 'paper'), accent: text(themeEl, 'accent'), accentSoft: text(themeEl, 'accentSoft'),
    },
    nav: mapChildren(doc.querySelector('nav'), 'item', (i) => ({ href: attr(i, 'href'), label: attr(i, 'label') })),
    hero: {
      eyebrow: text(heroEl, 'eyebrow'),
      titleLead: titleEl.textContent.trim(),
      titleHighlight: attr(titleEl, 'highlight'),
      subtitle: text(heroEl, 'subtitle'),
      primaryCta: cta('primaryCta'),
      secondaryCta: cta('secondaryCta'),
      stats: mapChildren(heroEl, 'stat', (s) => ({ value: attr(s, 'value'), suffix: attr(s, 'suffix'), label: attr(s, 'label') })),
    },
    features: {
      heading: text(featuresEl, 'heading'),
      subheading: text(featuresEl, 'subheading'),
      items: mapChildren(featuresEl, 'feature', (f) => ({ icon: attr(f, 'icon'), title: attr(f, 'title'), body: f.textContent.trim() })),
    },
    footer: {
      about: text(footerEl, 'about'),
      columns: mapChildren(footerEl, 'column', (c) => ({ title: attr(c, 'title'), links: mapChildren(c, 'link', (l) => ({ href: attr(l, 'href'), label: attr(l, 'label') })) })),
      legal: text(footerEl, 'legal'),
    },
  };
}
const SITE = parseSite(loadInlineXml('cfg-site'));
const TRAINING = (function (doc) {
  return {
    heading: text(doc, 'heading'), subheading: text(doc, 'subheading'),
    tracks: mapChildren(doc, 'track', (t) => ({
      id: attr(t, 'id'), level: attr(t, 'level'), icon: attr(t, 'icon'), duration: attr(t, 'duration'),
      name: text(t, 'name'), summary: text(t, 'summary'),
      courses: mapChildren(t, 'course', (c) => ({ title: attr(c, 'title'), provider: attr(c, 'provider'), minutes: attr(c, 'minutes'), href: attr(c, 'href') })),
    })),
  };
})(loadInlineXml('cfg-training'));
const CERTS = (function (doc) {
  return {
    heading: text(doc, 'heading'), subheading: text(doc, 'subheading'),
    certs: mapChildren(doc, 'cert', (c) => ({
      id: attr(c, 'id'), tier: attr(c, 'tier'), icon: attr(c, 'icon'), duration: attr(c, 'duration'), badge: attr(c, 'badge', '#CC785C'),
      name: text(c, 'name'), focus: text(c, 'focus'), description: text(c, 'description'),
      requirements: mapChildren(c, 'requirement', (r) => r.textContent.trim()),
      cta: { label: attr(c.querySelector('cta'), 'label'), href: attr(c.querySelector('cta'), 'href') },
    })),
  };
})(loadInlineXml('cfg-certifications'));
const UPDATES = (function (doc) {
  return {
    heading: text(doc, 'heading'), subheading: text(doc, 'subheading'),
    feeds: mapChildren(doc, 'feed', (f) => ({ id: attr(f, 'id'), label: attr(f, 'label') })),
    items: mapChildren(doc, 'item', (it) => ({
      feed: attr(it, 'feed'), date: attr(it, 'date'), tag: attr(it, 'tag'), featured: attr(it, 'featured') === 'true',
      title: text(it, 'title'), summary: text(it, 'summary'),
      link: { href: attr(it.querySelector('link'), 'href'), label: attr(it.querySelector('link'), 'label') },
    })),
  };
})(loadInlineXml('cfg-updates'));
const PRACTICES = (function (doc) {
  return {
    heading: text(doc, 'heading'), subheading: text(doc, 'subheading'),
    categories: mapChildren(doc, 'category', (c) => ({
      id: attr(c, 'id'), name: attr(c, 'name'), icon: attr(c, 'icon'),
      practices: mapChildren(c, 'practice', (p) => ({ title: attr(p, 'title'), body: p.textContent.trim() })),
    })),
  };
})(loadInlineXml('cfg-bestpractices'));
const OFFERINGS = (function (doc) {
  return {
    heading: text(doc, 'heading'), subheading: text(doc, 'subheading'),
    solutions: mapChildren(doc, 'solution', (s) => ({ id: attr(s, 'id'), icon: attr(s, 'icon'), outcome: attr(s, 'outcome'), name: text(s, 'name'), description: text(s, 'description'), industry: text(s, 'industry') })),
    steps: mapChildren(doc, 'step', (s) => ({ number: attr(s, 'number'), title: attr(s, 'title'), body: s.textContent.trim() })),
    contact: { text: text(doc.querySelector('contact'), 'text'), label: text(doc.querySelector('contact'), 'ctaLabel'), href: text(doc.querySelector('contact'), 'ctaHref') },
  };
})(loadInlineXml('cfg-offerings'));

/* ---- Components ------------------------------------------------------ */
function NavBar({ brand, nav }) {
  const scrolled = useScrolledPast(20);
  const [open, setOpen] = useState(false);
  return (
    <nav className={'coe-nav navbar navbar-expand-lg fixed-top py-2 ' + (scrolled ? 'scrolled' : '')}>
      <div className="container">
        <a className="coe-logo navbar-brand" href="#home" onClick={() => setOpen(false)}>
          <span className="coe-logo-mark">A</span>
          <span>{brand.product}<small>{brand.organization} · Center of Excellence</small></span>
        </a>
        <button className="navbar-toggler border-0" type="button" aria-label="Toggle navigation" onClick={() => setOpen((o) => !o)}>
          <i className={'bi ' + (open ? 'bi-x-lg' : 'bi-list') + ' fs-4'} />
        </button>
        <div className={'collapse navbar-collapse ' + (open ? 'show' : '')}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {nav.map((item) => (
              <li className="nav-item" key={item.href}><a className="nav-link" href={item.href} onClick={() => setOpen(false)}>{item.label}</a></li>
            ))}
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0"><a className="btn btn-coe btn-coe-primary w-100" href="#offerings" onClick={() => setOpen(false)}>Get started</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
function Hero({ hero }) {
  const ref = useReveal();
  return (
    <header id="home" className="hero" ref={ref}>
      <div className="hero-orb" aria-hidden="true" />
      <div className="container position-relative">
        <div className="row"><div className="col-lg-10 col-xl-9">
          <span className="eyebrow reveal">{hero.eyebrow}</span>
          <h1 className="hero-title reveal" style={{ transitionDelay: '0.05s' }}>{hero.titleLead} <span className="grad">{hero.titleHighlight}</span></h1>
          <p className="hero-sub reveal" style={{ transitionDelay: '0.1s' }}>{hero.subtitle}</p>
          <div className="d-flex flex-wrap gap-3 mt-4 reveal" style={{ transitionDelay: '0.15s' }}>
            <a className="btn btn-coe btn-coe-primary" href={hero.primaryCta.href}><i className="bi bi-mortarboard-fill me-2" />{hero.primaryCta.label}</a>
            <a className="btn btn-coe btn-coe-ghost" href={hero.secondaryCta.href}>{hero.secondaryCta.label}<i className="bi bi-arrow-right ms-2" /></a>
          </div>
        </div></div>
        <div className="hero-stats reveal" style={{ transitionDelay: '0.2s' }}>
          {hero.stats.map((s) => (<div className="hero-stat" key={s.label}><div className="num">{s.value}{s.suffix}</div><div className="lbl">{s.label}</div></div>))}
        </div>
      </div>
    </header>
  );
}
function Features({ features }) {
  const ref = useReveal();
  return (
    <section id="features" className="section" ref={ref}><div className="container">
      <SectionHeader eyebrow="Capabilities" title={features.heading} sub={features.subheading} center />
      <div className="row g-4">{features.items.map((f, i) => (
        <div className="col-md-6 col-lg-4" key={f.title}><div className="coe-card reveal" style={{ transitionDelay: (i * 0.05) + 's' }}>
          <div className="coe-icon"><i className={'bi ' + f.icon} /></div><h4>{f.title}</h4><p>{f.body}</p>
        </div></div>
      ))}</div>
    </div></section>
  );
}
function Training({ data }) {
  const ref = useReveal();
  return (
    <section id="training" className="section section-cream" ref={ref}><div className="container">
      <SectionHeader eyebrow="Training" title={data.heading} sub={data.subheading} center />
      <div className="row g-4">{data.tracks.map((track, i) => (
        <div className="col-md-6" key={track.id}><div className="coe-card track-card reveal" style={{ transitionDelay: (i * 0.05) + 's' }}>
          <div className="track-head"><div className="coe-icon mb-0"><i className={'bi ' + track.icon} /></div>
            <div><h4 className="mb-0">{track.name}</h4><small className="text-muted">{track.summary}</small></div></div>
          <div className="track-meta">
            <span className="pill">{track.level}</span>
            <span className="pill duration"><i className="bi bi-clock me-1" />{track.duration}</span>
            <span className="pill duration">{track.courses.length} courses</span>
          </div>
          <div className="mt-1">{track.courses.map((c) => (
            <a className="course-link" key={c.title} href={c.href} target="_blank" rel="noreferrer">
              <span><span className="d-block fw-medium">{c.title}</span><span className="meta">{c.provider} · {c.minutes} min</span></span>
              <i className="bi bi-box-arrow-up-right arrow" />
            </a>
          ))}</div>
        </div></div>
      ))}</div>
    </div></section>
  );
}
function Certifications({ data }) {
  const ref = useReveal();
  return (
    <section id="certifications" className="section" ref={ref}><div className="container">
      <SectionHeader eyebrow="Certifications" title={data.heading} sub={data.subheading} center />
      <div className="cert-path-line mb-4 d-none d-lg-block" />
      <div className="row g-4">{data.certs.map((c, i) => (
        <div className="col-md-6 col-xl-3" key={c.id}><div className="coe-card cert-card reveal" style={{ transitionDelay: (i * 0.05) + 's' }}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="cert-badge" style={{ background: c.badge }}><i className={'bi ' + c.icon} /></div>
            <div><div className="cert-tier">{c.tier} · {c.duration}</div><h4 className="mb-0" style={{ fontSize: '1.08rem' }}>{c.name}</h4></div>
          </div>
          <span className="pill mb-2 d-inline-block">{c.focus}</span>
          <p className="text-muted" style={{ fontSize: '0.92rem' }}>{c.description}</p>
          <ul className="cert-req">{c.requirements.map((r) => (<li key={r}><i className="bi bi-check-circle-fill" />{r}</li>))}</ul>
          <a className="btn btn-coe btn-coe-ghost w-100 mt-3" href={c.cta.href} target="_blank" rel="noreferrer">{c.cta.label}</a>
        </div></div>
      ))}</div>
    </div></section>
  );
}
function Updates({ data }) {
  const ref = useReveal();
  const [active, setActive] = useState('all');
  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const items = useMemo(() => {
    const sorted = [...data.items].sort((a, b) => b.date.localeCompare(a.date));
    return active === 'all' ? sorted : sorted.filter((i) => i.feed === active);
  }, [active]);
  return (
    <section id="updates" className="section section-cream" ref={ref}><div className="container">
      <SectionHeader eyebrow="Latest Updates & Feeds" title={data.heading} sub={data.subheading} />
      <div className="feed-filter">
        <button className={'feed-chip ' + (active === 'all' ? 'active' : '')} onClick={() => setActive('all')}><i className="bi bi-rss me-1" />All</button>
        {data.feeds.map((f) => (<button key={f.id} className={'feed-chip ' + (active === f.id ? 'active' : '')} onClick={() => setActive(f.id)}>{f.label}</button>))}
      </div>
      <div className="row g-4">{items.map((it, i) => (
        <div className={it.featured ? 'col-lg-8' : 'col-md-6 col-lg-4'} key={it.title}>
          <article className={'coe-card update-card ' + (it.featured ? 'featured ' : '') + 'reveal'} style={{ transitionDelay: (i * 0.04) + 's' }}>
            <div className="d-flex justify-content-between align-items-center mb-3"><span className="update-tag">{it.tag}</span><span className="update-date">{fmt(it.date)}</span></div>
            <h4 style={{ fontSize: it.featured ? '1.5rem' : '1.12rem' }}>{it.title}</h4>
            <p className="flex-grow-1">{it.summary}</p>
            <a className="fw-semibold mt-2 d-inline-flex align-items-center gap-1" style={{ color: it.featured ? '#f3c4b1' : 'var(--coe-primary-dark)' }}
               href={it.link.href} target={it.link.href.startsWith('#') ? undefined : '_blank'} rel="noreferrer">{it.link.label} <i className="bi bi-arrow-right" /></a>
          </article>
        </div>
      ))}</div>
    </div></section>
  );
}
function BestPractices({ data }) {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  return (
    <section id="practices" className="section" ref={ref}><div className="container">
      <SectionHeader eyebrow="Best Practices" title={data.heading} sub={data.subheading} center />
      <div className="practice-tabs justify-content-center">{data.categories.map((c, i) => (
        <button key={c.id} className={'practice-tab ' + (active === i ? 'active' : '')} onClick={() => setActive(i)}><i className={'bi ' + c.icon} /> {c.name}</button>
      ))}</div>
      <div className="row g-4">{data.categories[active].practices.map((p, i) => (
        <div className="col-md-6" key={p.title}><div className="practice-item reveal in" style={{ transitionDelay: (i * 0.04) + 's' }}>
          <h5><i className="bi bi-check2-circle me-2" style={{ color: 'var(--coe-primary)' }} />{p.title}</h5><p>{p.body}</p>
        </div></div>
      ))}</div>
    </div></section>
  );
}
function Offerings({ data }) {
  const ref = useReveal();
  return (
    <section id="offerings" ref={ref}>
      <div className="section"><div className="container">
        <SectionHeader eyebrow="For Customers" title={data.heading} sub={data.subheading} center />
        <div className="row g-4">{data.solutions.map((s, i) => (
          <div className="col-md-6 col-lg-4" key={s.id}><div className="coe-card offering-card reveal" style={{ transitionDelay: (i * 0.05) + 's' }}>
            <div className="coe-icon"><i className={'bi ' + s.icon} /></div><h4>{s.name}</h4><p>{s.description}</p>
            <div className="outcome"><i className="bi bi-graph-up-arrow" />{s.outcome}</div>
            <div className="industry"><i className="bi bi-buildings me-1" />{s.industry}</div>
          </div></div>
        ))}</div>
      </div></div>
      <div className="section section-ink"><div className="container">
        <SectionHeader eyebrow="Engagement Model" title="From idea to enterprise scale" sub="A proven, low-risk path the COE runs with every customer." center />
        <div className="row g-4 steps">{data.steps.map((s, i) => (
          <div className="col-md-6 col-lg-3" key={s.number}><div className="step-card reveal" style={{ transitionDelay: (i * 0.06) + 's' }}>
            <div className="step-num">{s.number}</div><h5>{s.title}</h5><p>{s.body}</p>
          </div></div>
        ))}</div>
        <div className="contact-band mt-5 reveal d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <h3 className="mb-0" style={{ color: '#fff', maxWidth: '24ch' }}>{data.contact.text}</h3>
          <a className="btn btn-coe btn-light px-4 fw-semibold" href={data.contact.href}><i className="bi bi-envelope-fill me-2" />{data.contact.label}</a>
        </div>
      </div></div>
    </section>
  );
}
function Footer({ footer, brand }) {
  return (
    <footer className="coe-footer pt-5 pb-4"><div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="coe-logo mb-3" style={{ color: '#fff' }}>
            <span className="coe-logo-mark">A</span>
            <span style={{ color: '#fff' }}>{brand.product}<small style={{ color: 'rgba(250,249,245,0.6)' }}>{brand.organization} · Center of Excellence</small></span>
          </div>
          <p style={{ maxWidth: '40ch' }}>{footer.about}</p>
        </div>
        {footer.columns.map((col) => (
          <div className="col-6 col-lg-2" key={col.title}><h6 className="mb-3">{col.title}</h6>
            <ul className="list-unstyled d-grid gap-2">{col.links.map((l) => (
              <li key={l.label}><a href={l.href} target={l.href.startsWith('#') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">{l.label}</a></li>
            ))}</ul>
          </div>
        ))}
      </div>
      <hr style={{ borderColor: 'rgba(250,249,245,0.15)', margin: '2.2rem 0 1.2rem' }} />
      <p className="small mb-0" style={{ color: 'rgba(250,249,245,0.55)' }}>{footer.legal}</p>
    </div></footer>
  );
}
function App() {
  const showTop = useScrolledPast(600);
  useEffect(() => {
    const t = SITE.theme, r = document.documentElement.style;
    r.setProperty('--coe-primary', t.primary); r.setProperty('--coe-primary-dark', t.primaryDark);
    r.setProperty('--coe-ink', t.ink); r.setProperty('--coe-cream', t.cream); r.setProperty('--coe-paper', t.paper);
    r.setProperty('--coe-accent', t.accent); r.setProperty('--coe-accent-soft', t.accentSoft);
    document.title = SITE.brand.product + ' Portal · ' + SITE.brand.organization;
  }, []);
  return (
    <React.Fragment>
      <NavBar brand={SITE.brand} nav={SITE.nav} />
      <main>
        <Hero hero={SITE.hero} />
        <Features features={SITE.features} />
        <Training data={TRAINING} />
        <Certifications data={CERTS} />
        <Updates data={UPDATES} />
        <BestPractices data={PRACTICES} />
        <Offerings data={OFFERINGS} />
      </main>
      <Footer footer={SITE.footer} brand={SITE.brand} />
      <button className={'scroll-top ' + (showTop ? 'show' : '')} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="bi bi-arrow-up" />
      </button>
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
