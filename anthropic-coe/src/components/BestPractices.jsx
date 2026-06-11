import { useState } from 'react'
import { useXmlConfig } from '../hooks/useXmlConfig.js'
import { attr, text, mapChildren } from '../utils/xml.js'
import { Loader, ErrorNote, SectionHeader, useReveal } from './common.jsx'

function parse(doc) {
  return {
    heading: text(doc, 'heading'),
    subheading: text(doc, 'subheading'),
    categories: mapChildren(doc, 'category', (c) => ({
      id: attr(c, 'id'),
      name: attr(c, 'name'),
      icon: attr(c, 'icon'),
      practices: mapChildren(c, 'practice', (p) => ({
        title: attr(p, 'title'),
        body: p.textContent.trim(),
      })),
    })),
  }
}

export default function BestPractices() {
  const { data, loading, error } = useXmlConfig('bestpractices.xml', parse)
  const ref = useReveal()
  const [active, setActive] = useState(0)

  return (
    <section id="practices" className="section" ref={ref}>
      <div className="container">
        {loading && <Loader label="Loading best practices…" />}
        {error && <ErrorNote message={error} />}
        {data && (
          <>
            <SectionHeader eyebrow="Best Practices" title={data.heading} sub={data.subheading} center />
            <div className="practice-tabs justify-content-center">
              {data.categories.map((c, i) => (
                <button
                  key={c.id}
                  className={`practice-tab ${active === i ? 'active' : ''}`}
                  onClick={() => setActive(i)}
                  dangerouslySetInnerHTML={{ __html: `<i class="bi ${c.icon}"></i> ${c.name}` }}
                />
              ))}
            </div>
            <div className="row g-4">
              {data.categories[active].practices.map((p, i) => (
                <div className="col-md-6" key={p.title}>
                  <div className="practice-item reveal in" style={{ transitionDelay: `${i * 0.04}s` }}>
                    <h5><i className="bi bi-check2-circle text-primary me-2" style={{ color: 'var(--coe-primary)' }} />{p.title}</h5>
                    <p>{p.body}</p>
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
