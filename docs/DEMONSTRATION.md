# AI University HQ — 50-Agent SwarmLab Demonstration

**Demonstrated on November 17, 2026.** The test scenario was illustrative and used a deterministic scripted engine.

## Mission

Design a privacy-first, AI-powered learning platform for African students, combining accessible courses, coordinated assistants, hands-on labs, and measurable outcomes.

## Recorded demo result

| Metric | Result |
| --- | --- |
| Agent roles selected | 50 |
| Specialist teams | 10 |
| Scripted waves completed | 4/4 |
| Simulated tasks completed | 50/50 |
| Blocked simulated tasks | 0 |
| Browser errors observed in test run | 0 |
| Report export | JSON and Markdown supported; JSON export was exercised |

**Interpretation:** Passing a scripted simulation validates that its dashboard and orchestration demonstration can complete. It does not demonstrate that 50 generative AI models ran independently or that they built production software.

## Team recommendations produced in the example

| Team | Illustrative result |
| --- | --- |
| Strategy | Define a measurable first release |
| Research | Create an evidence register and pilot |
| Product | Design three accessible student journeys |
| Education | Build short lessons and practical exercises |
| Engineering | Use modular architecture and protected APIs |
| Finance | Budget hosting, inference, and maintenance |
| Creative | Demonstrate real workflows in marketing |
| Growth | Measure student activation |
| Operations | Establish milestones and approval gates |
| Trust & Safety | Protect student data and review risks |

## Integration status

The related AI University and BuildRx changes were prepared in [AI University PR #19](https://github.com/mabrig1/AI-University/pull/19) and [BuildRx PR #78](https://github.com/mabrig1/BuildRx/pull/78). They require independent review and release approval. Committing this repository does **not** merge or deploy either integration.

## Required before real autonomous orchestration

- Authenticate learners and protect server-side provider API keys.
- Set strict rate limits and total spending caps for both user and school.
- Track queued, running, blocked, failed and cancelled work with durable state.
- Log the input/output provenance of each real model call; do not label scripted output as inference.
- Add independent validation for research citations, generated source code, security controls and tests.
- Keep credential, payment, course-grade, role-change and production-deployment actions behind human approval.

See [README](../README.md) for instructions to reproduce the local demo.
