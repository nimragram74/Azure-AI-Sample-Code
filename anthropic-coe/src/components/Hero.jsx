import { useReveal } from './common.jsx'

export default function Hero({ hero }) {
  const ref = useReveal()
  return (
    <header id="home" className="hero" ref={ref}>
      <div className="hero-orb" aria-hidden="true" />
      <div className="container position-relative">
        <div className="row">
          <div className="col-lg-10 col-xl-9">
            <span className="eyebrow reveal">{hero.eyebrow}</span>
            <h1 className="hero-title reveal" style={{ transitionDelay: '0.05s' }}>
              {hero.titleLead}{' '}
              <span className="grad">{hero.titleHighlight}</span>
            </h1>
            <p className="hero-sub reveal" style={{ transitionDelay: '0.1s' }}>
              {hero.subtitle}
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4 reveal" style={{ transitionDelay: '0.15s' }}>
              <a className="btn btn-coe btn-coe-primary" href={hero.primaryCta.href}>
                <i className="bi bi-mortarboard-fill me-2" />
                {hero.primaryCta.label}
              </a>
              <a className="btn btn-coe btn-coe-ghost" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
                <i className="bi bi-arrow-right ms-2" />
              </a>
            </div>
          </div>
        </div>

        <div className="hero-stats reveal" style={{ transitionDelay: '0.2s' }}>
          {hero.stats.map((s) => (
            <div className="hero-stat" key={s.label}>
              <div className="num">{s.value}{s.suffix}</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
