# Portfolio — Cloudflare Pages

Clean, minimal software portfolio with login-gated case studies.

## Project structure

```
portfolio/
├── public/                     ← Static site (HTML/CSS/JS)
│   ├── css/style.css           ← All styles
│   ├── js/auth.js              ← Client-side auth helpers
│   ├── index.html              ← Home page
│   ├── projects.html           ← Projects
│   ├── about.html              ← About / Contact
│   ├── login.html              ← Sign in / Register
│   └── projects/
│       ├── kv-store.html       ← Locked case study (example)
│       └── cli-toolkit.html    ← Public case study (example)
├── functions/
│   └── api/
│       ├── auth/
│       │   ├── login.js        ← POST /api/auth/login
│       │   └── register.js     ← POST /api/auth/register
│       └── _utils/
│           └── crypto.js       ← JWT + PBKDF2 helpers (Web Crypto API)
└── wrangler.toml
```