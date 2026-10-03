// One source of truth: drives both the 3D pieces and the HTML panels.

export type PieceKind = 'king' | 'queen' | 'rook' | 'knight' | 'bishop' | 'pawn'

export type Project = {
  id: string
  piece: PieceKind
  square: [file: number, rank: number] // 0..7, a1 = [0, 0]
  role: string
  name: string
  tagline: string
  problem: string
  built: string[]
  decision: string
  stack: string[]
  links: { label: string; href: string }[]
  stats?: { value: string; label: string }[]
}

export const NAME = 'Nishaad Bharaswadkar'
export const EMAIL = 'nishaadbharaswadkar@gmail.com'
export const GITHUB = 'https://github.com/darkaimzzz'
export const VIDEO = '' // TODO: link to your application video

export const projects: Project[] = [
  {
    id: 'mentary',
    piece: 'king',
    square: [4, 3],
    role: 'The King · the company bet',
    name: 'Mentary',
    tagline: 'Daily brain training for kids that they actually come back to.',
    problem:
      'Brain-training apps for kids are either worksheets with a coat of paint or slot machines. Neither builds a habit worth having.',
    built: [
      'A daily puzzle set drawn from four skill worlds: spatial reasoning, memory, logic and pattern recognition.',
      'Adaptive weighting so each day leans toward what the child is still struggling with.',
      'Streaks, coins and unlockable worlds, plus a PIN-protected parent dashboard kept separate from the kid-facing app.',
      'A waitlist site on Next.js and Supabase where the public key can only insert an email. It can never read the list back.',
    ],
    decision:
      'Privacy by construction. The waitlist form fails honestly when it is misconfigured instead of faking success, and the database grants only make the list write-only from the browser.',
    stack: ['TypeScript', 'React Native', 'Next.js', 'Supabase', 'Tailwind'],
    links: [{ label: 'Join the waitlist', href: 'https://waitlist-mentary.vercel.app' }],
  },
  {
    id: 'planora',
    piece: 'queen',
    square: [3, 4],
    role: 'The Queen · deepest engineering',
    name: 'Planora',
    tagline: 'Group plans that settle themselves.',
    problem:
      'Deciding when five people can meet turns into a forty-message group chat that ends with nobody going.',
    built: [
      'Everyone drags their free hours on a week grid. The server computes the overlap and opens a vote on the best three slots.',
      'Venue voting, automatic confirmation, a calendar entry and a group-chat announcement.',
      'Android APK distributed without a store, with a published SHA-256 and an in-app update check.',
    ],
    decision:
      'The organiser has no special power, and the database enforces it. Authorisation is 17 Postgres row-level security policies, not middleware, and a single idempotent state machine is the only thing that moves a plan forward.',
    stack: ['Expo / React Native', 'TypeScript', 'Postgres RLS', 'Supabase Edge Functions', 'Claude API'],
    links: [
      { label: 'Download', href: 'https://planora-mentary.vercel.app' },
      { label: 'Code', href: 'https://github.com/darkaimzzz/planora' },
    ],
    stats: [
      { value: '17', label: 'RLS policies' },
      { value: '42', label: 'adversarial assertions' },
      { value: '0', label: 'duplicate polls under an 8x concurrency burst' },
    ],
  },
  {
    id: 'agentpack',
    piece: 'rook',
    square: [0, 0],
    role: 'The Rook · infrastructure',
    name: 'AgentPack',
    tagline: 'One install for MCP servers across Claude Code, Codex and OpenCode.',
    problem:
      'Every AI coding agent stores its tool configuration in a different file and format (JSON, TOML, JSONC). Setting up the same capability three times breaks things quietly.',
    built: [
      'Scans a project, recommends capabilities and writes them into every installed agent at once.',
      'Launches each MCP server and asks for its tool list, so "installed" means "actually responds".',
      'Backs up every write and can roll back a whole run. A CLI mirrors the desktop app.',
      '12 MCP servers and 18 marketplace plugins in the registry.',
    ],
    decision:
      'It edits live config files, so it has to be reversible. Every write is backed up first, there is a --demo sandbox, and export never writes secrets.',
    stack: ['TypeScript', 'Electron', 'Node.js', 'MCP', 'GitHub Actions'],
    links: [
      { label: 'Website', href: 'https://agentpackfun.vercel.app' },
      { label: 'Code', href: 'https://github.com/darkaimzzz/AgentPack' },
    ],
  },
  {
    id: 'form-rescue',
    piece: 'knight',
    square: [5, 2],
    role: 'The Knight · sideways thinking',
    name: 'Form Rescue',
    tagline: 'Get your words back.',
    problem:
      'Long answers, support requests and applications vanish when a page refreshes, crashes or signs you out.',
    built: [
      'A local-first browser extension that saves drafts only on sites you opt in to.',
      'Handles React and Vue forms, fields added after load, open shadow DOM and fields outside a form.',
      'A side-by-side review page before restoring, conflict detection and undo.',
      'Submitted to Firefox Add-ons (in review).',
    ],
    decision:
      'Honest over clever. "Saved locally" appears only after the database transaction commits, and if a field cannot be matched with confidence you get a Copy button instead of a guess. No account, no server, no telemetry.',
    stack: ['TypeScript', 'WebExtensions MV3', 'IndexedDB', 'Astro'],
    links: [
      { label: 'Website', href: 'https://form-rescue.vercel.app' },
      { label: 'Code', href: 'https://github.com/darkaimzzz/Form-Rescue' },
    ],
  },
  {
    id: 'security',
    piece: 'bishop',
    square: [2, 5],
    role: 'The Bishop · seeing the angles',
    name: 'Security research',
    tagline: 'Learning to build by learning to break.',
    problem: 'You cannot defend a system you do not understand from the attacker’s side.',
    built: [
      'Three years on Hack The Box and TryHackMe: ethical pentests covering evil twin, phishing and DDoS scenarios in lab environments.',
      'Wireshark, Kali Linux, TCP/IP, DNS and routing.',
      'Scripted ransomware and keyloggers in Python for study in isolated labs.',
    ],
    decision:
      'It carried straight into product work. Planora’s audit suite attacks every permission boundary from the wrong side before any user can.',
    stack: ['Python', 'Kali Linux', 'Wireshark', 'Networking'],
    links: [],
    stats: [{ value: '3 yrs', label: 'grades 10–12' }],
  },
]

