# Local development

Run `pnpm dev` from this checkout to start the complete development app at [https://xword-stats.localhost](https://xword-stats.localhost). The shared Mac HTTPS proxy must be installed through dotfiles; `localhost-dev doctor` checks it.

`pnpm dev:url` prints the address without starting the app. Git's origin repository name supplies the base hostname. A linked worktree folder named `tofu` adds `tofu.` in front, including detached worktrees. Press Ctrl+C to stop the services started by this command and remove their routes. The shared proxy stays running.

The HTTPS address is a new browser origin with separate local storage, IndexedDB, and service workers. Existing data at old addresses remains intact; use the app’s existing linking or export/import flow when needed. Existing external services and credentials remain required as documented in the app’s README.

`pnpm dev:app` starts the direct server without the shared routing wrapper. Existing browser tests use direct servers and do not reuse the live routed app.

## NYT credentials

The stats API and `pnpm stats` read your solve history from the New York Times games API as you, using your `NYT-S` session cookie. Set `NYT_S_COOKIE` to that cookie's value (it starts with `0^`), copied from Chrome DevTools → Application → Cookies → https://www.nytimes.com. On Herb's Mac it lives in `~/.secrets`, which every shell loads. When NYT expires the session, the API fails with a message saying the cookie was rejected; copy a fresh one.
