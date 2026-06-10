import { useState } from 'react'
import { useScrolledPast } from './common.jsx'

export default function NavBar({ brand, nav }) {
  const scrolled = useScrolledPast(20)
  const [open, setOpen] = useState(false)

  return (
    <nav className={`coe-nav navbar navbar-expand-lg fixed-top py-2 ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a className="coe-logo navbar-brand" href="#home" onClick={() => setOpen(false)}>
          <span className="coe-logo-mark">A</span>
          <span>
            {brand.product}
            <small>{brand.organization} · Center of Excellence</small>
          </span>
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'} fs-4`} />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {nav.map((item) => (
              <li className="nav-item" key={item.href}>
                <a className="nav-link" href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <a className="btn btn-coe btn-coe-primary w-100" href="#offerings" onClick={() => setOpen(false)}>
                Get started
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