export type Pawn = { name: string; detail: string; stat?: string; square: [number, number] }

export const pawns: Pawn[] = [
  { name: 'Discord moderation bot', detail: 'Python bot that removes harmful content and DMs violators a warning with a philosophical quote.', stat: '500+ users', square: [1, 1] },
  { name: 'Equity trading algorithm', detail: 'Python bot on VWAP, HMA and RSI with structured risk controls for the NSE.', stat: '10%+ backtested ROI', square: [6, 1] },
  { name: 'Unity platformer', detail: 'A 2D game about reuniting a hero with his sandwich. Design, art direction and code.', square: [7, 2] },
  { name: 'Arduino solar systems', detail: 'Solar-powered, sensor-based drip irrigation and adaptive traffic-signal models.', stat: 'Lead engineer', square: [1, 3] },
  { name: 'Hawking radiation talk', detail: 'Models of black hole formation and virtual particles, presented with data visualisation.', stat: '250+ audience', square: [6, 5] },
  { name: 'Annual Day tech lead', detail: 'Ran lighting, music, video and digital invites with a team of 8.', stat: '500+ audience', square: [3, 1] },
]

export const timeline = [
  { grade: '9', items: 'Arduino solar exhibit lead · chess team captain' },
  { grade: '10', items: 'Security research begins · Unity game · Hawking radiation talk · event tech lead' },
  { grade: '11', items: 'Discord bot reaches 500+ users · Immortal in Valorant (top 1%)' },
  { grade: '12', items: 'Trading algorithm · shipped Planora, AgentPack and Form Rescue · building Mentary' },
]

export const nextMoves = [
  { when: 'Now', what: 'Getting what I’ve already built into real people’s hands, and learning from what they do with it.' },
  { when: 'Academy', what: 'Go deep on one problem worth years of my time. Today that’s Mentary, but I’ll follow whichever problem pulls hardest.' },
  { when: 'Co-op', what: 'Work at a company I believe in, close to the people building it, and learn how they think.' },
]
