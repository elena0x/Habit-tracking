# GitHub presentation checklist

The repository files are ready. These remaining settings live in the GitHub interface and should be applied when the update is published.

## About section

**Description**

> A privacy-first habit and life tracker with flexible fields, quick check-ins, visual insights, and iOS/Android support.

**Suggested topics**

`habit-tracker` · `local-first` · `react` · `typescript` · `vite` · `capacitor` · `tailwindcss` · `shadcn-ui` · `data-visualization` · `mobile-app`

Add the deployed product URL to the Website field once a public demo is available.

## Social preview

Upload [`docs/assets/habitflow-social-preview.png`](./assets/habitflow-social-preview.png) under **Settings → General → Social preview**. Its 1280 × 640 layout uses the same HabitFlow name, warm neutral palette, and verified product screenshots.

## Repository settings

- Enable Issues so the included forms are available.
- Keep the default branch named `main`.
- Add branch protection after the first CI run: require the `Typecheck, lint, test, build, and audit` check before merging.
- Enable private vulnerability reporting if you plan to accept external security reports.
- Pin the repository on the profile and place it near other role-relevant projects.

## Recruiter-facing polish

- Deploy a public demo and add its URL to both the About section and README.
- Record a 30–45 second walkthrough showing quick check-in, a custom-field log, and the insights view.
- Replace roadmap bullets with shipped links as features land.
- Add a license only after choosing the reuse terms you actually want; this repository intentionally does not assume that legal decision.
