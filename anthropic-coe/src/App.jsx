import { useEffect } from 'react'
import { useXmlConfig } from './hooks/useXmlConfig.js'
import { attr, text, mapChildren } from './utils/xml.js'
import { Loader, ErrorNote, useScrolledPast } from './components/common.jsx'
import NavBar from './components/NavBar.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Training from './components/Training.jsx'
import Certifications from './components/Certifications.jsx'
import Updates from './components/Updates.jsx'
import BestPractices from './components/BestPractices.jsx'
import Offerings from './components/Offerings.jsx'
import Footer from './components/Footer.jsx'

// Parse the global site.xml into a structured config object.
function parseSite(doc) {
  const brandEl = doc.querySelector('brand')
  const themeEl = doc.querySelector('theme')
  const heroEl = doc.querySelector('hero')
  const titleEl = heroEl.querySelector('title')
  const featuresEl = doc.querySelector('features')
  const footerEl = doc.querySelector('footer')

  const cta = (sel) => ({
    label: attr(heroEl.querySelector(sel), 'label'),
    href: attr(heroEl.querySelector(sel), 'href'),
  })

  return {
    brand: {
      organization: text(brandEl, 'organization'),
      product: text(brandEl, 'product'),
      tagline: text(brandEl, 'tagline'),
    },
    theme: {
      primary: text(themeEl, 'primary'),
      primaryDark: text(themeEl, 'primaryDark'),
      ink: text(themeEl, 'ink'),
      cream: text(themeEl, 'cream'),
      paper: text(themeEl, 'paper'),
      accent: text(themeEl, 'accent'),
      accentSoft: text(themeEl, 'accentSoft'),
    },
    nav: mapChildren(doc.querySelector('nav'), 'item', (i) => ({
      href: attr(i, 'href'),
      label: attr(i, 'label'),
    })),
    hero: {
      eyebrow: text(heroEl, 'eyebrow'),
      titleLead: titleEl.textContent.trim(),
      titleHighlight: attr(titleEl, 'highlight'),
      subtitle: text(heroEl, 'subtitle'),
      primaryCta: cta('primaryCta'),
      secondaryCta: cta('secondaryCta'),
      stats: mapChildren(heroEl, 'stat', (s) => ({
        value: attr(s, 'value'),
        suffix: attr(s, 'suffix'),
        label: attr(s, 'label'),
      })),
    },
    features: {
      heading: text(featuresEl, 'heading'),
      subheading: text(featuresEl, 'subheading'),
      items: mapChildren(featuresEl, 'feature', (f) => ({
        icon: attr(f, 'icon'),
        title: attr(f, 'title'),
        body: f.textContent.trim(),
      })),
    },
    footer: {
      about: text(footerEl, 'about'),
      columns: mapChildren(footerEl, 'column', (c) => ({
        title: attr(c, 'title'),
        links: mapChildren(c, 'link', (l) => ({ href: attr(l, 'href'), label: attr(l, 'label') })),
      })),
      legal: text(footerEl, 'legal'),
    },
  }
}

// Map XML theme tokens onto the CSS custom properties used across the app.
function applyTheme(theme) {
  if (!theme) return
  const root = document.documentElement.style
  root.setProperty('--coe-primary', theme.primary)
  root.setProperty('--coe-primary-dark', theme.primaryDark)
  root.setProperty('--coe-ink', theme.ink)
  root.setProperty('--coe-cream', theme.cream)
  root.setProperty('--coe-paper', theme.paper)
  root.setProperty('--coe-accent', theme.accent)
  root.setProperty('--coe-accent-soft', theme.accentSoft)
}

export default function App() {
  const { data: site, loading, error } = useXmlConfig('site.xml', parseSite)
  const showTop = useScrolledPast(600)

  useEffect(() => {
    if (site) {
      applyTheme(site.theme)
      document.title = `${site.brand.product} Portal · ${site.brand.organization}`
    }
  }, [site])

  if (loading) {
    return <div style={{ minHeight: '100vh' }}><Loader label="Starting the COE Portal…" /></div>
  }
  if (error || !site) {
    return <div className="container py-5"><ErrorNote message={error || 'Configuration unavailable.'} /></div>
  }

  return (
    <>
      <NavBar brand={site.brand} nav={site.nav} />
      <main>
        <Hero hero={site.hero} />
        <Features features={site.features} />
        <Training />
        <Certifications />
        <Updates />
        <BestPractices />
        <Offerings />
      </main>
      <Footer footer={site.footer} brand={site.brand} />

      <button
        className={`scroll-top ${showTop ? 'show' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="bi bi-arrow-up" />
      </button>
    </>
  )
}
