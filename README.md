# DARK NET AI

A Bangla/English AI assistant for WhatsApp — chat replies + `/image` generation —
controlled from a small web dashboard. Built on an **unofficial** WhatsApp Web
connection ([Baileys](https://github.com/WhiskeySockets/Baileys)), so review
WhatsApp's Terms of Service before running this against a number you rely on;
unofficial clients can get an account flagged or banned.

## Project structure

```
dark-net-ai/
├── index.js            # Express server & REST API
├── package.json
├── .env.example         # copy to .env and fill in
├── config/
│   └── config.js         # all env vars & constants in one place
├── bot/
│   ├── whatsapp.js       # connection, pairing, reconnect logic
│   ├── messages.js       # incoming-message handler
│   └── commands.js       # text → command classifier
├── ai/
│   ├── ai.js              # OpenRouter chat completion
│   ├── image.js           # Pollinations image generation
│   └── admininfo.js       # /info and /help text
├── utils/
│   ├── logger.js          # shared in-memory log ring buffer
│   └── helpers.js         # escapeHtml, extractImagePrompt
└── public/
    └── index.html          # dashboard (Tailwind, vanilla JS)
```

## Setup

```bash
npm install
cp .env.example .env
# edit .env and add your OPENROUTER_API_KEY
npm start
```

Open `http://localhost:3000`, enter your WhatsApp number (country code, no `+`),
and follow the on-screen pairing code instructions.

## Environment variables

| Variable               | Required | Description                                      |
|-------------------------|:--------:|---------------------------------------------------|
| `PORT`                  | no       | HTTP port (defaults to 3000, or platform-assigned) |
| `AUTH_DIR`               | no       | Where WhatsApp session files are stored            |
| `OPENROUTER_API_KEY`     | **yes**  | API key from https://openrouter.ai/keys           |
| `OPENROUTER_MODEL`       | no       | Model id (defaults to a free Nemotron model)       |
| `OPENROUTER_SITE_URL`    | no       | Sent to OpenRouter as your site referer            |
| `RENDER_EXTERNAL_URL`    | no       | Your deployed URL, enables a keep-alive self-ping  |

## Deploying to Render

1. Push this project to a GitHub repo.
2. Create a new **Web Service** on Render, connect the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Add the environment variables above under **Environment**.
5. If you want the WhatsApp session to survive restarts, attach a **persistent disk**
   mounted at the path you set for `AUTH_DIR` (e.g. `/opt/render/project/src/auth_info`).
6. Once live, set `RENDER_EXTERNAL_URL` to your service URL so the built-in
   self-ping keeps a free-tier instance from sleeping.

## API reference

| Method | Path             | Description                          |
|--------|------------------|---------------------------------------|
| GET    | `/health`         | Uptime + connection status            |
| GET    | `/api/status`     | Full status (phone, pairing code)     |
| GET    | `/api/logs`       | Recent log lines (`?count=`)          |
| POST   | `/api/wa/start`   | Begin pairing (`{ "phone": "..." }`)  |
| POST   | `/api/wa/reset`   | Wipe session & log out                |

## Notes

- Logs are kept in memory only (last 200 lines) — they reset on restart.
- Image generation uses the free Pollinations API and retries with backoff on
  rate limits; no API key required.
- Chat replies use OpenRouter, so any OpenRouter-hosted model can be swapped in
  via `OPENROUTER_MODEL`.
