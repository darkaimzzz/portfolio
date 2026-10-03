# Portfolio

A scrolling chessboard. Each piece is a project, and all content lives in `src/projects.ts`.

```bash
npm install
npm run dev      # local
npm run build    # → dist/, deploy to Vercel as a static site
```

Before submitting, fill in the TODOs at the top of `src/projects.ts` (name, email, video link).

## Live Mentary waitlist count (optional)

Run this once in the Mentary Supabase project's SQL editor. It exposes only the number. The list itself stays unreadable.

```sql
create or replace function public.waitlist_count() returns integer
language sql security definer set search_path = public stable as $$
  select count(*)::int from public.waitlist_active;
$$;
grant execute on function public.waitlist_count() to anon;
```

Then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` (the publishable key) in Vercel. Without them, the chip just doesn't show.
