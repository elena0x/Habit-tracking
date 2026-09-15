# Contributing to HabitFlow

Thanks for taking the time to improve HabitFlow.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install the pinned dependency tree with `npm ci`.
3. Start the app with `npm run dev`.
4. Add or update tests for behavior changes.
5. Run `npm run check` before opening a pull request.

## Pull requests

Keep pull requests small enough to review in one pass. Explain the user problem, the chosen approach, important trade-offs, and how you verified the result. Include before/after screenshots for visible changes.

## Code conventions

- Use TypeScript for application code.
- Keep platform-specific behavior behind a capability check.
- Route persistence through `src/lib/storage.ts` instead of reading local storage from UI components.
- Preserve backward compatibility for exported backups whenever practical.
- Prefer clear product language and accessible labels for icon-only controls.

## Reporting bugs

Use the bug-report template and include reproduction steps, browser or device details, and screenshots when useful. Never attach a backup that contains personal data.
