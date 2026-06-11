// xml.js — tiny helpers to fetch and read the XML config files.
// All portal content lives in /public/config/*.xml so it can be edited
// without touching React. These helpers turn that XML into plain data.

/** Fetch and parse an XML config file from /config. */
export async function loadXml(name) {
  const res = await fetch(`${import.meta.env.BASE_URL}config/${name}`)
  if (!res.ok) throw new Error(`Could not load config/${name} (${res.status})`)
  const text = await res.text()
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  const error = doc.querySelector('parsererror')
  if (error) throw new Error(`Malformed XML in ${name}: ${error.textContent}`)
  return doc
}

/** Text content of the first matching child element (by tag name). */
export function text(el, tag) {
  if (!el) return ''
  const found = tag ? el.querySelector(tag) : el
  return found ? found.textContent.trim() : ''
}

/** Read an attribute from an element, with a fallback. */
export function attr(el, name, fallback = '') {
  return el?.getAttribute(name) ?? fallback
}

/** Return an array of direct + nested elements matching a selector. */
export function all(root, selector) {
  return Array.from(root.querySelectorAll(selector))
}

/** Map child elements of a given tag into objects via a mapper fn. */
export function mapChildren(root, tag, mapper) {
  return all(root, tag).map(mapper)
}
