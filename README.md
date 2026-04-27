# Portfolio — Cloudflare Pages

Clean, minimal software portfolio with login-gated case studies.

## Project structure

```
portfolio/
├── public/                 ← Static site (HTML/CSS/JS)
│   ├── css/style.css       ← All styles
│   ├── js/auth.js          ← Client-side auth helpers
│   ├── index.html          ← Home page
│   ├── projects.html       ← Projects listing
│   ├── about.html          ← About / contact
│   ├── login.html          ← Sign in / register
│   └── projects/
│       ├── kv-store.html   ← Locked case study (example)
│       └── cli-toolkit.html← Public case study (example)
├── functions/
│   └── api/
│       ├── auth/
│       │   ├── login.js    ← POST /api/auth/login
│       │   └── register.js ← POST /api/auth/register
│       └── _utils/
│           └── crypto.js   ← JWT + PBKDF2 helpers (Web Crypto API)
└── wrangler.toml
```

## Deploy to Cloudflare Pages

### 1. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. Create KV namespace for user accounts
```bash
wrangler kv namespace create AUTH_KV
# Copy the id it prints into wrangler.toml
```

### 3. Set JWT secret
```bash
wrangler pages secret put JWT_SECRET
# Paste a strong random value, e.g.: openssl rand -hex 32
```

### 4. Push to GitHub, then connect in Cloudflare dashboard
- Go to Cloudflare Pages → Create project → Connect to Git
- Build command: *(leave blank — static site)*
- Output directory: `public`
- Add the KV binding and JWT_SECRET in Settings → Functions → KV namespace bindings

### 5. Local development
```bash
npx wrangler pages dev public --kv AUTH_KV
```

---

## Customising
### Add a new project
1. Copy `public/projects/cli-toolkit.html` (public) or `kv-store.html` (locked).
2. Edit the content.
3. Add an entry to the `projects` array in `public/projects.html` and `public/index.html`.

### Change which projects are locked
In `public/projects.html` and `public/index.html`, set `locked: true/false` on each project object.

### Edit your info
- **Home hero**: `public/index.html` — skills array, featured projects array
- **About**: `public/about.html` — bio text, experience timeline, links
- **Nav logo**: search `your<span>.</span>name` in all HTML files

### Add new pages
1. Copy any existing page and rename it.
2. Update the `<title>`, content, and the `class="active"` nav link.
3. Add a link to it from the nav or other pages.
