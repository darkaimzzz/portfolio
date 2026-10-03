import { lazy, Suspense, useEffect, useState } from 'react'
import { EMAIL, GITHUB, NAME, nextMoves, pawns, projects, timeline, VIDEO } from './projects'

const Board = lazy(() => import('./Board'))

const show3d =
  !matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !!document.createElement('canvas').getContext('webgl2')

// Live Mentary waitlist count. Shows nothing unless the env vars and the waitlist_count() RPC exist (see README).
function useWaitlistCount() {
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_KEY
    if (!url || !key) return
    fetch(`${url}/rest/v1/rpc/waitlist_count`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => typeof v === 'number' && setN(v))
      .catch(() => {})
  }, [])
  return n
}

export default function App() {
  const [active, setActive] = useState(-1)
  const waitlist = useWaitlistCount()

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.stop))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('[data-stop]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      {show3d && (
        <div className="stage" aria-hidden>
          <Suspense fallback={null}><Board active={active} /></Suspense>
        </div>
      )}

      <main className={show3d ? '' : 'flat'}>
        <section className="hero" data-stop={-1}>
          <p className="eyebrow">Portfolio · Horowitz Andreessen Academy 2027</p>
          <h1>{NAME}</h1>
          <p className="lede">I build things and ship them: a kids’ learning startup, an Android app, developer tools and a browser extension, all live.</p>
          <ul className="chips">
            {waitlist !== null && <li><b>{waitlist.toLocaleString()}</b> on the Mentary waitlist <span className="live">live</span></li>}
            <li><b>4</b> shipped products</li>
          </ul>
          <p className="hint">Scroll. Each piece on the board is something I built.</p>
        </section>

        {projects.map((p, i) => (
          <section key={p.id} className="panel" data-stop={i} id={p.id}>
            <p className="eyebrow">{p.role}</p>
            <h2>{p.name}</h2>
            <p className="tagline">{p.tagline}</p>
            <h3>Problem</h3>
            <p>{p.problem}</p>
            <h3>What I built</h3>
            <ul>{p.built.map((b) => <li key={b}>{b}</li>)}</ul>
            <h3>The hard call</h3>
            <p>{p.decision}</p>
            {(p.stats || (p.id === 'mentary' && waitlist !== null)) && (
              <ul className="stats">
                {p.id === 'mentary' && waitlist !== null && (
                  <li><b>{waitlist.toLocaleString()}</b>on the waitlist <span className="live">live</span></li>
                )}
                {p.stats?.map((s) => <li key={s.label}><b>{s.value}</b>{s.label}</li>)}
              </ul>
            )}
            <p className="stack">{p.stack.join(' · ')}</p>
            {p.links.length > 0 && (
              <p className="links">{p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>)}</p>
            )}
          </section>
        ))}

        <section className="panel wide" data-stop={projects.length}>
          <p className="eyebrow">The pawns · where it started</p>
          <h2>Smaller moves</h2>
          <div className="grid">
            {pawns.map((p) => (
              <article key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.detail}</p>
                {p.stat && <b>{p.stat}</b>}
              </article>
            ))}
          </div>
        </section>

        <section className="panel wide" data-stop={projects.length + 1}>
          <p className="eyebrow">Opening → middlegame</p>
          <h2>Four years of building</h2>
          <ol className="timeline">
            {timeline.map((t) => <li key={t.grade}><span>Grade {t.grade}</span>{t.items}</li>)}
          </ol>
        </section>

        <section className="panel wide" data-stop={projects.length + 2}>
          <p className="eyebrow">Thinking a few moves ahead</p>
          <h2>Next moves</h2>
          <ol className="timeline">
            {nextMoves.map((m) => <li key={m.when}><span>{m.when}</span>{m.what}</li>)}
          </ol>
        </section>

        <footer className="panel wide" data-stop={projects.length + 2}>
          <h2>Say hi</h2>
          <p className="links">
            <a href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
            {EMAIL && <a href={`mailto:${EMAIL}`}>Email</a>}
            {VIDEO && <a href={VIDEO} target="_blank" rel="noreferrer">Video ↗</a>}
          </p>
        </footer>
      </main>
    </>
  )
}
