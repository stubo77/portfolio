# Portfolio — Cloudflare Pages

Clean, minimal software portfolio with login-gated case studies.

## Project structure

```
portfolio/
├── public/                 ← Static site
│   ├── css/style.css       ← All styles
│   ├── js/auth.js          ← Client-side auth helpers
│   ├── index.html          ← Home page
│   ├── projects.html       ← Projects listing
│   ├── about.html          ← About / contact
│   ├── login.html          ← Sign in / register
│   └── projects/
│       ├── converter.html         ← Binary converter project page
│       ├── flight-manager.html    ← Flight managment project page
│       ├── forum.html             ← Forum project page
│       ├── goobi.html             ← GOOBI project page
│       └── microprocessor.html    ← Microprocessor project page

├── functions/
│   └── api/
│       ├── auth/
│       │   ├── login.js    ← POST /api/auth/login
│       │   └── register.js ← POST /api/auth/register
│       └── _utils/
│           └── crypto.js   ← JWT + PBKDF2 helpers (Web Crypto API)
└── wrangler.toml
```
