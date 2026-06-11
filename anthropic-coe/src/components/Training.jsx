import { useXmlConfig } from '../hooks/useXmlConfig.js'
import { attr, text, mapChildren } from '../utils/xml.js'
import { Loader, ErrorNote, SectionHeader, useReveal } from './common.jsx'

function parse(doc) {
  return {
    heading: text(doc, 'heading'),
    subheading: text(doc, 'subheading'),
    tracks: mapChildren(doc, 'track', (t) => ({
      id: attr(t, 'id'),
      level: attr(t, 'level'),
      icon: attr(t, 'icon'),
      duration: attr(t, 'duration'),
      name: text(t, 'name'),
      summary: text(t, 'summary'),
      courses: mapChildren(t, 'course', (c) => ({
        title: attr(c, 'title'),
        provider: attr(c, 'provider'),
        minutes: attr(c, 'minutes'),
        href: attr(c, 'href'),
      })),
    })),
  }
}

export default function Training() {
  const { data, loading, error } = useXmlConfig('training.xml', parse)
  const ref = useReveal()

  return (
    <section id="training" className="section section-cream" ref={ref}>
      <div className="container">
        {loading && <Loader label="Loading learning paths…" />}
        {error && <ErrorNote message={error} />}
        {data && (
          <>
            <SectionHeader eyebrow="Training" title={data.heading} sub={data.subheading} center />
            <div className="row g-4">
              {data.tracks.map((track, i) => (
                <div className="col-md-6" key={track.id}>
                  <div className="coe-card track-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                    <div className="track-head">
                      <div className="coe-icon mb-0"><i className={`bi ${track.icon}`} /></div>
                      <div>
                        <h4 className="mb-0">{track.name}</h4>
                        <small className="text-muted">{track.summary}</small>
                      </div>
                    </div>
                    <div className="track-meta">
                      <span className="pill">{track.level}</span>
                      <span className="pill duration"><i className="bi bi-clock me-1" />{track.duration}</span>
                      <span className="pill duration">{track.courses.length} courses</span>
                    </div>
                    <div className="mt-1">
                      {track.courses.map((c) => (
                        <a className="course-link" key={c.title} href={c.href} target="_blank" rel="noreferrer">
                          <span>
                            <span className="d-block fw-medium">{c.title}</span>
                            <span className="meta">{c.provider} · {c.minutes} min</span>
                          </span>
                          <i className="bi bi-box-arrow-up-right arrow" />
                        </a>
                      ))}
                    </div>
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
