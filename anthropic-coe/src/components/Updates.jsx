import { useMemo, useState } from 'react'
import { useXmlConfig } from '../hooks/useXmlConfig.js'
import { attr, text, mapChildren } from '../utils/xml.js'
import { Loader, ErrorNote, SectionHeader, useReveal } from './common.jsx'

function parse(doc) {
  return {
    heading: text(doc, 'heading'),
    subheading: text(doc, 'subheading'),
    feeds: mapChildren(doc, 'feed', (f) => ({ id: attr(f, 'id'), label: attr(f, 'label') })),
    items: mapChildren(doc, 'item', (it) => ({
      feed: attr(it, 'feed'),
      date: attr(it, 'date'),
      tag: attr(it, 'tag'),
      featured: attr(it, 'featured') === 'true',
      title: text(it, 'title'),
      summary: text(it, 'summary'),
      link: { href: attr(it.querySelector('link'), 'href'), label: attr(it.querySelector('link'), 'label') },
    })),
  }
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Updates() {
  const { data, loading, error } = useXmlConfig('updates.xml', parse)
  const ref = useReveal()
  const [active, setActive] = useState('all')

  const items = useMemo(() => {
    if (!data) return []
    const sorted = [...data.items].sort((a, b) => b.date.localeCompare(a.date))
    return active === 'all' ? sorted : sorted.filter((i) => i.feed === active)
  }, [data, active])

  return (
    <section id="updates" className="section section-cream" ref={ref}>
      <div className="container">
        {loading && <Loader label="Loading the latest updates…" />}
        {error && <ErrorNote message={error} />}
        {data && (
          <>
            <SectionHeader eyebrow="Latest Updates & Feeds" title={data.heading} sub={data.subheading} />
            <div className="feed-filter">
              <button className={`feed-chip ${active === 'all' ? 'active' : ''}`} onClick={() => setActive('all')}>
                <i className="bi bi-rss me-1" />All
              </button>
              {data.feeds.map((f) => (
                <button
                  key={f.id}
                  className={`feed-chip ${active === f.id ? 'active' : ''}`}
                  onClick={() => setActive(f.id)}
                  dangerouslySetInnerHTML={{ __html: f.label }}
                />
              ))}
            </div>
            <div className="row g-4">
              {items.map((it, i) => (
                <div className={it.featured ? 'col-lg-8' : 'col-md-6 col-lg-4'} key={it.title}>
                  <article className={`coe-card update-card ${it.featured ? 'featured' : ''} reveal`} style={{ transitionDelay: `${i * 0.04}s` }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="update-tag">{it.tag}</span>
                      <span className="update-date">{fmtDate(it.date)}</span>
                    </div>
                    <h4 style={{ fontSize: it.featured ? '1.5rem' : '1.12rem' }}>{it.title}</h4>
                    <p className="flex-grow-1">{it.summary}</p>
                    <a className="fw-semibold mt-2 d-inline-flex align-items-center gap-1"
                       style={{ color: it.featured ? '#f3c4b1' : 'var(--coe-primary-dark)' }}
                       href={it.link.href} target={it.link.href.startsWith('#') ? undefined : '_blank'} rel="noreferrer">
                      {it.link.label} <i className="bi bi-arrow-right" />
                    </a>
                  </article>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
