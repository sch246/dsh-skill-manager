# Candidate 1 bounded evidence

Observed on 2026-08-26 against implementation commit `c374b087c6a4bb463c3e1cba17ac3009507ed8a7` and Harness baseline `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`.

Checked without running test suites, as requested by the user:

- the external Host and browser contributions build successfully outside the Harness package tree;
- setup applied and recorded the exact compatibility patch, regenerated the shared client/API catalogs, rebuilt affected Harness artifacts, and linked the plugin into the `web` profile;
- the installed patch exactly reverse-applies, and the independently owned right-sidebar and preset-manager patches still exactly reverse-apply on the composed checkout;
- every compatibility region is bounded by nearby `dsh-skill-manager` locators, while shared generated catalogs remain outside static patch ownership;
- `@deepseek-ai/dsh-api-remotes` contains no static Skill-manager import or mount; the browser contribution mounts its generated Remote through the existing generic `$mount` capability;
- the active Harness branch points exactly to the official baseline, while the pre-existing dirty intervention set was restored with matching pre-cutover diff and status digests;
- source changes pass `git diff --check`.

No service restart or live browser observation was performed. This evidence therefore establishes buildability, installation structure, source ownership, and reversible composition—not runtime behavior or user-visible acceptance.
