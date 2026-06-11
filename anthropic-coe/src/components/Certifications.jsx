import { useXmlConfig } from '../hooks/useXmlConfig.js'
import { attr, text, mapChildren } from '../utils/xml.js'
import { Loader, ErrorNote, SectionHeader, useReveal } from './common.jsx'

function parse(doc) {
  return {
    heading: text(doc, 'heading'),
    subheading: text(doc, 'subheading'),
    certs: mapChildren(doc, 'cert', (c) => ({
      id: attr(c, 'id'),
      tier: attr(c, 'tier'),
      icon: attr(c, 'icon'),
      duration: attr(c, 'duration'),
      badge: attr(c, 'badge', '#CC785C'),
      name: text(c, 'name'),
      focus: text(c, 'focus'),
      description: text(c, 'description'),
      requirements: mapChildren(c, 'requirement', (r) => r.textContent.trim()),
      cta: { label: attr(c.querySelector('cta'), 'label'), href: attr(c.querySelector('cta'), 'href') },
    })),
  }
}

export default function Certifications() {
  const { data, loading, error } = useXmlConfig('certifications.xml', parse)
  const ref = useReveal()

  return (
    <section id="certifications" className="section" ref={ref}>
      <div className="container">
        {loading && <Loader label="Loading certifications…" />}
        {error && <ErrorNote message={error} />}
        {data && (
          <>
            <SectionHeader eyebrow="Certifications" title={data.heading} sub={data.subheading} center />
            <div className="cert-path-line mb-4 d-none d-lg-block" />
            <div className="row g-4">
              {data.certs.map((c, i) => (
                <div className="col-md-6 col-xl-3" key={c.id}>
                  <div className="coe-card cert-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="cert-badge" style={{ background: c.badge }}>
                        <i className={`bi ${c.icon}`} />
                      </div>
                      <div>
                        <div className="cert-tier">{c.tier} · {c.duration}</div>
                        <h4 className="mb-0" style={{ fontSize: '1.08rem' }}>{c.name}</h4>
                      </div>
                    </div>
                    <span className="pill mb-2 d-inline-block">{c.focus}</span>
                    <p className="text-muted" style={{ fontSize: '0.92rem' }}>{c.description}</p>
                    <ul className="cert-req">
                      {c.requirements.map((r) => (
                        <li key={r}><i className="bi bi-check-circle-fill" />{r}</li>
                      ))}
                    </ul>
                    <a className="btn btn-coe btn-coe-ghost w-100 mt-3" href={c.cta.href} target="_blank" rel="noreferrer">
                      {c.cta.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
