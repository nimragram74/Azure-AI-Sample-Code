import { SectionHeader, useReveal } from './common.jsx'

export default function Features({ features }) {
  const ref = useReveal()
  return (
    <section id="features" className="section" ref={ref}>
      <div className="container">
        <SectionHeader eyebrow="Capabilities" title={features.heading} sub={features.subheading} center />
        <div className="row g-4">
          {features.items.map((f, i) => (
            <div className="col-md-6 col-lg-4" key={f.title}>
              <div className="coe-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className="coe-icon"><i className={`bi ${f.icon}`} /></div>
                <h4>{f.title}</h4>
                <p>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
