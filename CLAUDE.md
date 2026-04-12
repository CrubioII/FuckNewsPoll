# FuckNewsPoll

## Stack
React + TypeScript + Vite + TailwindCSS v4. Supabase (DB, Realtime, Edge Functions). PWA.

## Routes
- `/` → AudiencePage (public)
- `/admin?token=SECRET` → AdminPage

## DB Tables
- `app_state` (id=1): `is_active_round BOOL`, `winner TEXT('mago'|'camilo') NULL`
- `votos`: `comediante TEXT`, `device_id TEXT UNIQUE`
- `vote_counts` view: `mago_count, camilo_count, total`

## Battle State Machine
IDLE → (start) → ACTIVE → (stop) → IDLE+winner set → (reset) → IDLE+winner null

## Comedians
- `'mago'` = Camilo Pardo. Color: red #FF2020. Emoji: 🪄
- `'camilo'` = Camilo Sánchez. Color: blue #0057D4. Emoji: 🍆

## Key Hooks
- `useAppState` → `{isActiveRound, winner, loading}` — realtime sub on app_state
- `useVoteCounts` → `{magoCount, camiloCount, total}` — realtime sub on votos
- `useVote` → vote submit, dedup via device_id unique constraint

## Components
- `Logo` — SVG beam traces pentagon (box + speech bubble tail). rAF animates stroke-dashoffset.
- `WinnerScreen` — no logo. text-glow-pulse on name. EmojiRain 80 particles infinite fall.
- `ProgressBar` — accepts `winner` prop → pulse-glow on winning side.
- `VotingScreen` / `IdleScreen` / `AdminControls`

## CSS Keyframes (index.css)
- `emoji-fall`: translateY -10vh→110vh + rotate 720deg
- `winner-reveal`: scale+fade slide-up
- `text-glow-pulse`: text-shadow 10px→160px via `--text-glow` var (NOT box-shadow)
- `neon-flicker`: text-shadow flicker for logo
- `pulse-glow`: box-shadow pulse via `--glow-color` (use on containers, not text)

## Edge Function: admin-action
- `start`: is_active_round=true
- `stop`: query vote_counts → set winner + is_active_round=false
- `reset`: delete votos + winner=null + is_active_round=false

## Pending Migration
```sql
ALTER TABLE app_state ADD COLUMN winner TEXT CHECK (winner IN ('mago', 'camilo'));
```

## Statusline
`~/.claude/statusline-command.sh` → ctx:XX% | /path | branch | model:NAME
