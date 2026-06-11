export default function Footer({ footer, brand }) {
  return (
    <footer className="coe-footer pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="coe-logo mb-3" style={{ color: '#fff' }}>
              <span className="coe-logo-mark">A</span>
              <span style={{ color: '#fff' }}>
                {brand.product}
                <small style={{ color: 'rgba(250,249,245,0.6)' }}>{brand.organization} · Center of Excellence</small>
              </span>
            </div>
            <p style={{ maxWidth: '40ch' }}>{footer.about}</p>
          </div>
          {footer.columns.map((col) => (
            <div className="col-6 col-lg-2" key={col.title}>
              <h6 className="mb-3">{col.title}</h6>
              <ul className="list-unstyled d-grid gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target={l.href.startsWith('#') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr style={{ borderColor: 'rgba(250,249,245,0.15)', margin: '2.2rem 0 1.2rem' }} />
        <p className="small mb-0" style={{ color: 'rgba(250,249,245,0.55)' }}>{footer.legal}</p>
      </div>
    </footer>
  )
}
