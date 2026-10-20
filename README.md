# AgentOps SDK

Showcase site for **AgentOps SDK**, an umbrella for seven small, open-source Python packages by Manas Vardhan that cover the lifecycle of LLM agents.

| Stage | Package (pip name) | Source repo |
| --- | --- | --- |
| Build | `mcp-server-forge` | [mcp-forge](https://github.com/ManasVardhan/mcp-forge) |
| Build | `llm-promptdiff` | [promptdiff](https://github.com/ManasVardhan/promptdiff) |
| Benchmark | `bench-my-llm` | [bench-my-llm](https://github.com/ManasVardhan/bench-my-llm) |
| Guard | `llm-shelter` | [llm-shelter](https://github.com/ManasVardhan/llm-shelter) |
| Run & Observe | `agent-trace-replay` | [agent-replay](https://github.com/ManasVardhan/agent-replay) |
| Run & Observe | `ai-agent-sentry` | [agent-sentry](https://github.com/ManasVardhan/agent-sentry) |
| Control cost | `llm-cost-guardian` | [llm-cost-guardian](https://github.com/ManasVardhan/llm-cost-guardian) |

Live at https://manasvardhan.com/agentops-sdk/

## Develop

```bash
npm ci
npm run dev       # http://localhost:5173/agentops-sdk/
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

Stack: Vite, React, TypeScript, Tailwind CSS v4, shadcn/ui, Motion and Recharts.

## Data

Every number on the page comes from `src/data/packages.json` (PyPI metadata and pypistats downloads, fetched on 2026-10-20). Per-package copy and quickstart snippets live in `src/data/meta.ts` and are taken from each README at the commit matching its PyPI release. The deploy workflow runs daily, refreshes the numbers with `scripts/refresh_data.py` (merging new daily downloads into the stored history) and commits the result. Run the script locally to refresh by hand.

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to GitHub Pages. Enable Pages with source "GitHub Actions" in the repository settings. The Vite `base` is `/agentops-sdk/`, so the repository must be named `agentops-sdk`.
