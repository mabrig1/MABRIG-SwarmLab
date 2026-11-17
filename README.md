# MABRIG SwarmLab

**MABRIG Technologies • 20–50 specialist agents • an interactive, human-governed demonstration**

SwarmLab is a browser-based visual laboratory for exploring multi-agent collaboration. Choose a mission, select **20–50 specialist roles** across ten teams, and watch the simulated work proceed through four coordinated waves. Inspect outputs and export the final report as JSON or Markdown.

> **Truth in demonstration:** The agents in this repository run **scripted, illustrative workflows**. A dashboard showing 50 completed specialists does **not** represent 50 independent calls to an AI model, real software construction, source verification, or autonomous deployment. The Live AI selector is intentionally disabled in the published app. There are no keys, paid model calls, or server-side jobs required.

## Open the app

1. **Immediate offline demo:** download and open `standalone.html` in a browser. Its styles and scripts are embedded.
2. **Editable multi-file site:** run `python -m http.server 8080` in the repository, then visit [http://localhost:8080](http://localhost:8080). The root `index.html` loads scripts and styles from `assets/`.
3. **Tests:** run `npm test`, then `npm run check`. No npm installation is required.
4. **Publishing:** the root `index.html` is a static site and can be hosted on GitHub Pages, Cloudflare Pages, or a comparable static host. **Publishing is not performed by this repository push.**

## Demonstration features

- An editable mission with preset examples.
- Slider selecting any count from 20 to 50.
- Ten specialist teams and four execution waves.
- Agent network visualization, team progress, event feed, per-agent inspector and pause/resume.
- Result exports in JSON or Markdown.
- Human-review flow: the BuildRx-hosted lab can preserve a mission temporarily in same-origin browser session storage, then open the standard **New Project** dialog. The AI University version uses an explicit copy/paste handoff across origins so no sensitive mission is transmitted in a URL.
- No student credentials, payment processing, external writes, deployment actions, or real AI inference in this repository.

## Repository layout

```
index.html             # Editable static version
standalone.html        # Complete single-file offline version
assets/styles.css      # Extracted dashboard styling
assets/app.js          # Browser demonstration engine and 50-role roster
assets/handoff.js      # Manual AI University → BuildRx handoff
docs/DEMONSTRATION.md  # Verified illustrative result and limitations
tests/                 # Source and safety regression tests
.github/workflows/     # Automated tests, never deployment
```

The static and standalone entrypoints are derived from the SwarmLab integration prepared for AI University. A future **live multi-agent coordinator** would need an authenticated server-side gateway, provider-budget controls, rate limits, model fallback, cancellation, telemetry, reliable queues and genuine artifact/evidence verification before it could be safely advertised as production orchestration.

## Connected projects

- [AI University HQ](https://aiuniversityhq.uk/) — learning platform.
- [BuildRx](https://www.buildrx.online/) — application-building platform.
- [AI University integration PR #19](https://github.com/mabrig1/AI-University/pull/19) — member-gated SwarmLab integration; review separately.
- [BuildRx integration PR #78](https://github.com/mabrig1/BuildRx/pull/78) — academy link and human-reviewed mission handoff; review separately.

**This source repository is independent of those two pull requests.** Pushing it here neither merges the PRs nor deploys changes to either application.

## Responsible use

Do not enter API keys, passwords, bank details or other sensitive records into the mission. Review all generated or simulated recommendations. Real billing, production deployments, account changes and access grants must remain under explicit human control.

© 2026 MABRIG Technologies. All rights reserved unless a separate license is supplied.
