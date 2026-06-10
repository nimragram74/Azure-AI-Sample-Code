import { useXmlConfig } from '../hooks/useXmlConfig.js'
import { attr, text, mapChildren } from '../utils/xml.js'
import { Loader, ErrorNote, SectionHeader, useReveal } from './common.jsx'

function parse(doc) {
  return {
    heading: text(doc, 'heading'),
    subheading: text(doc, 'subheading'),
    solutions: mapChildren(doc, 'solution', (s) => ({
      id: attr(s, 'id'),
      icon: attr(s, 'icon'),
      outcome: attr(s, 'outcome'),
      name: text(s, 'name'),
      description: text(s, 'description'),
      industry: text(s, 'industry'),
    })),
    steps: mapChildren(doc, 'step', (s) => ({
      number: attr(s, 'number'),
      title: attr(s, 'title'),
      body: s.textContent.trim(),
    })),
    contact: {
      text: text(doc.querySelector('contact'), 'text'),
      label: text(doc.querySelector('contact'), 'ctaLabel'),
      href: text(doc.querySelector('contact'), 'ctaHref'),
    },
  }
}

export default function Offerings() {
  const { data, loading, error } = useXmlConfig('offerings.xml', parse)
  const ref = useReveal()

  return (
    <section id="offerings" ref={ref}>
      {loading && <div className="section"><div className="container"><Loader label="Loading customer solutions…" /></div></div>}
      {error && <div className="section"><div className="container"><ErrorNote message={error} /></div></div>}
      {data && (
        <>
          <div className="section">
            <div className="container">
              <SectionHeader eyebrow="For Customers" title={data.heading} sub={data.subheading} center />
              <div className="row g-4">
                {data.solutions.map((s, i) => (
                  <div className="col-md-6 col-lg-4" key={s.id}>
                    <div className="coe-card offering-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                      <div className="coe-icon"><i className={`bi ${s.icon}`} /></div>
                      <h4>{s.name}</h4>
                      <p>{s.description}</p>
                      <div className="outcome"><i className="bi bi-graph-up-arrow" />{s.outcome}</div>
                      <div className="industry"><i className="bi bi-buildings me-1" />{s.industry}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagement model */}
          <div className="section section-ink">
            <div className="container">
              <SectionHeader eyebrow="Engagement Model" title="From idea to enterprise scale" sub="A proven, low-risk path the COE runs with every customer." center />
              <div className="row g-4 steps">
                {data.steps.map((s, i) => (
                  <div className="col-md-6 col-lg-3" key={s.number}>
                    <div className="step-card reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                      <div className="step-num">{s.number}</div>
                      <h5>{s.title}</h5>
                      <p>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-band mt-5 reveal d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                <h3 className="mb-0" style={{ color: '#fff', maxWidth: '24ch' }}>{data.contact.text}</h3>
                <a className="btn btn-coe btn-light px-4 fw-semibold" href={data.contact.href}>
                  <i className="bi bi-envelope-fill me-2" />{data.contact.label}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
