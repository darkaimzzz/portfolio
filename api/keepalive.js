// Daily Vercel cron (see vercel.json). Free Supabase projects pause after 7 days
// without database activity, so this runs one tiny read against each project.
// Only public (publishable) keys are used; the reads return no private data.

const projects = [
  {
    name: 'mentary-waitlist',
    url: process.env.VITE_SUPABASE_URL,
    key: process.env.VITE_SUPABASE_KEY,
    path: '/rest/v1/rpc/waitlist_count',
    method: 'POST',
  },
  {
    name: 'planora',
    url: process.env.PLANORA_SUPABASE_URL,
    key: process.env.PLANORA_SUPABASE_KEY,
    path: '/rest/v1/plans?select=id&limit=1',
    method: 'GET',
  },
  {
    // anon has no grant here, so Postgres answers 401 "permission denied".
    // That still reaches the database, which is all a keep-alive needs.
    name: 'mentary-app',
    url: process.env.MENTARY_SUPABASE_URL,
    key: process.env.MENTARY_SUPABASE_KEY,
    path: '/rest/v1/puzzles?select=id&limit=1',
    method: 'GET',
    okStatus: [200, 401],
  },
]

export default async function handler(req, res) {
  const results = await Promise.all(
    projects.map(async ({ name, url, key, path, method, okStatus = [200] }) => {
      if (!url || !key) return { name, ok: false, status: 'missing env' }
      try {
        const r = await fetch(url + path, { method, headers: { apikey: key, Authorization: `Bearer ${key}` } })
        return { name, ok: okStatus.includes(r.status), status: r.status }
      } catch (e) {
        return { name, ok: false, status: String(e) }
      }
    }),
  )
  res.status(results.every((r) => r.ok) ? 200 : 502).json(results)
}
